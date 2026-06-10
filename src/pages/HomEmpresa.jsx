import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/config";
import {
  collection, query, where, getDocs,
  doc, getDoc, updateDoc, orderBy, limit
} from "firebase/firestore";

// Wrapper que muestra la tarjeta con un overlay de "requiere plan" si está bloqueada
function LockedCard({ locked, children }) {
  if (!locked) return children;
  return (
    <div className="relative">
      {/* Tarjeta con opacidad reducida para dar sensación de preview */}
      <div className="opacity-50 pointer-events-none select-none">
        {children}
      </div>
      {/* Badge / banner inferior */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/95 to-white/60 rounded-b-3xl px-4 py-3 flex items-center gap-2">
        <span className="text-base">🔒</span>
        <div>
          <p className="text-xs font-bold text-gray-700 leading-tight">Requiere plan activo</p>
          <Link
            to="/PricingScreen"
            className="text-[11px] text-emerald-600 font-semibold hover:underline"
          >
            Ver planes →
          </Link>
        </div>
      </div>
    </div>
  );
}

function HomEmpresa() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("Empresa");
  const [saludo, setSaludo] = useState("");
  const [emoji, setEmoji] = useState("🌞");

  const [totalMensual, setTotalMensual] = useState(0);
  const [totalAnual, setTotalAnual] = useState(0);
  const [loading, setLoading] = useState(true);
  

  const [listaEmpleados, setListaEmpleados] = useState([]);
  const [limiteEmpleados, setLimiteEmpleados] = useState(0);
  const [planEmpresa, setPlanEmpresa] = useState("");

  const [totalEcoScore, setTotalEcoScore] = useState(0);
  const [nominaAbierta, setNominaAbierta] = useState(false);

  // ==============================
  // SALUDO DINÁMICO
  // ==============================
  useEffect(() => {
    const hora = new Date().getHours();
    if (hora < 12) { setSaludo("Buenos días"); setEmoji("🌞"); }
    else if (hora < 18) { setSaludo("Buenas tardes"); setEmoji("🌤️"); }
    else { setSaludo("Buenas noches"); setEmoji("🌙"); }
  }, []);

  
  // CARGA DE DATOS
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) { navigate("/"); return; }
      try {
        setLoading(true);

        // A. Datos empresa
        const empresaSnap = await getDoc(doc(db, "empresas", user.uid));
        let codigoEmpresa = "";

        if (empresaSnap.exists()) {
          const d = empresaSnap.data();
          setUsername(d.nombreEmpresa || d.email?.split("@")[0] || "Empresa");
          setLimiteEmpleados(Number(d.cantidadEmpleados) || 0);
          setPlanEmpresa(d.plan || "");
          codigoEmpresa = d.codigoEmpresa || "";
        }

        // B. Empleados
        if (codigoEmpresa) {
          const empSnap = await getDocs(query(
            collection(db, "empleados"),
            where("empresaId", "==", codigoEmpresa)
          ));
          let eco = 0;
          const lista = [];
          empSnap.forEach((d) => {
            const data = d.data();
            const pts = Number(data.puntosAcumulados ?? data.ecoScore ?? 0);
            eco += pts;
            lista.push({
              nombre: data.nombre || data.nombreCompleto || "Empleado sin nombre",
              departamento: data.departamento || "General",
              ecoScore: pts,
            });
          });
          setListaEmpleados(lista);
          setTotalEcoScore(eco);
        }

        // C. Huella empresa
        const docSnap = await getDoc(doc(db, "calculadora", user.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTotalMensual(data.totalMensual);
          setTotalAnual(data.totalAnual);
        }

      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const tienePlan = planEmpresa && planEmpresa !== "Sin plan activo";
  const cuposPct = limiteEmpleados > 0
    ? Math.min((listaEmpleados.length / limiteEmpleados) * 100, 100)
    : 0;

  // ==============================
  // RENDER
  // ==============================
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 font-[Poppins]">
      <div className="pt-6 md:pt-14 px-6 md:px-10 pb-28 max-w-[1300px] mx-auto">

        {/* SALUDO */}
        <div className="mb-7">
          <h1 className="text-[28px] md:text-[30px] font-bold text-gray-900">
            {saludo} {emoji}
          </h1>
          <div className="h-[5px] w-[110px] bg-gradient-to-r from-emerald-500 to-green-400 rounded-full mt-3" />
        </div>

        {/* TARJETA HUELLA */}
        <div className="relative mx-auto mb-8 w-full max-w-[360px] md:max-w-[1200px] h-[175px] md:h-[300px] overflow-hidden rounded-[28px] shadow-xl">
          <img src="/img/cuadroVerde.png" alt="huella" className="w-full h-full object-cover" />
          <img src="/img/manocontierra.png" alt="deco" className="absolute top-3 right-0 md:right-[20px] w-[140px] md:w-[260px] z-20 pointer-events-none" />
          <div className="absolute top-7 left-6 text-white">
            <p className="text-white/90 text-base md:text-lg font-semibold">Huella total de la empresa</p>
            <p className="text-[50px] md:text-[90px] font-extrabold leading-none mt-2">
              {loading ? "..." : totalMensual.toFixed(1)}
            </p>
            <p className="text-sm md:text-xl font-medium mt-1">kg CO₂ / mes</p>
            <p className="text-xs md:text-lg mt-2 text-white/90">
              {loading ? "" : `${totalAnual.toFixed(2)} toneladas / año`}
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECCIÓN: RESUMEN DE EMPLEADOS
        ══════════════════════════════════════ */}
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4">
          Resumen de empleados
        </h2>

        {/* Siempre se muestran las 3 tarjetas; si no hay plan se bloquean */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          {/* Tarjeta — Empleados registrados */}
          <LockedCard locked={!tienePlan}>
            <div className="bg-white rounded-3xl shadow-md p-6 flex flex-col gap-2">
              <p className="text-gray-400 text-sm font-medium">Empleados registrados</p>
              <p className="text-4xl font-extrabold text-green-700">
                {loading ? "..." : `${listaEmpleados.length}`}
                <span className="text-xl text-gray-300 font-semibold"> / {limiteEmpleados || "—"}</span>
              </p>
              <p className="text-xs text-gray-400">{tienePlan ? planEmpresa : "Sin plan activo"}</p>
              {/* Barra */}
              <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${cuposPct}%` }}
                />
              </div>
              <p className="text-[11px] text-gray-300 mt-1">
                {tienePlan
                  ? `${limiteEmpleados - listaEmpleados.length} cupos disponibles`
                  : "Activa un plan para ver tus cupos"}
              </p>
            </div>
          </LockedCard>

          {/* Tarjeta — EcoScore grupal */}
          <LockedCard locked={!tienePlan}>
            <div className="bg-white rounded-3xl shadow-md p-6 flex flex-col gap-2">
              <p className="text-gray-400 text-sm font-medium">EcoScore Grupal</p>
              <p className="text-4xl font-extrabold text-emerald-600">
                {loading ? "..." : tienePlan ? `${totalEcoScore}` : "—"}
                <span className="text-xl text-gray-300 font-semibold"> pts</span>
              </p>
              <p className="text-xs text-gray-400">Puntos acumulados por todos los empleados</p>
              {tienePlan && listaEmpleados.length > 0 && (
                <p className="text-[11px] text-emerald-500 font-semibold mt-1">
                  ≈ {Math.round(totalEcoScore / listaEmpleados.length)} pts por empleado
                </p>
              )}
            </div>
          </LockedCard>

          {/* Tarjeta — Nómina */}
          <LockedCard locked={!tienePlan}>
            <div className="bg-white rounded-3xl shadow-md p-6 flex flex-col">
              <button
                onClick={() => tienePlan && setNominaAbierta(!nominaAbierta)}
                className="flex items-center justify-between w-full"
              >
                <div className="text-left">
                  <p className="text-gray-400 text-sm font-medium">Nómina activa</p>
                  <p className="text-2xl font-extrabold text-gray-800 mt-1">
                    {loading ? "..." : tienePlan ? listaEmpleados.length : "—"}
                    <span className="text-base text-gray-400 font-medium"> empleados</span>
                  </p>
                </div>
                <span className={`text-2xl text-emerald-400 font-bold transition-transform duration-300 ${nominaAbierta ? "rotate-90" : ""}`}>
                  ›
                </span>
              </button>

              {/* Lista desplegable */}
              <div className={`overflow-hidden transition-all duration-300 ${nominaAbierta ? "max-h-64 mt-4" : "max-h-0"}`}>
                {listaEmpleados.length === 0 ? (
                  <p className="text-gray-300 text-sm text-center py-4">
                    Aún no hay empleados registrados.
                  </p>
                ) : (
                  <div className="overflow-y-auto max-h-56 space-y-2 pr-1">
                    {listaEmpleados.map((emp, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-emerald-700 font-bold text-xs">
                            {emp.nombre.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-700 truncate">{emp.nombre}</p>
                          <p className="text-[11px] text-gray-400">{emp.departamento}</p>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 flex-shrink-0">
                          {emp.ecoScore} pts
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </LockedCard>

        </div>

        {/* ══════════════════════════════════════
            SECCIÓN: HERRAMIENTAS ECOLÓGICAS
        ══════════════════════════════════════ */}
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-6">
          Herramientas ecológicas
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-7 text-center">

          {/* Clasificador IA */}
          <Link to="/ClasificadorIA" className="relative w-[140px] md:w-[212px] mx-auto hover:scale-105 transition group">
            <img src="/img/waste.png" alt="Clasificador" className="w-full drop-shadow-xl group-hover:brightness-110 transition-all duration-300" />
            <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm md:text-base font-bold text-green-950 group-hover:text-green-700 transition-colors duration-300 w-full px-2 text-center">
              Clasificador de residuos
            </p>
          </Link>

          {/* Dónde reciclar */}
          <Link to="/DondeReciclar" className="relative w-[140px] md:w-[212px] mx-auto hover:scale-105 transition group">
            <img src="/img/tree.png" alt="Donde reciclar" className="w-full drop-shadow-xl group-hover:brightness-110 transition-all duration-300" />
            <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm md:text-base font-bold text-green-950 group-hover:text-green-700 transition-colors duration-300">
              Donde reciclar
            </p>
          </Link>

          {/* Módulo educativo */}
          <Link to="/ModuloInfo" className="relative w-[140px] md:w-[210px] mx-auto hover:scale-105 transition group">
            <img src="/img/plant.png" alt="Modulo educativo" className="w-full drop-shadow-xl group-hover:brightness-110 transition-all duration-300" />
            <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm md:text-base font-bold text-green-950 group-hover:text-green-700 transition-colors duration-300">
              Módulo educativo
            </p>
          </Link>

        </div>

      </div>
    </div>
  );
}

export default HomEmpresa;