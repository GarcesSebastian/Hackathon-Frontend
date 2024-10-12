import { cn } from "@/lib/utils"
import VoiceAI from "./voiceAI"

interface ChatMessageProps {
  role: 'user' | 'assistant',
  content: string,
  isTalkAI: boolean,
  setIsTalkAI: any,
  index: number,
}

export function ChatMessage({ role, content, isTalkAI, setIsTalkAI, index }: ChatMessageProps) {
  return (
    <div className="flex gap-x-2 h-fit">
      <div className={cn(
      "max-w-[55%] px-3 py-6 rounded-lg flex gap-x-4 items-center justify-center",
      role === 'user' ? "bg-primary text-primary-foreground ml-auto" : "bg-secondary text-secondary-foreground"
    )}>

      {content}
      <VoiceAI index={index} isTalkAI={isTalkAI} setIsTalkAI={setIsTalkAI}/>
      </div>
    </div>
  )
}