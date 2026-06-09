import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

function CompanyRegister() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [companyCode, setCompanyCode] = useState(""); 
  const [employeeCount, setEmployeeCount] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 
  const [loading, setLoading] = useState(false); // Estado para evitar múltiples clics

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage(""); 

    if (
      email.trim() === "" ||
      password.trim() === "" ||
      companyType === "" ||
      companyCode.trim() === "" ||
      employeeCount.trim() === ""
    ) {
      setErrorMessage("Por favor, rellena todos los campos.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    try {
      setLoading(true);

      // 1. Crear el usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Guardar datos en Firestore en la colección 'empresas' usando el UID
      // Cambié 'tipoEmpresa' por 'rubro' para que sea compatible con tu pantalla de perfil y calculadora
      await setDoc(doc(db, "empresas", user.uid), {
        email: email,
        rubro: companyType, 
        codigoEmpresa: companyCode.trim(), 
        cantidadEmpleados: Number(employeeCount), 
        role: "business_admin",           
        fecha: new Date().toLocaleString(),
        uid: user.uid,
      });

      // 3. Limpiar inputs del estado
      setEmail("");
      setPassword("");
      setCompanyType("");
      setCompanyCode("");
      setEmployeeCount("");
      
      // 4. Redirigir correctamente AQUÍ una vez que todo se guardó con éxito
      navigate("/homempresa");

    } catch (error) {
      console.error("Error exacto en el registro de empresa:", error.code, error.message);
      
      if (error.code === "auth/network-request-failed" || error.message.includes("offline")) {
        setErrorMessage("Error de red. Revisa tu conexión a internet e inténtalo de nuevo.");
      } else if (error.code === "auth/email-already-in-use") {
        setErrorMessage("Este correo ya está registrado por otra empresa.");
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("El formato del correo no es válido.");
      } else {
        setErrorMessage("Hubo un problema al guardar los datos. Inténtalo más tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-[Poppins] relative overflow-hidden">

      {/* Fondo Idéntico */}
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

      {/* HAND IMAGE */}
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

        {/* Tarjeta de Registro */}
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
          <h2 className="text-center text-[34px] lg:text-[42px] font-extrabold text-green-500 leading-tight">
            Registro Empresa
          </h2>

          <p className="text-center text-sm lg:text-base text-gray-600 mt-1 mb-8">
            ¿Ya tienes cuenta corporativa?{" "}
            <span
              className="font-bold text-green-900 cursor-pointer hover:underline"
              onClick={() => navigate("/login")} 
            >
              Inicia Sesión
            </span>
          </p>

          <form onSubmit={handleRegister} autoComplete="off" className="flex flex-col gap-5">

            {/* Mensaje de Error Dinámico */}
            {errorMessage && (
              <div className="p-4 text-sm text-red-700 bg-red-100 rounded-2xl font-medium border border-red-200">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Correo de la Empresa */}
            <input
              type="email"
              placeholder="Correo de la empresa"
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

            {/* Contraseña */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
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

            {/* Tipo de Empresa (Menú Desplegable / Select) */}
            <select
              value={companyType}
              onChange={(e) => setCompanyType(e.target.value)}
              className="
                text-sm lg:text-base
                w-full py-4 lg:py-5 px-6
                rounded-2xl bg-gray-200 
                outline-none text-gray-700 font-medium 
                focus:ring-2 focus:ring-green-400
                appearance-none cursor-pointer
              "
            >
              <option value="" disabled className="text-gray-500">
                Selecciona el Tipo de Empresa
              </option>
              <option value="Tecnológico">Tecnológico</option>
              <option value="Agrícola">Agrícola</option>
              <option value="Industrial">Industrial</option>
            </select>

            {/* Cantidad de Empleados */}
            <input
              type="number"
              min="1"
              placeholder="Cantidad de empleados"
              value={employeeCount}
              onChange={(e) => setEmployeeCount(e.target.value)}
              className="
                text-sm lg:text-base
                w-full py-4 lg:py-5 px-6
                rounded-2xl bg-gray-200 
                outline-none text-gray-700 
                placeholder-gray-500 font-medium 
                focus:ring-2 focus:ring-green-400
              "
            />

            {/* Código Creado por la Empresa */}
            <input
              type="text"
              placeholder="Crea el código para tu empresa (Ej: patito123)"
              value={companyCode}
              onChange={(e) => setCompanyCode(e.target.value)}
              className="
                text-sm lg:text-base
                w-full py-4 lg:py-5 px-6
                rounded-2xl bg-gray-200 
                outline-none text-gray-700 
                placeholder-gray-500 font-medium 
                focus:ring-2 focus:ring-green-400
              "
            />

            {/* Fuerza de la Contraseña */}
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

            {/* Botón (Sin onClick conflictivo) */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-4 lg:py-5
                rounded-2xl 
                bg-gradient-to-r from-green-800 to-green-500
                text-white font-bold text-lg lg:text-xl
                shadow-lg hover:opacity-90 transition
                disabled:opacity-50
                mt-2
              "
            >
              {loading ? "Registrando organización..." : "Regístrate"}
            </button>

            <div className="text-center mt-2 py-3 px-4 rounded-2xl bg-green-100 text-green-700 font-semibold text-sm">
              "small steps, big impact"
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CompanyRegister;