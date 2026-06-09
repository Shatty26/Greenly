import React, {
  useState,
  useEffect,
  useMemo
} from "react";

import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config"; 
import { collection, addDoc } from "firebase/firestore";

function Calcu1() {

  // Navegación
  const navigate = useNavigate();

  // Total de pasos
  const totalSteps = 4;

  // Paso actual
  const [step, setStep] = useState(1);

  // Estado para controlar la carga mientras se guarda en Firebase
  const [loading, setLoading] = useState(false);

  // ============================================
  // INPUTS
  // ============================================
  const [electricidad, setElectricidad] = useState("");
  const [gas, setGas] = useState("");
  const [gasolina, setGasolina] = useState("");

  // ============================================
  // API STATES
  // ============================================
  const [carbonIntensity, setCarbonIntensity] = useState(180);
  const [ecoLevel, setEcoLevel] = useState("Moderado");
  const [ecoAdvice, setEcoAdvice] = useState("Cargando recomendaciones...");

  useEffect(() => {
    const fetchCarbon = async () => {
      try {
        const response = await fetch(
          "https://api.electricitymap.org/v3/carbon-intensity/latest?zone=SV",
          {
            headers: {
              "auth-token": "6gfnAvYm97wk7gDmJz3m"
            }
          }
        );

        const data = await response.json();

        if (data.carbonIntensity) {
          setCarbonIntensity(data.carbonIntensity);

          if (data.carbonIntensity < 100) {
            setEcoLevel("Bajo");
            setEcoAdvice("Excelente momento para usar energía.");
          } else if (data.carbonIntensity < 300) {
            setEcoLevel("Moderado");
            setEcoAdvice("Evita usar aparatos de alto consumo.");
          } else {
            setEcoLevel("Alto");
            setEcoAdvice("Reduce el consumo eléctrico; la red está muy saturada.");
          }
        }
      } catch (e) {
        console.error("Error API", e);
      }
    };

    fetchCarbon();
  }, []);

  // ============================================
  // CÁLCULOS
  // ============================================
  const {
    totalMensual,
    totalAnual,
    impactoNivel,
    mensajeImpacto,
    principalFuente,
    consejoPersonalizado,
    listaRecomendaciones
  } = useMemo(() => {

    const eVal = parseFloat(electricidad) || 0;
    const gVal = parseFloat(gas) || 0;
    const gaVal = parseFloat(gasolina) || 0;

    // Electricidad
    const calculoElectrico = eVal * (carbonIntensity / 1000);
    // Gas
    const calculoGas = gVal * 0.63;
    // Gasolina
    const calculoGasolina = gaVal * 8.89;

    // Total mensual
    const mensual = calculoElectrico + calculoGas + calculoGasolina;
    // Total anual
    const anual = (mensual * 12) / 1000;

    // Nivel de impacto (Añadido "Super Alto")
    let nivel = "Bajo";
    let mensaje = "";

    if (anual < 2) {
      nivel = "Bajo";
      mensaje = "Tus hábitos tienen un impacto ambiental relativamente bajo ¡Sigue así!";
    } else if (anual < 5) {
      nivel = "Moderado";
      mensaje = "Hay algunas acciones que podrías mejorar para reducir tu impacto significativamente.";
    } else if (anual < 10) {
      nivel = "Alto";
      mensaje = "Tus hábitos actuales generan una cantidad considerable de emisiones. Es urgente tomar medidas.";
    } else {
      nivel = "Super Alto";
      mensaje = "⚠️ Tu huella de carbono es extremadamente crítica. Estás superando por mucho los límites sostenibles.";
    }

    // Fuente principal y recomendaciones
    let principal = "";
    let consejo = "";
    let tips = [];

    if (calculoGasolina > calculoElectrico && calculoGasolina > calculoGas) {
      principal = "Transporte (Gasolina)";
      consejo = "El uso del automóvil es el factor clave en tu huella actual. Pequeños cambios aquí transformarán tu impacto.";
      
      if (nivel === "Alto" || nivel === "Super Alto") {
        tips = [
          "Considera planificar una ruta de carpool (viajes compartidos) con colegas o compañeros de estudio.",
          "Sustituye al menos 2 días de uso de vehículo por transporte público o bicicleta.",
          "Mantén la presión correcta de tus llantas; reduce el consumo de combustible hasta un 3%."
        ];
      } else {
        tips = [
          "Evita aceleraciones bruscas al conducir para optimizar el rendimiento del combustible.",
          "Para distancias menores a 1.5 kilómetros, opta por caminar.",
          "Planifica tus salidas para realizar múltiples mandados en un solo viaje."
        ];
      }
    } else if (calculoElectrico > calculoGas) {
      principal = "Electricidad";
      consejo = "El consumo energético en tu hogar o espacio de trabajo está liderando tus emisiones de CO₂.";
      
      if (nivel === "Alto" || nivel === "Moderado" || nivel === "Super Alto") {
        tips = [
          "Revisa y disminuye el uso de aire acondicionado o dispositivos de climatización.",
          "Desconecta cargadores y electrodomésticos en la noche (evita el consumo vampiro).",
          "Aprovecha las horas de baja intensidad de la red recopiladas por GreenBot para planificar tareas pesadas."
        ];
      } else {
        tips = [
          "Cambia los focos restantes por tecnología LED de alta eficiencia.",
          "Limpia los filtros de tus electrodomésticos para que no fuercen su motor."
        ];
      }
    } else {
      principal = "Gas Propano";
      consejo = "El uso energético enfocado en la cocina o calentadores representa tu mayor área de oportunidad.";
      
      tips = [
        "Utiliza tapas en las ollas al cocinar para concentrar el calor y reducir el tiempo de uso de gas.",
        "Asegúrate de que la llama de tus quemadores sea azul constante; una llama amarilla gasta más recursos.",
        "Considera hervir agua utilizando un hervidor eléctrico eficiente si la red eléctrica reporta baja intensidad de carbono."
      ];
    }

    return {
      totalMensual: mensual,
      totalAnual: anual,
      impactoNivel: nivel,
      mensajeImpacto: mensaje,
      principalFuente: principal,
      consejoPersonalizado: consejo,
      listaRecomendaciones: tips
    };

  }, [electricidad, gas, gasolina, carbonIntensity]);

  // ============================================
  // FUNCIÓN GUARDAR EN FIREBASE
  // ============================================
  const handleGuardarDatos = async () => {
    setLoading(true);
    try {
      const userUid = "YOJvLvhmemZVRRgxs1e3gbvG8tm1"; // UID base para tus pruebas

      await addDoc(collection(db, "calculadora"), {
        electricidad: parseFloat(electricidad) || 0,
        gas: parseFloat(gas) || 0,
        gasolina: parseFloat(gasolina) || 0,
        totalAnual: parseFloat(totalAnual.toFixed(2)),
        totalMensual: parseFloat(totalMensual.toFixed(2)),
        fecha: new Date().toLocaleString(),
        uid: userUid
      });

      navigate("/home");
    } catch (error) {
      console.error("Error al guardar en Firebase:", error);
      alert("Hubo un problema al guardar tus datos. Verifica la conexión.");
    } finally {
      setLoading(false);
    }
  };

  const incrementarValor = (tipo) => {
    if (tipo === "electricidad") {
      const valorActual = parseFloat(electricidad) || 0;
      setElectricidad((valorActual + 10).toString());
    } else if (tipo === "gas") {
      const valorActual = parseFloat(gas) || 0;
      setGas((valorActual + 5).toString());
    } else if (tipo === "gasolina") {
      const valorActual = parseFloat(gasolina) || 0;
      setGasolina((valorActual + 1).toString());
    }
  };

  const decrementarValor = (tipo) => {
    if (tipo === "electricidad") {
      const valorActual = parseFloat(electricidad) || 0;
      if (valorActual >= 10) setElectricidad((valorActual - 10).toString());
    } else if (tipo === "gas") {
      const valorActual = parseFloat(gas) || 0;
      if (valorActual >= 5) setGas((valorActual - 5).toString());
    } else if (tipo === "gasolina") {
      const valorActual = parseFloat(gasolina) || 0;
      if (valorActual >= 1) setGasolina((valorActual - 1).toString());
    }
  };

  // ============================================
  // NAVEGACIÓN PASO A PASO
  // ============================================
  const handleNext = () => {
    setStep((s) => Math.min(s + 1, 4));
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 1));
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <main className="fondoCal min-h-screen flex justify-center items-center p-3 sm:p-6">
      <div className="bg-white rounded-[30px] shadow-2xl p-5 sm:p-8 w-full max-w-3xl min-h-[650px] flex flex-col justify-between">
        
        <div>
          {/* HEADER (Oculta botones en el paso 4) */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 items-center justify-between mb-6">
            {/* ATRÁS */}
            {step < 4 && (
              <button
                onClick={handleBack}
                disabled={step === 1}
                className={`w-full sm:w-auto px-5 py-3 rounded-2xl font-bold transition ${
                  step === 1
                    ? "bg-gray-100 text-gray-300"
                    : "bg-green-100 text-green-800 hover:bg-green-200"
                }`}
              >
                Atrás
              </button>
            )}

            {step === 4 && <div className="w-full sm:w-auto"></div>}

            {/* CANCELAR */}
            {step < 4 && (
              <button
                onClick={() => navigate("/calculadora")}
                className="w-full sm:w-auto bg-gray-100 px-5 py-3 rounded-2xl font-bold text-green-900 hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
            )}
          </div>

          {/* BARRA DE PROGRESO */}
          <div className="mb-8">
            <div className="flex justify-between text-xs font-bold text-green-700 mb-2">
              <span>Paso {step} de {totalSteps}</span>
              <span>{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full h-3 bg-green-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-800 to-green-500 transition-all duration-500"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* FORMULARIO PASOS (1 AL 3) */}
          {step < 4 && (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6 shadow-inner">
                {step === 1 ? (
                  <img src="/img/electricidad.png" alt="electricidad" className="w-10 h-10" />
                ) : step === 2 ? (
                  <img src="/img/gasPropano.png" alt="gas" className="w-10 h-10" />
                ) : (
                  <img src="/img/gasolina.png" alt="gasolina" className="w-10 h-10" />
                )}
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-green-900 mb-3 text-center">
                {step === 1 ? "Electricidad" : step === 2 ? "Gas Propano" : "Gasolina"}
              </h2>

              <p className="text-gray-500 text-center mb-6 px-2">
                {step === 1 ? "¿Cuántos kWh consumes al mes?" : step === 2 ? "¿Cuántas libras consumes al mes?" : "¿Cuántos galones consumes al mes?"}
              </p>

              <div className="w-full max-w-md flex flex-row items-center gap-2 sm:gap-3 mb-6">
                <button
                  onClick={() => {
                    if (step === 1) decrementarValor("electricidad");
                    else if (step === 2) decrementarValor("gas");
                    else decrementarValor("gasolina");
                  }}
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 hover:bg-green-200 rounded-xl text-2xl font-bold text-green-800 transition shrink-0"
                >
                  -
                </button>

                <input
                  type="number"
                  className="flex-1 min-w-0 p-4 sm:p-5 bg-green-50 rounded-2xl border border-green-200 text-center text-xl sm:text-2xl font-bold text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={step === 1 ? electricidad : step === 2 ? gas : gasolina}
                  onChange={(e) => {
                    if (step === 1) setElectricidad(e.target.value);
                    else if (step === 2) setGas(e.target.value);
                    else setGasolina(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
                  }}
                  onWheel={(e) => e.target.blur()}
                  placeholder="0"
                />

                <button
                  onClick={() => {
                    if (step === 1) incrementarValor("electricidad");
                    else if (step === 2) incrementarValor("gas");
                    else incrementarValor("gasolina");
                  }}
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 hover:bg-green-200 rounded-xl text-2xl font-bold text-green-800 transition shrink-0"
                >
                  +
                </button>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center w-full">
                <p className="text-sm text-green-900 font-medium leading-relaxed">
                  {step === 1
                    ? "La electricidad que usamos diariamente puede producir emisiones contaminantes dependiendo de cómo se genera la energía."
                    : step === 2
                    ? "El uso frecuente de gas genera emisiones que contribuyen al calentamiento global."
                    : "El transporte es una de las mayores fuentes de contaminación ambiental en el mundo."}
                </p>
              </div>
            </div>
          )}

          {/* RENDEREADO DE RESULTADOS (PASO 4) */}
          {step === 4 && (
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
              
              {/* RESULTADO PRINCIPAL */}
              <div className="bg-gradient-to-br from-green-700 via-green-600 to-green-500 text-white p-6 rounded-3xl shadow-xl">
                <p className="text-sm uppercase tracking-widest opacity-80 font-bold">Tu huella mensual</p>
                <h1 className="text-4xl sm:text-6xl font-black mt-2 break-words">
                  {totalMensual.toFixed(2)}
                </h1>
                <p className="text-base sm:text-lg mt-1">kg CO₂ / mes</p>

                <div className="mt-5 bg-white/10 rounded-2xl p-4">
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                      <p className="text-xs sm:text-sm opacity-80">Nivel de impacto</p>
                      <h3 className={`text-xl sm:text-2xl font-black ${
                        impactoNivel === "Bajo" 
                          ? "text-green-300" 
                          : impactoNivel === "Moderado" 
                          ? "text-yellow-300" 
                          : "text-red-400"
                      }`}>
                        {impactoNivel}
                      </h3>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm opacity-80">Intensidad eléctrica</p>
                      <h3 className="text-xl sm:text-2xl font-black">{carbonIntensity} gCO₂/kWh</h3>
                    </div>
                  </div>
                  <p className="mt-4 leading-relaxed text-sm sm:text-base">{mensajeImpacto}</p>
                </div>
              </div>

              {/* SIGNIFICADO ANUAL */}
              <div className="bg-[#F2FFE9] border border-green-200 rounded-3xl p-5 sm:p-6 shadow-lg">
                <h3 className="text-xl sm:text-2xl font-black text-green-900 mb-2">Lo que esto significa</h3>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  Si mantienes estos hábitos durante un año, generarías aproximadamente{" "}
                  <span className="font-black text-green-700">
                    {totalAnual.toFixed(2)} toneladas de CO₂.
                  </span>
                </p>
              </div>

              {/* FUENTE PRINCIPAL Y CONSEJOS */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-green-100 shadow-md">
                <h3 className="text-lg sm:text-xl font-black text-green-900 mb-1">Mayor foco de emisiones</h3>
                <h2 className="text-2xl sm:text-3xl font-black text-green-700 mb-3">{principalFuente}</h2>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">{consejoPersonalizado}</p>
                
                <div className="border-t border-green-100 pt-4">
                  <h4 className="text-green-900 font-bold text-sm sm:text-base mb-3">📋 Plan de acción recomendado:</h4>
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

              {/* EQUIVALENCIAS DE CO₂ (Vuelven a estar incluidas) */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
                  <div className="text-3xl mb-1">✈️</div>
                  <p className="text-xl sm:text-2xl font-black text-green-700">{(totalAnual * 2.52).toFixed(1)}</p>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">vuelos eq.</p>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
                  <div className="text-3xl mb-1">🌳</div>
                  <p className="text-xl sm:text-2xl font-black text-green-700">{(totalAnual * 110).toFixed(0)}</p>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">árboles nec.</p>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
                  <div className="text-3xl mb-1">🚗</div>
                  <p className="text-xl sm:text-2xl font-black text-green-700">{(totalAnual * 520).toFixed(0)}</p>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">km en auto</p>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
                  <div className="text-3xl mb-1">💡</div>
                  <p className="text-xl sm:text-2xl font-black text-green-700">{(totalMensual * 2).toFixed(0)}</p>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">hrs luz LED</p>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* BOTÓN DE ACCIÓN DINÁMICO */}
        <div className="w-full pt-4">
          <button
            onClick={step < 4 ? handleNext : handleGuardarDatos}
            disabled={loading}
            className={`w-full bg-gradient-to-r from-green-800 to-green-500 text-white p-4 sm:p-5 rounded-2xl font-black text-base sm:text-lg shadow-lg hover:scale-[1.01] transition-all ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {step < 4 ? "Siguiente" : loading ? "Guardando..." : "Guardar"}
          </button>
        </div>

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

export default Calcu1;