"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AudioLines } from 'lucide-react';
import { sendMessageToSafety } from "@/lib/utils";
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Settings{
    isTalkAI: boolean;
    setIsTalkAI: any;
}

const VoiceAI = ({isTalkAI, setIsTalkAI}: Settings) => {
  const [voiceLevel, setVoiceLevel] = useState(0);

  const simulateVoice = useCallback(() => {
    if (setIsTalkAI) {
      const newLevel = Math.random();
      setVoiceLevel(newLevel);
    } else {
      setVoiceLevel(0);
    }
  }, [setIsTalkAI]);

  useEffect(() => {
    const interval = setInterval(simulateVoice, 100);
    return () => clearInterval(interval);
  }, [simulateVoice]);

  console.log(setIsTalkAI)

  return (
    <CardContent className='flex items-end justify-center w-fit h-fit relative p-0' style={{display: isTalkAI ? "flex" : "none"}}>
        <div className="relative flex justify-center items-end">
        <Button className={`relative w-12 h-12 rounded-full focus:outline-none transition-all duration-300 ease-in-out z-20`}>
            <AudioLines className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </Button>
        {setIsTalkAI && (
            <div className="absolute -top-1 -right-1 flex h-3 w-3 z-20">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3"></span>
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
    </CardContent>
  );
};

export default VoiceAI;