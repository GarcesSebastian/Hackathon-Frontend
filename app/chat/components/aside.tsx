import React from 'react';
import { Button } from "@/components/ui/button";    
import { Home, Settings, BotMessageSquare, User } from "lucide-react";
import { ModeToggle } from '@/components/mode-toggle';
import { useRouter } from 'next/navigation';

interface Settings {
  isVoiceSelection: boolean;
  setIsVoiceSelection: any;
  isOasis: boolean;
  setIsOasis: any;
}

const Aside = ({ isVoiceSelection, setIsVoiceSelection, isOasis, setIsOasis}: Settings) => {
  const handleChangeVoice = () => {
    setIsVoiceSelection(!isVoiceSelection)
  }

  const router = useRouter();

  return (
    <aside className="w-20 h-full bg-background p-4 flex flex-col items-center space-y-4 justify-start py-5">
      <Button onClick={() => {router.push('/')}}   variant="outline" size="icon">
        <Home className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Home</span>
      </Button>
      
      <Button onClick={() => {setIsOasis(!isOasis)}}   variant="outline" size="icon">
        <User className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Home</span>
      </Button>
      
      <Button variant="outline" size="icon" onClick={handleChangeVoice}>
        <BotMessageSquare className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Select Voice</span>
      </Button>
      
      <ModeToggle></ModeToggle>
    </aside>
  );
};

export default Aside;