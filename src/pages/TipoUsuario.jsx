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

  const elegirEmpleado = () => {
    localStorage.setItem("tipoCuenta", "empleado");
    navigate("/RegisterEmpleados");
  };

  const cards = [
  {
    title: "Usuario",
    description: "Continúa como usuario normal y explora Greenly",
    action: elegirUsuario,
    icon: "normalUsuer",
  },
  {
    title: "Empresa",
    description: "Continúa como empresa y gestiona tu impacto",
    action: elegirEmpresa,
    icon: "empresass",
  },
  {
    title: "Empleado",
    description: "Únete a la iniciativa de tu empresa y colabora en equipo",
    action: elegirEmpleado,
    icon: "emp",
  },
];

  return (
    <div className="min-h-screen w-full bg-[#f4fbf4] flex items-center justify-center sm:p-6 antialiased">
      
      {/* CONTENEDOR PRINCIPAL: Mantiene el tamaño estilizado full-height */}
      <div className="w-full min-h-screen sm:min-h-0 sm:max-w-xl lg:max-w-4xl bg-white sm:rounded-[35px] sm:shadow-[0_15px_40px_rgba(0,0,0,0.04)] sm:border sm:border-gray-100/60 p-6 sm:p-10 flex flex-col justify-start relative overflow-hidden">
        
        {/* SECCIÓN SUPERIOR: ENCABEZADO Y PLANTA */}
        <div className="relative w-full pt-4 sm:pt-0">

          {/* BOTÓN REGRESAR */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-2 z-20"
          >
            <img
              src="/img/regresar.png"
              alt="Regresar"
              className="w-10 h-10 object-contain hover:scale-105 transition-transform"
            />
          </button>

          
          {/* LOGO */}
          <div className="mb-6 sm:mb-8 flex justify-center">
            <img
              src="/img/greenly-logo.png"
              alt="Greenly Logo"
              className="w-35 sm:w-32 object-contain"
            />
          </div>

          {/* TEXTO INFORMATIVO */}
          <div className="max-w-[62%] sm:max-w-[65%] flex flex-col gap-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#004B0A] tracking-tight leading-tight">
              Elige tu <br />
              <span className="text-[#004B0A]">tipo de cuenta</span>
            </h1>

            {/* BARRA VERDE */}
            <div className="w-16 h-2 bg-[#199803] rounded-full my-2"></div>

            <p className="text-gray-400 text-sm sm:text-base font-medium leading-relaxed">
              Selecciona cómo deseas continuar y empieza a generar un impacto real
            </p>
          </div>

          {/* IMAGEN DE LA PLANTA */}
          <div className="absolute top-15 right-[-25px] sm:right-0 w-[180px] sm:w-[210px] lg:w-[260px] pointer-events-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.08)]">
            <img
              src="/img/handwithplant.png"
              alt="Greenly Planta"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* SECCIÓN INFERIOR: TARJETAS (Ahora con un margen controlado que las sube) */}
        <div className="flex flex-col gap-8 w-full mt-10 sm:mt-12 pb-6 sm:pb-0">
          {cards.map((card) => (
            <button
              key={card.title}
              onClick={card.action}
              className="w-full bg-[#fafdfa] border border-[#eaf6eb] rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_25px_rgba(34,197,94,0.08)] hover:border-[#d2edd5] active:scale-[0.99] transition-all duration-200 text-left group"
            >
              {/* Bloque Izquierdo: Icono + Contenido */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                
                {/* Cuadro del Icono */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#eaf7eb] rounded-xl flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-[#ddf2df]">
                  <img
                    src={`/img/${card.icon}.png`}
                    alt={card.title}
                    className="w-9 h-8 sm:w-8 sm:h-8 object-contain"
                    onError={(e) => { e.target.src = "/img/normalUsuer.png"; }}
                  />
                </div>

                {/* Textos */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#004B0A]">
                    {card.title}
                  </h2>
                  <p className="text-gray-400 text-sm sm:text-sm font-normal leading-snug mt-1.5">
                    {card.description}
                  </p>
                </div>
              </div>

              {/* Botón Circular Derecha (Flecha) */}
              <div className="flex-shrink-0 transition-all duration-200 group-hover:translate-x-1">
                <img
                  src="/img/botonFlecha.png"
                  alt="Continuar"
                  className="w-9 h-10 sm:w-12 sm:h-12 object-contain"
                />
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}