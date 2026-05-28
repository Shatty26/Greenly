import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Send, Leaf, Sparkles } from 'lucide-react';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef(null);

  // NOTA: Recuerda proteger tu API KEY antes de subir el proyecto a producción (p. ej. usando variables de entorno)
  const API_KEY = "AIzaSyCBNyJ-TAHIRCfJj5aGNqAA5DrkW2NGXbw"; 
  const genAI = new GoogleGenerativeAI(API_KEY);
  
  // Configuración del modelo
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: "Eres GreenBot, un experto ambiental que está integrado en una app. Respuestas cortas (máximo 5 líneas) y un emoji. 🌿"
  });

  // Auto-scroll al final del chat cuando llega un mensaje
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input;
    const userMessage = { role: 'user', text: userText };
    
    // Actualizamos la pantalla con el mensaje del usuario de inmediato
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Para mantener el contexto y las instrucciones del sistema de forma robusta
      const chat = model.startChat({
        history: messages.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        })),
      });

      const result = await chat.sendMessage(userText);
      const response = await result.response;
      
      setMessages(prev => [...prev, { role: 'bot', text: response.text() }]);
    } catch (error) {
      console.error("Error con la API de Gemini:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "Error de conexión o API Key inválida. 🌿" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    // CAMBIO: Se eliminó 'fixed bottom-6 right-6 items-end' y el estado isOpen.
    // Ahora es un contenedor flex que se adapta al 100% del alto y ancho disponible de la pantalla.
    <div className="w-full h-screen font-sans antialiased flex flex-col bg-gray-50 p-2 sm:p-4 justify-center items-center">
      
      {/* VENTANA DEL CHAT (Adaptada a pantalla completa/contenedor grande) */}
      <div className="w-full max-w-2xl h-[90vh] flex flex-col bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden transition-all duration-300">
        
        {/* HEADER (Se removió el botón de cerrar) */}
        <div className="bg-[#13a147] p-4 flex items-center justify-between text-white flex-shrink-0 h-14">
          <div className="flex items-center gap-2">
            <Leaf size={18} />
            <span className="font-bold text-sm">GreenBot</span>
          </div>
        </div>

        {/* CUERPO DE CHAT */}
        <div className="flex-1 overflow-y-auto bg-[#f9fafb] p-4 flex flex-col space-y-3" ref={chatBodyRef}>
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
              <Sparkles size={30} className="text-[#13a147] mb-2" />
              <p className="text-xs font-bold text-gray-800">¡Hola! Pregúntame sobre el ambiente</p>
            </div>
          )}
          
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-[13px] shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-[#13a147] text-white rounded-tr-none' 
                  : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-[#13a147] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-[#13a147] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-[#13a147] rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
        </div>

        {/* ÁREA DE INPUT */}
        <div className="p-3 bg-white border-t border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200 focus-within:border-[#13a147] focus-within:ring-1 focus-within:ring-[#13a147] transition-all">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escribe aquí..."
              className="flex-1 bg-transparent border-none focus:ring-0 px-2 py-2 text-sm text-gray-700 outline-none w-full"
            />
            <button 
              onClick={handleSendMessage} 
              className="bg-[#13a147] text-white p-2.5 rounded-lg flex-shrink-0 shadow-md active:scale-95 disabled:opacity-50"
              disabled={isTyping}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Chatbot;