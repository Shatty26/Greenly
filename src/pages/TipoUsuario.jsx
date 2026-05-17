import React from "react";
import { useNavigate } from "react-router-dom";

export default function TipoUsuario() {
  const navigate = useNavigate();

  const elegirUsuario = () => {
    localStorage.setItem("tipoCuenta", "usuario");
    navigate("/WelcomeScreen");
  };

  const elegirEmpresa = () => {
    localStorage.setItem("tipoCuenta", "empresa");
    navigate("/PricingScreen");
  };

  return (
    // Contenedor principal: centrado verticalmente, fondo blanco, padding responsivo
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      {/* Contenedor interno: ancho máximo para que no se estire demasiado en 4K */}
      <div className="max-w-6xl w-full mx-auto">
        
         {/* Logo*/}
        <div className="mb-6 md:mb-10">
          <img
            src="/img/greenly-logo.png"
            alt="Greenly Logo"
            className="w-[250px] mb-2 md:w-[250px]"
          />
        </div>

        {/* Sección de texto del header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#064e3b] tracking-tight">
            Elige tu tipo de cuenta
          </h1>
          {/* Línea verde decorativa debajo del título */}
          <div className="w-16 h-1 bg-[#22c55e] rounded-full mt-3 mb-4"></div>
          <p className="text-gray-500 text-base md:text-lg">
            Selecciona cómo quieres continuar y empieza a generar impacto real
          </p>
        </div>

        {/* Grid responsivo: en PC (lg) son 2 columnas, en móvil 1 columna */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* LADO IZQUIERDO: IMAGEN (Sin distorsión) */}
          <div className="flex justify-center lg:justify-start order-2 lg:order-1">
            <img 
              src="public/img/manocontierra.png" 
              alt="Mano con tierra" 
              className="w-64 sm:w-80 md:w-96 lg:w-full max-w-md h-auto object-contain"
            />
          </div>

          {/* LADO DERECHO: TARJETAS (Botones) */}
          <div className="flex flex-col gap-5 md:gap-6 order-1 lg:order-2">
            
            {/* Tarjeta de Usuario */}
            <button 
              onClick={elegirUsuario}
              className="w-full bg-[#fafffa] border border-[#e6f5e6] rounded-2xl p-5 md:p-6 flex items-center gap-4 md:gap-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left group"
            >
              {/* Icono */}
              <div className="w-12 h-12 md:w-14 md:h-14  flex items-center justify-center text-2xl md:text-3xl flex-shrink-0">
                <img src="/public/img/usuario.png" alt="usuario" />
              </div>
              {/* Texto */}
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-[#064e3b]">Usuario</h2>
              </div>
              {/* Flecha */}
              <div className="text-[#22c55e] text-2xl md:text-3xl font-bold group-hover:translate-x-1 transition-transform">
                ›
              </div>
            </button>

            {/* Tarjeta de Empresa */}
            <button 
              onClick={elegirEmpresa}
              className="w-full bg-[#fafffa] border border-[#e6f5e6] rounded-2xl p-5 md:p-6 flex items-center gap-4 md:gap-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left group"
            >
              {/* Icono */}
              <div className="w-12 h-12 md:w-14 md:h-14  flex items-center justify-center text-2xl md:text-3xl flex-shrink-0">
                <img src="/public/img/empresa.png" alt="empresa" />
              </div>
              {/* Texto */}
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-[#064e3b]">Empresa</h2>
              </div>
              {/* Flecha */}
              <div className="text-[#22c55e] text-2xl md:text-3xl font-bold group-hover:translate-x-1 transition-transform">
                ›
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}