import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

// Firebase
import {
  auth,
  db,
} from "../firebase/config";

import {
  signOut,
} from "firebase/auth";

import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

function Home() {

  // =========================
  // NAVIGATE
  // =========================

  const navigate =
    useNavigate();

  // =========================
  // ESTADOS
  // =========================

  // Nombre del usuario
  const [username, setUsername] =
    useState("Usuario");

  // Saludo dinámico
  const [saludo, setSaludo] =
    useState("");

  // Emoji dinámico
  const [emoji, setEmoji] =
    useState("🌞");

  // Datos del usuario
  const [puntos, setPuntos] =
    useState(0);

  const [nivel, setNivel] =
    useState(0);

  const [racha, setRacha] =
    useState(0);

  // Insignia del usuario
  const [insignia, setInsignia] =
    useState(
      "Semilla ecológica"
    );

  // Datos calculadora
  const [totalMensual,
    setTotalMensual] =
    useState(0);

  const [totalAnual,
    setTotalAnual] =
    useState(0);

  // =========================
  // SALUDO DINÁMICO
  // =========================

  useEffect(() => {

    const hora =
      new Date().getHours();

    // Buenos días
    if (hora < 12) {

      setSaludo(
        "Buenos días"
      );

      setEmoji("🌞");

    }

    // Buenas tardes
    else if (hora < 18) {

      setSaludo(
        "Buenas tardes"
      );

      setEmoji("🌤️");

    }

    // Buenas noches
    else {

      setSaludo(
        "Buenas noches"
      );

      setEmoji("🌙");

    }

  }, []);

  // =========================
  // OBTENER DATOS
  // =========================

  useEffect(() => {

    const obtenerDatos =
      async () => {

        try {

          // Usuario actual
          const user =
            auth.currentUser;

          // Si no existe usuario
          if (!user) return;

          // =========================
          // OBTENER USUARIO
          // =========================

          const qUsuario =
            query(
              collection(
                db,
                "usuarios"
              ),

              where(
                "uid",
                "==",
                user.uid
              )
            );

          const usuarioSnapshot =
            await getDocs(
              qUsuario
            );

          usuarioSnapshot.forEach(
            (documento) => {

              const data =
                documento.data();

              // Nombre
              setUsername(
                data.nombre ||
                "Usuario"
              );

              // Puntos
              const puntosUsuario =
                data.puntos || 0;

              setPuntos(
                puntosUsuario
              );

              // Nivel
              const nivelCalculado =
                Math.floor(
                  puntosUsuario / 5
                );

              setNivel(
                nivelCalculado
              );

              // Racha
              const diasRacha =
                data.racha || 0;

              setRacha(
                diasRacha
              );

              // =========================
              // INSIGNIAS
              // =========================

              if (
                diasRacha >= 200
              ) {

                setInsignia(
                  "Leyenda del planeta"
                );

              }

              else if (
                diasRacha >= 100
              ) {

                setInsignia(
                  "Maestro ecológico"
                );

              }

              else if (
                diasRacha >= 50
              ) {

                setInsignia(
                  "Guardián verde"
                );

              }

              else if (
                diasRacha >= 25
              ) {

                setInsignia(
                  "Novato verde"
                );

              }

              else {

                setInsignia(
                  "Semilla ecológica"
                );

              }

            }
          );

          // =========================
          // OBTENER CALCULADORA
          // =========================

          const qCalculadora =
            query(
              collection(
                db,
                "calculadora"
              ),

              where(
                "uid",
                "==",
                user.uid
              )
            );

          const snapshot =
            await getDocs(
              qCalculadora
            );

          let ultimoRegistro =
            null;

          snapshot.forEach(
            (doc) => {

              const data =
                doc.data();

              // Obtener
              // el más reciente
              if (
                !ultimoRegistro ||

                data.fecha.seconds >
                ultimoRegistro.fecha.seconds
              ) {

                ultimoRegistro =
                  data;

              }

            }
          );

          // Guardar datos
          if (ultimoRegistro) {

            setTotalMensual(
              ultimoRegistro.totalMensual || 0
            );

            setTotalAnual(
              ultimoRegistro.totalAnual || 0
            );

          }

        }

        catch (error) {

          console.error(
            "Error obteniendo datos:",
            error
          );

        }

      };

    obtenerDatos();

  }, []);

  // =========================
  // CERRAR SESIÓN
  // =========================

  const handleLogout =
    async () => {

      try {

        await signOut(auth);

        navigate("/");

      }

      catch (error) {

        console.error(
          "Error al cerrar sesión:",
          error
        );

      }

    };

  return (

    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-emerald-100 font-[Poppins]">

      <div className="pt-6 md:pt-14 px-6 md:px-10 pb-28 max-w-[1300px] mx-auto">

        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}

        <div className="mb-7">

          <h1 className="text-[28px] md:text-[30px] font-bold text-gray-900 flex items-center gap-2">

            {saludo}
            {" "}
            {username}!
            {" "}
            {emoji}

          </h1>

          {/* SOLO ESTA PARTE */}
          {/* DEL PRIMER CÓDIGO */}
          <div className="h-[5px] w-[110px] md:h-[4px] md:w-[90px] bg-gradient-to-r from-emerald-500 to-green-400 rounded-full mt-3"></div>

        </div>

        {/* ========================= */}
        {/* PROGRESO SEMANAL */}
        {/* ========================= */}

        <div className="relative mx-auto mb-8 w-[360px] md:w-[800px] h-[175px] md:h-[280px] overflow-hidden rounded-[28px] shadow-xl">

          {/* Fondo */}
          <img
            src="/img/cuadroVerde.png"
            alt="weekly progress"
            className="w-full h-full object-cover"
          />

          {/* Imagen */}
          <img
            src="/img/manocontierra.png"
            alt="mano con tierra"
            className="absolute top-3 right-0 md:right-[0px] w-[140px] md:w-[230px] z-20"
          />

          {/* Texto */}
          <div className="absolute top-7 left-6 text-white">

            <p className="text-white/90 text-base font-semibold">
              Tu impacto ambiental
            </p>

            {/* TOTAL MENSUAL */}
            <p className="text-[50px] md:text-[80px] font-extrabold leading-none mt-2">

              {totalMensual.toFixed(1)}

            </p>

            <p className="text-sm md:text-lg font-medium mt-1">
              kg CO₂ / mes
            </p>

            {/* TOTAL ANUAL */}
            <p className="text-xs md:text-base mt-2 text-white/90">

              {totalAnual.toFixed(2)}
              {" "}
              toneladas / año

            </p>

          </div>

        </div>

       
        {/* ========================= */}
        {/* HERRAMIENTAS */}
        {/* ========================= */}

        <div>

          <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-6">

            Herramientas ecológicas

          </h2>

          {/* GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-7 text-center">

            {/* MÓDULO */}
            <Link
              to="/ModuloInfo"
              className="relative w-[140px] md:w-[210px] mx-auto hover:scale-105 transition"
            >

              <img
                src="/img/plant.png"
                alt="Modulo educativo"
                className="w-full drop-shadow-xl"
              />

              <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm md:text-base font-bold text-green-950">

                Modulo educativo

              </p>

            </Link>

            {/* CLASIFICADOR */}
            <Link
              to="/ClasificadorIA"
              className="relative w-[140px] md:w-[212px] mx-auto hover:scale-105 transition"
            >

              <img
                src="/img/waste.png"
                alt="Clasificador"
                className="w-full drop-shadow-xl"
              />

              <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm md:text-base font-bold text-green-950">

                Clasificador de residuos

              </p>

            </Link>

            {/* RECICLAR */}
            <Link
              to="/DondeReciclar"
              className="relative w-[140px] md:w-[212px] mx-auto hover:scale-105 transition"
            >

              <img
                src="/img/tree.png"
                alt="Donde reciclar"
                className="w-full drop-shadow-xl"
              />

              <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm md:text-base font-bold text-green-950">

                Donde reciclar

              </p>

            </Link>

            {/* PROGRESO */}
            <div className="relative w-[140px] md:w-[210px] mx-auto hover:scale-105 transition cursor-pointer">

              <img
                src="/img/greenhand.png"
                alt="Mi progreso"
                className="w-full drop-shadow-xl"
              />

              <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm md:text-base font-bold text-green-950">

                Mi progreso

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

/* ========================= */
/* COMPONENTE STATS */
/* ========================= */

function StatItem({
  img,
  label,
  value,
}) {

  return (

    <div className="flex flex-col items-center">

      {/* ICONO */}
      <img
        src={img}
        alt={label}
        className="w-16 h-16 object-contain"
      />

      {/* LABEL */}
      <p className="text-sm text-gray-600 mt-2 font-medium">

        {label}

      </p>

      {/* VALOR */}
      <p className="text-xl font-bold text-green-700 mt-1">

        {value}

      </p>

    </div>
  );
}

/* ========================= */
/* BOTONES */
/* ========================= */

function MenuButton({
  label,
}) {

  return (

    <button className="w-full bg-green-50 py-4 px-7 rounded-2xl flex justify-between items-center border border-green-100 hover:bg-green-100 transition-all">

      <span className="text-sm md:text-base font-semibold text-green-800">

        {label}

      </span>

      <span className="text-2xl text-green-300 font-bold">

        ›

      </span>

    </button>
  );
}

export default Home;