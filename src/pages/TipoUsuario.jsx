import React from "react";
import { useNavigate } from "react-router-dom";

export default function TipoUsuario() {
  const navigate = useNavigate();

  const elegirUsuario = () => {
    localStorage.setItem("tipoCuenta", "user");
    navigate("/WelcomeScreen");
  };

  const elegirEmpresa = () => {
    localStorage.setItem("tipoCuenta", "business");
    navigate("/PricingScreen");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-green-700 mb-4">
          Choose Account Type
        </h1>

        <p className="text-gray-600 text-lg mb-14">
          Select how you want to continue
        </p>

        <div className="flex flex-col md:flex-row gap-12 items-center justify-center">
          {/* Usuario normal */}
          <button
            onClick={elegirUsuario}
            className="
              w-64 h-64
              rounded-full
              bg-white
              shadow-2xl
              border-4 border-green-200
              hover:scale-105
              hover:bg-green-50
              transition-all duration-300
              flex flex-col items-center justify-center
            "
          >
            <div className="text-6xl mb-4">👤</div>

            <h2 className="text-2xl font-bold text-green-700">
              User
            </h2>

            <p className="text-gray-500 mt-2 px-6 text-sm">
              Continue as a normal user
            </p>
          </button>

          {/* Empresa */}
          <button
            onClick={elegirEmpresa}
            className="
              w-64 h-64
              rounded-full
              bg-green-600
              shadow-2xl
              border-4 border-green-300
              hover:scale-105
              hover:bg-green-700
              transition-all duration-300
              flex flex-col items-center justify-center
            "
          >
            <div className="text-6xl mb-4">🏢</div>

            <h2 className="text-2xl font-bold text-white">
              Business
            </h2>

            <p className="text-green-100 mt-2 px-6 text-sm">
              Continue as a company
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}