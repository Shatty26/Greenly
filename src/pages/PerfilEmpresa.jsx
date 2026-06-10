import { useEffect, useState } from "react";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { useNavigate, Link } from "react-router-dom";

function PerfilEmpresa() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [nombreEmpresa, setNombreEmpresa] = useState("Cargando...");
  const [correoEmpresa, setCorreoEmpresa] = useState("");
  const [planEmpresa, setPlanEmpresa] = useState("Sin plan activo");
  const [codigoEmpresa, setCodigoEmpresa] = useState(null); // null = sin plan
  const [fotoPerfil, setFotoPerfil] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // ==============================
  // FOTO ALEATORIA
  // ==============================
  const seleccionarFotoAleatoria = () => {
    const n = Math.floor(Math.random() * 8) + 1;
    return `/src/imgEco/ecoimg${n}.jfif`;
  };

  // ==============================
  // CARGAR DATOS
  // ==============================
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const docRef = doc(db, "empresas", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setNombreEmpresa(data.nombreEmpresa || data.nombre || "");
          setCorreoEmpresa(data.correo || data.email || user.email || "");
          setPlanEmpresa(data.plan || "Sin plan activo");
          // El código solo existe si ya tiene un plan de pago
          setCodigoEmpresa(data.codigoEmpresa || null);
        }
      } catch (err) {
        console.error("Error al obtener datos:", err);
      }
    };
    if (user) {
      obtenerDatos();
      setFotoPerfil(seleccionarFotoAleatoria());
    }
  }, [user]);

  // ==============================
  // CERRAR SESIÓN
  // ==============================
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  const tienePlan = planEmpresa !== "Sin plan activo";

  // ==============================
  // RENDER
  // ==============================
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gray-100 flex justify-center">

      {/* FONDO */}
      <div className="absolute inset-0 z-0">
        <img src="/fondo.png" alt="background" className="w-full h-full object-cover" />
      </div>

      {/* CONTENEDOR */}
      <div className="relative z-10 w-full max-w-4xl lg:max-w-[1500px] min-h-screen flex flex-col items-center px-4 md:px-10 pt-10 pb-28">

        {/* CARD PRINCIPAL */}
        <div className="w-full bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col items-center pb-10">

          {/* HEADER VERDE */}
          <div className="w-full h-48 md:h-52 bg-gradient-to-b from-lime-500 to-green-800 rounded-b-[150px] flex justify-center pt-10">
            <h2 className="text-white text-2xl md:text-3xl font-bold text-center leading-tight">
              Perfil<br />Corporativo
            </h2>
          </div>

          {/* FOTO DE PERFIL */}
          <div className="relative -mt-12 w-36 h-36 md:w-40 md:h-40 rounded-full bg-white p-2 shadow-xl">
            <div className="w-full h-full rounded-full bg-gradient-to-b from-green-300 to-green-600 flex items-center justify-center overflow-hidden">
              {fotoPerfil
                ? <img src={fotoPerfil} alt="perfil" className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-gray-200 animate-pulse" />
              }
            </div>
          </div>

          {/* NOMBRE, CORREO Y PLAN */}
          <div className="text-center mt-5 w-full px-4">
            <h3 className="text-xl md:text-2xl font-bold text-green-900">
              {nombreEmpresa}
            </h3>

            <p className="text-gray-400 text-sm mt-1">{correoEmpresa}</p>

            {/* Badge de plan */}
            <span className={`inline-block mt-2 px-4 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
              tienePlan
                ? "bg-lime-100 text-green-800 border border-lime-200"
                : "bg-gray-100 text-gray-500 border border-gray-200"
            }`}>
              {planEmpresa}
            </span>

            {/* ── CÓDIGO DE EMPRESA ── */}
            <div className="mt-4 mx-auto max-w-xs">
              {tienePlan && codigoEmpresa ? (
                /* Tiene plan y código generado */
                <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-3">
                  <p className="text-[11px] text-green-600 font-semibold uppercase tracking-wider mb-1">
                    Código de empresa
                  </p>
                  <p className="text-2xl font-black text-green-800 tracking-widest">
                    {codigoEmpresa}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Comparte este código con tus empleados para que se unan a la app.
                  </p>
                </div>
              ) : (
                /* Sin plan — bloqueo visual */
                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl px-5 py-3 opacity-60">
                  <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1">
                    Código de empresa
                  </p>
                  <p className="text-sm text-gray-400">
                    🔒 Disponible al activar un plan de pago
                  </p>
                </div>
              )}
            </div>

            <hr className="w-1/2 mx-auto border-gray-100 mt-5" />
          </div>

          {/* BOTONES */}
          <div className="w-full max-w-2xl mt-6 px-6 space-y-4">

            {/* Editar perfil */}
            <Link to="/EditarPerfilEmpresa" className="w-full block">
              <MenuButton label="Editar perfil" />
            </Link>

            {/* Planes de pago */}
            <Link to="/PricingScreen" className="w-full block">
              <MenuButton label="Planes de pago" />
            </Link>

            {/* Soporte técnico */}
            <Link to="/soporte" className="w-full block">
              <MenuButton label="Soporte técnico" />
            </Link>

            {/* Cerrar sesión */}
            <button
              onClick={handleLogout}
              className="w-full bg-red-50/60 py-4 px-7 rounded-2xl text-center text-sm md:text-base font-semibold text-red-800 border border-red-100 hover:bg-red-100 transition-all"
            >
              Cerrar sesión
            </button>

          </div>
        </div>
      </div>
    </main>
  );
}

/* ──────────────────────────────────────
   COMPONENTE BOTÓN MENÚ
────────────────────────────────────── */
function MenuButton({ label }) {
  return (
    <button className="w-full bg-green-50/60 py-4 px-7 rounded-2xl flex justify-between items-center border border-green-100 hover:bg-green-100 transition-all">
      <span className="text-sm md:text-base font-semibold text-green-800">{label}</span>
      <span className="text-2xl text-green-300 font-bold">›</span>
    </button>
  );
}

export default PerfilEmpresa;
