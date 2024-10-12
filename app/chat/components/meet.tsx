import React from 'react';
import VoiceRecord from '@/components/voiceRecord';

interface VoiceRecord{
    messages: { role: string; content: string }[];
    setMessages: React.Dispatch<React.SetStateAction<{ role: string; content: string }[]>>;
    selectedVoice: any;
    setSelectedVoice: any;
    isMeet: boolean;
    setIsMeet: (isMeet: boolean) => void;
}

const Meet = ({isMeet, setIsMeet, messages, setMessages, selectedVoice, setSelectedVoice}: VoiceRecord) => {
    const exitMeet = (e: any) => {
        if(e.target.id != "meet-bg") return;
        setIsMeet(false);
    }

    return(
        <div onClick={exitMeet} id='meet-bg' className="w-full h-full absolute bg-black/60 hidden z-[90] justify-center items-center cursor-pointer" style={{display: isMeet ? "flex" : "none"}}>
            <VoiceRecord messages={messages} setMessages={setMessages} selectedVoice={selectedVoice} setSelectedVoice={setSelectedVoice} isMeet={isMeet} />
        </div>
    )
}

export default Meet;