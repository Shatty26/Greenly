import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { collection, query, where, getDocs, doc, getDoc, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ReportesEmpresa() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rubro, setRubro] = useState("Tecnológico");
  const [datosGrafico, setDatosGrafico] = useState({ labels: [], datasets: [] });
  const [totalEmpleados, setTotalEmpleados] = useState(0);
  const [ecoScorePromedio, setEcoScorePromedio] = useState(0);

  useEffect(() => {
    const fetchReportesData = async () => {
      const user = auth.currentUser;
      if (!user) { navigate("/"); return; }

      try {
        setLoading(true);

        const empresaDoc = await getDoc(doc(db, "empresas", user.uid));
        let codigoDeLaEmpresa = "";

        if (empresaDoc.exists()) {
          const empresaData = empresaDoc.data();
          setRubro(empresaData.rubro || "Tecnológico");
          codigoDeLaEmpresa = empresaData.codigoEmpresa || "";
        }

        if (!codigoDeLaEmpresa) { setLoading(false); return; }

        const qEmpleados = query(collection(db, "empleados"), where("empresaId", "==", codigoDeLaEmpresa));
        const empleadosSnapshot = await getDocs(qEmpleados);

        const mapaEmpleados = {};
        let sumaEcoScore = 0;
        let contadorEmpleados = 0;

        empleadosSnapshot.forEach((doc) => {
          const data = doc.data();
          const score = data.puntosAcumulados !== undefined ? Number(data.puntosAcumulados) : (Number(data.ecoScore) || 0);
          sumaEcoScore += score;
          contadorEmpleados++;
          mapaEmpleados[doc.id] = data.departamento || "General";
        });

        setTotalEmpleados(contadorEmpleados);
        setEcoScorePromedio(contadorEmpleados > 0 ? Math.round(sumaEcoScore / contadorEmpleados) : 0);

        const qCalculos = query(collection(db, "calculadora"), where("codigoEmpresa", "==", codigoDeLaEmpresa));
        const calculosSnapshot = await getDocs(qCalculos);

        const departamentosImpactoMap = {};
        calculosSnapshot.forEach((doc) => {
          const data = doc.data();
          const deptoDelEmpleado = mapaEmpleados[data.uid] || "General";
          const huellaAnual = Number(data.totalAnual) || 0;
          if (!departamentosImpactoMap[deptoDelEmpleado]) {
            departamentosImpactoMap[deptoDelEmpleado] = { sumaHuella: 0, cuentaCalculos: 0 };
          }
          departamentosImpactoMap[deptoDelEmpleado].sumaHuella += huellaAnual;
          departamentosImpactoMap[deptoDelEmpleado].cuentaCalculos += 1;
        });

        const labels = Object.keys(departamentosImpactoMap);
        const promediosHuella = labels.map(
          (d) => departamentosImpactoMap[d].sumaHuella / departamentosImpactoMap[d].cuentaCalculos
        );

        setDatosGrafico({
          labels: labels.length > 0 ? labels : ["Sin datos"],
          datasets: [{
            label: "Huella promedio (t CO₂ / año)",
            data: promediosHuella.length > 0 ? promediosHuella : [0],
            backgroundColor: "rgba(20, 83, 45, 0.75)",
            borderColor: "rgb(20, 83, 45)",
            borderWidth: 0,
            borderRadius: 8,
          }],
        });

      } catch (error) {
        console.error("Error al estructurar reportes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportesData();
  }, [navigate]);

  const opcionesGrafico = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { family: "Poppins", size: 12 },
          color: "#374151",
          boxWidth: 12,
          padding: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#f3f4f6" },
        border: { display: false },
        ticks: { font: { family: "Poppins", size: 11 }, color: "#9ca3af" },
        title: {
          display: true,
          text: "Toneladas CO₂",
          font: { family: "Poppins", size: 11 },
          color: "#9ca3af",
        },
      },
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { font: { family: "Poppins", size: 12 }, color: "#374151" },
      },
    },
  };

  // Contenido por rubro — sin emojis, texto semibold
  const sugerencias = {
    Tecnológico: [
      { titulo: "Green computing", texto: "Establece políticas de apagado de estaciones al finalizar la jornada y optimiza el almacenamiento redundante de datos." },
      { titulo: "Consumo fantasma", texto: "Instala regletas inteligentes en salas de servidores auxiliares para cortar flujos de energía los fines de semana." },
    ],
    Industrial: [
      { titulo: "Economía circular", texto: "Identifica subproductos de desecho fabril que puedan canalizarse a plantas de reciclaje de materia prima." },
      { titulo: "Mantenimiento predictivo", texto: "Programa inspecciones de fugas neumáticas en líneas de aire comprimido para evitar pérdidas en motores." },
    ],
  };

  const sugerenciasActivas = sugerencias[rubro] || [
    { titulo: "Oficina sin papel", texto: "Establece flujos de firmas digitales para evitar el uso de resmas físicas en recursos humanos y finanzas." },
  ];

  const retos = {
    Tecnológico: [
      { area: "Energía", titulo: "Migración a la nube", desc: "Migrar ambientes de desarrollo locales desusados a contenedores con apagado programado.", pct: 65, color: "#14532d" },
      { area: "Residuos", titulo: "Gestión de e-waste", desc: "Recolectar y canalizar hardware obsoleto a centros autorizados de manejo de residuos electrónicos.", pct: 40, color: "#1d4ed8" },
    ],
    Industrial: [
      { area: "Procesos", titulo: "Eficiencia de maquinaria", desc: "Optimizar tiempos de precalentamiento en motores de alta potencia para reducir picos de consumo.", pct: 65, color: "#14532d" },
      { area: "Suministros", titulo: "Merma cero en planta", desc: "Implementar control de cortes de materia prima para reducir desperdicios de embalaje.", pct: 40, color: "#1d4ed8" },
    ],
  };

  const retosActivos = retos[rubro] || [
    { area: "Energía", titulo: "Desconexión masiva", desc: "Lograr que los colaboradores configuren el modo de ahorro energético en sus equipos.", pct: 65, color: "#14532d" },
    { area: "Residuos", titulo: "Cero plásticos de un solo uso", desc: "Sustituir vasos plásticos por tazas reutilizables en todos los dispensadores.", pct: 40, color: "#1d4ed8" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-[Poppins]">
        <p className="text-green-900 font-semibold animate-pulse text-sm">Generando reportes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-[Poppins] p-4 md:p-10 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ENCABEZADO */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reportes de sostenibilidad</h1>
          <p className="text-gray-400 text-sm mt-1">Monitoreo del desempeño sustentable interno</p>
        </div>

        {/* TARJETAS RESUMEN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Colaboradores activos</p>
            <p className="text-5xl font-bold text-gray-900">{totalEmpleados}</p>
            <p className="text-xs text-gray-400 mt-2">Usuarios en la plataforma</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">EcoScore promedio</p>
            <p className="text-5xl font-bold text-green-900">
              {ecoScorePromedio}
              <span className="text-xl font-semibold text-gray-300"> / 100</span>
            </p>
            <p className="text-xs text-gray-400 mt-2">Cultura ecológica del equipo</p>
          </div>

          <div className="bg-green-900 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-semibold text-green-300 uppercase tracking-wider mb-3">Sector auditado</p>
            <p className="text-2xl font-bold text-white">{rubro}</p>
            <span className="inline-block mt-3 bg-green-800 text-green-200 text-xs font-semibold px-3 py-1 rounded-lg">
              Métricas calibradas
            </span>
          </div>

        </div>

        {/* GRÁFICO + SUGERENCIAS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* GRÁFICO */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Impacto por área</h2>
            <p className="text-xs text-gray-400 mt-0.5 mb-6">Huella de carbono promedio por departamento</p>
            <Bar data={datosGrafico} options={opcionesGrafico} />
          </div>

          {/* SUGERENCIAS */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Sugerencias para tu sector</h2>
              <p className="text-xs text-gray-400 mt-0.5">Recomendaciones para rubro {rubro}</p>
            </div>

            <div className="space-y-3 flex-1">
              {sugerenciasActivas.map((s, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-sm font-semibold text-green-900 mb-1">{s.titulo}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.texto}</p>
                </div>
              ))}

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs text-gray-400 leading-relaxed">
                  Los departamentos con mayor huella en la gráfica son candidatos prioritarios para auditorías energéticas.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* RETOS ACTIVOS */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Retos de sostenibilidad activos</h2>
          <p className="text-xs text-gray-400 mb-6">Objetivos colectivos para toda la nómina</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {retosActivos.map((reto, i) => (
              <div key={i} className="p-5 border border-gray-100 rounded-xl space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{reto.area}</span>
                    <h4 className="text-sm font-semibold text-gray-900 mt-0.5">{reto.titulo}</h4>
                  </div>
                  <span className="text-xs text-gray-300 font-medium whitespace-nowrap shrink-0">Meta: 100%</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{reto.desc}</p>
                <div className="space-y-1">
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${reto.pct}%`, backgroundColor: reto.color }}
                    />
                  </div>
                  <p className="text-right text-[10px] text-gray-400 font-semibold">{reto.pct}% completado</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default ReportesEmpresa;
