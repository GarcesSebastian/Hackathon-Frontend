import Link from 'next/link';
import { Button } from '@/components/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-white to-green-100 dark:from-gray-900 dark:to-green-900 text-foreground">
      <h1 className="text-5xl font-bold mb-6">Bienvenido a MindfulChat</h1>
      <p className="text-xl mb-8 max-w-md text-center">
        Tu compañero de confianza para el bienestar emocional. Obtén apoyo personalizado y orientación en cualquier momento.
      </p>
      <div className="space-x-4">
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/auth">Iniciar Sesión</Link>
        </Button>
        <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
          <Link href="/chat">Chatear como Invitado</Link>
        </Button>
      </div>
    </div>
  );
}