import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      alert("Por favor complete todos los campos");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert("¡Bienvenido de nuevo! Sesión iniciada");
        navigate("/home");
      })
      .catch((error) => {
        alert("Error: " + error.message + " - Intenta de nuevo!");
      });
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

      {/* Mano */}
      <img
        src="/img/manocontierra.png"
        alt="mano"
        className="
          absolute 
          top-[100px] right-[-25px]
          w-[200px]
          z-0
          lg:top-[60px] lg:right-[640px] lg:w-[300px]
        "
      />

      {/* MAIN LAYOUT */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center justify-center px-6 lg:px-20 gap-10">

        {/* LEFT TEXT */}
        <div className="w-full lg:w-1/2 text-left pl-3 lg:pl-0 lg:text-left">
          <h1 className="text-[52px] lg:text-[85px] font-black text-green-950 leading-none">
            Bienvenido
          </h1>

          <h2 className="text-[28px] lg:text-[45px] font-bold text-green-800 mt-2">
            a salvar el
          </h2>

          <h1 className="text-[72px] lg:text-[100px] font-black text-green-500 leading-none">
            Mundo
          </h1>
        </div>

        {/* Tarjeta */}
        <div
          className="
            mt-17 lg:mt-0
            w-full max-w-[460px]
            lg:max-w-[520px]
            bg-white rounded-[35px]
            shadow-2xl
            px-8 py-10
            lg:px-12 lg:py-14
          "
        >
          <h2 className="text-center text-[36px] lg:text-[45px] font-extrabold text-green-500">
            Inicia Sesión
          </h2>

          <p className="text-center text-sm lg:text-base text-gray-600 mt-1 mb-8">
            ¿No tienes una cuenta?{" "}
            <span
              className="font-bold text-green-900 cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              Registrate
            </span>
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              className="
                w-full py-4 lg:py-5 px-6
                rounded-2xl bg-gray-200 
                outline-none text-gray-700 
                placeholder-gray-500 font-medium 
                focus:ring-2 focus:ring-green-400
              "
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="
                  w-full py-4 lg:py-5 px-6
                  rounded-2xl bg-gray-200 
                  outline-none text-gray-700 
                  placeholder-gray-500 font-medium 
                  focus:ring-2 focus:ring-green-400
                "
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="
                  absolute right-5 top-1/2 
                  -translate-y-1/2 
                  text-gray-500 hover:text-gray-700
                "
                onClick={() => setShowPassword(!showPassword)}
              >
                👁
              </button>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="
                w-full py-4 lg:py-5
                rounded-2xl 
                bg-gradient-to-r from-green-800 to-green-500
                text-white font-bold text-lg lg:text-xl
                shadow-lg hover:opacity-90 transition
              "
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;