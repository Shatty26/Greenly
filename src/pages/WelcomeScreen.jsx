import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="w-screen min-h-screen bg-white flex justify-center items-start md:items-center relative overflow-hidden">

        <img
        src="/fondoCal.png"
        alt="fondo"
        className="hidden md:block absolute inset-0 w-full h-full object-cover z-0"
        />

      {/* Fondo forma verde */}
      <img
        src="/img/formaVerde.png"
        alt="Green shape"
        className="
          absolute top-10 left-[55%] -translate-x-1/2 w-[100%] sm:w-[110%] h-[320px] object-cover z-0

            md:w-[500px]
            md:h-auto
            md:object-contain
            md:top-[20px]
            md:left-[48%]
        "
      />

      {/* Imagen mano botella */}
      <img
        src="/img/manobotella.png"
        alt="Hand bottle"
        className="absolute top-[1px] left-[65%] -translate-x-1/2 w-[290px] sm:w-[320px] z-10 md:hidden mt-[20px]"
        />

        {/* MANO (PC con transparencia fade derecha -> izquierda) */}
        <div
        className="hidden md:block absolute top-[20px] left-[53%] -translate-x-1/2 w-[290px] z-10"
        style={{
            WebkitMaskImage: "linear-gradient(to left, transparent 0%, black 35%)",
            maskImage: "linear-gradient(to left, transparent 0%, black 35%)",
        }}
        >
        <img
            src="/img/manobotella.png"
            alt="Hand bottle"
            className="w-full h-auto object-contain"
        />
        </div>

      {/* Card */}
      <div
        className="
          relative
          z-20
          mt-[400px]
          w-[88%]
          max-w-[390px]
          bg-gradient-to-b
          from-green-200/80
          to-white
          rounded-[28px]
          shadow-xl
          px-6
          py-10
          flex
          flex-col
          items-center

          md:mt-[380px]
          md:max-w-[450px]
          md:px-7
          md:py-8
        "
      >
        {/* Logo */}
        <img
          src="/img/greenly-logo.png"
          alt="Greenly Logo"
          className="w-[250px] mb-2 md:w-[250px]"
        />

        {/* Welcome */}
        <h1 className="text-green-900 text-3xl font-extrabold mb-7 md:text-2xl md:mb-5">
          Bienvenido!
        </h1>

        {/* Iniciar sesión */}
        <button
          onClick={() => (window.location.href = "/login")}
          className="w-full py-4 rounded-full text-white font-semibold text-lg bg-gradient-to-r from-green-900 to-green-500 shadow-md transition hover:scale-[1.03] md:py-3 md:text-base"
        >
          Iniciar Sesión
        </button>

        {/* Registrarse */}
        <button
          onClick={() => (window.location.href = "/register")}
          className="w-full py-4 rounded-full font-semibold text-lg border-2 border-green-700 text-green-800 bg-white mt-6 transition hover:bg-green-50 hover:scale-[1.03] md:py-3 md:text-base md:mt-4"
        >
          Registrarse
        </button>
      </div>
    </div>
  );
}

export default WelcomeScreen;