"use client"

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ChatMessage } from '@/components/ChatMessage';
import Grabacion from '@/components/Grabacion';
import { Avatar } from '@/components/ui/avatar';
import { Grab, Mic, Send, User } from 'lucide-react';
import Loader from '@/components/loader';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from 'next/navigation';
import Aside from './components/aside'
import { set } from 'date-fns';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '¡Hola! Soy tu asistente de salud mental. ¿Cómo puedo ayudarte hoy?' }
  ]);
  const [Estate, setestate] = useState(false);
  const [input, setInput] = useState('');
 
  const router = useRouter();

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { role: 'user', content: input }]);
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Entiendo. ¿Puedes contarme más sobre cómo te sientes?' }]);
      }, 1000);
      setInput('');
    }
  };

  const setEstate = () => {
       setestate(!Estate);
       console.log(Estate);
  }

  const handleLogout = () => {
    // Aquí iría la lógica de cierre de sesión
    router.push('/');
  };

   

  return (
    <div className="flex h-full">
      <Aside/>
      <div className='w-full h-full flex flex-col'>
          <main className="flex-1 overflow-y-auto p-4 space-y-4">
          <Grabacion />
            {messages.map((message, index) => (
              <ChatMessage key={index} role={message.role} content={message.content} />
            ))}
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
              <Button onClick={handleSend}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
      </div> 
    </div>
  );
}