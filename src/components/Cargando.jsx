import React from 'react';

const Cargando = () => {
  return (
    <div className="relative w-full h-screen bg-white flex flex-col justify-between overflow-hidden select-none">
      
      {/* 1. Degradado diagonal superior izquierdo (Se expande en pantallas grandes) */}
      <div className="absolute top-0 left-0 w-full h-1/3 md:h-1/2 bg-gradient-to-br from-green-500/90 via-green-400/30 to-transparent pointer-events-none z-0" />

      {/* 2. Contenedor del Logo (Se agranda proporcionalmente en pantallas más grandes) */}
      <div className="relative z-10 flex justify-center items-center pt-16 md:pt-24 lg:pt-32 px-4">
        {/* REEMPLAZA: 'src' con la ruta real de tu logo */}
        <img 
          src="/img/logo-greenly.png" 
          alt="Greenly Logo" 
          className="h-14 sm:h-16 md:h-20 lg:h-24 w-auto object-contain transition-all duration-300"
        />
      </div>

      {/* 3. Contenedor de la Ilustración Central y Fondos */}
      <div className="relative w-full flex-1 flex flex-col justify-end items-center">
        
        {/* Imagen de la mano con el árbol (Control de tamaños responsivos) */}
        <div className="relative z-10 w-full flex justify-center px-4 max-h-[50vh] sm:max-h-[55vh] md:max-h-[60vh]">
          {/* REEMPLAZA: 'src' con la ruta real de tu imagen del árbol en la mano */}
          <img 
            src="/img/arbol.png" 
            alt="arbol" 
            className="w-full max-w-[280px] sm:max-w-[340px] md:max-w-[420px] lg:max-w-[480px] object-contain object-bottom transition-all duration-300"
          />
        </div>

        {/* Fondo verde degradado en la base (Se adapta a la altura de la pantalla) */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-green-600/80 via-green-200/20 to-transparent pointer-events-none backdrop-blur-[1px] z-0" />
        
        {/* Suelo verde oscuro difuminado en el borde inferior absoluto */}
        <div className="absolute bottom-0 left-0 w-full h-10 sm:h-14 md:h-20 bg-green-800/30 blur-md z-0" />
      </div>

    </div>
  );
};

export default Cargando;