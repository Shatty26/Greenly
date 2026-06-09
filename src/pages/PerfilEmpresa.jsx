import { useEffect, useState } from "react";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

function PerfilEmpresa() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [correoEmpresa, setCorreoEmpresa] = useState("");
  const [planEmpresa, setPlanEmpresa] = useState(""); 
  const [fotoPerfil, setFotoPerfil] = useState("");
  const [loading, setLoading] = useState(false);
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  
  const seleccionarFotoAleatoria = () => {
    const cantidadImagenes = 10;
    const numeroAleatorio = Math.floor(Math.random() * cantidadImagenes) + 1;
    return `/src/imgEco/ecoimg${numeroAleatorio}.jfif`;
  };

  // Datos de empresa
  useEffect(() => {
    const obtenerDatosEmpresa = async () => {
      try {
        const docRef = doc(db, "empresas", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setNombreEmpresa(data.nombreEmpresa || data.nombre || "");
          setCorreoEmpresa(data.correo || data.email || user.email || "Correo no disponible");
          
          // Recuperar el plan guardado desde Firestore (si no tiene, por defecto "Sin plan activo")
          setPlanEmpresa(data.plan || "Sin plan activo");
        } else {
          setError("No se encontraron los datos de la organización.");
        }
      } catch (error) {
        console.error("Error al obtener datos corporativos:", error);
        setError("Error al cargar la información del perfil.");
      }
    };

    if (user) {
      obtenerDatosEmpresa();
      setFotoPerfil(seleccionarFotoAleatoria());
    }
  }, [user]);

  // Cambios de empresa
  const guardarCambios = async () => {
    setMensaje("");
    setError("");

    if (nombreEmpresa.trim() === "") {
      setError("El nombre de la empresa no puede estar vacío");
      return;
    }

    try {
      setLoading(true);
      const documentoRef = doc(db, "empresas", user.uid);

      await updateDoc(documentoRef, {
        nombreEmpresa: nombreEmpresa,
      });

      setMensaje("Perfil corporativo actualizado correctamente 💚");
      setEditando(false);
    } catch (error) {
      console.error("Error al actualizar la empresa:", error);
      setError("Ocurrió un error al actualizar los datos institucionales");
    } finally {
      setLoading(false);
    }
  };

  // CERRAR SESIÓN
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gray-100 flex justify-center">
      {/* FONDO */}
      <div className="absolute inset-0 z-0">
        <img src="/fondo.png" alt="background" className="w-full h-full object-cover" />
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="relative z-10 w-full max-w-4xl lg:max-w-[1500px] min-h-screen flex flex-col items-center px-4 md:px-10 pt-10 pb-28">
        
        {/* CARD */}
        <div className="w-full bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col items-center pb-10 mt-12">
          
          {/* HEADER */}
          <div className="w-full h-48 md:h-52 bg-gradient-to-b from-lime-500 to-green-800 rounded-b-[150px] flex justify-center pt-10">
            <h2 className="text-white text-2xl md:text-3xl font-bold text-center leading-tight">
              Perfil <br /> Corporativo
            </h2>
          </div>

          {/* LOGO / FOTO DE PERFIL */}
          <div className="relative -mt-12 w-36 h-36 md:w-40 md:h-40 rounded-full bg-white p-2 shadow-xl">
            <div className="w-full h-full rounded-full bg-gradient-to-b from-green-300 to-green-600 flex items-center justify-center overflow-hidden">
              {fotoPerfil ? (
                <img src={fotoPerfil} alt="perfil corporativo" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200 animate-pulse"></div>
              )}
            </div>
          </div>

          {/* MUESTRA DE DATOS (NOMBRE, CORREO Y PLAN) / INPUT DE EDICIÓN */}
          <div className="w-full max-w-2xl px-6 mt-8 space-y-6 text-center">
            
            <div className="flex flex-col items-center justify-center min-h-[120px]">
              {!editando ? (
                /* MODO VISTA */
                <div className="space-y-3 flex flex-col items-center">
                  <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">
                    {nombreEmpresa || "Nombre no definido en BD"}
                  </h1>
                  <p className="text-sm md:text-base font-semibold text-gray-500 tracking-wide">
                    {correoEmpresa}
                  </p>
                  
                  {/* APARTADO VISUAL DEL PLAN */}
                  <div className="pt-1">
                    <span className="px-4 py-1.5 rounded-full bg-lime-100 text-green-800 text-xs md:text-sm font-extrabold tracking-wider uppercase shadow-sm border border-lime-200">
                      Plan actual: {planEmpresa}
                    </span>
                  </div>
                </div>
              ) : (
                /* MODO EDICIÓN */
                <div className="w-full flex flex-col gap-2 text-left">
                  <label className="text-green-900 font-bold text-sm ml-1">Modificar nombre de la empresa</label>
                  <input
                    type="text"
                    value={nombreEmpresa}
                    onChange={(e) => setNombreEmpresa(e.target.value)}
                    className="w-full py-4 px-6 rounded-2xl bg-gray-100 outline-none text-gray-700 font-medium focus:ring-2 focus:ring-green-400"
                    placeholder="Escribe el nuevo nombre"
                  />
                </div>
              )}
            </div>

            {/* NOTIFICACIONES */}
            {mensaje && (
              <div className="bg-green-100 text-green-700 text-sm rounded-xl py-3 px-4 font-medium text-left">
                {mensaje}
              </div>
            )}

            {error && (
              <div className="bg-red-100 text-red-700 text-sm rounded-xl py-3 px-4 font-medium text-left">
                {error}
              </div>
            )}

            {/* ACCIONES DEL PERFIL */}
            <div className="mt-8 pt-2 space-y-4">
              {!editando ? (
                <>
                  <button
                    onClick={() => setEditando(true)}
                    className="w-full py-4 px-7 rounded-2xl bg-gradient-to-r from-green-800 to-green-500 text-white font-bold text-lg shadow-lg hover:opacity-90 transition"
                  >
                    Editar Perfil
                  </button>
                  
                  {/* BOTÓN ADICIONAL PARA ACCEDER A LA PANTALLA DE PRECIOS */}
                  <button
                    onClick={() => navigate("/PricingScreen")}
                    className="w-full py-4 px-7 rounded-2xl bg-gradient-to-r from-lime-600 to-lime-500 text-white font-bold text-lg shadow-lg hover:opacity-90 transition"
                  >
                    Ver Planes / Adquirir Suscripción
                  </button>
                </>
              ) : (
                <button
                  onClick={guardarCambios}
                  disabled={loading}
                  className="w-full py-4 px-7 rounded-2xl bg-gradient-to-r from-green-800 to-green-500 text-white font-bold text-lg shadow-lg hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? "Actualizando organización..." : "Guardar Cambios"}
                </button>
              )}

              {/* BOTÓN CERRAR SESIÓN */}
              <button
                onClick={handleLogout}
                className="w-full py-4 px-7 rounded-2xl bg-red-100 text-red-600 font-bold text-lg shadow-sm hover:bg-red-200 transition"
              >
                Cerrar Sesión
              </button>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

export default PerfilEmpresa;