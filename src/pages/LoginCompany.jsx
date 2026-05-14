import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

export default function LoginBusiness() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // OPCIONAL (si querés verificar empresa)
  const [codigoEmpresa, setCodigoEmpresa] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Buscar si existe en colección empresas
      const docRef = doc(db, "empresas", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        alert("Esta cuenta no es empresarial. Usa el login normal.");
        return;
      }

      const data = docSnap.data();

      // Si querés validar el código de empresa
      if (codigoEmpresa.trim() !== "" && data.codigoEmpresa !== codigoEmpresa) {
        alert("El código de empresa no coincide.");
        return;
      }

      alert("Inicio de sesión empresarial exitoso");
      navigate("/homeBusiness");

    } catch (error) {
      console.log(error);
      alert("Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">

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
        className="absolute top-6 left-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/80 shadow-md hover:bg-green-50 transition z-30"
      >
        <ArrowLeft className="w-6 h-6 text-green-900" />
      </button>

      {/* Icono empresa */}
      <div className="absolute top-[90px] right-[-25px] w-[200px] z-0 lg:top-[60px] lg:right-[640px] lg:w-[300px] text-[140px] lg:text-[180px]">
        🏢
      </div>

      {/* MAIN */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center justify-center px-6 lg:px-20 gap-10">

        {/* LEFT TEXT */}
        <div className="w-full lg:w-1/2 text-left pl-3 lg:pl-0">
          <h1 className="text-[52px] lg:text-[85px] font-black text-green-950 leading-none">
            Bienvenido
          </h1>

          <h2 className="text-[28px] lg:text-[45px] font-bold text-green-800 mt-2">
            a tu panel
          </h2>

          <h1 className="text-[72px] lg:text-[100px] font-black text-green-500 leading-none">
            Empresa
          </h1>
        </div>

        {/* Card */}
        <div className="w-full max-w-[460px] lg:max-w-[520px] bg-white rounded-[35px] shadow-2xl px-8 py-10 lg:px-12 lg:py-14">
          
          <h2 className="text-center text-[36px] lg:text-[45px] font-extrabold text-green-500">
            Login Empresa
          </h2>

          <p className="text-center text-sm lg:text-base text-gray-600 mt-1 mb-8">
            ¿No tienes una cuenta empresarial?{" "}
            <span
              className="font-bold text-green-900 cursor-pointer hover:underline"
              onClick={() => navigate("/registerbusiness")}
            >
              Regístrate
            </span>
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">

            {/* Correo */}
            <input
              type="email"
              placeholder="Correo empresarial"
              className="w-full py-4 lg:py-5 px-6 rounded-2xl bg-gray-200 outline-none text-gray-700 placeholder-gray-500 font-medium focus:ring-2 focus:ring-green-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Código empresa (opcional) */}
            <input
              type="text"
              placeholder="Código de empresa (opcional)"
              className="w-full py-4 lg:py-5 px-6 rounded-2xl bg-gray-200 outline-none text-gray-700 placeholder-gray-500 font-medium focus:ring-2 focus:ring-green-400"
              value={codigoEmpresa}
              onChange={(e) => setCodigoEmpresa(e.target.value)}
            />

            {/* Contraseña */}
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full py-4 lg:py-5 px-6 rounded-2xl bg-gray-200 outline-none text-gray-700 placeholder-gray-500 font-medium focus:ring-2 focus:ring-green-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Botón */}
            <button
              type="submit"
              className="w-full py-4 lg:py-5 rounded-2xl bg-gradient-to-r from-green-800 to-green-500 text-white font-bold text-lg lg:text-xl shadow-lg hover:opacity-90 transition"
            >
              Iniciar Sesión
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}