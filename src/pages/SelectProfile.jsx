import { useNavigate } from "react-router-dom";
import { Building2, User, ChevronRight } from "lucide-react";

export default function SelectProfile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white relative overflow-hidden font-sans selection:bg-green-100 flex flex-col items-center justify-center">
      
      {/* FONDO: Patrón de hojas sutil (Marca de agua) */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
        style={{ 
          backgroundImage: `url('https://www.transparenttextures.com/patterns/leaves.png')`,
          backgroundSize: '300px' 
        }}
      ></div>

      {/* CONTENEDOR PRINCIPAL: Centrado y con ancho máximo para PC */}
      <div className="relative z-10 w-full max-w-[1200px] px-6 py-10 md:py-20 flex flex-col h-full">
        
        {/* LOGOTIPO - Siempre arriba a la izquierda */}
        <div className="mb-10 md:mb-16 self-start">
          <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate("/")}>
            <span className="text-3xl font-bold text-[#2d6a4f] tracking-tight">
              G<span className="text-[#52b788]">reenly</span>
            </span>
            <div className="flex flex-col -ml-1">
              <div className="flex gap-0.5">
                <div className="w-2.5 h-2.5 bg-[#84cc16] rounded-tr-full rounded-bl-full rotate-12"></div>
                <div className="w-2.5 h-2.5 bg-[#4ade80] rounded-tl-full rounded-br-full -rotate-12"></div>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN HERO: Layout responsivo (Vertical en móvil, Horizontal en PC) */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-12 md:mb-20">
          
          <div className="md:w-3/5 lg:w-1/2">
            <h1 className="text-[38px] sm:text-[48px] md:text-[56px] font-extrabold text-[#1b4332] leading-[1.1] mb-6">
              Elige tu tipo <br className="hidden md:block" /> de cuenta
            </h1>
            
            {/* Barra verde decorativa */}
            <div className="w-20 h-2 bg-[#4ade80] rounded-full mb-8"></div>
            
            <p className="text-[#6c757d] text-lg sm:text-xl leading-snug font-medium max-w-md">
              Selecciona cómo quieres continuar y comienza a generar un impacto real.
            </p>
          </div>

          {/* IMAGEN DE LA PLANTA: Se ajusta según el dispositivo */}
          <div className="flex justify-center md:justify-end md:w-2/5">
            <div className="relative w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 group">
              {/* Resplandor de fondo */}
              <div className="absolute inset-0 bg-green-200/40 rounded-full blur-[60px] animate-pulse"></div>
              
              {/* Espacio para la imagen real */}
              <div className="relative w-full h-full flex items-center justify-center border-2 border-dashed border-green-200 rounded-full text-green-400 text-xs text-center p-6 bg-white/50 backdrop-blur-sm">
                <span className="opacity-60 italic">[ Aquí va la imagen de la planta de image_86d93f.png ]</span>
              </div>
            </div>
          </div>
        </div>

        {/* TARJETAS: En PC se mantienen centradas y no demasiado anchas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl md:mx-auto w-full">
          
          {/* Tarjeta: USUARIO */}
          <button
            onClick={() => navigate("/employeeLogin")}
            className="group flex items-center bg-[#f9fefb] border border-[#f0f9f1] rounded-[40px] p-6 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] hover:bg-white transition-all duration-300 active:scale-[0.98]"
          >
            <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-[#dcf5e1] rounded-[30px] flex items-center justify-center mr-6 group-hover:bg-[#c2edcc] transition-colors">
              <User size={42} className="text-[#1b4332]" strokeWidth={1.5} />
            </div>
            
            <div className="flex-grow text-left">
              <h2 className="text-2xl font-bold text-[#1b4332] mb-1">Usuario</h2>
              <p className="text-[#6c757d] text-sm sm:text-base leading-tight">
                Entra como usuario y explora Greenly
              </p>
            </div>

            <div className="flex-shrink-0 w-11 h-11 bg-[#38a169] rounded-full flex items-center justify-center text-white shadow-lg group-hover:bg-[#2d6a4f] transition-all group-hover:translate-x-2">
              <ChevronRight size={26} />
            </div>
          </button>

          {/* Tarjeta: EMPRESA */}
          <button
            onClick={() => navigate("/logincompany")}
            className="group flex items-center bg-[#f9fefb] border border-[#f0f9f1] rounded-[40px] p-6 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] hover:bg-white transition-all duration-300 active:scale-[0.98]"
          >
            <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-[#dcf5e1] rounded-[30px] flex items-center justify-center mr-6 group-hover:bg-[#c2edcc] transition-colors">
              <Building2 size={42} className="text-[#1b4332]" strokeWidth={1.5} />
            </div>
            
            <div className="flex-grow text-left">
              <h2 className="text-2xl font-bold text-[#1b4332] mb-1">Empresa</h2>
              <p className="text-[#6c757d] text-sm sm:text-base leading-tight">
                Gestiona el impacto de tu compañía
              </p>
            </div>

            <div className="flex-shrink-0 w-11 h-11 bg-[#38a169] rounded-full flex items-center justify-center text-white shadow-lg group-hover:bg-[#2d6a4f] transition-all group-hover:translate-x-2">
              <ChevronRight size={26} />
            </div>
          </button>

        </div>

        {/* PIE DE PÁGINA */}
        <div className="mt-16 text-center">
           <p className="text-gray-400 text-sm font-medium">
             ¿No tienes una cuenta? {' '}
             <button 
               onClick={() => navigate("/companyregister")} 
               className="text-[#38a169] font-bold hover:underline transition-colors ml-1"
             >
               Regístrate aquí
             </button>
           </p>
        </div>

      </div>
    </div>
  );
}