import React, { useState, useEffect, useRef } from "react";
import { Mic, Square, AudioLines } from "lucide-react";

interface GrabacionProps {
  setIsMeet: any;
}

const AudioRecorderButton: React.FC<GrabacionProps> = ({ setIsMeet }) => {
  const handleMeet = () => {
    setIsMeet(true);
  }

  return (
    <div className="flex flex-col items-end fixed bottom-10 -translate-y-full left-1/2 -translate-x-1/2">
      <button
        onClick={handleMeet}
        className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-16 w-16 py-2 px-4 rounded-full mb-2"
      >
          <AudioLines size={30} />
      </button>
    </div>
  );
};

export default AudioRecorderButton;