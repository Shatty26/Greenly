import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Send, Leaf, MessageSquare, Home, ShieldCheck, User, Sparkles } from 'lucide-react';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef(null);

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; 
  const genAI = new GoogleGenerativeAI(API_KEY);
  
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: "Eres GreenBot, un experto ambiental que está integrado en una app. Respuestas cortas (máximo 5 líneas) y un emoji. 🌿"
  });

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input;
    const userMessage = { role: 'user', text: userText };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
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

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  return (
    <div className="w-full h-screen font-sans antialiased flex bg-[#e3e9e5] text-gray-800 overflow-hidden">
      
      {/* SIDEBAR IZQUIERDO */}
      <div className="w-72 bg-[#f4f7f5] border-r border-gray-300/60 flex flex-col justify-between p-5 select-none hidden md:flex">
        <div>
          {/* Logo / Título del Panel */}
          <div className="mb-8">
            <h1 className="text-[17px] font-bold text-gray-900 leading-tight">Panel de control de</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[17px] font-bold text-[#13a147]">GreenBot</span>
            </div>
            <p className="text-[12px] text-gray-500 mt-1">Tu asistente eco-amigable</p>
          </div>

          {/* Sección Temas de Conversación */}
          <div>
            <h2 className="text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-3">Temas de conversación</h2>
            <div className="space-y-1">
              {[
                "¿Cómo puedo reducir mi huella de carbono?",
                "Ideas para reciclar plástico en casa.",
                "¿Qué es la economía circular?",
                "Consejos para ahorrar agua en la cocina"
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(item)}
                  className="w-full text-left text-[12px] text-gray-600 hover:text-[#13a147] hover:bg-white/80 p-2.5 rounded-lg border border-transparent hover:border-gray-200 transition-all duration-150 block truncate"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card Informativa Inferior */}
        <div className="bg-white/60 border border-gray-200/80 p-3.5 rounded-xl">
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Cada pequeña acción cuenta. ¡Pregúntame cómo mejorar tus hábitos diarios!
          </p>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL DEL CHAT */}
      <div className="flex-1 flex flex-col bg-[#eef2f0] relative">
        
        {/* TOP BAR / HEADER */}
        <div className="px-6 py-4 border-b border-gray-300/40 bg-[#eef2f0]/80 backdrop-blur-sm flex items-center justify-between flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-[15px] text-gray-900">Chatea con GreenBot</h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-medium">En línea</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">Consultor ambiental con Inteligencia Artificial</p>
          </div>
        </div>

        {/* ÁREA DE MENSAJES */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col space-y-4" ref={chatBodyRef}>
          {messages.length === 0 ? (
            /* Vista de bienvenida (Igual a la imagen) */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 max-w-xl mx-auto">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm border border-gray-200/50">
                <Sparkles size={20} className="text-[#13a147]" />
              </div>
              <h3 className="text-[15px] font-bold text-gray-900 mb-2">¡Hola! Soy tu asistente ecológico</h3>
              <p className="text-[12px] text-gray-500 leading-relaxed">
                Estoy aquí para resolver tus dudas sobre reciclaje, energías renovables, sustentabilidad o ideas para cuidar nuestro planeta.
              </p>
            </div>
          ) : (
            /* Mensajes del chat */
            messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-xl text-[13px] leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-[#13a147] text-white shadow-sm' 
                    : 'bg-white text-gray-800 border border-gray-200/60 shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))
          )}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200/60 px-4 py-2.5 rounded-xl shadow-sm flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-[#13a147] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-[#13a147] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-[#13a147] rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM BAR: BARRA DE ENTRADA Y MENÚ INFERIOR */}
        <div className="p-4 bg-[#eef2f0] flex flex-col items-center gap-4 flex-shrink-0">
          
          {/* Input de búsqueda flotante estilizado */}
          <div className="w-full max-w-2xl flex items-center gap-2 bg-white/80 border border-gray-300/80 px-4 py-1.5 rounded-full shadow-sm focus-within:border-[#13a147] focus-within:bg-white transition-all">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Pregúntale algo a GreenBot... (ej: ¿Cómo reciclo pilas?)"
              className="flex-1 bg-transparent border-none text-[13px] text-gray-800 placeholder-gray-400 focus:ring-0 outline-none py-1.5"
            />
            <button 
              onClick={handleSendMessage} 
              disabled={isTyping || !input.trim()}
              className="bg-[#13a147] text-white p-2 rounded-full hover:bg-[#118c3e] active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all flex items-center justify-center w-8 h-8"
            >
              <Send size={13} className="ml-0.5" />
            </button>
          </div>

          {/* Menú de Iconos Inferiores (Navegación de la App) */}
          <div className="flex items-center justify-center gap-8 text-gray-500 pb-1">
            <button className="hover:text-[#13a147] transition-colors p-1.5"><Home size={20} /></button>
            <button className="hover:text-[#13a147] transition-colors p-1.5"><Leaf size={20} /></button>
            <button className="text-[#13a147] bg-white/80 rounded-xl shadow-sm border border-gray-200 p-2"><MessageSquare size={20} /></button>
            <button className="hover:text-[#13a147] transition-colors p-1.5"><User size={20} /></button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Chatbot;