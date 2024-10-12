import React, { useState, useRef } from "react";
import { Mic, Square } from "lucide-react";

const AudioRecorderButton: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState<string>("");
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        sendAudioToServer(audioBlob);
        audioChunks.current = [];
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setStatus("Grabando...");
    } catch (error) {
      console.error("Error accessing the microphone", error);
      setStatus("Error al acceder al micrófono");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      setStatus("Procesando audio...");
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const sendAudioToServer = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, `audio_${new Date().getTime()}.wav`);

    try {
      const response = await fetch('http://localhost:4000/api/upload-audio', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setStatus('Audio cargado con éxito');
      } else {
        setStatus('Error al cargar el audio');
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
      setStatus('Error de conexión');
    }
  };

  return (
    <div className="flex flex-col items-end pr-11">
      <button
        onClick={toggleRecording}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-14 w-14 py-2 px-4 rounded-full mb-2"
      >
        {isRecording ? (
          <Square size={24} />
        ) : (
          <Mic size={24} />
        )}
      </button>
      {status && (
        <p className="text-sm text-gray-600 mt-2">{status}</p>
      )}
    </div>
  );
};

export default AudioRecorderButton;