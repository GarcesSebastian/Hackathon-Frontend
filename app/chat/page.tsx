"use client"
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage } from '@/components/ChatMessage';
import Grabacion from '@/components/Grabacion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Aside from './components/aside';
import { sendMessageToSafety } from '@/lib/utils';
import Meet from './components/meet';
import { Card, CardContent } from '@/components/ui/card';
import Apartado from '@/components/apartado';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '¡Hola! Soy tu asistente de salud mental. Antes de empezar, ¿te gustaría elegir una voz para mí?' }
  ]);
  const [input, setInput] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isVoiceSelected, setIsVoiceSelected] = useState(false);
  const [isMeet, setIsMeet] = useState(false);
  const [isVoiceSelection, setIsVoiceSelection] = useState(false);
  const [isOasis, setIsOasis] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const synth = window.speechSynthesis;
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices.filter(voice => voice.lang.startsWith('es')));
    };

    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }

    loadVoices();
  }, []);

  const handleSend = async () => {
    if (input.trim()) {
      setInput('');
      setMessages([...messages, { role: 'user', content: input }]);
      let fullResponse = "";
      await sendMessageToSafety(([...messages, { role: 'user', content: input }]), (chunk) => {
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
      })
    }
  };

  const handleVoiceSelection = (voice) => {
    setSelectedVoice(voice);
    setIsVoiceSelected(true);
    setMessages([...messages, { role: 'assistant', content: '¡Excelente elección! Ahora, ¿en qué puedo ayudarte hoy?' }]);
  };

  const exitVoiceSelection = (e: any) => {
    if(e.target.id != "voice-selected-bg") return;
    setIsVoiceSelection(false);
  }

  return (
    <div className="flex h-full bg-background text-foreground">
      <Aside isVoiceSelection={isVoiceSelection} setIsVoiceSelection={setIsVoiceSelection} isOasis={isOasis} setIsOasis={setIsOasis} />
      <Apartado isOasis={isOasis} setIsOasis={setIsOasis}></Apartado>
      <Meet isMeet={isMeet} setIsMeet={setIsMeet} messages={messages} setMessages={setMessages} selectedVoice={selectedVoice} setSelectedVoice={setSelectedVoice} />
      <div className='w-full h-full flex flex-col'>
        <main className="flex-1 overflow-y-auto p-4 space-y-4 relative">
          {!isVoiceSelected && (
            <div onClick={exitVoiceSelection} id='voice-selected-bg' className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 cursor-pointer" style={{display: isVoiceSelection ? "flex" : "none"}}>
              <Card className="max-w-4xl w-full p-6">
                <CardContent>
                  <h2 className="text-2xl font-bold mb-4 text-center">Elige una voz para el asistente</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {voices.map((voice, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="flex flex-col items-center p-4 h-auto"
                        onClick={() => handleVoiceSelection(voice)}
                      >
                        <Avatar className="w-20 h-20 mb-2">
                          <AvatarImage src={`https://api.dicebear.com/6.x/bottts/svg?seed=${voice.name}`} alt={voice.name} />
                          <AvatarFallback>{voice.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-center">{voice.name}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          {messages.map((message, index) => (
            <ChatMessage key={index} role={message.role} content={message.content} />
          ))}
          <Grabacion setIsMeet={setIsMeet}/>
        </main>
        <div className="p-4 bg-card border-t border-border">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Escribe tu mensaje aquí..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-grow"
            />
            <div className="flex flex-col items-end">
              <button
                onClick={handleSend}
                className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-14 w-14 py-2 px-4 rounded-full mb-2"
              >
                <Send size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}