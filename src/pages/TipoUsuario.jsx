import React from "react";
import { useNavigate } from "react-router-dom";

export default function TipoUsuario() {
  const navigate = useNavigate();

  const elegirUsuario = () => {
    localStorage.setItem("tipoCuenta", "usuario");
    navigate("/WelcomeScreen");
  };

  const elegirEmpresa = () => {
    localStorage.setItem("tipoCuenta", "empresa");
    navigate("/PricingScreen");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #dcfce7, white, #f0fdf4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>

        <h1
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: "#15803d",
            marginBottom: "16px",
          }}
        >
          Elegir Tipo de Cuenta
        </h1>

        <p
          style={{
            color: "#4b5563",
            fontSize: "20px",
            marginBottom: "56px",
          }}
        >
          Selecciona cómo deseas continuar
        </p>

        <div
          style={{
            display: "flex",
            gap: "48px",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >

          {/* Usuario */}
          <button
            onClick={elegirUsuario}
            style={{
              width: "260px",
              height: "260px",
              borderRadius: "999px",
              backgroundColor: "white",
              border: "4px solid #bbf7d0",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              cursor: "pointer",
              transition: "0.3s",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>
              👤
            </div>

            <h2
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: "#15803d",
              }}
            >
              Usuario
            </h2>

            <p
              style={{
                color: "#6b7280",
                marginTop: "10px",
                padding: "0 20px",
                fontSize: "14px",
              }}
            >
              Continuar como usuario normal
            </p>
          </button>

          {/* Empresa */}
          <button
            onClick={elegirEmpresa}
            style={{
              width: "260px",
              height: "260px",
              borderRadius: "999px",
              backgroundColor: "#16a34a",
              border: "4px solid #86efac",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              cursor: "pointer",
              transition: "0.3s",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>
              🏢
            </div>

            <h2
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: "white",
              }}
            >
              Empresa
            </h2>

            <p
              style={{
                color: "#dcfce7",
                marginTop: "10px",
                padding: "0 20px",
                fontSize: "14px",
              }}
            >
              Continuar como empresa
            </p>
          </button>

        </div>
      </div>
    </div>
  );
}