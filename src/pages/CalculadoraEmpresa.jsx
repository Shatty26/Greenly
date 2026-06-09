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
  const [aguaLitros, setAguaLitros] = useState(""); 
  const [papel, setPapel] = useState("");
  
  // Inputs específicos por rubro
  const [materiaPrima, setMateriaPrima] = useState(""); 
  const [servidores, setServidores] = useState("");     
  const [hectareas, setHectareas] = useState("");       

  // Resultados calculados expuestos en la interfaz
  const [resultadoMensual, setResultadoMensual] = useState(0);
  const [resultadoAnual, setResultadoAnual] = useState(0);
  const [nivelImpacto, setNivelImpacto] = useState({ texto: "", color: "", bg: "" });
  const [listaRecomendaciones, setListaRecomendaciones] = useState([]);
  const [datosGrafico, setDatosGrafico] = useState([]);

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
  // COMPORTAMIENTO MÁS / MENOS (PASO A PASO)
  // =========================================
  const modificarValor = (setter, valorActual, cantidad, esIncremento) => {
    const actual = parseFloat(valorActual) || 0;
    if (esIncremento) {
      setter((actual + cantidad).toString());
    } else {
      if (actual >= cantidad) setter((actual - cantidad).toString());
    }
  };

  // =========================================
  // LOGICA MATEMÁTICA Y GENERADOR DE CONSEJOS
  // =========================================
  const procesarMetricasYAvance = () => {
    // Factores de emisión
    const factorLuz = 0.35;
    const factorCombustible = 2.31;
    const factorAguaM3 = 0.25; 
    const factorPapel = 1.2;

    const numKwh = Number(kwh) || 0;
    const numCombustible = Number(combustible) || 0;
    const numAguaM3 = (Number(aguaLitros) || 0) / 1000; 
    const numPapel = rubroEmpresa === "Tecnológico" ? (Number(papel) || 0) : 0;

    let numEspecial = 0;
    let factorEspecial = 0;
    let nombreEspecial = "Sector";

    if (rubroEmpresa === "Tecnológico") {
      numEspecial = Number(servidores) || 0;
      factorEspecial = 0.45;
      nombreEspecial = "Servidores";
    } else if (rubroEmpresa === "Industrial") {
      numEspecial = Number(materiaPrima) || 0;
      factorEspecial = 1.8;
      nombreEspecial = "Materia Prima";
    } else if (rubroEmpresa === "Agrícola") {
      numEspecial = Number(hectareas) || 0;
      factorEspecial = 1.2;
      nombreEspecial = "Hectáreas";
    }

    // Calcular CO2 individual para el gráfico
    const co2Luz = numKwh * factorLuz;
    const co2Combustible = numCombustible * factorCombustible;
    const co2Agua = numAguaM3 * factorAguaM3;
    const co2Papel = numPapel * factorPapel;
    const co2Especial = numEspecial * factorEspecial;

    const totalMensualKg = co2Luz + co2Combustible + co2Agua + co2Papel + co2Especial;
    const totalAnualToneladas = (totalMensualKg * 12) / 1000;

    setResultadoMensual(totalMensualKg);
    setResultadoAnual(totalAnualToneladas);

    // 1. Determinar Nivel de Impacto Corporativo
    let impacto = { texto: "Bajo", color: "text-green-600", bg: "bg-green-50 border-green-200" };
    if (totalMensualKg > 500 && totalMensualKg <= 2000) {
      impacto = { texto: "Moderado", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" };
    } else if (totalMensualKg > 2000) {
      impacto = { texto: "Alto", color: "text-red-600", bg: "bg-red-50 border-red-200" };
    }
    setNivelImpacto(impacto);

    // 2. Preparar datos para el gráfico nativo
    const itemsGrafico = [
      { nombre: "Electricidad", valor: co2Luz },
      { nombre: "Combustible", valor: co2Combustible },
      { nombre: "Agua", valor: co2Agua },
    ];
    if (rubroEmpresa === "Tecnológico") {
      itemsGrafico.push({ nombre: "Papel", valor: co2Papel });
    }
    itemsGrafico.push({ nombre: nombreEspecial, valor: co2Especial });

    // Encontrar el valor más alto para sacar porcentajes visuales de las barras
    const valorMaximo = Math.max(...itemsGrafico.map(i => i.valor), 1);
    const graficoProcesado = itemsGrafico.map(item => ({
      ...item,
      porcentajeBarra: Math.min((item.valor / valorMaximo) * 100, 100)
    }));
    
    // Ordenar de mayor a menor consumo para mostrar el problema primero
    graficoProcesado.sort((a, b) => b.valor - a.valor);
    setDatosGrafico(graficoProcesado);

    // 3. Generar Recomendaciones Inteligentes Basadas en lo que salió más alto
    const consejos = [];
    const mayorOfensor = graficoProcesado[0];

    if (mayorOfensor && mayorOfensor.valor > 0) {
      consejos.push(`⚠️ **Prioridad Crítica:** Tu mayor fuente de emisión es **${mayorOfensor.nombre}** (${mayorOfensor.valor.toFixed(1)} kg CO₂). Aquí debes concentrar tus esfuerzos de mejora urgentes.`);
    }

    // Consejos condicionales tradicionales
    if (numKwh > 800) {
      consejos.push("💡 Cambia luminarias a LED de alta eficiencia y configura sensores de movimiento en áreas de poco tráfico corporativo.");
    }
    if (numCombustible > 150) {
      consejos.push("🚗 Optimiza las rutas de distribución o establece incentivos económicos para los empleados que usen transporte público o bicicleta.");
    }
    if (Number(aguaLitros) > 12000) {
      consejos.push("💧 El consumo de agua es elevado. Coloca reguladores de caudal en grifos y revisa llaves de paso para prevenir fugas.");
    }

    // Consejos por rubro
    if (rubroEmpresa === "Tecnológico") {
      if (numPapel > 8) {
        consejos.push("📄 Reduce las resmas implementando firmas digitales legalizadas (como DocuSign) para eliminar contratos físicos.");
      }
      if (numEspecial > 5) {
        consejos.push("⚡ Evalúa proveedores Cloud como AWS, Google o Azure que garanticen infraestructuras operadas al 100% con energías renovables.");
      }
    } else if (rubroEmpresa === "Industrial") {
      consejos.push("🏭 Recupera el calor residual de tus procesos mecánicos y rediseña los empaques para reducir el tonelaje de residuos finales.");
    } else if (rubroEmpresa === "Agrícola") {
      consejos.push("🌱 Integra fertilizantes orgánicos de liberación lenta para mitigar la huella de compuestos nitrogenados en el suelo.");
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
          aguaLitros: Number(aguaLitros) || 0, 
          papelResmas: rubroEmpresa === "Tecnológico" ? (Number(papel) || 0) : 0,
          servidoresActivos: rubroEmpresa === "Tecnológico" ? (Number(servidores) || 0) : 0,
          materiaPrimaToneladas: rubroEmpresa === "Industrial" ? (Number(materiaPrima) || 0) : 0,
          hectareasCultivo: rubroEmpresa === "Agrícola" ? (Number(hectareas) || 0) : 0
        },
        totalMensual: parseFloat(resultadoMensual.toFixed(2)),
        totalAnual: parseFloat(resultadoAnual.toFixed(2)),
        rangoImpacto: nivelImpacto.texto
      });

      setExito(true);
      setTimeout(() => navigate("/HomEmpresa"), 3000);

    } catch (err) {
      console.error("Error al guardar la huella:", err);
      setError("No se pudo salvar el registro en el Dashboard corporativo.");
    } finally {
      setGuardando(false);
    }
  };

  const handleBack = () => {
    setPaso((p) => Math.max(p - 1, 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center font-[Poppins]">
        <p className="text-green-800 font-bold animate-pulse">Cargando perfil ecológico empresarial...</p>
      </div>
    );
  }

  return (
    <main className="fondoCal min-h-screen flex justify-center items-center p-3 sm:p-6">
      <div className="bg-white rounded-[30px] shadow-2xl p-5 sm:p-8 w-full max-w-2xl min-h-[650px] flex flex-col justify-between">
        
        <div>
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 items-center justify-between mb-6">
            {paso < 3 ? (
              <button
                onClick={handleBack}
                disabled={paso === 1}
                className={`w-full sm:w-auto px-5 py-3 rounded-2xl font-black text-xl transition flex items-center justify-center ${
                  paso === 1
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                    : "bg-green-100 text-green-800 hover:bg-green-200"
                }`}
              >
                ←
              </button>
            ) : (
              <div className="w-full sm:w-auto"></div>
            )}

            {paso < 3 && (
              <button
                onClick={() => navigate("/HomEmpresa")}
                className="w-full sm:w-auto bg-gray-100 px-5 py-3 rounded-2xl font-bold text-green-900 hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
            )}
          </div>

          {/* INDICADOR DE RUBRO */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-3 text-center mb-4">
            <span className="text-xs uppercase tracking-wider text-green-600 font-black">Organización Auditada</span>
            <h3 className="text-xl font-black text-green-900">{rubroEmpresa}</h3>
          </div>

          {/* BARRA DE PROGRESO */}
          <div className="mb-8">
            <div className="flex justify-between text-xs font-bold text-green-700 mb-2">
              <span>Evaluando: {nombreEmpresa}</span>
              <span>Paso {paso} de 3</span>
            </div>
            <div className="w-full h-3 bg-green-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-800 to-green-500 transition-all duration-500"
                style={{ width: `${(paso / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* CUERPO CENTRAL */}
          {exito ? (
            <div className="text-center py-8 space-y-4 flex flex-col items-center justify-center flex-1">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl shadow-inner">✓</div>
              <h2 className="text-2xl font-black text-green-900">¡Huella Actualizada!</h2>
              <p className="text-gray-500 max-w-sm mx-auto text-center text-sm">
                Tus registros mensuales, anuales y nivel de impacto se guardaron correctamente en tu base de datos.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 font-medium text-center text-sm">
                  {error}
                </div>
              )}

              {/* PASO 1: ENERGÍA GENERAL */}
              {paso === 1 && (
                <div className="flex flex-col items-center justify-center space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl sm:text-4xl font-black text-green-900 mb-2">Métricas Principales</h2>
                    <p className="text-gray-500 text-sm">Consumo global de energía y logística de transporte</p>
                  </div>

                  {/* ELECTRICIDAD */}
                  <div className="w-full flex flex-col gap-2">
                    <label className="text-green-900 font-bold text-sm">¿Cuántos kWh de electricidad se consumieron este mes?</label>
                    <div className="w-full flex flex-row items-center gap-2">
                      <button type="button" onClick={() => modificarValor(setKwh, kwh, 100, false)} className="w-12 h-12 bg-green-100 hover:bg-green-200 rounded-xl text-2xl font-bold text-green-800 transition shrink-0">-</button>
                      <input 
                        type="number" value={kwh} onChange={(e) => setKwh(e.target.value)}
                        onKeyDown={(e) => (e.key === "ArrowUp" || e.key === "ArrowDown") && e.preventDefault()}
                        onWheel={(e) => e.target.blur()}
                        placeholder="0" className="flex-1 min-w-0 p-4 bg-green-50 rounded-2xl border border-green-200 text-center text-xl font-bold text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                      <button type="button" onClick={() => modificarValor(setKwh, kwh, 100, true)} className="w-12 h-12 bg-green-100 hover:bg-green-200 rounded-xl text-2xl font-bold text-green-800 transition shrink-0">+</button>
                    </div>
                  </div>

                  {/* COMBUSTIBLE */}
                  <div className="w-full flex flex-col gap-2">
                    <label className="text-green-900 font-bold text-sm">¿Cuántos litros de combustible gastó la flota vehicular?</label>
                    <div className="w-full flex flex-row items-center gap-2">
                      <button type="button" onClick={() => modificarValor(setCombustible, combustible, 20, false)} className="w-12 h-12 bg-green-100 hover:bg-green-200 rounded-xl text-2xl font-bold text-green-800 transition shrink-0">-</button>
                      <input 
                        type="number" value={combustible} onChange={(e) => setCombustible(e.target.value)}
                        onKeyDown={(e) => (e.key === "ArrowUp" || e.key === "ArrowDown") && e.preventDefault()}
                        onWheel={(e) => e.target.blur()}
                        placeholder="0" className="flex-1 min-w-0 p-4 bg-green-50 rounded-2xl border border-green-200 text-center text-xl font-bold text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                      <button type="button" onClick={() => modificarValor(setCombustible, combustible, 20, true)} className="w-12 h-12 bg-green-100 hover:bg-green-200 rounded-xl text-2xl font-bold text-green-800 transition shrink-0">+</button>
                    </div>
                  </div>
                </div>
              )}

              {/* PASO 2: DINÁMICO SEGÚN EL RUBRO */}
              {paso === 2 && (
                <div className="flex flex-col items-center justify-center space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl sm:text-4xl font-black text-green-900 mb-2">Métricas de Sector</h2>
                    <p className="text-gray-500 text-sm">Campos específicos para optimizar tu rubro comercial</p>
                  </div>

                  {/* AGUA LITROS */}
                  <div className="w-full flex flex-col gap-2">
                    <label className="text-green-900 font-bold text-sm">¿Cuántos litros de agua se consumieron este mes?</label>
                    <div className="w-full flex flex-row items-center gap-2">
                      <button type="button" onClick={() => modificarValor(setAguaLitros, aguaLitros, 1000, false)} className="w-12 h-12 bg-green-100 hover:bg-green-200 rounded-xl text-2xl font-bold text-green-800 transition shrink-0">-</button>
                      <input 
                        type="number" value={aguaLitros} onChange={(e) => setAguaLitros(e.target.value)}
                        onKeyDown={(e) => (e.key === "ArrowUp" || e.key === "ArrowDown") && e.preventDefault()}
                        onWheel={(e) => e.target.blur()}
                        placeholder="0" className="flex-1 min-w-0 p-4 bg-green-50 rounded-2xl border border-green-200 text-center text-xl font-bold text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                      <button type="button" onClick={() => modificarValor(setAguaLitros, aguaLitros, 1000, true)} className="w-12 h-12 bg-green-100 hover:bg-green-200 rounded-xl text-2xl font-bold text-green-800 transition shrink-0">+</button>
                    </div>
                  </div>

                  {/* PAPEL RESMAS (SOLO EN RUBRO TECNOLÓGICO) */}
                  {rubroEmpresa === "Tecnológico" && (
                    <div className="w-full flex flex-col gap-2">
                      <label className="text-green-900 font-bold text-sm">¿Cuántas resmas de papel se utilizaron?</label>
                      <div className="w-full flex flex-row items-center gap-2">
                        <button type="button" onClick={() => modificarValor(setPapel, papel, 5, false)} className="w-12 h-12 bg-green-100 hover:bg-green-200 rounded-xl text-2xl font-bold text-green-800 transition shrink-0">-</button>
                        <input 
                          type="number" value={papel} onChange={(e) => setPapel(e.target.value)}
                          onKeyDown={(e) => (e.key === "ArrowUp" || e.key === "ArrowDown") && e.preventDefault()}
                          onWheel={(e) => e.target.blur()}
                          placeholder="0" className="flex-1 min-w-0 p-4 bg-green-50 rounded-2xl border border-green-200 text-center text-xl font-bold text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                        <button type="button" onClick={() => modificarValor(setPapel, papel, 5, true)} className="w-12 h-12 bg-green-100 hover:bg-green-200 rounded-xl text-2xl font-bold text-green-800 transition shrink-0">+</button>
                      </div>
                    </div>
                  )}

                  {/* CAMPO DINÁMICO: TECNOLÓGICO */}
                  {rubroEmpresa === "Tecnológico" && (
                    <div className="w-full flex flex-col gap-2">
                      <label className="text-green-900 font-bold text-sm">¿Cuántos servidores e infraestructura cloud mantienen activos?</label>
                      <div className="w-full flex flex-row items-center gap-2">
                        <button type="button" onClick={() => modificarValor(setServidores, servidores, 1, false)} className="w-12 h-12 bg-green-100 hover:bg-green-200 rounded-xl text-2xl font-bold text-green-800 transition shrink-0">-</button>
                        <input 
                          type="number" value={servidores} onChange={(e) => setServidores(e.target.value)}
                          onKeyDown={(e) => (e.key === "ArrowUp" || e.key === "ArrowDown") && e.preventDefault()}
                          onWheel={(e) => e.target.blur()}
                          placeholder="0" className="flex-1 min-w-0 p-4 bg-green-50 rounded-2xl border border-green-200 text-center text-xl font-bold text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button type="button" onClick={() => modificarValor(setServidores, servidores, 1, true)} className="w-12 h-12 bg-green-100 hover:bg-green-200 rounded-xl text-2xl font-bold text-green-800 transition shrink-0">+</button>
                      </div>
                    </div>
                  )}

                  {/* CAMPO DINÁMICO: INDUSTRIAL */}
                  {rubroEmpresa === "Industrial" && (
                    <div className="w-full flex flex-col gap-2">
                      <label className="text-green-900 font-bold text-sm">¿Cuántas toneladas de materia prima fueron procesadas?</label>
                      <div className="w-full flex flex-row items-center gap-2">
                        <button type="button" onClick={() => modificarValor(setMateriaPrima, materiaPrima, 1, false)} className="w-12 h-12 bg-green-100 hover:bg-green-200 rounded-xl text-2xl font-bold text-green-800 transition shrink-0">-</button>
                        <input 
                          type="number" value={materiaPrima} onChange={(e) => setMateriaPrima(e.target.value)}
                          onKeyDown={(e) => (e.key === "ArrowUp" || e.key === "ArrowDown") && e.preventDefault()}
                          onWheel={(e) => e.target.blur()}
                          placeholder="0" className="flex-1 min-w-0 p-4 bg-green-50 rounded-2xl border border-green-200 text-center text-xl font-bold text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button type="button" onClick={() => modificarValor(setMateriaPrima, materiaPrima, 1, true)} className="w-12 h-12 bg-green-100 hover:bg-green-200 rounded-xl text-2xl font-bold text-green-800 transition shrink-0">+</button>
                      </div>
                    </div>
                  )}

                  {/* CAMPO DINÁMICO: AGRÍCOLA */}
                  {rubroEmpresa === "Agrícola" && (
                    <div className="w-full flex flex-col gap-2">
                      <label className="text-green-900 font-bold text-sm">¿Cuántas hectáreas totales bajo producción están activas?</label>
                      <div className="w-full flex flex-row items-center gap-2">
                        <button type="button" onClick={() => modificarValor(setHectareas, hectareas, 5, false)} className="w-12 h-12 bg-green-100 hover:bg-green-200 rounded-xl text-2xl font-bold text-green-800 transition shrink-0">-</button>
                        <input 
                          type="number" value={hectareas} onChange={(e) => setHectareas(e.target.value)}
                          onKeyDown={(e) => (e.key === "ArrowUp" || e.key === "ArrowDown") && e.preventDefault()}
                          onWheel={(e) => e.target.blur()}
                          placeholder="0" className="flex-1 min-w-0 p-4 bg-green-50 rounded-2xl border border-green-200 text-center text-xl font-bold text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button type="button" onClick={() => modificarValor(setHectareas, hectareas, 5, true)} className="w-12 h-12 bg-green-100 hover:bg-green-200 rounded-xl text-2xl font-bold text-green-800 transition shrink-0">+</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* RENDER DE RESULTADOS FINALES */}
              {paso === 3 && (
                <div className="space-y-6 max-h-[58vh] overflow-y-auto pr-1">
                  
                  {/* RESULTADO PRINCIPAL: MENSUAL Y ANUAL JUNTOS */}
                  <div className="bg-gradient-to-br from-green-700 via-green-600 to-green-500 text-white p-5 rounded-3xl shadow-xl">
                    <div className="text-center border-b border-white/20 pb-3 mb-3">
                      <p className="text-xs uppercase tracking-widest opacity-80 font-bold">Huella Mensual</p>
                      <h1 className="text-4xl font-black mt-0.5 break-words">
                        {resultadoMensual.toFixed(2)}
                      </h1>
                      <p className="text-xs mt-0.5">kg CO₂ / mes</p>
                    </div>

                    <div className="text-center">
                      <p className="text-xs uppercase tracking-widest opacity-80 font-bold">Proyección Anual</p>
                      <h2 className="text-2xl font-black mt-0.5 break-words text-green-200">
                        {resultadoAnual.toFixed(2)}
                      </h2>
                      <p className="text-xs mt-0.5">Toneladas CO₂ / año</p>
                    </div>
                  </div>

                  {/* NUEVA TARJETA: NIVEL DE IMPACTO */}
                  <div className={`border p-4 rounded-2xl text-center transition-all ${nivelImpacto.bg}`}>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Nivel de Impacto Ambiental</span>
                    <h3 className={`text-2xl font-black ${nivelImpacto.color}`}>{nivelImpacto.texto}</h3>
                  </div>

                  {/* NUEVA SECCIÓN: GRÁFICO DE BARRAS DE MAYOR EMISOR */}
                  <div className="bg-white p-5 rounded-3xl border border-green-100 shadow-sm">
                    <h4 className="text-green-900 font-black text-sm uppercase tracking-wide mb-4">📊 Diagnóstico: ¿En qué estás gastando más?</h4>
                    <div className="space-y-4">
                      {datosGrafico.map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs font-bold text-gray-700">
                            <span>{item.nombre}</span>
                            <span className="text-gray-500">{item.valor.toFixed(1)} kg CO₂</span>
                          </div>
                          <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ${
                                idx === 0 ? "bg-red-500" : "bg-green-600 opacity-70"
                              }`}
                              style={{ width: `${item.porcentajeBarra}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-3 text-center italic">
                      *La barra roja representa tu mayor foco de contaminación actual.
                    </p>
                  </div>

                  {/* RECOMENDACIONES DE SUSTENTABILIDAD */}
                  <div className="bg-white p-5 rounded-3xl border border-green-100 shadow-md">
                    <h4 className="text-green-900 font-bold text-sm sm:text-base mb-3">📋 Plan estratégico de reducción recomendado:</h4>
                    <ul className="space-y-3 text-left">
                      {listaRecomendaciones.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-green-500 font-bold mt-0.5">✔</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              )}
            </div>
          )}
        </div>

        {/* BOTÓN DE ACCIÓN DINÁMICO DE CONTROL */}
        {!exito && (
          <div className="w-full pt-4">
            <button
              onClick={paso === 1 ? () => setPaso(2) : paso === 2 ? procesarMetricasYAvance : handleGuardarEnDashboard}
              disabled={guardando}
              className={`w-full bg-gradient-to-r from-green-800 to-green-500 text-white p-4 sm:p-5 rounded-2xl font-black text-base sm:text-lg shadow-lg hover:scale-[1.01] transition-all ${
                guardando ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {paso === 1 ? "Siguiente Sección" : paso === 2 ? "Calcular Impacto" : guardando ? "Guardando..." : "Guardar"}
            </button>
          </div>
        )}

      </div>

      <style>
        {`
          .fondoCal {
            background: linear-gradient(to bottom, #9dd56f, #eaf7dc);
            font-family: "Kanit", "Poppins", sans-serif;
          }
          input[type="number"]::-webkit-inner-spin-button,
          input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type="number"] {
            -moz-appearance: textfield;
          }
        `}
      </style>
    </main>
  );
}

export default CalculadoraEmpresa;