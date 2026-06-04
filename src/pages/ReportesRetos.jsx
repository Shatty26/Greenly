import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
// Agregamos orderBy para manejar la recolección eficiente de cálculos
import { collection, query, where, getDocs, doc, getDoc, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// Importaciones necesarias para Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ReportesEmpresa() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rubro, setRubro] = useState("Tecnológico");
  
  // Estados para el gráfico de departamentos
  const [datosGrafico, setDatosGrafico] = useState({
    labels: [],
    datasets: [],
  });

  // Estados de métricas generales
  const [totalEmpleados, setTotalEmpleados] = useState(0);
  const [ecoScorePromedio, setEcoScorePromedio] = useState(0);

  useEffect(() => {
    const fetchReportesData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/");
        return;
      }

      try {
        setLoading(true);

        // 1. Obtener los datos de la empresa (Rubro y su Código Identificador)
        const empresaDoc = await getDoc(doc(db, "empresas", user.uid));
        let codigoDeLaEmpresa = "";

        if (empresaDoc.exists()) {
          const empresaData = empresaDoc.data();
          setRubro(empresaData.rubro || "Tecnológico");
          codigoDeLaEmpresa = empresaData.codigoEmpresa || "";
        }

        if (codigoDeLaEmpresa === "") {
          console.warn("Esta empresa no tiene un código registrado.");
          setLoading(false);
          return;
        }

        // 2. Obtener la nómina de empleados vinculados usando el codigoEmpresa
        const qEmpleados = query(
          collection(db, "empleados"), 
          where("empresaId", "==", codigoDeLaEmpresa)
        );
        const empleadosSnapshot = await getDocs(qEmpleados);
        
        const mapaEmpleados = {}; // Clave: uid del empleado, Valor: su departamento
        let sumaEcoScore = 0;
        let contadorEmpleados = 0;

        empleadosSnapshot.forEach((doc) => {
          const data = doc.data();
          const score = data.puntosAcumulados !== undefined ? Number(data.puntosAcumulados) : (Number(data.ecoScore) || 0);
          
          sumaEcoScore += score;
          contadorEmpleados++;
          
          // Mapeamos el ID del documento con su departamento para cruzarlo después con la calculadora
          mapaEmpleados[doc.id] = data.departamento || "General";
        });

        setTotalEmpleados(contadorEmpleados);
        setEcoScorePromedio(contadorEmpleados > 0 ? Math.round(sumaEcoScore / contadorEmpleados) : 0);

        // 3. Procesar el impacto de la huella de carbono desde la colección 'calculadora'
        const qCalculos = query(
          collection(db, "calculadora"),
          where("codigoEmpresa", "==", codigoDeLaEmpresa)
        );
        const calculosSnapshot = await getDocs(qCalculos);

        // Agrupador para calcular el promedio de CO2 por Departamento
        const departamentosImpactoMap = {};

        calculosSnapshot.forEach((doc) => {
          const data = doc.data();
          const empUid = data.uid;
          
          // Averiguamos a qué departamento pertenece el empleado dueño de este cálculo
          const deptoDelEmpleado = mapaEmpleados[empUid] || "General";
          const huellaAnual = Number(data.totalAnual) || 0;

          if (!departamentosImpactoMap[deptoDelEmpleado]) {
            departamentosImpactoMap[deptoDelEmpleado] = { sumaHuella: 0, cuentaCalculos: 0 };
          }
          
          departamentosImpactoMap[deptoDelEmpleado].sumaHuella += huellaAnual;
          departamentosImpactoMap[deptoDelEmpleado].cuentaCalculos += 1;
        });

        // Extraer etiquetas y procesar los promedios reales de emisiones
        const labels = Object.keys(departamentosImpactoMap);
        const promediosHuella = labels.map(
          (depto) => departamentosImpactoMap[depto].sumaHuella / departamentosImpactoMap[depto].cuentaCalculos
        );

        // Configuración del gráfico apuntando a la Huella de Carbono (Impacto de los usuarios)
        setDatosGrafico({
          labels: labels.length > 0 ? labels : ["Sin datos"],
          datasets: [
            {
              label: "Huella Promedio (Toneladas CO₂ / Año)",
              data: promediosHuella.length > 0 ? promediosHuella : [0],
              backgroundColor: "rgba(239, 68, 68, 0.6)", // Rojo/Coral para denotar impacto de la huella
              borderColor: "rgb(239, 68, 68)",
              borderWidth: 2,
              borderRadius: 12,
            },
          ],
        });

      } catch (error) {
        console.error("Error al estructurar reportes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportesData();
  }, [navigate]);

  // Opciones de personalización del gráfico de Huella de Carbono
  const opcionesGrafico = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { font: { family: "Poppins", weight: "600" } },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#f3f4f6" },
        title: {
          display: true,
          text: "Toneladas CO₂",
          font: { family: "Poppins", weight: "600" }
        }
      },
      x: {
        grid: { display: false },
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-[Poppins]">
        <p className="text-emerald-600 font-bold animate-pulse">Generando paneles analíticos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-emerald-50 font-[Poppins] p-4 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ENCABEZADO SIN EL BOTÓN DE VOLVER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Reportes de Sostenibilidad
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Monitoreo activo del desempeño sustentable interno.
            </p>
          </div>
        </div>

        {/* TARJETAS RESUMEN DE NÓMINA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-emerald-100">
            <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider">Colaboradores Activos</h3>
            <p className="text-5xl font-black text-gray-800 mt-2">{totalEmpleados}</p>
            <p className="text-xs text-gray-500 mt-2">Usuarios en la plataforma Greenly</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-xl border border-emerald-100">
            <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider">EcoScore General</h3>
            <p className="text-5xl font-black text-emerald-600 mt-2">{ecoScorePromedio}<span className="text-xl text-gray-400">/100</span></p>
            <p className="text-xs text-gray-500 mt-2">Promedio de cultura ecológica</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-xl border border-emerald-100 flex flex-col justify-between">
            <div>
              <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider">Filtro de Sector</h3>
              <p className="text-2xl font-extrabold text-teal-800 mt-2">Rubro {rubro}</p>
            </div>
            <span className="bg-teal-50 text-teal-700 font-semibold px-3 py-1 rounded-xl text-xs w-fit mt-2">
              Métricas calibradas
            </span>
          </div>
        </div>

        {/* CONTENEDOR CENTRAL: GRÁFICA + RECOMENDACIONES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMNA IZQUIERDA: GRÁFICO DE PORCENTAJE/VALOR DE IMPACTO DE HUELLA */}
          <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[32px] shadow-xl border border-emerald-100 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Impacto Atmosférico por Área</h2>
              <p className="text-xs text-gray-400 mt-0.5 mb-6">Comparativa de la huella de carbono generada en promedio por los usuarios según su departamento corporativo</p>
            </div>
            <div className="w-full">
              <Bar data={datosGrafico} options={opcionesGrafico} />
            </div>
          </div>

          {/* COLUMNA DERECHA: RECOMENDACIONES CORPORATIVAS */}
          <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-xl border border-emerald-100 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Sugerencias Directivas</h2>
              <p className="text-xs text-gray-400 mt-0.5">Estrategias recomendadas para el rubro {rubro}</p>
            </div>

            <div className="space-y-4 text-sm font-medium text-gray-700">
              {rubro === "Tecnológico" && (
                <>
                  <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100 leading-relaxed">
                    💻 <strong className="text-teal-950">Green Computing:</strong> Promueve políticas de apagado de estaciones de trabajo al finalizar la jornada laboral y optimiza el almacenamiento redundante de datos.
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 leading-relaxed">
                    🔌 <strong className="text-emerald-950">Vampiros Energéticos:</strong> Instala regletas inteligentes en las salas de servidores auxiliares para cortar flujos fantasmas los fines de semana.
                  </div>
                </>
              )}

              {rubro === "Industrial" && (
                <>
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 leading-relaxed">
                    🏭 <strong className="text-amber-950">Economía Circular:</strong> Identifica subproductos de desecho fabril que puedan ser donados o vendidos a plantas de reciclaje de materia prima.
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 leading-relaxed">
                    🔧 <strong className="text-emerald-950">Mantenimiento Predictivo:</strong> Programa inspecciones periódicas de fugas neumáticas en líneas de aire comprimido para evitar pérdidas energéticas en motores.
                  </div>
                </>
              )}

              {rubro !== "Tecnológico" && rubro !== "Industrial" && (
                <>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 leading-relaxed">
                    🌿 <strong className="text-emerald-950">Oficina Cero Papel:</strong> Establece flujos de firmas biométricas obligatorias para evitar el uso de resmas físicas en recursos humanos y finanzas.
                  </div>
                </>
              )}

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-500 text-center">
                💡 Tip General: Los departamentos con mayor huella de carbono en la gráfica califican prioritariamente para auditorías energéticas focalizadas.
              </div>
            </div>
          </div>
        </div>

        {/* PANEL INFERIOR: RETOS CORPORATIVOS DINÁMICOS SEGÚN EL RUBRO */}
        <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-xl border border-emerald-100">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">Retos de Sostenibilidad Activos</h2>
            <p className="text-xs text-gray-400 mt-0.5">Objetivos colectivos para toda la nómina registrada</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* RETO 1 DINÁMICO */}
            <div className="p-5 border border-gray-100 rounded-2xl space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 font-bold rounded-lg text-xs uppercase">
                    {rubro === "Industrial" ? "Procesos" : "Energía"}
                  </span>
                  <h4 className="font-bold text-gray-800 mt-1">
                    {rubro === "Tecnológico" && "Desconexión Servidores Locales"}
                    {rubro === "Industrial" && "Eficiencia de Maquinaria"}
                    {rubro !== "Tecnológico" && rubro !== "Industrial" && "Desconexión Masiva"}
                  </h4>
                </div>
                <span className="text-xs text-gray-400 font-semibold">Meta: 80% empleados</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                {rubro === "Tecnológico" && "Migrar ambientes de desarrollo locales desusados a contenedores en la nube con apagado programado."}
                {rubro === "Industrial" && "Optimizar los tiempos de precalentamiento y stand-by en motores de alta potencia para abatir picos de consumo eléctrico."}
                {rubro !== "Tecnológico" && rubro !== "Industrial" && "Lograr que los colaboradores configuren el modo de ahorro energético en sus equipos."}
              </p>
              <div className="space-y-1">
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: "65%" }}></div>
                </div>
                <p className="text-right text-[10px] text-gray-400 font-bold">65% Completado</p>
              </div>
            </div>

            {/* RETO 2 DINÁMICO */}
            <div className="p-5 border border-gray-100 rounded-2xl space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded-lg text-xs uppercase">
                    {rubro === "Industrial" ? "Suministros" : "Residuos"}
                  </span>
                  <h4 className="font-bold text-gray-800 mt-1">
                    {rubro === "Tecnológico" && "Reciclaje E-Waste Corporativo"}
                    {rubro === "Industrial" && "Merma Cero en Planta"}
                    {rubro !== "Tecnológico" && rubro !== "Industrial" && "Cero Plásticos de un Solo Uso"}
                  </h4>
                </div>
                <span className="text-xs text-gray-400 font-semibold">Meta: 100% áreas</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                {rubro === "Tecnológico" && "Recolectar y canalizar hardware, periféricos dañados y cables obsoletos a centros autorizados de manejo de basura electrónica."}
                {rubro === "Industrial" && "Implementar un control riguroso de cortes de materia prima para reducir los desperdicios plásticos de embalaje."}
                {rubro !== "Tecnológico" && rubro !== "Industrial" && "Sustituir los vasos plásticos de los dispensadores comunes por tazas reutilizables."}
              </p>
              <div className="space-y-1">
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: "40%" }}></div>
                </div>
                <p className="text-right text-[10px] text-gray-400 font-bold">40% Completado</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default ReportesEmpresa;