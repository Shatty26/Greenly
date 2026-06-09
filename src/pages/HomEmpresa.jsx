import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../firebase/config";
// Importamos 'orderBy' y 'limit' para resolver la lectura eficiente del último cálculo
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";

function HomEmpresa() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("Empresa");
  const [saludo, setSaludo] = useState("");
  const [emoji, setEmoji] = useState("🌞");

  const [totalMensual, setTotalMensual] = useState(0);
  const [totalAnual, setTotalAnual] = useState(0);

  // Estados dinámicos para control de empleados y límites
  const [listaEmpleados, setListaEmpleados] = useState([]);
  const [limiteEmpleados, setLimiteEmpleados] = useState(0);
  const [loading, setLoading] = useState(true);

  // NUEVOS ESTADOS PARA LAS TARJETAS DINÁMICAS
  const [totalEcoScore, setTotalEcoScore] = useState(0);
  const [porcentajeImpacto, setPorcentajeImpacto] = useState(0);

  // 1. Saludo dinámico según la hora
  useEffect(() => {
    const hora = new Date().getHours();
    if (hora < 12) {
      setSaludo("Buenos días");
      setEmoji("🌞");
    } else if (hora < 18) {
      setSaludo("Buenas tardes");
      setEmoji("🌤️");
    } else {
      setSaludo("Buenas noches");
      setEmoji("🌙");
    }
  }, []);

  // 2. Efecto principal conectado a Firestore (Corregido para leer tus datos)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate("/");
        return;
      }

      try {
        setLoading(true);

        // A. Obtener datos de la empresa actual
        const empresaDocRef = doc(db, "empresas", user.uid);
        const empresaSnapshot = await getDoc(empresaDocRef);
        
        let codigoDeLaEmpresa = "";

        if (empresaSnapshot.exists()) {
          const empresaData = empresaSnapshot.data();
          setUsername(empresaData.nombreEmpresa || empresaData.nombre || empresaData.email?.split("@")[0] || "Empresa");
          setLimiteEmpleados(Number(empresaData.cantidadEmpleados) || 0);
          codigoDeLaEmpresa = empresaData.codigoEmpresa || ""; 
        }

        // B. Obtener los registros de la colección 'empleados'
        let acumuladorEcoScore = 0;
        if (codigoDeLaEmpresa !== "") {
          const qEmpleados = query(
            collection(db, "empleados"), 
            where("empresaId", "==", codigoDeLaEmpresa)
          );

          const empleadosSnapshot = await getDocs(qEmpleados);
          const empleadosData = [];

          empleadosSnapshot.forEach((doc) => {
            const data = doc.data();
            const puntos = data.puntosAcumulados !== undefined ? Number(data.puntosAcumulados) : (Number(data.ecoScore) || 0);
            
            acumuladorEcoScore += puntos; // Sumamos los puntos del empleado al total

            empleadosData.push({
              nombre: data.nombre || data.nombreCompleto || "Empleado sin nombre",
              departamento: data.departamento || "General",
              ecoScore: puntos,
            });
          });

          setListaEmpleados(empleadosData);
          setTotalEcoScore(acumuladorEcoScore); // Guardamos la suma total de EcoScore
        } else {
          setListaEmpleados([]);
          setTotalEcoScore(0);
        }

        // C. Obtener el cálculo de emisiones de la empresa de forma segura
        // Se quita 'orderBy' de la consulta de Firebase para evitar la necesidad de configurar índices compuestos
        const qCalculadora = query(
          collection(db, "calculadora"),
          where("uid", "==", user.uid),
          where("tipo", "==", "empresa")
        );

        const snapshot = await getDocs(qCalculadora);
        let emisionEmpresaBase = 0;
        
        if (!snapshot.empty) {
          // Ordenamos los documentos manualmente por marca de tiempo en JavaScript
          const documentos = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          documentos.sort((a, b) => {
            const fechaA = a.fecha?.seconds || 0;
            const fechaB = b.fecha?.seconds || 0;
            return fechaB - fechaA; // El más reciente primero
          });

          const ultimoRegistro = documentos[0];
          emisionEmpresaBase = Number(ultimoRegistro.totalAnual) || 0;
          setTotalMensual(Number(ultimoRegistro.totalMensual) || 0);
          setTotalAnual(emisionEmpresaBase);
        } else {
          setTotalMensual(0);
          setTotalAnual(0);
        }

        // D. CALCULAR EL IMPACTO AMBIENTAL TOTAL DE LOS EMPLEADOS (Calculado dinámicamente)
        if (codigoDeLaEmpresa !== "") {
          const qCalculosEmpleados = query(
            collection(db, "calculadora"),
            where("codigoEmpresa", "==", codigoDeLaEmpresa),
            where("tipo", "==", "empleado") // Asegura recolectar datos únicos de empleados
          );

          const calculosSnapshot = await getDocs(qCalculosEmpleados);
          let sumaHuellaEmpleados = 0;

          calculosSnapshot.forEach((doc) => {
            const data = doc.data();
            // Sumamos las toneladas anuales que producen los empleados individuales
            sumaHuellaEmpleados += Number(data.totalAnual) || 0;
          });

          // Sacamos el porcentaje de impacto de los empleados sobre el total global de la empresa
          if (emisionEmpresaBase > 0) {
            const porcentaje = (sumaHuellaEmpleados / emisionEmpresaBase) * 100;
            // Lo limitamos al 100% como máximo para la barra visual
            setPorcentajeImpacto(porcentaje > 100 ? 100 : porcentaje);
          } else {
            // Si la empresa base no tiene huella, pero los empleados sí, asignamos un progreso estimado
            setPorcentajeImpacto(sumaHuellaEmpleados > 0 ? 50 : 0);
          }
        }

      } catch (error) {
        console.error("Error al cargar los datos de la empresa:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Aumentar la restricción de empleados permitidos (+1 espacio)
  const handleAumentarRestriccion = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const nuevoLimite = limiteEmpleados + 1;
      const empresaDocRef = doc(db, "empresas", user.uid);
      
      await updateDoc(empresaDocRef, {
        cantidadEmpleados: nuevoLimite
      });

      setLimiteEmpleados(nuevoLimite);
    } catch (error) {
      console.error("Error al aumentar la restricción de empleados:", error);
      alert("No se pudo actualizar el límite. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-emerald-100 font-[Poppins]">
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-8">
        
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <img src="/img/greenly-logo.png" alt="Greenly" className="w-12 h-12 object-contain" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {saludo} {username}!!! {emoji}
              </h1>
            </div>
          </div>
        </div>
        <div className="h-1 w-28 bg-emerald-500 rounded-full -mt-4 mb-8"></div>

        {/* TARJETA PRINCIPAL (PANEL DE RESULTADOS) */}
        <div className="relative overflow-hidden rounded-3xl shadow-xl mb-8">
          <img src="/img/cuadroVerde.png" alt="dashboard" className="w-full h-[250px] md:h-[320px] object-cover" />
          <img src="/img/manocontierra.png" alt="decoracion" className="absolute right-4 top-5 w-[150px] md:w-[260px] pointer-events-none" />
          <div className="absolute inset-0 p-6 md:p-10 text-white flex flex-col justify-between">
            <div>
              <p className="text-lg font-semibold opacity-90">Huella Total de la Empresa</p>
              <h2 className="text-5xl md:text-8xl font-extrabold">
                {loading ? "..." : totalAnual.toFixed(2)}
              </h2>
              <p className="text-lg md:text-2xl">Toneladas CO₂ / Año</p>
            </div>
            <div>
              <p className="text-sm md:text-lg">
                Emisiones mensuales:{" "}
                <span className="font-bold ml-2">
                  {loading ? "..." : totalMensual.toFixed(1)} kg CO₂
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="text-gray-500 font-medium">EcoScore Grupal</h3>
            <p className="text-4xl font-bold text-emerald-600 mt-3">
              {loading ? "..." : `${totalEcoScore} pts`}
            </p>
            <p className="text-gray-500 mt-2">Puntos ambientales acumulados</p>
          </div>

          {/* TARJETA 2: EMPLEADOS REGISTRADOS */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="text-gray-500 font-medium">Empleados registrados</h3>
            <p className="text-4xl font-bold text-green-700 mt-3">
              {loading ? "..." : `${listaEmpleados.length}/${limiteEmpleados}`}
            </p>
            <p className="text-gray-500 mt-2">Cupos utilizados en la plataforma</p>
          </div>

          {/* TARJETA 3: META AMBIENTAL / IMPACTO EN PORCENTAJE */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="text-gray-500 font-medium">Impacto Colectivo</h3>
            <p className="text-4xl font-bold text-lime-600 mt-3">
              {loading ? "..." : `${porcentajeImpacto.toFixed(0)}%`}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
              <div 
                className="bg-emerald-600 h-3 rounded-full transition-all duration-500" 
                style={{ width: `${porcentajeImpacto}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* SECCIÓN DE LA NÓMINA */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-6 gap-2">
            <h2 className="text-xl md:text-3xl font-bold">Nómina Activa</h2>

            <button 
              onClick={handleAumentarRestriccion}
              disabled={loading}
              className="px-4 py-2 rounded-xl font-semibold transition text-white bg-emerald-600 hover:bg-emerald-700"
            >
              + Agregar Cupo
            </button>
          </div>

          {loading ? (
            <p className="text-center text-gray-500 py-10">Cargando nómina...</p>
          ) : listaEmpleados.length === 0 ? (
            <p className="text-center text-gray-500 py-10">No hay empleados registrados para esta empresa todavía.</p>
          ) : (
            <div className="space-y-4">
              {listaEmpleados.map((empleado, index) => (
                <div key={index} className="border border-gray-200 rounded-2xl p-4 hover:shadow-lg transition">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{empleado.nombre}</h3>
                      <p className="text-gray-500 text-sm">Departamento: {empleado.departamento}</p>
                      <p className="text-emerald-600 text-sm font-semibold mt-1">Puntos: {empleado.ecoScore} pts</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default HomEmpresa;