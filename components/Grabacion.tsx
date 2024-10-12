import React, { useState, useEffect } from "react";

// Definimos el tipo de la API de reconocimiento de voz

let recognition: any = null;
if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.lang = "es-ES"; // Cambié a es-ES para español de España
}

const MicrophoneButton: React.FC = () => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      setText(event.results[0][0].transcript);
      console.log("onresult event: ", event);
      setIsListening(false);
      recognition.stop(); // Detenemos el reconocimiento una vez obtenemos el resultado
    };

    recognition.onend = () => {
      setIsListening(false); // Cambia el estado de `isListening` cuando se detiene el reconocimiento
    };
  }, []);

  const startListening = () => {
    if (isListening) {
      recognition.stop(); 
    } else {
      setText(""); 
      setIsListening(true); 
      recognition.start(); 
    }
  };

  console.log("text: ", text);

  return (
    <div  className="flex justify-end  pr-11 ">
      <button onClick={startListening} className="inline-flex - items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-14 w-14 py-2 px-4 redounded-full ">
        {isListening ? "Detener" : <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-microphone">
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M9 2m0 3a3 3 0 0 1 3 -3h0a3 3 0 0 1 3 3v5a3 3 0 0 1 -3 3h0a3 3 0 0 1 -3 -3z" />
  <path d="M5 10a7 7 0 0 0 14 0" />
  <path d="M8 21l8 0" />
  <path d="M12 17l0 4" />
</svg>} 
      </button>
      
    </div>
  );
};

export default MicrophoneButton;
