import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { collection, addDoc, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function CalculadoraEmpresa() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  // =========================================
  // ESTADOS DEL COMPONENTE
  // =========================================
  const [paso, setPaso] = useState(1);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);

  // Datos de origen de la empresa
  const [nombreEmpresa, setNombreEmpresa] = useState("la Empresa");
  const [rubroEmpresa, setRubroEmpresa] = useState("Tecnológico");

  // Inputs del usuario
  const [kwh, setKwh] = useState("");
  const [combustible, setCombustible] = useState("");
  const [aguaLitros, setAguaLitros] = useState(""); // 👈 Cambiado a litros
  const [papel, setPapel] = useState("");
  const [materiaPrima, setMateriaPrima] = useState(""); 
  const [servidores, setServidores] = useState("");     

  // Resultados calculados expuestos en la interfaz
  const [resultadoMensual, setResultadoMensual] = useState(0);
  const [resultadoAnual, setResultadoAnual] = useState(0);
  const [listaRecomendaciones, setListaRecomendaciones] = useState([]);

  // =========================================
  // DETECTAR EL RUBRO AUTOMÁTICAMENTE
  // =========================================
  useEffect(() => {
    const cargarRubroEmpresa = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, "empresas", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setNombreEmpresa(data.nombreEmpresa || data.nombre || "tu Empresa");
          setRubroEmpresa(data.rubro || "Tecnológico");
        }
      } catch (err) {
        console.error("Error al obtener rubro corporativo:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarRubroEmpresa();
  }, [user]);

  // =========================================
  // LOGICA MATEMÁTICA Y GENERADOR DE CONSEJOS
  // =========================================
  const procesarMetricasYAvance = () => {
    // Factores de emisión estándar (en kg de CO2)
    const factorLuz = 0.35;
    const factorCombustible = 2.31;
    const factorAguaM3 = 0.25; // Factor por cada metro cúbico
    const factorPapel = 1.2;
    const factorEspecial = rubroEmpresa === "Tecnológico" ? 0.45 : 1.8;

    const numKwh = Number(kwh) || 0;
    const numCombustible = Number(combustible) || 0;
    
    // Convertimos los litros ingresados a metros cúbicos para la fórmula (Litros / 1000)
    const numAguaM3 = (Number(aguaLitros) || 0) / 1000; 
    
    const numPapel = Number(papel) || 0;
    const numEspecial = Number(materiaPrima) || Number(servidores) || 0;

    // 1. Cálculo Mensual (Kilogramos de CO2)
    const totalMensualKg = 
      (numKwh * factorLuz) + 
      (numCombustible * factorCombustible) + 
      (numAguaM3 * factorAguaM3) + 
      (numPapel * factorPapel) +
      (numEspecial * factorEspecial);

    // 2. Cálculo Anual Proyectado (Toneladas de CO2)
    const totalAnualToneladas = (totalMensualKg * 12) / 1000;

    setResultadoMensual(totalMensualKg);
    setResultadoAnual(totalAnualToneladas);

    // 3. Crear consejos personalizados de sustentabilidad
    const consejos = [];
    if (numKwh > 1000) {
      consejos.push("💡 Cambia el 100% de tus bombillas corporativas a tecnología LED de alta eficiencia y configura apagados automáticos de noche.");
    }
    if (numCombustible > 200) {
      consejos.push("🚗 Incentiva el 'Carpos' (viajes compartidos) entre tus colaboradores o implementa un día fijo de Home Office a la semana.");
    }
    if (Number(aguaLitros) > 15000) {
      consejos.push("💧 Alto consumo hídrico. Revisa si existen fugas invisibles en los baños e instala aireadores de agua en los grifos para reducir el caudal.");
    }
    if (numPapel > 10) {
      consejos.push("📄 Migra todos tus procesos de facturación, contratos y minutas de junta a herramientas 100% digitales.");
    }

    // Consejos basados estrictamente en el Rubro comercial
    if (rubroEmpresa === "Tecnológico") {
      consejos.push("⚡ Tip TI: Elige servidores cloud que posean certificados de carbono neutralidad o 'Green Web Hosting'.");
    } else if (rubroEmpresa === "Industrial") {
      consejos.push("🏭 Tip Fabril: Ejecuta auditorías de pérdidas de calor en calderas e implementa la separación estricta de residuos.");
    } else if (rubroEmpresa === "Agrícola") {
      consejos.push("🌱 Tip del Campo: Adopta sistemas de riego tecnificado por goteo para mitigar el uso de bombas eléctricas.");
    }

    setListaRecomendaciones(consejos);
    setPaso(3); 
  };

  // =========================================
  // GUARDAR DEFINITIVAMENTE EN FIRESTORE
  // =========================================
  const handleGuardarEnDashboard = async () => {
    if (!user) return;
    setGuardando(true);
    setError("");

    try {
      await addDoc(collection(db, "calculadora"), {
        uid: user.uid,
        tipo: "empresa",
        fecha: serverTimestamp(),
        rubroAuditado: rubroEmpresa,
        datosOrigen: {
          kwhMensual: Number(kwh) || 0,
          combustibleLitros: Number(combustible) || 0,
          aguaLitros: Number(aguaLitros) || 0, // Guardamos los litros directamente
          papelResmas: Number(papel) || 0,
          adicionalSector: Number(materiaPrima) || Number(servidores) || 0
        },
        totalMensual: resultadoMensual,
        totalAnual: resultadoAnual
      });

      setExito(true);
      setTimeout(() => navigate("/HomEmpresa"), 3500);

    } catch (err) {
      console.error("Error al guardar la huella:", err);
      setError("No se pudo salvar el registro en el Dashboard corporativo.");
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-[Poppins]">
        <p className="text-emerald-700 font-bold animate-pulse">Cargando perfil ecológico empresarial...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-emerald-50 font-[Poppins] flex items-center justify-center p-4 md:p-10">
      <div className="w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden border border-emerald-100">
        
        {/* ENCABEZADO */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-600 p-8 text-white text-center">
          <span className="bg-white/20 text-xs px-3 py-1 rounded-full font-bold tracking-wider uppercase">
            Rubro: {rubroEmpresa}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold mt-2">Calculadora de Impacto</h1>
          <p className="text-emerald-100 text-sm font-medium mt-1">Evaluación ambiental de {nombreEmpresa}</p>

          <div className="flex justify-center gap-2 mt-5">
            <span className={`h-2 rounded-full transition-all ${paso === 1 ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}></span>
            <span className={`h-2 rounded-full transition-all ${paso === 2 ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}></span>
            <span className={`h-2 rounded-full transition-all ${paso === 3 ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}></span>
            <span className={`h-2 rounded-full transition-all ${paso === 4 ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}></span>
          </div>
        </div>

        {/* CUERPO DEL FORMULARIO POR PASOS */}
        <div className="p-6 md:p-10">
          {exito ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner">✓</div>
              <h2 className="text-2xl font-bold text-gray-800">¡Huella Actualizada!</h2>
              <p className="text-gray-500 max-w-sm mx-auto">Tus registros mensuales y anuales ya se visualizan en la pantalla principal de tu empresa.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 font-medium">{error}</div>}

              {/* PASO 1: ENERGÍA TRANSVERSAL */}
              {paso === 1 && (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-2">
                    <h2 className="text-lg font-bold text-emerald-900">Métricas Principales</h2>
                    <p className="text-gray-400 text-xs font-medium">Consumo global de energía y transporte de la firma</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-gray-700 font-semibold text-sm">¿Cuántos kWh de electricidad se consumieron en las sedes este mes?</label>
                    <input 
                      type="number" value={kwh} onChange={(e) => setKwh(e.target.value)}
                      placeholder="Ej: 1400" className="w-full py-4 px-5 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-gray-700 font-semibold text-sm">¿Cuántos litros de combustible gastó la flota vehicular?</label>
                    <input 
                      type="number" value={combustible} onChange={(e) => setCombustible(e.target.value)}
                      placeholder="Ej: 300" className="w-full py-4 px-5 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                      required
                    />
                  </div>

                  <button type="button" onClick={() => setPaso(2)} className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:bg-emerald-700 transition">
                    Siguiente Sección
                  </button>
                </div>
              )}

              {/* PASO 2: DINÁMICO POR RUBRO */}
              {paso === 2 && (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-2">
                    <h2 className="text-lg font-bold text-emerald-900">Métricas Específicas de Sector</h2>
                    <p className="text-gray-400 text-xs font-medium">Campos adaptados al rubro de tu organización</p>
                  </div>

                  {/* PREGUNTA CAMBIADA A LITROS (¡MÁS FÁCIL!) */}
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-700 font-semibold text-sm">¿Cuántos litros de agua potable se consumieron en las instalaciones?</label>
                    <input 
                      type="number" value={aguaLitros} onChange={(e) => setAguaLitros(e.target.value)}
                      placeholder="Ej: 25000" className="w-full py-4 px-5 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-gray-700 font-semibold text-sm">¿Cuántas resmas de papel de oficina gastaron en el mes?</label>
                    <input 
                      type="number" value={papel} onChange={(e) => setPapel(e.target.value)}
                      placeholder="Ej: 6" className="w-full py-4 px-5 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                    />
                  </div>

                  {/* PREGUNTAS FILTRADAS POR RUBRO */}
                  {rubroEmpresa === "Tecnológico" && (
                    <div className="flex flex-col gap-2 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
                      <label className="text-emerald-950 font-bold text-sm">💻 Auditoría Cloud: ¿Cuántas horas mensuales aproximadas operaron tus servidores o instancias?</label>
                      <input 
                        type="number" value={servidores} onChange={(e) => setServidores(e.target.value)}
                        placeholder="Ej: 720" className="w-full py-4 px-5 rounded-2xl bg-white border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                      />
                    </div>
                  )}

                  {rubroEmpresa === "Industrial" && (
                    <div className="flex flex-col gap-2 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
                      <label className="text-emerald-950 font-bold text-sm">🏭 Desperdicios: ¿Cuántas toneladas de mermas o materia prima descartada se generaron?</label>
                      <input 
                        type="number" value={materiaPrima} onChange={(e) => setMateriaPrima(e.target.value)}
                        placeholder="Ej: 3" className="w-full py-4 px-5 rounded-2xl bg-white border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                      />
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button type="button" onClick={() => setPaso(1)} className="w-1/2 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition">Atrás</button>
                    <button type="button" onClick={procesarMetricasYAvance} className="w-1/2 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:bg-emerald-700 transition">Procesar Huella</button>
                  </div>
                </div>
              )}

              {/* PASO 3: PANTALLA DE RESULTADOS MENSUALES Y ANUALES */}
              {paso === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-gray-100 pb-2">
                    <h2 className="text-lg font-bold text-emerald-900">Resultados de Impacto Ecológico</h2>
                    <p className="text-gray-400 text-xs font-medium">Estimación calculada a partir de los coeficientes del IPCC</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Mensual */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 p-6 rounded-2xl text-center">
                      <p className="text-sm font-bold text-emerald-800 uppercase tracking-wider">Balance Mensual</p>
                      <h3 className="text-3xl font-black text-gray-800 mt-2">{resultadoMensual.toFixed(1)}</h3>
                      <p className="text-xs text-gray-500 font-medium mt-1">Kilogramos de CO₂ / Mes</p>
                    </div>

                    {/* Anual */}
                    <div className="bg-gradient-to-br from-teal-800 to-emerald-900 text-white p-6 rounded-2xl text-center shadow-md">
                      <p className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Proyección Anual</p>
                      <h3 className="text-3xl font-black mt-2">{resultadoAnual.toFixed(2)}</h3>
                      <p className="text-xs text-emerald-100 opacity-90 font-medium mt-1">Toneladas de CO₂ / Año</p>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setPaso(2)} className="w-1/2 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition">Modificar Datos</button>
                    <button type="button" onClick={() => setPaso(4)} className="w-1/2 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:bg-emerald-700 transition">Ver Recomendaciones</button>
                  </div>
                </div>
              )}

              {/* PASO 4: CONSEJOS APLICABLES Y GUARDADO */}
              {paso === 4 && (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-2">
                    <h2 className="text-lg font-bold text-emerald-900">Consejos de Sostenibilidad</h2>
                    <p className="text-gray-400 text-xs font-medium">Acciones corporativas para mitigar tu huella</p>
                  </div>

                  <div className="bg-gray-900 text-emerald-400 rounded-2xl p-6 space-y-4 shadow-xl border-l-4 border-emerald-500">
                    <h4 className="font-extrabold text-sm text-white uppercase tracking-widest">📋 Plan de mitigación sugerido:</h4>
                    <ul className="space-y-3 text-sm text-gray-300 font-medium list-disc list-inside">
                      {listaRecomendaciones.map((consejo, idx) => (
                        <li key={idx} className="leading-relaxed"><span className="text-emerald-400">{consejo}</span></li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-4">
                    <button type="button" disabled={guardando} onClick={() => setPaso(3)} className="w-1/2 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition">Revisar Balance</button>
                    <button type="button" onClick={handleGuardarEnDashboard} disabled={guardando} className="w-1/2 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-2xl shadow-xl hover:opacity-95 transition">
                      {guardando ? "Guardando..." : "Integrar a Dashboard"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}

export default CalculadoraEmpresa;