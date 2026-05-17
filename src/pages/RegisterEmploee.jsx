import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

export default function RegisterEmployee() {
  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [tipoEmpresa, setTipoEmpresa] = useState("");
  const [telefono, setTelefono] = useState("");
  const [codigoEmpresa, setCodigoEmpresa] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleRegisterBusiness = async (e) => {
    e.preventDefault();

    if (
      !nombreEmpresa.trim() ||
      !tipoEmpresa.trim() ||
      !telefono.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      alert("Por favor complete todos los campos");
      return;
    }

    if (password.length < 8) {
      alert("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "empresas", user.uid), {
        nombreEmpresa,
        tipoEmpresa,
        telefono,
        codigoEmpresa: codigoEmpresa || null,
        email,
        uid: user.uid,
        fecha: new Date().toLocaleString(),
      });

      alert("¡Registro empresarial exitoso!");
      navigate("/homeBusiness");

    } catch (error) {
      console.log(error);
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-white font-[Poppins] relative overflow-hidden">

      {/* Fondo */}
      <div
        className="absolute top-0 left-0 w-full h-1/2 lg:h-full bg-cover bg-center"
        style={{ backgroundImage: "url('/img/fondoArboles.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-green-300/70 via-white/40 to-white"></div>
      </div>

      {/* Flecha */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/80 shadow-md hover:bg-white transition z-30"
      >
        <ArrowLeft className="w-6 h-6 text-green-900" />
      </button>

      {/* Mano */}
      <img
        src="/img/manocontierra.png"
        alt="mano"
        className="absolute top-[100px] right-[-25px] w-[200px] z-0 lg:top-[60px] lg:right-[640px] lg:w-[300px]"
      />

      {/* MAIN */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center justify-start lg:justify-center px-6 lg:px-20 gap-10 pt-20 lg:pt-0">

        {/* Texto izquierda */}
        <div className="w-full lg:w-1/2 text-left pl-3 lg:pl-0">
          <h1 className="text-[52px] lg:text-[85px] font-black text-green-950 leading-none">
            Bienvenido
          </h1>

          <h2 className="text-[28px] lg:text-[45px] font-bold text-green-800 mt-2">
            a registrar tu
          </h2>

          <h1 className="text-[72px] lg:text-[100px] font-black text-green-500 leading-none">
            Empresa
          </h1>
        </div>

        {/* Tarjeta */}
        <div className="w-full max-w-[460px] lg:max-w-[520px] bg-white rounded-[35px] shadow-2xl px-8 py-10 lg:px-12 lg:py-14">

          <h2 className="text-center text-[32px] lg:text-[40px] font-extrabold text-green-500">
            Registro Empresa
          </h2>

          <p className="text-center text-sm lg:text-base text-gray-600 mt-1 mb-8">
            ¿Ya tienes cuenta?{" "}
            <span
              className="font-bold text-green-900 cursor-pointer hover:underline"
              onClick={() => navigate("/loginbusiness")}
            >
              Inicia Sesión
            </span>
          </p>

          <form onSubmit={handleRegisterBusiness} className="flex flex-col gap-5">

            <input
              type="text"
              placeholder="Nombre de la empresa"
              value={nombreEmpresa}
              onChange={(e) => setNombreEmpresa(e.target.value)}
              className="w-full py-4 lg:py-5 px-6 rounded-2xl bg-gray-200 outline-none text-gray-700 placeholder-gray-500 font-medium focus:ring-2 focus:ring-green-400"
            />

            <input
              type="text"
              placeholder="Tipo de empresa (Ej: Restaurante, Tecnología...)"
              value={tipoEmpresa}
              onChange={(e) => setTipoEmpresa(e.target.value)}
              className="w-full py-4 lg:py-5 px-6 rounded-2xl bg-gray-200 outline-none text-gray-700 placeholder-gray-500 font-medium focus:ring-2 focus:ring-green-400"
            />

            <input
              type="text"
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full py-4 lg:py-5 px-6 rounded-2xl bg-gray-200 outline-none text-gray-700 placeholder-gray-500 font-medium focus:ring-2 focus:ring-green-400"
            />

            <input
              type="text"
              placeholder="Código de empresa (opcional)"
              value={codigoEmpresa}
              onChange={(e) => setCodigoEmpresa(e.target.value)}
              className="w-full py-4 lg:py-5 px-6 rounded-2xl bg-gray-200 outline-none text-gray-700 placeholder-gray-500 font-medium focus:ring-2 focus:ring-green-400"
            />

            <input
              type="email"
              placeholder="Correo empresarial"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-4 lg:py-5 px-6 rounded-2xl bg-gray-200 outline-none text-gray-700 placeholder-gray-500 font-medium focus:ring-2 focus:ring-green-400"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña (8+ caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-4 lg:py-5 px-6 rounded-2xl bg-gray-200 outline-none text-gray-700 placeholder-gray-500 font-medium focus:ring-2 focus:ring-green-400"
              />

              <button
                type="button"
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                👁
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-4 lg:py-5 rounded-2xl bg-gradient-to-r from-green-800 to-green-500 text-white font-bold text-lg lg:text-xl shadow-lg hover:opacity-90 transition"
            >
              Registrar Empresa
            </button>

            <div className="text-center mt-3 py-3 px-4 rounded-2xl bg-green-100 text-green-700 font-semibold">
              "Empresas sostenibles, futuro sostenible"
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}