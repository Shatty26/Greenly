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

  const [username, setUsername] =
    useState("Usuario");

  const [saludo, setSaludo] =
    useState("");

  const [emoji, setEmoji] =
    useState("🌞");

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

    if (hora < 12) {

      setSaludo(
        "Buenos días"
      );

      setEmoji("🌞");

    }

    else if (hora < 18) {

      setSaludo(
        "Buenas tardes"
      );

      setEmoji("🌤️");

    }

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

          const user =
            auth.currentUser;

          if (!user) return;

          // =========================
          // USUARIO
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

              setUsername(
                data.nombre ||
                "Usuario"
              );

            }
          );

          // =========================
          // CALCULADORA
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
  // LOGOUT
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

        {/* HEADER */}
        <div className="mb-7">

          <h1 className="text-[28px] md:text-[30px] font-bold text-gray-900 flex items-center gap-2">

            {saludo}
            {" "}
            {username}!
            {" "}
            {emoji}

          </h1>

          <div className="h-[5px] w-[110px] md:h-[4px] md:w-[90px] bg-gradient-to-r from-emerald-500 to-green-400 rounded-full mt-3"></div>

        </div>

        {/* PROGRESO */}
        <div className="relative mx-auto mb-8 w-full max-w-[360px] md:max-w-[1200px] h-[175px] md:h-[300px] overflow-hidden rounded-[28px] shadow-xl">

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
            className="absolute top-3 right-0 md:right-[20px] w-[140px] md:w-[260px] z-20"
          />

          {/* Texto */}
          <div className="absolute top-7 left-6 text-white">

            <p className="text-white/90 text-base md:text-lg font-semibold">
              Tu impacto ambiental
            </p>

            <p className="text-[50px] md:text-[90px] font-extrabold leading-none mt-2">

              {totalMensual.toFixed(1)}

            </p>

            <p className="text-sm md:text-xl font-medium mt-1">
              kg CO₂ / mes
            </p>

            <p className="text-xs md:text-lg mt-2 text-white/90">

              {totalAnual.toFixed(2)}
              {" "}
              toneladas / año

            </p>

          </div>

        </div>

        {/* HERRAMIENTAS */}
        <div>

          <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-6">

            Herramientas ecológicas

          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-7 text-center">

            {/* CLASIFICADOR */}
            <Link
              to="/ClasificadorIA"
              className="relative w-[140px] md:w-[212px] mx-auto hover:scale-105 transition group"
            >

              <img
                src="/img/waste.png"
                alt="Clasificador"
                className="w-full drop-shadow-xl group-hover:brightness-110 transition-all duration-300"
              />

              <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm md:text-base font-bold text-green-950 group-hover:text-green-700 transition-colors duration-300">

                Clasificador de residuos

              </p>

            </Link>

            {/* DONDE RECICLAR */}
            <Link
              to="/DondeReciclar"
              className="relative w-[140px] md:w-[212px] mx-auto hover:scale-105 transition group"
            >

              <img
                src="/img/tree.png"
                alt="Donde reciclar"
                className="w-full drop-shadow-xl group-hover:brightness-110 transition-all duration-300"
              />

              <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm md:text-base font-bold text-green-950 group-hover:text-green-700 transition-colors duration-300">

                Donde reciclar

              </p>

            </Link>

            {/* MODULO EDUCATIVO */}
            <Link
              to="/ModuloInfo"
              className="relative w-[140px] md:w-[210px] mx-auto hover:scale-105 transition group"
            >

              <img
                src="/img/plant.png"
                alt="Modulo educativo"
                className="w-full drop-shadow-xl group-hover:brightness-110 transition-all duration-300"
              />

              <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm md:text-base font-bold text-green-950 group-hover:text-green-700 transition-colors duration-300">

                Modulo educativo

              </p>

            </Link>

            {/* RETOS */}
            <Link
              to="/Retos"
              className="relative w-[140px] md:w-[210px] mx-auto hover:scale-105 transition group"
            >

              <img
                src="/img/greenhand.png"
                alt="Retos"
                className="w-full drop-shadow-xl group-hover:brightness-110 transition-all duration-300"
              />

              <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center w-full px-2 text-sm md:text-base font-bold text-green-950 group-hover:text-green-700 transition-colors duration-300">

                Retos diarios

              </p>

            </Link>

          </div>

        </div>

      </div>

    </div>

  );
}

export default Home;