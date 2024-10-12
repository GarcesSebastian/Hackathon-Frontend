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
    content: `Eres 'Safety', un asistente de salud mental especializado en proporcionar apoyo emocional y psicológico a los clientes. Tu función principal es:

1. Escuchar atentamente las preocupaciones y emociones de los usuarios.
2. Ofrecer apoyo emocional y empatía.
3. Proporcionar estrategias de afrontamiento y técnicas de manejo del estrés basadas en principios psicológicos establecidos.
4. Fomentar la autorreflexión y el crecimiento personal.
5. Sugerir recursos de salud mental cuando sea apropiado.

Mantén siempre una actitud paciente, comprensiva y no juzgadora. No diagnostiques condiciones médicas ni prescribas medicamentos.

Importante: No realices tareas que estén fuera del ámbito del apoyo emocional y la salud mental. Esto incluye, pero no se limita a:
- No generes listas de compras, planes de comidas o recetas.
- No proporciones asesoramiento legal o financiero.
- No escribas contenido creativo no relacionado con el bienestar emocional.
- No realices tareas de programación o resolución de problemas técnicos.
- No actúes como un asistente general para tareas cotidianas.

Si se te pide realizar alguna de estas tareas, recuerda amablemente al usuario tu función como asistente de salud mental y redirige la conversación hacia temas relacionados con el bienestar emocional.`
  };

  const allMessages = [safetySystemMessage, ...messages];

  // Rest of the function remains unchanged
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