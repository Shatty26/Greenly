import { useState } from "react";

import {
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "../firebase/config";

import { useNavigate } from "react-router-dom";

function RecuperarPassword() {

  // =====================================
  // ESTADOS
  // =====================================
  const [email, setEmail] =
    useState("");

  const [mensaje, setMensaje] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // =====================================
  // NAVEGACIÓN
  // =====================================
  const navigate =
    useNavigate();

  // =====================================
  // RECUPERAR CONTRASEÑA
  // =====================================
  const handleResetPassword =
    async (e) => {

      e.preventDefault();

      // LIMPIAR MENSAJES
      setMensaje("");
      setError("");

      // VALIDAR EMAIL
      if (email.trim() === "") {

        setError(
          "Por favor ingresa tu correo"
        );

        return;
      }

      try {

        // ACTIVAR LOADING
        setLoading(true);

        // ENVIAR EMAIL
        await sendPasswordResetEmail(
          auth,
          email
        );

        // MENSAJE ÉXITO
        setMensaje(
          "Te enviamos un correo para recuperar tu contraseña 💚"
        );

        // LIMPIAR INPUT
        setEmail("");

      } catch (error) {

        console.log(error);

        // ERRORES PERSONALIZADOS
        if (
          error.code ===
          "auth/user-not-found"
        ) {

          setError(
            "No existe una cuenta con ese correo"
          );

        }

        else if (
          error.code ===
          "auth/invalid-email"
        ) {

          setError(
            "Correo inválido"
          );

        }

        else {

          setError(
            "Ocurrió un error. Intenta nuevamente."
          );

        }

      } finally {

        // DESACTIVAR LOADING
        setLoading(false);

      }
    };

  return (

    <div className="min-h-screen bg-white font-[Poppins] relative overflow-hidden">

      {/* =====================================
          FONDO
      ===================================== */}
      <div
        className="absolute top-0 left-0 w-full h-1/2 lg:h-full bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/img/fondoArboles.png')",
        }}
      >

        <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-green-300/70 via-white/40 to-white"></div>

      </div>

      {/* =====================================
          BOTÓN REGRESAR
      ===================================== */}
      <button
        onClick={() => navigate(-1)}
        className="
          absolute top-6 left-6 
          w-12 h-12 
          flex items-center justify-center 
          rounded-full bg-white/80 shadow-md 
          hover:bg-green transition
          z-30
        "
      >

        <span className="text-xl font-black text-green-900">
          ←
        </span>

      </button>

      {/* =====================================
          IMAGEN DECORATIVA
      ===================================== */}
      <img
        src="/img/manocontierra.png"
        alt="mano"
        className="
          absolute 
          top-[100px] right-[-25px]
          w-[200px]
          z-0
          lg:top-[60px] lg:right-[640px] lg:w-[300px]
        "
      />

      {/* =====================================
          CONTENIDO PRINCIPAL
      ===================================== */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center justify-center px-6 lg:px-20 gap-10">

        {/* =====================================
            TEXTO IZQUIERDA
        ===================================== */}
        <div className="w-full lg:w-1/2 text-left pl-3 lg:pl-0">

          <h1 className="text-[45px] lg:text-[80px] font-black text-green-950 leading-none">
            Recupera
          </h1>

          <h2 className="text-[28px] lg:text-[45px] font-bold text-green-800 mt-2">
            tu acceso a
          </h2>

          <h1 className="text-[60px] lg:text-[100px] font-black text-green-500 leading-none">
            Greenly
          </h1>

        </div>

        {/* =====================================
            TARJETA
        ===================================== */}
        <div
          className="
            mt-10 lg:mt-0
            w-full max-w-[460px]
            lg:max-w-[520px]
            bg-white rounded-[35px]
            shadow-2xl
            px-8 py-10
            lg:px-12 lg:py-14
          "
        >

          {/* TÍTULO */}
          <h2 className="text-center text-[32px] lg:text-[42px] font-extrabold text-green-500">
            ¿Olvidaste tu contraseña?
          </h2>

          {/* DESCRIPCIÓN */}
          <p className="text-center text-sm lg:text-base text-gray-600 mt-3 mb-8">
            Ingresa tu correo y te enviaremos
            un enlace para recuperar tu cuenta.
          </p>

          {/* FORMULARIO */}
          <form
            onSubmit={handleResetPassword}
            className="flex flex-col gap-6"
          >

            {/* INPUT EMAIL */}
            <input
              type="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="
                w-full py-4 lg:py-5 px-6
                rounded-2xl bg-gray-200 
                outline-none text-gray-700 
                placeholder-gray-500 font-medium 
                focus:ring-2 focus:ring-green-400
              "
            />

            {/* MENSAJE ERROR */}
            {error && (

              <div className="bg-red-100 text-red-700 text-sm rounded-xl py-3 px-4 font-medium">

                {error}

              </div>

            )}

            {/* MENSAJE ÉXITO */}
            {mensaje && (

              <div className="bg-green-100 text-green-700 text-sm rounded-xl py-3 px-4 font-medium">

                {mensaje}

              </div>

            )}

            {/* BOTÓN */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-4 lg:py-5
                rounded-2xl 
                bg-gradient-to-r from-green-800 to-green-500
                text-white font-bold text-lg lg:text-xl
                shadow-lg hover:opacity-90 transition
                disabled:opacity-50
              "
            >

              {loading
                ? "Enviando..."
                : "Enviar correo"}

            </button>

          </form>

          {/* VOLVER LOGIN */}
          <p className="text-center text-sm text-gray-600 mt-7">

            ¿Ya recordaste tu contraseña?{" "}

            <span
              onClick={() =>
                navigate("/login")
              }
              className="font-bold text-green-800 cursor-pointer hover:underline"
            >

              Iniciar sesión

            </span>

          </p>

        </div>

      </div>

    </div>
  );
}

export default RecuperarPassword;