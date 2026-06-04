import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore"; 
import { auth, db } from "../firebase/config";    
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); 
    setIsLoading(true);  

    if (email.trim() === "" || password.trim() === "") {
      setErrorMessage("Por favor, rellena todos los campos.");
      setIsLoading(false);
      return;
    }

    try {
      // 1. Autenticar primero en Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("1. Auth exitoso. Buscando UID:", user.uid);

      // 2. Intentar buscar primero en la colección 'empresas' por ID directo
      let empresaDoc = null;
      try {
        empresaDoc = await getDoc(doc(db, "empresas", user.uid));
      } catch (err) {
        console.log("Error al buscar en empresas:", err);
      }

      if (empresaDoc && empresaDoc.exists()) {
        console.log("¡Encontrado en la colección empresas!");
        const datosEmpresa = empresaDoc.data();
        localStorage.setItem("username", datosEmpresa.nombreEmpresa || "Empresa");
        localStorage.setItem("role", "business_admin");
        navigate("/homempresa");
        return; 
      }

      // 3. NUEVO PASO: Buscar en la colección 'empleados' por ID directo
      console.log("2. No es empresa. Buscando en 'empleados' por ID directo...");
      let empleadoDoc = null;
      try {
        empleadoDoc = await getDoc(doc(db, "empleados", user.uid));
      } catch (err) {
        console.log("Error al buscar empleado por ID:", err);
      }

      if (empleadoDoc && empleadoDoc.exists()) {
        console.log("¡Encontrado en la colección empleados!");
        const datosEmpleado = empleadoDoc.data();
        
        // Verificar si el empleado está activo antes de dejarlo entrar
        if (datosEmpleado.estado === false) {
          setErrorMessage("Esta cuenta de empleado ha sido desactivada.");
          return;
        }

        localStorage.setItem("username", datosEmpleado.nombre || "Empleado");
        localStorage.setItem("role", datosEmpleado.rol || "empleado");
        localStorage.setItem("empresaId", datosEmpleado.empresaId || ""); 
        navigate("/home");
        return;
      }

      // 4. Si no es empresa ni empleado, buscar en 'usuarios' por ID directo
      console.log("3. Buscando en 'usuarios' por ID directo...");
      let usuarioDoc = null;
      try {
        usuarioDoc = await getDoc(doc(db, "usuarios", user.uid));
      } catch (err) {
        console.log("Error al buscar usuario por ID:", err);
      }

      if (usuarioDoc && usuarioDoc.exists()) {
        console.log("¡Encontrado en usuarios por ID directo!");
        const datosUsuario = usuarioDoc.data();
        localStorage.setItem("username", datosUsuario.nombre || datosUsuario.username || "Usuario");
        localStorage.setItem("role", "user");
        navigate("/home");
        return;
      }

      // 5. SOLUCIÓN DE EMERGENCIA: Buscar en 'usuarios' filtrando por el campo 'email'
      console.log("4. ID no coincide. Buscando en 'usuarios' por campo 'email'...");
      const usuariosRef = collection(db, "usuarios");
      const q = query(usuariosRef, where("email", "==", email.trim()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        console.log("¡Encontrado usuario por filtro de correo electrónico!");
        const usuarioData = querySnapshot.docs[0].data();
        localStorage.setItem("username", usuarioData.nombre || usuarioData.username || "Usuario");
        localStorage.setItem("role", "user");
        navigate("/home");
      } else {
        // SOLUCIÓN DE EMERGENCIA 2: Buscar también en 'empleados' por campo 'email' por si acaso
        const empleadosRef = collection(db, "empleados");
        const qEmp = query(empleadosRef, where("email", "==", email.trim()));
        const empSnapshot = await getDocs(qEmp);

        if (!empSnapshot.empty) {
          console.log("¡Encontrado empleado por filtro de correo electrónico!");
          const empData = empSnapshot.docs[0].data();
          if (empData.estado === false) {
            setErrorMessage("Esta cuenta de empleado ha sido desactivada.");
            return;
          }
          localStorage.setItem("username", empData.nombre || "Empleado");
          localStorage.setItem("role", empData.rol || "empleado");
          navigate("/home");
        } else {
          setErrorMessage(`No se encontró ningún perfil asociado a este correo en la base de datos.`);
        }
      }

    } catch (error) {
      console.log("Error exacto en la autenticación:", error.code, error.message);
      
      if (error.code === "auth/network-request-failed" || error.message.includes("offline")) {
        setErrorMessage("Error de red. Revisa tu conexión a internet.");
      } else if (
        error.code === "auth/invalid-credential" || 
        error.code === "auth/user-not-found" || 
        error.code === "auth/wrong-password"
      ) {
        setErrorMessage("El correo o la contraseña son incorrectos. Verifica tus datos.");
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("El formato del correo electrónico no es válido.");
      } else if (error.code === "auth/too-many-requests") {
        setErrorMessage("Has intentado demasiadas veces. Cuenta bloqueada temporalmente.");
      } else {
        setErrorMessage("Hubo un problema al ingresar. Inténtalo más tarde.");
      }
    } finally {
      setIsLoading(false); 
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
            relative z-20
          "
        >
          <h2 className="text-center text-[36px] lg:text-[45px] font-extrabold text-green-500">
            Inicia Sesión
          </h2>

          <p className="text-center text-sm lg:text-base text-gray-600 mt-1 mb-8">
            ¿No tienes una cuenta?{" "}
            <span
              className="font-bold text-green-900 cursor-pointer hover:underline"
              onClick={() => navigate("/tipousuario")}
            >
              Regístrate
            </span>
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            {errorMessage && (
              <div className="p-4 text-sm text-red-700 bg-red-100 rounded-2xl font-medium border border-red-200">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
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
                value={password}
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
              disabled={isLoading}
              className={`
                w-full py-4 lg:py-5
                rounded-2xl 
                bg-gradient-to-r from-green-800 to-green-500
                text-white font-bold text-lg lg:text-xl
                shadow-lg hover:opacity-90 transition
                ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              {isLoading ? "Ingresando..." : "Iniciar Sesión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;