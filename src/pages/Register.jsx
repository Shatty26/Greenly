import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleRegister = (e) => {
  e.preventDefault();

  if (
    nombre.trim() === "" ||
    email.trim() === "" ||
    password.trim() === ""
  ) {
    return;
  }

  if (password.length < 8) {
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Guardar nombre en localStorage
      localStorage.setItem("username", nombre);

      return addDoc(collection(db, "usuarios"), {
        nombre: nombre,
        email: email,
        uid: user.uid,
        fecha: new Date().toLocaleString(),
      });
    })
    .then(() => {
      // limpiar inputs
      setNombre("");
      setEmail("");
      setPassword("");

      navigate("/home");
    })
    .catch((error) => {
      console.log(error.message);
    });
};

  return (
    <div className="min-h-screen bg-white font-[Poppins] relative overflow-hidden">

      {/* Fondo */}
      <div
        className="absolute top-0 left-0 w-full h-1/2 lg:h-full bg-cover bg-center"
        style={{ backgroundImage: "url('public/img/fondoArboles.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-green-300/70 via-white/40 to-white"></div>
      </div>

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="
          absolute top-6 left-6 
          w-12 h-12 
          flex items-center justify-center 
          rounded-full bg-white/80 shadow-md 
          hover:bg-white transition
          z-30
        "
      >
        <span className="text-xl font-black text-green-900">←</span>
      </button>

      {/* HAND IMAGE (movible libre) */}
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
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center justify-start lg:justify-center px-6 lg:px-20 gap-10 pt-20 lg:pt-0">

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
            mt-15 lg:mt-0
            relative z-20
            w-full max-w-[460px]
            lg:max-w-[520px]
            bg-white rounded-[35px]
            shadow-2xl
            px-8 py-10
            lg:px-12 lg:py-14
          "
        >
          <h2 className="text-center text-[36px] lg:text-[45px] font-extrabold text-green-500">
            Regístrate
          </h2>

          <p className="text-center text-sm lg:text-base text-gray-600 mt-1 mb-8">
            ¿Tienes una cuenta?{" "}
            <span
              className="font-bold text-green-900 cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Inicia Sesión
            </span>
          </p>

          <form onSubmit={handleRegister} autoComplete="off" className="flex flex-col gap-6">

            {/* Name */}
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="
              text-sm lg:text-base
                w-full py-4 lg:py-5 px-6
                rounded-2xl bg-gray-200 
                outline-none text-gray-700 
                placeholder-gray-500 font-medium 
                focus:ring-2 focus:ring-green-400
              "
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="new-email"
              className="
                text-sm lg:text-base
                w-full py-4 lg:py-5 px-6
                rounded-2xl bg-gray-200 
                outline-none text-gray-700 
                placeholder-gray-500 font-medium 
                focus:ring-2 focus:ring-green-400
              "
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña (8+ caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="
                text-sm lg:text-base
                  w-full py-4 lg:py-5 px-6
                  rounded-2xl bg-gray-200 
                  outline-none text-gray-700 
                  placeholder-gray-500 font-medium 
                  focus:ring-2 focus:ring-green-400
                "
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

            {/* Password Strength */}
            {password.length > 7 && (
              <p className="text-sm text-gray-600 -mt-2">
                {password.length < 8 ? (
                  <span className="text-red-500 font-semibold">
                    Débil: requiere 8 caracteres o más
                  </span>
                ) : (
                  <span className="text-green-600 font-semibold">
                    ¡Contraseña segura!
                  </span>
                )}
              </p>
            )}

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
              Regístrate
            </button>

            {/* Eco message */}
            <div className="text-center mt-4 py-3 px-4 rounded-2xl bg-green-100 text-green-700 font-semibold">
              "small steps, big impact"
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;