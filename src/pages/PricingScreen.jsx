import {
  Check,
  Leaf,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function PantallaPrecios() {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ecfff1] via-[#dfffe7] to-[#c8ffd8] overflow-hidden relative">

      {/* Retroceder */}
      <button
        onClick={() => navigate(-1)}
        className="
          absolute top-6 left-6 
          w-12 h-12 
          flex items-center justify-center 
          rounded-full bg-white/80 shadow-md 
          hover:bg-green transition
          z-30
        "
      >
        <span className="text-xl font-black text-green-900">←</span>
      </button>

      {/* Fondos decorativos */}
      <div className="absolute top-[-100px] left-[-80px] w-72 h-72 bg-green-300 rounded-full blur-3xl opacity-30"></div>

      <div className="absolute bottom-[-100px] right-[-80px] w-72 h-72 bg-lime-300 rounded-full blur-3xl opacity-30"></div>

      {/* Contenedor principal */}
      <div className="relative z-10 px-4 py-8 sm:px-6 md:px-10">

        {/* Logo*/}
        <div>
          <img
            src="/img/greenly-logo.png"
            alt="Greenly Logo"
            className="w-[250px] mb-2 md:w-[250px]"
          />
        </div>

        {/* Encabezado */}
        <div className="text-center mb-14">

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-green-950 leading-tight">
            Únete al
            <br />
            Movimiento Greenly
          </h2>

          <p className="text-green-800 mt-5 text-base sm:text-lg max-w-xl mx-auto px-2">
            Elige el plan perfecto para reducir tu impacto ambiental
            y crear un futuro más verde.
          </p>

        </div>

        {/* Cards */}
        <div className="flex flex-col lg:flex-row justify-center items-center gap-8">

          {/* ===================== */}
          {/* CARD BÁSICA */}
          {/* ===================== */}
          <div className="relative w-full max-w-sm rounded-[35px] p-6 sm:p-8 transition-all duration-300 hover:scale-105 shadow-2xl bg-gradient-to-br from-green-600 to-emerald-800">

            {/* Título */}
            <div className="text-center mb-8">

              <h3 className="text-3xl sm:text-4xl font-black text-white">
                Básico
              </h3>

              <p className="text-green-100 text-lg sm:text-xl mt-3">
                Gratis
              </p>

            </div>

            {/* Características */}
            <div className="space-y-5">

              <div className="flex items-start gap-4">

                <div className="min-w-[32px] min-h-[32px] bg-lime-300 rounded-full flex items-center justify-center mt-1">
                  <Check size={18} className="text-green-950" />
                </div>

                <p className="text-white text-base sm:text-lg leading-relaxed">
                  Calculadora de huella de carbono
                </p>

              </div>

              <div className="flex items-start gap-4">

                <div className="min-w-[32px] min-h-[32px] bg-lime-300 rounded-full flex items-center justify-center mt-1">
                  <Check size={18} className="text-green-950" />
                </div>

                <p className="text-white text-base sm:text-lg leading-relaxed">
                  Retos ecológicos diarios
                </p>

              </div>

              <div className="flex items-start gap-4">

                <div className="min-w-[32px] min-h-[32px] bg-lime-300 rounded-full flex items-center justify-center mt-1">
                  <Check size={18} className="text-green-950" />
                </div>

                <p className="text-white text-base sm:text-lg leading-relaxed">
                  Clasificador de Residuos
                </p>

              </div>

              <div className="flex items-start gap-4">

                <div className="min-w-[32px] min-h-[32px] bg-lime-300 rounded-full flex items-center justify-center mt-1">
                  <Check size={18} className="text-green-950" />
                </div>

                <p className="text-white text-base sm:text-lg leading-relaxed">
                  Recomendaciones de lugares donde puedes reciclar
                </p>

              </div>

              <div className="flex items-start gap-4">

                <div className="min-w-[32px] min-h-[32px] bg-lime-300 rounded-full flex items-center justify-center mt-1">
                  <Check size={18} className="text-green-950" />
                </div>

                <p className="text-white text-base sm:text-lg leading-relaxed">
                  Chat bot
                </p>

              </div>

            </div>

            {/* Botón */}
            <button
              onClick={() => navigate("/WelcomeScreen")}
              className="w-full mt-10 py-4 rounded-2xl text-lg sm:text-xl font-bold transition-all duration-300 bg-white hover:bg-green-50 text-green-900"
            >
              Elegir Plan
            </button>

          </div>

          {/* ===================== */}
          {/* CARD PREMIUM */}
          {/* ===================== */}
          <div className="relative w-full max-w-sm rounded-[35px] p-6 sm:p-8 transition-all duration-300 hover:scale-105 shadow-2xl bg-gradient-to-br from-green-700 to-emerald-900 border-4 border-lime-300">

            {/* Título */}
            <div className="text-center mb-8">

              <h3 className="text-3xl sm:text-4xl font-black text-white">
                Green Mensual
              </h3>

              <p className="text-green-100 text-lg sm:text-xl mt-3">
                $4.99/mes
              </p>

            </div>

            {/* Características */}
            <div className="space-y-5">

              <div className="flex items-start gap-4">

                <div className="min-w-[32px] min-h-[32px] bg-lime-300 rounded-full flex items-center justify-center mt-1">
                  <Check size={18} className="text-green-950" />
                </div>

                <p className="text-white text-base sm:text-lg leading-relaxed">
                  Calculadora de huella de carbono avanzada
                </p>

              </div>

              <div className="flex items-start gap-4">

                <div className="min-w-[32px] min-h-[32px] bg-lime-300 rounded-full flex items-center justify-center mt-1">
                  <Check size={18} className="text-green-950" />
                </div>

                <p className="text-white text-base sm:text-lg leading-relaxed">
                  Reportes mensuales
                </p>

              </div>

              <div className="flex items-start gap-4">

                <div className="min-w-[32px] min-h-[32px] bg-lime-300 rounded-full flex items-center justify-center mt-1">
                  <Check size={18} className="text-green-950" />
                </div>

                <p className="text-white text-base sm:text-lg leading-relaxed">
                  Consejos y Retos personalizados
                </p>

              </div>

              <div className="flex items-start gap-4">

                <div className="min-w-[32px] min-h-[32px] bg-lime-300 rounded-full flex items-center justify-center mt-1">
                  <Check size={18} className="text-green-950" />
                </div>

                <p className="text-white text-base sm:text-lg leading-relaxed">
                  Reportes estadisticos de empleados
                </p>

              </div>

              <div className="flex items-start gap-4">

                <div className="min-w-[32px] min-h-[32px] bg-lime-300 rounded-full flex items-center justify-center mt-1">
                  <Check size={18} className="text-green-950" />
                </div>

                <p className="text-white text-base sm:text-lg leading-relaxed">
                  Registro de empleados max 20
                </p>

              </div>

            </div>

            {/* Botón */}
            <button
              onClick={() => navigate("/SelectProfile")}
              className="w-full mt-10 py-4 rounded-2xl text-lg sm:text-xl font-bold transition-all duration-300 bg-lime-300 hover:bg-lime-200 text-green-950"
            >
              Elegir Plan
            </button>

          </div>

          {/* ===================== */}
          {/* CARD ANUAL */}
          {/* ===================== */}
          <div className="relative w-full max-w-sm rounded-[35px] p-6 sm:p-8 transition-all duration-300 hover:scale-105 shadow-2xl bg-gradient-to-br from-green-600 to-emerald-800">

            {/* Título */}
            <div className="text-center mb-8">

              <h3 className="text-3xl sm:text-4xl font-black text-white">
                Eco Anual
              </h3>

              <p className="text-green-100 text-lg sm:text-xl mt-3">
                $49/año
              </p>

            </div>

            {/* Características */}
            <div className="space-y-5">

              <div className="flex items-start gap-4">

                <div className="min-w-[32px] min-h-[32px] bg-lime-300 rounded-full flex items-center justify-center mt-1">
                  <Check size={18} className="text-green-950" />
                </div>

                <p className="text-white text-base sm:text-lg leading-relaxed">
                  Todo lo del plan Green Mensual
                </p>

              </div>

              <div className="flex items-start gap-4">

                <div className="min-w-[32px] min-h-[32px] bg-lime-300 rounded-full flex items-center justify-center mt-1">
                  <Check size={18} className="text-green-950" />
                </div>

                <p className="text-white text-base sm:text-lg leading-relaxed">
                  Estadísticas comparativas anuales
                </p>

              </div>

              <div className="flex items-start gap-4">

                <div className="min-w-[32px] min-h-[32px] bg-lime-300 rounded-full flex items-center justify-center mt-1">
                  <Check size={18} className="text-green-950" />
                </div>

                <p className="text-white text-base sm:text-lg leading-relaxed">
                  Consejos, Retos y Recomendaciones personalizadas
                </p>

              </div>

              <div className="flex items-start gap-4">

                <div className="min-w-[32px] min-h-[32px] bg-lime-300 rounded-full flex items-center justify-center mt-1">
                  <Check size={18} className="text-green-950" />
                </div>

                <p className="text-white text-base sm:text-lg leading-relaxed">
                  Reporte estadisticos de empleados
                </p>

              </div>

              <div className="flex items-start gap-4">

                <div className="min-w-[32px] min-h-[32px] bg-lime-300 rounded-full flex items-center justify-center mt-1">
                  <Check size={18} className="text-green-950" />
                </div>

                <p className="text-white text-base sm:text-lg leading-relaxed">
                  Registro de emplados max 100
                </p>

              </div>

            </div>

            {/* Botón */}
            <button
              onClick={() => navigate("/SelectProfile")}
              className="w-full mt-10 py-4 rounded-2xl text-lg sm:text-xl font-bold transition-all duration-300 bg-white hover:bg-green-50 text-green-900"
            >
              Elegir Plan
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}