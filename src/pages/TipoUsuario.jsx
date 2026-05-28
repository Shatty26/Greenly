import React from "react";
import { useNavigate } from "react-router-dom";

export default function TipoUsuario() {
  const navigate = useNavigate();

  const elegirUsuario = () => {
    localStorage.setItem("tipoCuenta", "usuario");
    navigate("/Register");
  };

  const elegirEmpresa = () => {
    localStorage.setItem("tipoCuenta", "empresa");
    navigate("/CompanyRegister");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-0 sm:px-4 py-0 sm:py-10">
      
      {/* CONTENEDOR PRINCIPAL */}
      <div className="w-full min-h-screen sm:min-h-0 sm:max-w-4xl bg-white sm:rounded-[30px] sm:shadow-xl px-6 sm:px-10 py-10 relative overflow-hidden">
        {/* LOGO */}
        <div className="mb-6">
          <img
            src="/img/greenly-logo.png"
            alt="Greenly Logo"
            className="w-[140px]"
          />
        </div>

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8">

          {/* TEXTO */}
          <div className="max-w-xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#064e3b] leading-tight">
              Elige tu <br /> tipo de cuenta
            </h1>

            {/* LINEA VERDE */}
            <div className="w-20 h-2 bg-[#22c55e] rounded-full mt-4 mb-4"></div>

            <p className="text-gray-500 text-base sm:text-lg">
              Selecciona cómo deseas continuar <br />
              y empieza a generar un impacto real.
            </p>
          </div>
        </div>

        {/* TARJETAS */}
        <div className="mt-8 flex flex-col gap-4">

          {/* USUARIO */}
          <button
            onClick={elegirUsuario}
            className="w-full bg-[#f6fff6] border border-[#e0f2e0] rounded-2xl px-5 py-5 sm:px-7 sm:py-6 flex items-center gap-4 shadow-md hover:shadow-xl transition-all duration-300 text-left group"
          >
            {/* ICONO */}
            <div className="w-16 h-16 bg-[#dff3d7] rounded-2xl flex items-center justify-center flex-shrink-0">
              <img
                src="/img/usuario.png"
                alt="Usuario"
                className="w-9 h-9 object-contain"
              />
            </div>

            {/* TEXTO */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#064e3b]">Usuario</h2>
              <p className="text-gray-500 mt-1 text-base leading-snug">
                Continúa como usuario normal <br />
                y explora Greenly
              </p>
            </div>

            {/* FLECHA */}
            <div className="w-12 h-12 bg-[#22c55e] group-hover:bg-[#16a34a] rounded-full flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-all duration-300 flex-shrink-0">
              ›
            </div>
          </button>

          {/* EMPRESA */}
          <button
            onClick={elegirEmpresa}
            className="w-full bg-[#f6fff6] border border-[#e0f2e0] rounded-2xl px-5 py-5 sm:px-7 sm:py-6 flex items-center gap-4 shadow-md hover:shadow-xl transition-all duration-300 text-left group"
          >
            {/* ICONO */}
            <div className="w-16 h-16 bg-[#dff3d7] rounded-2xl flex items-center justify-center flex-shrink-0">
              <img
                src="/img/empresa.png"
                alt="Empresa"
                className="w-9 h-9 object-contain"
              />
            </div>

            {/* TEXTO */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#064e3b]">Empresa</h2>
              <p className="text-gray-500 mt-1 text-base leading-snug">
                Continúa como empresa <br />
                y gestiona tu impacto
              </p>
            </div>

            {/* FLECHA */}
            <div className="w-12 h-12 bg-[#22c55e] group-hover:bg-[#16a34a] rounded-full flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-all duration-300 flex-shrink-0">
              ›
            </div>
          </button>

        </div>
      </div>
    </div>
  );
}