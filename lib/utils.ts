import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { OPENAI_API_KEY } from '@/env';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function sendMessageToSafety(
  messages: { role: string; content: string }[],
  onChunk: (chunk: string) => void
) {
  const safetySystemMessage = {
    role: "system",
    content: "Eres 'Safety', un asistente de salud mental especializado en ayudar a los clientes con sus emociones. Tu misión es proporcionar apoyo emocional, escuchar atentamente y ofrecer consejos útiles basados en principios de psicología. Mantén siempre una actitud paciente, comprensiva y empática. No realices tareas que no estén relacionadas con el apoyo emocional y la salud mental."
  };

  const allMessages = [safetySystemMessage, ...messages];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: allMessages,
      stream: true,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Ocurrió un error al enviar el mensaje a Safety');
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { done, value } = await reader!.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("data: ")) {
        const data = trimmedLine.slice(6);
        if (data === "[DONE]") {
          return;
        }
        try {
          const parsed = JSON.parse(data);
          const chunk = parsed.choices[0]?.delta?.content || "";
          if (chunk) {
            onChunk(chunk);
          }
        } catch (error) {
          console.error("Error al analizar JSON:", error);
        }
      }
    }
  }
}