import React from 'react';
import { Button } from "@/components/ui/button";    
import { Sun, Moon, Home, Settings, User } from "lucide-react";

const Aside = () => {
  return (
    <aside className="w-20 h-full bg-background p-4 flex flex-col items-center space-y-4">
      <Button variant="outline" size="icon">
        <Home className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Home</span>
      </Button>
      
      <Button variant="outline" size="icon">
        <User className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">User Profile</span>
      </Button>
      
      <Button variant="outline" size="icon">
        <Settings className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Settings</span>
      </Button>
      
      <Button variant="outline" size="icon">
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </aside>
  );
};

export default Aside;