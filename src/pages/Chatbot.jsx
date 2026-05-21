import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Send, Leaf, Sparkles, Trash2, Globe, Lightbulb } from 'lucide-react';

const GreenBotPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef(null);

  // NOTA: Recuerda proteger tu API Key en variables de entorno (.env) en producción
  const API_KEY = "AIzaSyApMCSYOxN0ykRM3wPE-TIZqoAmJiKJ9kU"; 
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: "Eres GreenBot, un experto ambiental. Respuestas cortas (máximo 5 líneas), precisas y usando siempre algún emoji relacionado con la naturaleza. 🌿"
  });

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend = input) => {
    const messageText = typeof textToSend === 'string' ? textToSend : input;
    if (!messageText.trim()) return;

    const userMessage = { role: 'user', text: messageText };
    setMessages(prev => [...prev, userMessage]);
    if (typeof textToSend !== 'string' || textToSend === input) setInput("");
    setIsTyping(true);

    try {
      const result = await model.generateContent(messageText);
      const response = await result.response;
      setMessages(prev => [...prev, { role: 'bot', text: response.text() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Error de conexión con la red ecológica 🌿" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("¿Quieres limpiar el historial de conversación?")) {
      setMessages([]);
    }
  };

  const sugerencias = [
    "¿Cómo puedo reducir mi huella de carbono?",
    "Ideas para reciclar plástico en casa",
    "¿Qué es la economía circular?",
    "Tips para ahorrar agua en la cocina"
  ];

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-[#f4f7f5] font-sans antialiased flex flex-col md:flex-row">
      
      {/* PANEL LATERAL DE SUGERENCIAS (Oculto en móviles, visible en md+) */}
      <div className="hidden md:flex md:w-80 bg-white border-r border-gray-200 p-6 flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 text-[#13a147] mb-6">
            <div className="p-2 bg-[#13a147]/10 rounded-xl">
              <Leaf size={24} />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-lg">GreenBot Dashboard</h2>
              <p className="text-xs text-gray-500">Tu asistente eco-amigable</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Lightbulb size={14} /> Temas de conversación
            </h3>
            <div className="flex flex-col gap-2">
              {sugerencias.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(sug)}
                  disabled={isTyping}
                  className="text-left text-sm text-gray-600 bg-[#f9fafb] hover:bg-[#13a147]/5 hover:text-[#13a147] p-3 rounded-xl border border-gray-100 transition-all duration-200 active:scale-[0.98]"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info footer del panel */}
        <div className="bg-[#13a147]/5 p-4 rounded-xl border border-[#13a147]/10 flex items-center gap-3">
          <Globe size={18} className="text-[#13a147] shrink-0" />
          <p className="text-xs text-gray-600 leading-relaxed">
            Cada pequeña acción cuenta. ¡Pregúntame cómo mejorar tus hábitos diarios!
          </p>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL DEL CHAT */}
      <div className="flex-1 flex flex-col h-[calc(100vh-64px)]">
        
        {/* HEADER DE LA PÁGINA */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="md:hidden p-2 bg-[#13a147]/10 rounded-xl text-[#13a147]">
              <Leaf size={20} />
            </div>
            <div>
              <h1 className="font-bold text-gray-800 text-base md:text-lg flex items-center gap-2">
                Chat con GreenBot 
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 animate-pulse">
                  En línea
                </span>
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">Consultor ambiental con Inteligencia Artificial</p>
            </div>
          </div>

          {messages.length > 0 && (
            <button 
              onClick={clearChat}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
            >
              <Trash2 size={14} />
              <span>Limpiar chat</span>
            </button>
          )}
        </div>

        {/* ÁREA DE MENSAJES */}
        <div 
          ref={chatBodyRef}
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 max-w-4xl w-full mx-auto"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto py-12">
              <div className="w-16 h-16 bg-[#13a147]/10 text-[#13a147] rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                <Sparkles size={32} />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">¡Hola! Soy tu asistente ecológico</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Estoy aquí para resolver tus dudas sobre reciclaje, energías renovables, sustentabilidad o ideas para cuidar nuestro planeta.
              </p>
              
              {/* Sugerencias en bloque para vista móvil */}
              <div className="mt-6 w-full flex flex-col gap-2 md:hidden">
                {sugerencias.slice(0, 2).map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(sug)}
                    className="text-center text-xs text-gray-600 bg-white p-3 rounded-xl border border-gray-200"
                  >
                    "{sug}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex w-full animate-fade-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar básico */}
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold shadow-sm ${
                  msg.role === 'user' ? 'bg-slate-600 text-white' : 'bg-[#13a147] text-white'
                }`}>
                  {msg.role === 'user' ? 'Tú' : <Leaf size={14} />}
                </div>

                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#13a147] text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-gray-200/60 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}

          {/* Animación de carga (GreenBot escribiendo...) */}
          {isTyping && (
            <div className="flex justify-start gap-3 max-w-[75%]">
              <div className="w-8 h-8 rounded-full bg-[#13a147] text-white shrink-0 flex items-center justify-center">
                <Leaf size={14} />
              </div>
              <div className="bg-white border border-gray-200/60 px-5 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1.5 items-center">
                <span className="w-2 h-2 bg-[#13a147] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-[#13a147] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-[#13a147] rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
        </div>

        {/* INPUT DE TEXTO FIJO ABAJO */}
        <div className="p-4 md:p-6 bg-white border-t border-gray-200 shrink-0">
          <div className="max-w-4xl w-full mx-auto">
            <div className="flex items-center gap-2 bg-[#f9fafb] p-2 rounded-2xl border-2 border-transparent focus-within:border-[#13a147] focus-within:bg-white shadow-sm transition-all duration-200">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Pregúntale algo a GreenBot... (ej: ¿Cómo reciclo pilas?)"
                className="flex-1 bg-transparent border-none focus:ring-0 px-3 py-2.5 text-sm text-gray-700 outline-none w-full placeholder-gray-400"
                disabled={isTyping}
              />
              <button 
                onClick={() => handleSendMessage()} 
                className="bg-[#13a147] hover:bg-[#0f8238] text-white p-3 rounded-xl flex-shrink-0 shadow-md transition-all active:scale-95 disabled:opacity-40 disabled:hover:bg-[#13a147]"
                disabled={isTyping || !input.trim()}
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-[11px] text-center text-gray-400 mt-2">
              GreenBot puede cometer errores. Considera verificar la información importante.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GreenBotPage;