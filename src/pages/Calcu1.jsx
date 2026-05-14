import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function Calcu1() {

  const navigate = useNavigate();

  const totalSteps = 4;

  const [step, setStep] = useState(1);

  const [electricidad, setElectricidad] = useState("");
  const [gas, setGas] = useState("");
  const [gasolina, setGasolina] = useState("");

  // =========================
  // API STATES
  // =========================
  const [carbonIntensity, setCarbonIntensity] = useState(180);

  const [ecoLevel, setEcoLevel] = useState("Moderado");

  const [ecoAdvice, setEcoAdvice] = useState(
    "Cargando recomendaciones..."
  );

  // =========================
  // API
  // =========================
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

  // =========================
  // CALCULOS
  // =========================
  const {

    totalMensual,
    totalAnual,

    emE,
    emG,
    emGa,

    impactoNivel,
    mensajeImpacto,
    colorImpacto,
    principalFuente,
    consejoPersonalizado

  } = useMemo(() => {

    const eVal = parseFloat(electricidad) || 0;
    const gVal = parseFloat(gas) || 0;
    const gaVal = parseFloat(gasolina) || 0;

    const calculoElectrico =
      eVal * (carbonIntensity / 1000);

    const calculoGas =
      gVal * 0.63;

    const calculoGasolina =
      gaVal * 8.89;

    const mensual =
      calculoElectrico +
      calculoGas +
      calculoGasolina;

    const anual =
      (mensual * 12) / 1000;

    let nivel = "Bajo";
    let mensaje = "";
    let color = "text-green-700";

    if (anual < 2) {

      nivel = "Bajo";

      mensaje =
        "Tus hábitos tienen un impacto ambiental relativamente bajo.";

      color = "text-green-600";

    }

    else if (anual < 5) {

      nivel = "Moderado";

      mensaje =
        "Hay algunas acciones que podrías mejorar para reducir tu impacto.";

      color = "text-yellow-500";

    }

    else {

      nivel = "Alto";

      mensaje =
        "Tus hábitos actuales generan una cantidad considerable de emisiones.";

      color = "text-red-500";

    }

    let principal = "";
    let consejo = "";

    if (
      calculoGasolina > calculoElectrico &&
      calculoGasolina > calculoGas
    ) {

      principal = "⛽ Transporte";

      consejo =
        "Usar menos el automóvil, compartir viajes o caminar más podría reducir gran parte de tu huella.";

    }

    else if (
      calculoElectrico > calculoGas
    ) {

      principal = "⚡ Electricidad";

      consejo =
        "Apagar luces innecesarias y desconectar aparatos ayudaría a disminuir tu consumo energético.";

    }

    else {

      principal = "🔥 Gas";

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
      colorImpacto: color,
      principalFuente: principal,
      consejoPersonalizado: consejo

    };

  }, [
    electricidad,
    gas,
    gasolina,
    carbonIntensity
  ]);

  // =========================
  // FUNCIONES
  // =========================
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

  const resetCalculator = () => {

    setElectricidad("");
    setGas("");
    setGasolina("");
    setStep(1);

  };

  return (

    <main className="fondoCal min-h-screen flex justify-center items-center p-3 sm:p-6">

      <div className="bg-white rounded-[30px] shadow-2xl p-5 sm:p-8 w-full max-w-3xl min-h-[650px] flex flex-col">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 items-center justify-between mb-6">

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

            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6 shadow-inner">

              <span className="text-4xl">

                {

                  step === 1

                    ? "⚡"

                    : step === 2

                    ? "🔥"

                    : "⛽"

                }

              </span>

            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-green-900 mb-3 text-center">

              {

                step === 1

                  ? "Electricidad"

                  : step === 2

                  ? "Gas Propano"

                  : "Gasolina"

              }

            </h2>

            <p className="text-gray-500 text-center mb-6 px-2">

              {

                step === 1

                  ? "¿Cuántos kWh consumes al mes?"
                  : step === 2

                  ? "¿Cuántas libras consumes al mes?"
                  : "¿Cuántos galones consumes al mes?"

              }

            </p>

            {/* MENSAJE EDUCATIVO */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 text-center w-full">

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

            <input
              type="number"
              className="w-full p-5 bg-green-50 rounded-2xl border border-green-200 text-center text-2xl font-bold text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500"
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
              placeholder="0"
            />

          </div>

        )}

        {/* RESULTADOS */}
        {step === 4 && (

          <div className="space-y-6">

            <h2 className="text-3xl sm:text-5xl font-black text-center text-green-900">
              Tu Impacto Ambiental
            </h2>

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

                    <h3 className={`text-2xl font-black ${colorImpacto}`}>
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

            {/* CONCIENCIA */}
            <div className="bg-[#F2FFE9] border border-green-200 rounded-3xl p-6 shadow-lg">

              <h3 className="text-2xl font-black text-green-900 mb-4">
                🌍 Lo que esto significa
              </h3>

              <p className="text-gray-700 leading-relaxed">

                Si mantienes estos hábitos durante un año,
                podrías generar aproximadamente

                <span className="font-black text-green-700">
                  {" "} {totalAnual.toFixed(2)} toneladas de CO₂.
                </span>

                Estas emisiones contribuyen al calentamiento global,
                contaminación del aire y cambios climáticos.

              </p>

            </div>

            {/* FUENTE PRINCIPAL */}
            <div className="bg-white p-6 rounded-3xl border border-green-100 shadow-md">

              <h3 className="text-2xl font-black text-green-900 mb-3">
                📊 Tu principal fuente de emisiones
              </h3>

              <h2 className="text-3xl font-black text-green-700 mb-3">
                {principalFuente}
              </h2>

              <p className="text-gray-700 leading-relaxed">
                {consejoPersonalizado}
              </p>

            </div>

            {/* DISTRIBUCION */}
            <div className="bg-white p-5 rounded-3xl border border-green-100 shadow-md">

              <h3 className="text-xl font-black text-green-900 mb-5 text-center">
                Distribución de emisiones
              </h3>

              {/* ELECTRICIDAD */}
              <div className="mb-5">

                <div className="flex justify-between mb-2">

                  <span className="font-semibold text-gray-700">
                    ⚡ Electricidad
                  </span>

                  <span className="font-black text-green-700">
                    {emE.toFixed(1)} kg
                  </span>

                </div>

                <div className="w-full h-4 bg-green-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-green-500"
                    style={{
                      width: `${Math.min((emE / totalMensual) * 100 || 0, 100)}%`
                    }}
                  ></div>

                </div>

              </div>

              {/* GAS */}
              <div className="mb-5">

                <div className="flex justify-between mb-2">

                  <span className="font-semibold text-gray-700">
                    🔥 Gas
                  </span>

                  <span className="font-black text-yellow-500">
                    {emG.toFixed(1)} kg
                  </span>

                </div>

                <div className="w-full h-4 bg-green-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-yellow-400"
                    style={{
                      width: `${Math.min((emG / totalMensual) * 100 || 0, 100)}%`
                    }}
                  ></div>

                </div>

              </div>

              {/* GASOLINA */}
              <div>

                <div className="flex justify-between mb-2">

                  <span className="font-semibold text-gray-700">
                    ⛽ Gasolina
                  </span>

                  <span className="font-black text-red-500">
                    {emGa.toFixed(1)} kg
                  </span>

                </div>

                <div className="w-full h-4 bg-green-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-red-500"
                    style={{
                      width: `${Math.min((emGa / totalMensual) * 100 || 0, 100)}%`
                    }}
                  ></div>

                </div>

              </div>

            </div>

            {/* EQUIVALENCIAS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
                ✈️ {(totalAnual * 2.52).toFixed(1)} vuelos equivalentes
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
                🌳 {(totalAnual * 110).toFixed(0)} árboles necesarios
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
                🚗 {(totalAnual * 520).toFixed(0)} km recorridos
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
                💡 {(totalMensual * 2).toFixed(0)} horas de luz LED
              </div>

            </div>

            {/* RECOMENDACIONES */}
            <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-3xl p-6 text-white shadow-xl">

              <h3 className="text-2xl font-black mb-4">
                🌱 Cómo reducir tu huella
              </h3>

              <div className="space-y-3 text-sm sm:text-base leading-relaxed">

                <p>
                  • Caminar o usar bicicleta en trayectos cortos.
                </p>

                <p>
                  • Apagar luces y desconectar aparatos innecesarios.
                </p>

                <p>
                  • Reducir el consumo de combustible.
                </p>

                <p>
                  • Usar focos LED y electrodomésticos eficientes.
                </p>

                <p>
                  • Reciclar y reutilizar materiales siempre que sea posible.
                </p>

              </div>

            </div>

          </div>

        )}

        {/* BOTON */}
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
        `}
      </style>

    </main>

  );

}

export default Calcu1;