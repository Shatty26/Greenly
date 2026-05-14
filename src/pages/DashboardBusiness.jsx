import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// Firebase
import { auth, db } from "../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";

function DashboardBusiness() {

  const isDesktop = window.innerWidth >= 768;

  // 🔹 Estados
  const [userName, setUserName] = useState("");
  const [saludo, setSaludo] = useState("");
  const [emoji, setEmoji] = useState("🌞");

  const [totalMensual, setTotalMensual] = useState(0);
  const [totalAnual, setTotalAnual] = useState(0);

  // =========================
  // saludo con emoji, con if, por que si es de día, tarde o noche, cambia el saludo y el emoji
  // =========================
  useEffect(() => {

    const user = auth.currentUser;

    if (user) {
      setUserName(user.displayName || "Usuario");
    }

    const hora = new Date().getHours();

    if (hora < 12) {
      setSaludo("Buenos días");
      setEmoji("🌞");
    } else if (hora < 18) {
      setSaludo("Buenas tardes");
      setEmoji("🌞");
    } else {
      setSaludo("Buenas noches");
      setEmoji("🌙");
    }

  }, []);

  // =========================
  //TRAER DATOS DE FIREBASE
  // =========================
  useEffect(() => {

    const obtenerDatos = async () => {

      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "calculadora"),
        where("uid", "==", user.uid) //IMPORTANTE: usa uid
      );

      const snapshot = await getDocs(q);

      let ultimoRegistro = null;

      snapshot.forEach((doc) => {
        const data = doc.data();

        if (!ultimoRegistro || data.fecha.seconds > ultimoRegistro.fecha.seconds) {
          ultimoRegistro = data;
        }
      });

      //Si hay datos, los mostramos
      if (ultimoRegistro) {
        setTotalMensual(ultimoRegistro.totalMensual);
        setTotalAnual(ultimoRegistro.totalAnual);
      }
    };

    obtenerDatos();

  }, []);


  const styles = {
    body: {
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      background: "linear-gradient(to bottom, #f8fafc, #e0f2e9)",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center"
    },

    container: {
      width: "100%",
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden"
    },

    contentWrapper: {
      maxWidth: "1200px",
      margin: "0 auto"
    },

    header: {
      padding: isDesktop ? "40px 40px 0" : "32px 24px 0"
    },

    title: {
      fontSize: isDesktop ? "34px" : "28px",
      fontWeight: "700",
      color: "#111827",
      display: "flex",
      alignItems: "center",
      gap: "8px"
    },

    progressLine: {
      height: "6px",
      width: "110px", // 🔹 se queda igual (no funcional como pediste)
      background: "linear-gradient(to right, #10b981, #4ade80)",
      borderRadius: "9999px",
      marginTop: "12px"
    },

    weeklyCard: {
      margin: isDesktop ? "32px 40px" : "24px",
      background: "linear-gradient(135deg, #10b981, #059669)",
      borderRadius: "28px",
      padding: "24px",
      color: "white",
      boxShadow: "0 10px 15px rgba(16,185,129,0.3)"
    },

    weeklyContent: {
      display: "flex",
      justifyContent: "space-between"
    },

    percentage: {
      fontSize: isDesktop ? "64px" : "52px",
      fontWeight: "700",
      margin: "8px 0"
    },

    toolsSection: {
      padding: isDesktop ? "0 40px" : "0 24px"
    },

    toolsGrid: {
      display: "grid",
      gridTemplateColumns: isDesktop ? "repeat(4, 1fr)" : "1fr 1fr",
      gap: "16px"
    },

    card: {
      background: "white",
      borderRadius: "24px",
      padding: "20px",
      textAlign: "center",
      boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
    },

    icon: {
      fontSize: "50px",
      background: "#ecfdf5",
      borderRadius: "20px",
      padding: "20px",
      marginBottom: "10px"
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <div style={styles.contentWrapper}>

          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.title}>
              {saludo} {userName} {emoji}
            </h1>
            <div style={styles.progressLine}></div>
          </div>

          {/*CARD CON DATOS REALES */}
          <div style={styles.weeklyCard}>
            <div style={styles.weeklyContent}>
              <div>
                <p>Tu impacto</p>

                {/* 🔹 TOTAL MENSUAL */}
                <p style={styles.percentage}>
                  {totalMensual.toFixed(2)}
                </p>
                <p>kg CO₂ / mes</p>

                {/* 🔹 TOTAL ANUAL */}
                <p style={{ marginTop: "10px" }}>
                  {totalAnual.toFixed(2)} toneladas / año
                </p>
              </div>

              <div></div> {/* 🔹 quitamos emoji decorativo */}
            </div>
          </div>

          {/* Tools (NO SE TOCA) */}
          <div style={styles.toolsSection}>
            <h2>Ecological tools</h2>

            <div style={styles.toolsGrid}>
              
              <div style={styles.card}>
                <Link to="/moduloinfo">
                  <div style={styles.icon}></div>
                  <p>Educational module</p>
                </Link>
              </div>

              <div style={styles.card}>
                <Link to="/ClasificadorIA">
                  <div style={styles.icon}></div>
                  <p>Waste classifier</p>
                </Link>
              </div>

              <div style={styles.card}>
                <div style={styles.icon}></div>
                <Link to="/modulo-desconocido">
                  <p>Unknown tool</p>
                </Link>
              </div>

              <div style={styles.card}>
                <div style={styles.icon}></div>
                <p>My impact process</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default DashboardBusiness;