import React from 'react';
import { Button } from "@/components/ui/button";    
import { Sun, Moon, Home, Settings, User } from "lucide-react";
import { ModeToggle } from '@/components/mode-toggle';
import Historial from '@/components/Historial';
import Link from 'next/link';

const Aside = () => {

  const [state, setState] = React.useState(false);
  
const setestado = () => {
  setState(!state);
}
  return (
    <aside className="w-20 h-full bg-background p-4 flex flex-col items-center space-y-4 justify-center py-20 border-r-2">
      <Link href="/apartado">
   
      <Button   variant="outline" size="icon">
        <Home className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Home</span>
      </Button>
      </Link>
      
    <Historial></Historial>
      
      <Button variant="outline" size="icon">
        <Settings className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Settings</span>
      </Button>
      
      <ModeToggle></ModeToggle>
    </aside>
  );
};

export default Aside;