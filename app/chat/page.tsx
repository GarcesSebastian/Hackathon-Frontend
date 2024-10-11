"use client"

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ChatMessage } from '@/components/ChatMessage';
import { Avatar } from '@/components/ui/avatar';
import { Mic, Send, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '¡Hola! Soy tu asistente de salud mental. ¿Cómo puedo ayudarte hoy?' }
  ]);
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

  const handleLogout = () => {
    // Aquí iría la lógica de cierre de sesión
    router.push('/');
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="bg-card shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">MindfulChat</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <User className="h-6 w-6" />
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push('/profile')}>
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4 relative">
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 rounded-full"
          title="Activar micrófono"
        >
          <Mic className="h-4 w-4" />
        </Button>
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
  );
}