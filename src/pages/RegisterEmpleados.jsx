import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

function RegisterEmpleados() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [empresaId, setEmpresaId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // Estado para capturar y mostrar los mensajes de error en la UI
  const [errorMessage, setErrorMessage] = useState(""); 

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Limpiar errores previos de la pantalla

    // 1. Validación de campos vacíos
    if (
      nombre.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      departamento.trim() === "" ||
      empresaId.trim() === ""
    ) {
      setErrorMessage("Por favor, rellena todos los campos.");
      return;
    }

    // 2. Validación de largo de contraseña
    if (password.length < 8) {
      setErrorMessage("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    try {
      // 3. Crear el usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar nombre en localStorage para usarlo en el Home
      localStorage.setItem("username", nombre);

      // 4. Guardar datos en Firestore en la colección 'empleados' con la estructura definida
      await addDoc(collection(db, "empleados"), {
        uid: user.uid,
        nombre: nombre.trim(),
        email: email.trim(),
        departamento: departamento.trim(),
        empresaId: empresaId.trim(),
        rol: "empleado",                  // Rol fijo predeterminado
        estado: true,                     // Boolean (Activo)
        puntosAcumulados: 0,              // int64 inicializado en 0
        registroActividades: [],          // Array vacío listo para mapas
        fechaIngreso: new Date().toISOString(),
      });

      // Si todo sale bien, limpiar inputs y redirigir al Home inmediatamente
      setNombre("");
      setEmail("");
      setPassword("");
      setDepartamento("");
      setEmpresaId("");
      navigate("/home");

    } catch (error) {
      console.error("Error exacto en el registro de empleados:", error.code, error.message);
      
      // 5. Manejo de alertas condicionales para fallas de Red o Firebase
      if (error.code === "auth/network-request-failed" || error.message.includes("offline")) {
        setErrorMessage("Error de red. Revisa tu conexión a internet e inténtalo de nuevo.");
      } else if (error.code === "auth/email-already-in-use") {
        setErrorMessage("Este correo ya está registrado por otro empleado.");
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("El formato del correo no es válido.");
      } else if (error.message.includes("permissions") || error.code === "permission-denied") {
        setErrorMessage("Error de permisos en Firestore. Asegúrate de activar el acceso de lectura/escritura en tu consola de Firebase.");
      } else {
        setErrorMessage("Hubo un problema al guardar los datos. Inténtalo más tarde.");
      }
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

      {/* BACK BUTTON */}
      <button
        type="button"
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
            Registro Colaborador
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

          <form onSubmit={handleRegister} autoComplete="off" className="flex flex-col gap-5">

            {/* Mensaje de Error Dinámico en la interfaz */}
            {errorMessage && (
              <div className="p-4 text-sm text-red-700 bg-red-100 rounded-2xl font-medium border border-red-200">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Name */}
            <input
              type="text"
              placeholder="Nombre Completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="
                text-sm lg:text-base
                w-full py-4 px-6
                rounded-2xl bg-gray-200 
                outline-none text-gray-700 
                placeholder-gray-500 font-medium 
                focus:ring-2 focus:ring-green-400
              "
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Correo Corporativo / Personal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="new-email"
              className="
                text-sm lg:text-base
                w-full py-4 px-6
                rounded-2xl bg-gray-200 
                outline-none text-gray-700 
                placeholder-gray-500 font-medium 
                focus:ring-2 focus:ring-green-400
              "
            />

            {/* Departamento */}
            <input
              type="text"
              placeholder="Departamento (Ej: IT, Ventas, Logística)"
              value={departamento}
              onChange={(e) => setDepartamento(e.target.value)}
              className="
                text-sm lg:text-base
                w-full py-4 px-6
                rounded-2xl bg-gray-200 
                outline-none text-gray-700 
                placeholder-gray-500 font-medium 
                focus:ring-2 focus:ring-green-400
              "
            />

            {/* ID Empresa */}
            <input
              type="text"
              placeholder="ID / Código de la Empresa"
              value={empresaId}
              onChange={(e) => setEmpresaId(e.target.value)}
              className="
                text-sm lg:text-base
                w-full py-4 px-6
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
                  w-full py-4 px-6
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
            {password.length > 0 && (
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
                shadow-lg hover:opacity-90 transition mt-2
              "
            >
              Registrar Empleado
            </button>

            {/* Eco message */}
            <div className="text-center mt-2 py-3 px-4 rounded-2xl bg-green-100 text-green-700 font-semibold">
              "small steps, big impact"
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterEmpleados;