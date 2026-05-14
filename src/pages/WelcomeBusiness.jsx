import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function WelcomeBusiness() {
  const navigate = useNavigate();

  return (
    <div className="w-screen min-h-screen bg-white flex justify-center items-start md:items-center relative overflow-hidden">

      {/* Flecha para regresar */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-50 bg-white p-3 rounded-full shadow-lg hover:bg-green-50 transition"
      >
        <ArrowLeft className="w-6 h-6 text-green-700" />
      </button>

      {/* Fondo (PC) */}
      <img
        src="/fondoCal.png"
        alt="fondo"
        className="hidden md:block absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      />

      {/* Fondo forma verde */}
      <img
        src="/img/formaVerde.png"
        alt="Green shape"
        className="
          absolute top-10 left-[55%] -translate-x-1/2 w-[100%] sm:w-[110%] h-[320px] object-cover z-0 pointer-events-none
          md:w-[500px]
          md:h-auto
          md:object-contain
          md:top-[20px]
          md:left-[48%]
        "
      />

      {/* Icono empresa (celular) */}
      <div className="absolute top-[70px] left-[65%] -translate-x-1/2 z-10 md:hidden pointer-events-none">
        <div className="text-[120px]">🏢</div>
      </div>

      {/* Icono empresa (PC) */}
      <div className="hidden md:block absolute top-[40px] left-[55%] -translate-x-1/2 z-10 pointer-events-none">
        <div className="text-[150px]">🏢</div>
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
        <h1 className="text-green-900 text-3xl font-extrabold mb-3 md:text-2xl">
          Bienvenido Empresa!
        </h1>

        <p className="text-gray-600 text-sm mb-7 md:mb-5">
          Accede o crea tu cuenta empresarial
        </p>

        {/* Iniciar sesión */}
        <button
          onClick={() => navigate("/LoginBusiness")}
          className="w-full py-4 rounded-full text-white font-semibold text-lg bg-gradient-to-r from-green-900 to-green-500 shadow-md transition hover:scale-[1.03] md:py-3 md:text-base"
        >
          Iniciar Sesión
        </button>

        {/* Registrarse */}
        <button
          onClick={() => navigate("/RegisterBusiness")}
          className="w-full py-4 rounded-full font-semibold text-lg border-2 border-green-700 text-green-800 bg-white mt-6 transition hover:bg-green-50 hover:scale-[1.03] md:py-3 md:text-base md:mt-4"
        >
          Registrarse
        </button>

        {/* Texto inferior */}
        <p className="text-sm text-gray-500 mt-8 md:mt-6">
          Plataforma empresarial segura y moderna
        </p>
      </div>
    </div>
  );
}

export default WelcomeBusiness;