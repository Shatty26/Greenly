import { PayPalButtons } from "@paypal/react-paypal-js";
import { Check } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/config";
import { doc, updateDoc } from "firebase/firestore";

// ==============================
// GENERAR CÓDIGO ÚNICO DE EMPRESA
// ==============================
const generarCodigoEmpresa = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin O,0,I,1 para evitar confusión
  let codigo = "";
  for (let i = 0; i < 8; i++) {
    codigo += chars[Math.floor(Math.random() * chars.length)];
  }
  return codigo; // ej: "G4KP9XTA"
};

// ==============================
// LÍMITES POR PLAN
// ==============================
const LIMITES = {
  "Green Mensual": 20,
  "Eco Anual": 100,
};

export default function PricingScreen() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [pagando, setPagando] = useState(false);

  // ==============================
  // GUARDAR PLAN + GENERAR CÓDIGO
  // ==============================
  const guardarPlanEnBaseDatos = async (tipoPlan) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("No hay usuario autenticado.");
      return;
    }
    try {
      setPagando(true);
      const codigo = generarCodigoEmpresa();
      const empresaDocRef = doc(db, "empresas", user.uid);

      await updateDoc(empresaDocRef, {
        plan: tipoPlan,
        codigoEmpresa: codigo,
        cantidadEmpleados: LIMITES[tipoPlan] ?? 20, // límite según el plan
        planActivadoEn: new Date().toISOString(),
      });

      console.log(`Plan "${tipoPlan}" activado. Código: ${codigo}`);
    } catch (error) {
      console.error("Error al guardar el plan:", error);
    } finally {
      setPagando(false);
    }
  };

  // ==============================
  // HANDLER PAYPAL COMPARTIDO
  // ==============================
  const onApproveHandler = (tipoPlan) => async (data, actions) => {
    return actions.order.capture().then(async (details) => {
      await guardarPlanEnBaseDatos(tipoPlan);
      alert(`¡Pago completado! Bienvenido al plan ${tipoPlan} 🌿`);
      navigate("/HomEmpresa");
    });
  };

  const onErrorHandler = (err) => {
    console.error(err);
    alert("Error en el pago con PayPal. Intenta de nuevo.");
  };

  // ==============================
  // PLANES
  // ==============================
  const planes = [
    {
      id: "Green Mensual",
      titulo: "Green Mensual",
      precio: "$4.99/mes",
      monto: "4.99",
      descripcion: "Ideal para empresas pequeñas que quieren empezar.",
      caracteristicas: [
        "Calculadora de huella de carbono avanzada",
        "Reportes mensuales",
        "Consejos y Retos personalizados",
        "Reportes estadísticos de empleados",
        "Registro de hasta 20 empleados",
      ],
      estiloCard: "bg-gradient-to-br from-green-700 to-emerald-900 border-4 border-lime-300",
      estiloPrecio: "text-green-100",
      estiloBoton: "bg-lime-300 hover:bg-lime-200 text-green-950",
    },
    {
      id: "Eco Anual",
      titulo: "Eco Anual",
      precio: "$49/año",
      monto: "49.00",
      descripcion: "La opción más completa para organizaciones.",
      caracteristicas: [
        "Todo lo del plan Green Mensual",
        "Estadísticas comparativas anuales",
        "Consejos, Retos y Recomendaciones personalizadas",
        "Reportes estadísticos de empleados",
        "Registro de hasta 100 empleados",
      ],
      estiloCard: "bg-gradient-to-br from-green-600 to-emerald-800",
      estiloPrecio: "text-green-100",
      estiloBoton: "bg-white hover:bg-green-50 text-green-900",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ecfff1] via-[#dfffe7] to-[#c8ffd8] overflow-hidden relative">

       {/* BOTÓN REGRESAR */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-9 left-2 z-20"
          >
            <img
              src="/img/regresar.png"
              alt="Regresar"
              className="w-10 h-10 object-contain hover:scale-105 transition-transform"
            />
          </button>

      {/* Fondos decorativos */}
      <div className="absolute top-[-100px] left-[-80px] w-72 h-72 bg-green-300 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-80px] w-72 h-72 bg-lime-300 rounded-full blur-3xl opacity-30 pointer-events-none" />

      {/* Contenido */}
      <div className="relative z-10 px-4 py-8 sm:px-6 md:px-10">

        {/* LOGO */}
          <div className="mb-6 sm:mb-8 flex justify-center">
            <img
              src="/img/greenly-logo.png"
              alt="Greenly Logo"
              className="w-35 sm:w-32 object-contain"
            />
          </div>

        {/* Encabezado */}
        <div className="text-center mb-14">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-green-950 leading-tight">
            Únete al<br />Movimiento Greenly
          </h2>
          <p className="text-green-800 mt-5 text-base sm:text-lg max-w-xl mx-auto px-2">
            Elige el plan perfecto para reducir tu impacto ambiental y crear un futuro más verde.
          </p>
        </div>

        {/* Cards de planes */}
        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8">
          {planes.map((plan) => (
            <div
              key={plan.id}
              className={`relative w-full max-w-sm rounded-[35px] p-6 sm:p-8 transition-all duration-300 hover:scale-105 shadow-2xl ${plan.estiloCard}`}
            >
              {/* Título y precio */}
              <div className="text-center mb-8">
                <h3 className="text-3xl sm:text-4xl font-black text-white">{plan.titulo}</h3>
                <p className={`text-lg sm:text-xl mt-3 ${plan.estiloPrecio}`}>{plan.precio}</p>
              </div>

              {/* Características */}
              <div className="space-y-5">
                {plan.caracteristicas.map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="min-w-[32px] min-h-[32px] bg-lime-300 rounded-full flex items-center justify-center mt-1">
                      <Check size={18} className="text-green-950" />
                    </div>
                    <p className="text-white text-base sm:text-lg leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>

              {/* Código que se generará */}
              <div className="mt-6 bg-white/10 rounded-2xl px-4 py-3 text-center">
                <p className="text-white/70 text-xs">
                  🔑 Al pagar se generará automáticamente tu <span className="font-bold text-white">código de empresa</span> para registrar empleados.
                </p>
              </div>

              {/* Botón elegir plan */}
              <button
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full mt-6 py-4 rounded-2xl text-lg sm:text-xl font-bold transition-all duration-300 ${plan.estiloBoton}`}
              >
                {selectedPlan === plan.id ? "PayPal listo abajo ↓" : "Elegir Plan"}
              </button>

              {/* PayPal */}
              {selectedPlan === plan.id && (
                <div className="mt-6">
                  {pagando ? (
                    <div className="text-center text-white/80 py-4 animate-pulse">
                      Activando plan y generando código...
                    </div>
                  ) : (
                    <PayPalButtons
                      style={{ layout: "vertical", color: "blue", shape: "pill", label: "paypal" }}
                      createOrder={(data, actions) =>
                        actions.order.create({
                          purchase_units: [{
                            description: plan.titulo,
                            amount: { value: plan.monto },
                          }],
                        })
                      }
                      onApprove={onApproveHandler(plan.id)}
                      onError={onErrorHandler}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
