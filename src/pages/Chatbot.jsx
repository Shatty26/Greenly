import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Send, Leaf, ChevronDown, Sparkles } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef(null);

  const API_KEY = "AIzaSyCBNyJ-TAHIRCfJj5aGNqAA5DrkW2NGXbw"; 
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: "Eres GreenBot, un experto ambiental que esta integrado en una app. Respuestas cortas (máximo 5 líneas) y un emoji. 🌿"
  });

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const result = await model.generateContent(input);
      const response = await result.response;
      setMessages(prev => [...prev, { role: 'bot', text: response.text() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Error de conexión 🌿" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans antialiased flex flex-col items-end">
      
      {/* VENTANA DEL CHAT */}
      {isOpen && (
        <div className="mb-4 w-[90vw] sm:w-[350px] flex flex-col bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden transition-all duration-300 h-[450px] max-h-[calc(100vh-140px)]">
          
          {/* HEADER */}
          <div className="bg-[#13a147] p-4 flex items-center justify-between text-white flex-shrink-0 h-14">
            <div className="flex items-center gap-2">
              <Leaf size={18} />
              <span className="font-bold text-sm">GreenBot</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-black/10 rounded-full transition-colors">
              <ChevronDown size={20} />
            </button>
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
      )}

      {/* BOTÓN FLOTANTE - TAMAÑO REDUCIDO */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative transition-all duration-300 transform ${
          isOpen ? 'rotate-180 scale-90' : 'hover:scale-110 active:scale-95'
        }`}
      >
        {isOpen ? (
          /* Botón cerrar más compacto */
          <div className="bg-slate-700 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl">
             <ChevronDown size={24} />
          </div>
        ) : (
          <div className="relative">
            {/* Burbuja reducida a 60x50 con bordes proporcionales */}
            <div className="bg-[#13a147] w-[60px] h-[50px] rounded-[1.5rem] flex items-center justify-center gap-1 shadow-lg border-[3px] border-white">
              <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
              <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
              <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
            </div>
            {/* Colita de la burbuja ajustada */}
            <div 
              className="absolute -bottom-1.5 right-3 w-0 h-0 
              border-l-[8px] border-l-transparent 
              border-r-[8px] border-r-transparent 
              border-t-[12px] border-t-[#13a147]
              drop-shadow-md"
            ></div>
          </div>
        )}
      </button>

    </div>
  );
};

export default Chatbot;