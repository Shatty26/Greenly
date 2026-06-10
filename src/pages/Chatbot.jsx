import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Send, Leaf } from 'lucide-react';
import { auth, db } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [nombre, setNombre] = useState(""); // ← nombre real del usuario
  const chatBodyRef = useRef(null);

  const user = auth.currentUser;

  
  // OBTENER NOMBRE DESDE FIREBASE
  useEffect(() => {
    const obtenerNombre = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, "usuarios"),
          where("uid", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        snapshot.forEach((doc) => {
          setNombre(doc.data().nombre || "");
        });
      } catch (error) {
        console.error("Error obteniendo nombre:", error);
      }
    };
    obtenerNombre();
  }, [user]);

  // ==============================
  // GEMINI
  // ==============================
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: "Eres GreenBot, un experto ambiental integrado en una app. Respuestas cortas (máximo 5 líneas) y un emoji. 🌿"
  });

  // Scroll al último mensaje
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;
    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
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

  const handleSuggestionClick = (text) => setInput(text);

  const suggestions = [
    { icon: "👣", label: "Huella de\ncarbono" },
    { icon: "📊", label: "Impacto\nambiental" },
    { icon: "🌿", label: "Ideas\nsostenibles" },
    { icon: "📄", label: "Reporte\nverde" },
  ];

  return (
    <div className="min-h-screen bg-[#f8faf8]] flex flex-col pb-[160px]">

      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 md:px-8 py-3 flex items-center gap-3 shadow-sm">
        <div className="w-12 h-12 flex items-center justify-center">
          <img
            src="/img/G.png"
            alt="Greenly"
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <h2 className="font-bold text-[22px] md:text-base text-[#005016]">Greenly Bot</h2>
          <p className="text-[13px] text-gray-400">Tu asistente para un futuro sostenible</p>
        </div>
      </div>

      {/* ÁREA DE CHAT — se centra en pantallas grandes */}
      <div className="flex-1 w-full max-w-2xl mx-auto flex flex-col px-4 md:px-0 pt-4">

        <div className="flex-1 flex flex-col gap-4 overflow-y-auto pb-10" ref={chatBodyRef}>

          {/* ── Estado vacío: bienvenida ── */}
          {messages.length === 0 && (
            <>
              {/* Hero */}
              <div className="flex items-start justify-between gap-4 mt-2">
                <div className="flex-1">
                  <h1 className="text-2xl md:text-4xl font-black text-[#005016] leading-tight">
                    {nombre ? `¡Hola, ${nombre}!` : "¡Hola!"}<br />
                    ¿En qué te puedo ayudar?
                  </h1>
                  <div className="w-16 h-2 bg-[#38a83f] rounded-full mt-3 mb-3"></div>
                  <p className="text-xs md:text-sm text-gray-500 leading-relaxed max-w-xs">
                    Estoy aquí para ayudarte a tomar decisiones más sostenibles y mejorar tu impacto ambiental.
                  </p>
                </div>
                <div className="w-28 h-28 md:w-36 md:h-36 flex-shrink-0">
                  <img src="/img/chatbot.png" alt="GreenBot" className="w-full h-full object-contain" />
                </div>
              </div>

              {/* Sugerencias */}
              <div className="mt-2">
                <h3 className="font-bold text-sm text-[#24423b] mb-3">Sugerencias para ti</h3>
                <div className="grid grid-cols-4 gap-2">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(s.label.replace('\n', ' '))}
                      className="bg-[#f5f5f5] hover:bg-[#edf5eb] rounded-2xl p-3 flex flex-col items-center gap-2 transition-colors border border-transparent hover:border-[#38a83f]/30"
                    >
                      <span className="text-xl">{s.icon}</span>
                      <span className="text-[10px] text-gray-500 text-center leading-tight whitespace-pre-line">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mensaje inicial del bot */}
              <div className="flex items-start gap-2 mt-2">
                <div className="w-8 h-8 bg-[#edf5eb] rounded-full flex items-center justify-center flex-shrink-0">
                  <Leaf size={15} className="text-[#38a83f]" />
                </div>
                <div className="bg-[#e8f5e2] text-[#24423b] px-4 py-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed max-w-[80%]">
                  Puedo ayudarte a entender tu impacto ambiental, encontrar mejores hábitos y trabajar juntos por un planeta más sano. 🌍<br /><br />
                  ¿Por dónde empezamos?
                </div>
              </div>
            </>
          )}

          {/* ── Mensajes del chat ── */}
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'items-start gap-2'}`}>
              {msg.role === 'bot' && (
                <div className="w-8 h-8 bg-[#edf5eb] rounded-full flex items-center justify-center flex-shrink-0">
                  <Leaf size={15} className="text-[#38a83f]" />
                </div>
              )}
              <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#2d7a3a] text-white rounded-br-sm'
                  : 'bg-[#e8f5e2] text-[#24423b] rounded-bl-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {/* ── Indicador de escritura ── */}
          {isTyping && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#edf5eb] rounded-full flex items-center justify-center flex-shrink-0">
                <Leaf size={15} className="text-[#38a83f]" />
              </div>
              <div className="bg-[#e8f5e2] px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                <span className="w-2 h-2 bg-[#38a83f] rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-[#38a83f] rounded-full animate-bounce [animation-delay:0.15s]"></span>
                <span className="w-2 h-2 bg-[#38a83f] rounded-full animate-bounce [animation-delay:0.3s]"></span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── BARRA DE INPUT — fija en la parte inferior, sobre el navbar ── */}
      <div className="fixed bottom-[90px] left-0 right-0 z-20 bg-white border-t border-gray-100 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-4 bg-[#f7f7f7] border border-gray-200 px-4 py-2.5 rounded-2xl focus-within:border-[#38a83f] transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Pregúntale algo a GreenBot..."
            className="flex-1 bg-transparent border-none text-sm text-gray-800 placeholder-gray-400 focus:ring-0 outline-none"
          />
          <button
            onClick={handleSendMessage}
            disabled={isTyping || !input.trim()}
            className="bg-[#2d7a3a] text-white rounded-full hover:bg-[#245f2e] active:scale-95 disabled:opacity-40 transition-all flex items-center justify-center w-9 h-9 flex-shrink-0"
          >
            <Send size={15} />
          </button>
        </div>
      </div>

    </div>
  );
};

export default Chatbot;