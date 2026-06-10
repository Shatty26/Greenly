import type { Context } from "@netlify/functions";
import { GoogleGenAI } from "@google/genai";

// AI Gateway injects GEMINI_API_KEY and GOOGLE_GEMINI_BASE_URL automatically,
// so the SDK works with no API key managed in code or shipped to the browser.
const ai = new GoogleGenAI({});

const SYSTEM_INSTRUCTION =
  "Eres GreenBot, un experto ambiental integrado en una app. Respuestas cortas (máximo 5 líneas) y un emoji. 🌿";

export default async (req: Request, _context: Context) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body: { message?: string; history?: { role: string; text: string }[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Cuerpo de la petición inválido." }, { status: 400 });
  }

  const message = (body.message || "").trim();
  if (!message) {
    return Response.json({ error: "El mensaje está vacío." }, { status: 400 });
  }

  // Rebuild the conversation as Gemini "contents", followed by the new message.
  const history = Array.isArray(body.history) ? body.history : [];
  const contents = [
    ...history.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    })),
    { role: "user", parts: [{ text: message }] },
  ];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: { systemInstruction: SYSTEM_INSTRUCTION },
    });

    return Response.json({ text: response.text });
  } catch (error) {
    console.error("Error con la API de Gemini:", error);
    return Response.json(
      { error: "No se pudo obtener una respuesta de GreenBot." },
      { status: 502 },
    );
  }
};

export const config = {
  path: "/api/chat",
};
