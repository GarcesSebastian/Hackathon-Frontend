"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mic } from 'lucide-react';
import { sendMessageToSafety } from "@/lib/utils";
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Settings{
    messages: { role: string; content: string }[];
    setMessages: React.Dispatch<React.SetStateAction<{ role: string; content: string }[]>>;
    selectedVoice: any;
    setSelectedVoice: any;
    isMeet: any;
    isTalkAI: boolean;
    setIsTalkAI: any;
}

const VoiceRecord = ({messages, setMessages, selectedVoice, setSelectedVoice, isMeet, isTalkAI, setIsTalkAI}: Settings) => {
  const [isRecording, setIsRecording] = useState(false);
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [userMessage, setUserMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [rate, setRate] = useState(1);
  const [isReceivingResponse, setIsReceivingResponse] = useState(false);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const simulateVoice = useCallback(() => {
    if (isRecording) {
      const newLevel = Math.random();
      setVoiceLevel(newLevel);
    } else {
      setVoiceLevel(0);
    }
  }, [isRecording]);

  useEffect(() => {
    const interval = setInterval(simulateVoice, 100);
    return () => clearInterval(interval);
  }, [simulateVoice]);

  useEffect(() => {
    if(!isMeet){
        setIsListening(false);
        setIsRecording(false);
    }
  },[isMeet])

  const handleClick = () => {
    setIsRecording(!isRecording);
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = "es-ES";
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");
        setUserMessage(transcript);
      };

      recognitionRef.current = recognition;
    }

    synthRef.current = window.speechSynthesis;

    const loadVoices = () => {
      const availableVoices = synthRef.current?.getVoices() || [];
      
      const spanishVoices = availableVoices.filter(voice => voice.lang.startsWith('es'));
      
      setVoices(availableVoices);
      
      const defaultVoice = spanishVoices[0] || availableVoices[0] || null;
      setSelectedVoice(defaultVoice);
    };

    loadVoices();

    if (synthRef.current?.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = loadVoices;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
      setIsRecording(true);
    }
  };

  const stopRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      setIsRecording(false);
      handleOpenAIRequest(userMessage);
    }
  };

  const handleOpenAIRequest = async (message: string) => {
    const sendMessage = {
      role: "user",
      content: message
    };

    setIsTalkAI(true);

    const mapMessages = [...messages, sendMessage];
    setMessages(mapMessages);
    setIsReceivingResponse(true);

    try {
      let fullResponse = "";
      await sendMessageToSafety(mapMessages, (chunk) => {
        fullResponse += chunk;
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages];
          if (updatedMessages[updatedMessages.length - 1].role === "assistant") {
            updatedMessages[updatedMessages.length - 1].content = fullResponse;
          } else {
            updatedMessages.push({ role: "assistant", content: fullResponse });
          }
          return updatedMessages;
        });
      });

      setIsTalkAI(false);
      speakResponse(fullResponse);
    } catch (error) {
      console.error("Error al obtener respuesta de la IA:", error);
    } finally {
      setIsReceivingResponse(false);
    }
  };

  const speakResponse = (text: string) => {
    if (synthRef.current) {
      synthRef.current.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      } else {
        console.warn("No voice selected, using default system voice");
      }
      
      utterance.rate = rate;
      utterance.lang = "es-ES";

      synthRef.current.speak(utterance);
      
      utterance.onstart = () => console.log("Speech started");
      utterance.onend = () => console.log("Speech ended");
      utterance.onerror = (event) => console.error("Speech error:", event);
    } else {
      console.error("Speech synthesis not available");
    }
  };

  return (
    <CardContent className='flex flex-col items-center w-fit h-fit p-20 border rounded-md bg-background'>
        <div className="relative">
        <Button
            onClick={isListening ? stopRecognition : startRecognition}
            className={`relative w-16 h-16 rounded-full focus:outline-none transition-all duration-300 ease-in-out z-20`}
        >
            <Mic className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </Button>
        {isRecording && (
            <div className="absolute -top-1 -right-1 flex h-3 w-3 z-20">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </div>
        )}
        {voiceLevel > 0.1 && (
            <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-50 transition-all duration-200 z-10"
            style={{
                width: `${voiceLevel * 200}%`,
                height: `${voiceLevel * 200}%`,
            }}
            ></div>
        )}
        </div>
        <p className="mt-4 text-gray-700">
        {isRecording ? 'Escuchando...' : 'Haz clic para grabar'}
        </p>
    </CardContent>
  );
};

export default VoiceRecord;