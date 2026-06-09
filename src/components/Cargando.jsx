import React from 'react';

const Cargando = () => {
  return (
    <div className="relative w-full h-screen bg-white flex flex-col justify-between overflow-hidden select-none font-sans">
      
      {/* 1. REFLEJO DIAGONAL SUPERIOR (Se extiende fluido en toda la pantalla) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        {/* Destello blanco en diagonal */}
        <div 
          className="absolute top-[-20%] left-[-10%] w-[120%] h-[60%] rotate-[15deg] bg-gradient-to-b from-white via-white/80 to-transparent z-10" 
          style={{ clipPath: 'polygon(0 0, 100% 0, 70% 100%, 0% 100%)' }}
        />
        {/* Degradado verde suave base en la esquina */}
        <div className="absolute top-0 left-0 w-[60%] h-[40%] bg-gradient-to-br from-emerald-400/20 via-green-200/5 to-transparent blur-3xl" />
      </div>
      
      {/* 2. LOGOTIPO DE GREENLY (Centrado nativamente en la pantalla) */}
      <div className="relative z-10 flex flex-col items-center pt-16 sm:pt-20 md:pt-24 lg:pt-28 px-4 w-full">
        <div className="flex items-center justify-center transition-all duration-300 transform scale-100 hover:scale-105 max-w-xs sm:max-w-sm md:max-w-md">
          <img
            src="/img/greenly-logo.png"
            alt="Greenly Logo"
            className="h-10 sm:h-12 md:h-24 lg:h-28 w-auto object-contain"
          />
        </div>
      </div>

      {/* 3. ILUSTRACIÓN CENTRAL (Perfectamente centrada en el eje vertical y horizontal de su sección) */}
      <div className="relative z-20 w-full flex justify-center items-center px-6 flex-1 max-h-[45vh] md:max-h-[50vh]">
        <div className="relative w-full max-w-[240px] sm:max-w-[280px] md:max-w-[340px] lg:max-w-[380px] aspect-square flex items-center justify-center transition-all duration-300">
          
          {/* Resplandor amarillo/dorado circular detrás del árbol */}
          <div className="absolute w-[90%] h-[90%] bg-gradient-to-b from-amber-300/40 via-yellow-100/10 to-transparent rounded-full blur-2xl animate-pulse duration-[4000ms]" />
          
          <img
            src="/img/arbol.png"
            alt="Mano sosteniendo árbol frondoso rojo"
            className="relative z-10 w-full h-full object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.12)]"
          />
        </div>
      </div>

      {/* 4. PAISAJE INFERIOR DE COLINAS (De lado a lado de la pantalla) */}
      <div className="relative w-full h-[28%] sm:h-[32%] md:h-[35%] z-10 flex flex-col justify-end pointer-events-none">
        
        {/* Capa de Niebla/Atmósfera suave que une la ilustración con las colinas */}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/90 via-emerald-200/40 to-transparent z-10" />
        
        {/* Colina Trasera (Ocupa el 100% del ancho del monitor) */}
        <svg 
          className="absolute bottom-6 sm:bottom-10 md:bottom-14 left-0 w-full h-24 sm:h-32 text-emerald-500/60 fill-current z-0" 
          viewBox="0 0 1440 320" 
          preserveAspectRatio="none"
        >
          <path d="M0,160 C288,128 576,224 864,224 C1152,224 1440,160 1440,160 L1440,320 L0,320 Z"></path>
        </svg>

        {/* Colina Frontal (Suelo principal de lado a lado) */}
        <svg 
          className="absolute bottom-0 left-0 w-full h-20 sm:h-28 md:h-36 text-emerald-600 fill-current z-20" 
          viewBox="0 0 1440 320" 
          preserveAspectRatio="none"
        >
          <path d="M0,192 C360,256 720,160 1080,192 C1260,208 1350,256 1440,288 L1440,320 L0,320 Z"></path>
        </svg>
        
        <div className="w-full h-4 sm:h-6 bg-emerald-600 z-20" />
      </div>

    </div>
  );
};

export default Cargando;