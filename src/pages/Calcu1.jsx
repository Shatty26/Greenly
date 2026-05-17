// ============================================
// IMPORTS
// ============================================
import React, {
  useState,
  useEffect,
  useMemo
} from "react";

import { useNavigate } from "react-router-dom";

// ============================================
// COMPONENTE
// ============================================
function Calcu1() {

  // Navegación
  const navigate = useNavigate();

  // Total de pasos
  const totalSteps = 4;

  // Paso actual
  const [step, setStep] = useState(1);

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

  const [ecoAdvice, setEcoAdvice] = useState(
    "Cargando recomendaciones..."
  );

  // ============================================
  // API
  // ============================================
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

            setEcoAdvice(
              "Excelente momento para usar energía."
            );

          }

          else if (data.carbonIntensity < 300) {

            setEcoLevel("Moderado");

            setEcoAdvice(
              "Evita usar aparatos de alto consumo."
            );

          }

          else {

            setEcoLevel("Alto");

            setEcoAdvice(
              "Reduce el consumo eléctrico; la red está muy saturada."
            );

          }

        }

      }

      catch (e) {

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

    emE,
    emG,
    emGa,

    impactoNivel,
    mensajeImpacto,
    principalFuente,
    consejoPersonalizado

  } = useMemo(() => {

    const eVal = parseFloat(electricidad) || 0;
    const gVal = parseFloat(gas) || 0;
    const gaVal = parseFloat(gasolina) || 0;

    // Electricidad
    const calculoElectrico =
      eVal * (carbonIntensity / 1000);

    // Gas
    const calculoGas =
      gVal * 0.63;

    // Gasolina
    const calculoGasolina =
      gaVal * 8.89;

    // Total mensual
    const mensual =
      calculoElectrico +
      calculoGas +
      calculoGasolina;

    // Total anual
    const anual =
      (mensual * 12) / 1000;

    // ============================================
    // NIVEL IMPACTO
    // ============================================
    let nivel = "Bajo";
    let mensaje = "";

    if (anual < 2) {

      nivel = "Bajo";

      mensaje =
        "Tus hábitos tienen un impacto ambiental relativamente bajo.";

    }

    else if (anual < 5) {

      nivel = "Moderado";

      mensaje =
        "Hay algunas acciones que podrías mejorar para reducir tu impacto.";

    }

    else {

      nivel = "Alto";

      mensaje =
        "Tus hábitos actuales generan una cantidad considerable de emisiones.";

    }

    // ============================================
    // FUENTE PRINCIPAL
    // ============================================
    let principal = "";
    let consejo = "";

    if (
      calculoGasolina > calculoElectrico &&
      calculoGasolina > calculoGas
    ) {

      principal = "Transporte";

      consejo =
        "Usar menos el automóvil, compartir viajes o caminar más podría reducir gran parte de tu huella.";

    }

    else if (
      calculoElectrico > calculoGas
    ) {

      principal = "Electricidad";

      consejo =
        "Apagar luces innecesarias y desconectar aparatos ayudaría a disminuir tu consumo energético.";

    }

    else {

      principal = "Gas";

      consejo =
        "Reducir el uso de gas o utilizar opciones más eficientes disminuiría tus emisiones.";

    }

    return {

      totalMensual: mensual,
      totalAnual: anual,

      emE: calculoElectrico,
      emG: calculoGas,
      emGa: calculoGasolina,

      impactoNivel: nivel,
      mensajeImpacto: mensaje,
      principalFuente: principal,
      consejoPersonalizado: consejo

    };

  }, [
    electricidad,
    gas,
    gasolina,
    carbonIntensity
  ]);

  // ============================================
  // BOTONES + Y -
  // ============================================
  const incrementarValor = (tipo) => {

    if (tipo === "electricidad") {

      const valorActual =
        parseFloat(electricidad) || 0;

      setElectricidad(
        (valorActual + 10).toString()
      );

    }

    else if (tipo === "gas") {

      const valorActual =
        parseFloat(gas) || 0;

      setGas(
        (valorActual + 5).toString()
      );

    }

    else if (tipo === "gasolina") {

      const valorActual =
        parseFloat(gasolina) || 0;

      setGasolina(
        (valorActual + 1).toString()
      );

    }

  };

  const decrementarValor = (tipo) => {

    if (tipo === "electricidad") {

      const valorActual =
        parseFloat(electricidad) || 0;

      if (valorActual >= 10) {

        setElectricidad(
          (valorActual - 10).toString()
        );

      }

    }

    else if (tipo === "gas") {

      const valorActual =
        parseFloat(gas) || 0;

      if (valorActual >= 5) {

        setGas(
          (valorActual - 5).toString()
        );

      }

    }

    else if (tipo === "gasolina") {

      const valorActual =
        parseFloat(gasolina) || 0;

      if (valorActual >= 1) {

        setGasolina(
          (valorActual - 1).toString()
        );

      }

    }

  };

  // ============================================
  // NAVEGACIÓN
  // ============================================
  const handleNext = () => {

    setStep((s) =>
      Math.min(s + 1, 4)
    );

  };

  const handleBack = () => {

    setStep((s) =>
      Math.max(s - 1, 1)
    );

  };

  // ============================================
  // REINICIAR
  // ============================================
  const resetCalculator = () => {

    setElectricidad("");
    setGas("");
    setGasolina("");

    setStep(1);

  };

  // ============================================
  // RENDER
  // ============================================
  return (

    <main className="fondoCal min-h-screen flex justify-center items-center p-3 sm:p-6">

      <div className="bg-white rounded-[30px] shadow-2xl p-5 sm:p-8 w-full max-w-3xl min-h-[650px] flex flex-col">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 items-center justify-between mb-6">

          {/* ATRÁS */}
          {step < 4 && (

            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`w-full sm:w-auto px-5 py-3 rounded-2xl font-bold transition

              ${step === 1
                ? "bg-gray-100 text-gray-300"
                : "bg-green-100 text-green-800 hover:bg-green-200"
              }

              `}
            >
              Atrás
            </button>

          )}

          {step === 4 &&
            <div className="w-full sm:w-auto"></div>
          }

          {/* CANCELAR */}
          <button
            onClick={() => navigate("/calculadora")}
            className="w-full sm:w-auto bg-gray-100 px-5 py-3 rounded-2xl font-bold text-green-900 hover:bg-gray-200 transition"
          >
            Cancelar
          </button>

        </div>

        {/* BARRA */}
        <div className="mb-8">

          <div className="flex justify-between text-xs font-bold text-green-700 mb-2">

            <span>
              Paso {step} de {totalSteps}
            </span>

            <span>
              {Math.round((step / totalSteps) * 100)}%
            </span>

          </div>

          <div className="w-full h-3 bg-green-100 rounded-full overflow-hidden">

            <div
              className="h-full bg-gradient-to-r from-green-800 to-green-500 transition-all duration-500"
              style={{
                width: `${(step / totalSteps) * 100}%`
              }}
            ></div>

          </div>

        </div>

        {/* PASOS */}
        {step < 4 && (

          <div className="flex-1 flex flex-col items-center justify-center">

            {/* ICONO */}
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6 shadow-inner">

              {

                step === 1

                  ? <img src="/img/electricidad.png" alt="electricidad" className="w-10 h-10" />

                  : step === 2

                  ? <img src="/img/gasPropano.png" alt="gas" className="w-10 h-10" />

                  : <img src="/img/gasolina.png" alt="gasolina" className="w-10 h-10" />

              }

            </div>

            {/* TITULO */}
            <h2 className="text-2xl sm:text-4xl font-black text-green-900 mb-3 text-center">

              {

                step === 1
                  ? "Electricidad"
                  : step === 2
                  ? "Gas Propano"
                  : "Gasolina"

              }

            </h2>

            {/* DESCRIPCIÓN */}
            <p className="text-gray-500 text-center mb-6 px-2">

              {

                step === 1
                  ? "¿Cuántos kWh consumes al mes?"
                  : step === 2
                  ? "¿Cuántas libras consumes al mes?"
                  : "¿Cuántos galones consumes al mes?"

              }

            </p>

            {/* INPUT */}
            <div className="w-full flex items-center gap-3 mb-6">

              {/* MENOS */}
              <button
                onClick={() => {

                  if (step === 1)
                    decrementarValor("electricidad");

                  else if (step === 2)
                    decrementarValor("gas");

                  else
                    decrementarValor("gasolina");

                }}
                className="w-12 h-12 bg-green-100 hover:bg-green-200 rounded-xl text-2xl font-bold text-green-800 transition"
              >
                -
              </button>

              {/* INPUT */}
              <input
                type="number"
                className="flex-1 p-5 bg-green-50 rounded-2xl border border-green-200 text-center text-2xl font-bold text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500"

                value={
                  step === 1
                    ? electricidad
                    : step === 2
                    ? gas
                    : gasolina
                }

                onChange={(e) =>

                  step === 1
                    ? setElectricidad(e.target.value)
                    : step === 2
                    ? setGas(e.target.value)
                    : setGasolina(e.target.value)

                }

                // Evita ↑ ↓
                onKeyDown={(e) => {

                  if (
                    e.key === "ArrowUp" ||
                    e.key === "ArrowDown"
                  ) {

                    e.preventDefault();

                  }

                }}

                // Evita scroll
                onWheel={(e) =>
                  e.target.blur()
                }

                placeholder="0"
              />

              {/* MÁS */}
              <button
                onClick={() => {

                  if (step === 1)
                    incrementarValor("electricidad");

                  else if (step === 2)
                    incrementarValor("gas");

                  else
                    incrementarValor("gasolina");

                }}
                className="w-12 h-12 bg-green-100 hover:bg-green-200 rounded-xl text-2xl font-bold text-green-800 transition"
              >
                +
              </button>

            </div>

            {/* MENSAJE */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center w-full">

              <p className="text-sm text-green-900 font-medium leading-relaxed">

                {

                  step === 1

                    ? "La electricidad que usamos diariamente puede producir emisiones contaminantes dependiendo de cómo se genera la energía."

                    : step === 2

                    ? "El uso frecuente de gas genera emisiones que contribuyen al calentamiento global."

                    : "El transporte es una de las mayores fuentes de contaminación ambiental en el mundo."

                }

              </p>

            </div>

          </div>

        )}

        {/* RESULTADOS */}
        {step === 4 && (

          <div className="space-y-6">

            {/* RESULTADO PRINCIPAL */}
            <div className="bg-gradient-to-br from-green-700 via-green-600 to-green-500 text-white p-6 rounded-3xl shadow-xl">

              <p className="text-sm uppercase tracking-widest opacity-80 font-bold">
                Tu huella mensual
              </p>

              <h1 className="text-5xl sm:text-6xl font-black mt-3">
                {totalMensual.toFixed(2)}
              </h1>

              <p className="text-lg mt-2">
                kg CO₂ / mes
              </p>

              <div className="mt-6 bg-white/10 rounded-2xl p-4">

                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">

                  <div>

                    <p className="text-sm opacity-80">
                      Nivel de impacto
                    </p>

                    <h3
                      className={`text-2xl font-black

                      ${impactoNivel === "Bajo"
                        ? "text-green-300"
                        : impactoNivel === "Moderado"
                        ? "text-yellow-300"
                        : "text-red-300"
                      }

                      `}
                    >
                      {impactoNivel}
                    </h3>

                  </div>

                  <div>

                    <p className="text-sm opacity-80">
                      Intensidad eléctrica
                    </p>

                    <h3 className="text-2xl font-black">
                      {carbonIntensity}
                    </h3>

                  </div>

                </div>

                <p className="mt-4 leading-relaxed text-sm sm:text-base">
                  {mensajeImpacto}
                </p>

              </div>

            </div>

            {/* SIGNIFICADO */}
            <div className="bg-[#F2FFE9] border border-green-200 rounded-3xl p-6 shadow-lg">

              <h3 className="text-2xl font-black text-green-900 mb-4">
                Lo que esto significa
              </h3>

              <p className="text-gray-700 leading-relaxed">

                Si mantienes estos hábitos durante un año,
                podrías generar aproximadamente

                <span className="font-black text-green-700">
                  {" "} {totalAnual.toFixed(2)} toneladas de CO₂.
                </span>

              </p>

            </div>

            {/* FUENTE */}
            <div className="bg-white p-6 rounded-3xl border border-green-100 shadow-md">

              <h3 className="text-2xl font-black text-green-900 mb-3">
                Tu principal fuente de emisiones
              </h3>

              <h2 className="text-3xl font-black text-green-700 mb-3">
                {principalFuente}
              </h2>

              <p className="text-gray-700 leading-relaxed">
                {consejoPersonalizado}
              </p>

            </div>

            {/* EQUIVALENCIAS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 text-center">

                <div className="text-4xl mb-2">
                  ✈️
                </div>

                <p className="text-2xl font-black text-green-700">
                  {(totalAnual * 2.52).toFixed(1)}
                </p>

                <p className="text-gray-600 font-medium">
                  vuelos equivalentes
                </p>

              </div>

              <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 text-center">

                <div className="text-4xl mb-2">
                  🌳
                </div>

                <p className="text-2xl font-black text-green-700">
                  {(totalAnual * 110).toFixed(0)}
                </p>

                <p className="text-gray-600 font-medium">
                  árboles necesarios
                </p>

              </div>

              <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 text-center">

                <div className="text-4xl mb-2">
                  🚗
                </div>

                <p className="text-2xl font-black text-green-700">
                  {(totalAnual * 520).toFixed(0)}
                </p>

                <p className="text-gray-600 font-medium">
                  km recorridos
                </p>

              </div>

              <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 text-center">

                <div className="text-4xl mb-2">
                  💡
                </div>

                <p className="text-2xl font-black text-green-700">
                  {(totalMensual * 2).toFixed(0)}
                </p>

                <p className="text-gray-600 font-medium">
                  horas de luz LED
                </p>

              </div>

            </div>

          </div>

        )}

        {/* BOTÓN FINAL */}
        <div className="mt-auto pt-8">

          <button
            onClick={
              step < 4
                ? handleNext
                : resetCalculator
            }

            className="w-full bg-gradient-to-r from-green-800 to-green-500 text-white p-5 rounded-2xl font-black text-lg shadow-lg hover:scale-[1.02] transition"
          >

            {

              step < 4
                ? "Siguiente"
                : "Reiniciar"

            }

          </button>

        </div>

      </div>

      {/* ESTILOS */}
      <style>
        {`

          .fondoCal {

            background:
              linear-gradient(
                to bottom,
                #9dd56f,
                #eaf7dc
              );

            font-family:
              "Kanit",
              "Poppins",
              sans-serif;

          }

          /* Quitar flechas */
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