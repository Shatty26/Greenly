import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import { auth, db } from "../firebase/config";

import { useEffect, useState } from "react";

import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

function Perfil() {

  // ==============================
  // NAVEGACIÓN
  // ==============================
  const navigate = useNavigate();

  // ==============================
  // ESTADOS
  // ==============================
  const [nombre, setNombre] =
    useState("Cargando...");

  const [puntos, setPuntos] =
    useState(0);

  const [nivel, setNivel] =
    useState(0);

  const [racha, setRacha] =
    useState(0);

  const [insignia, setInsignia] =
    useState("Semilla ecológica");

  // FOTO DE PERFIL
  const [fotoPerfil, setFotoPerfil] =
    useState("");

  // USUARIO ACTUAL
  const user = auth.currentUser;

  // ==============================
  // FUNCIÓN PARA FOTO ALEATORIA
  // ==============================
  const seleccionarFotoAleatoria = () => {

    // CANTIDAD DE IMÁGENES
    const cantidadImagenes = 8;

    // NÚMERO ALEATORIO
    const numeroAleatorio =
      Math.floor(
        Math.random() * cantidadImagenes
      ) + 1;

    // RETORNA IMAGEN
    return `/src/imgEco/ecoimg${numeroAleatorio}.jfif`;
  };

  // ==============================
  // OBTENER DATOS DEL USUARIO
  // ==============================
  useEffect(() => {

    const obtenerUsuario =
      async () => {

        try {

          const q = query(
            collection(db, "usuarios"),
            where(
              "uid",
              "==",
              user.uid
            )
          );

          const querySnapshot =
            await getDocs(q);

          querySnapshot.forEach(
            (documento) => {

              const data =
                documento.data();

              // ==============================
              // NOMBRE
              // ==============================
              setNombre(
                data.nombre
              );

              // ==============================
              // PUNTOS
              // ==============================
              const puntosUsuario =
                data.puntos || 0;

              setPuntos(
                puntosUsuario
              );

              // ==============================
              // NIVEL
              // ==============================
              const nivelCalculado =
                Math.floor(
                  puntosUsuario / 5
                );

              setNivel(
                nivelCalculado
              );

              // ==============================
              // RACHA
              // ==============================
              const diasRacha =
                data.racha || 0;

              setRacha(
                diasRacha
              );

              // ==============================
              // INSIGNIAS
              // ==============================
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

        } catch (error) {

          console.error(
            "Error obteniendo usuario:",
            error
          );

        }
      };

    if (user) {

      // OBTENER DATOS
      obtenerUsuario();

      // FOTO ALEATORIA
      setFotoPerfil(
        seleccionarFotoAleatoria()
      );
    }

  }, [user]);

  // ==============================
  // CERRAR SESIÓN
  // ==============================
  const handleLogout =
    async () => {

      try {

        await signOut(auth);

        navigate("/");

      } catch (error) {

        console.error(
          "Error al cerrar sesión:",
          error
        );

      }
    };

  // ==============================
  // RENDER
  // ==============================
  return (

    <main className="relative min-h-screen w-full overflow-hidden bg-gray-100 flex justify-center">

      {/* ==============================
          FONDO
      ============================== */}
      <div className="absolute inset-0 z-0">

        <img
          src="/fondo.png"
          alt="background"
          className="w-full h-full object-cover"
        />

      </div>

      {/* ==============================
          CONTENEDOR PRINCIPAL
      ============================== */}
      <div className="relative z-10 w-full max-w-4xl lg:max-w-[1500px] min-h-screen flex flex-col items-center px-4 md:px-10 pt-10 pb-28">

        {/* ==============================
            CARD PRINCIPAL
        ============================== */}
        <div className="w-full bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col items-center pb-10">

          {/* ==============================
              HEADER
          ============================== */}
          <div className="w-full h-48 md:h-52 bg-gradient-to-b from-lime-500 to-green-800 rounded-b-[150px] flex justify-center pt-10">

            <h2 className="text-white text-2xl md:text-3xl font-bold text-center leading-tight">
              Mi <br /> perfil
            </h2>

          </div>

          {/* ==============================
              FOTO DE PERFIL ALEATORIA
          ============================== */}
          <div className="relative -mt-12 w-36 h-36 md:w-40 md:h-40 rounded-full bg-white p-2 shadow-xl">

            <div className="w-full h-full rounded-full bg-gradient-to-b from-green-300 to-green-600 flex items-center justify-center overflow-hidden">

              {fotoPerfil ? (

                <img
                  src={fotoPerfil}
                  alt="perfil"
                  className="w-full h-full object-cover"
                />

              ) : (

                <div className="w-full h-full bg-gray-200 animate-pulse"></div>

              )}

            </div>

          </div>

          {/* ==============================
              NOMBRE E INSIGNIA
          ============================== */}
          <div className="text-center mt-5 w-full">

            <h3 className="text-xl md:text-2xl font-bold text-green-900">
              {nombre}
            </h3>

            <p className="text-green-600 text-sm md:text-base mt-1 font-semibold">
              {insignia}
            </p>

            <hr className="w-1/2 mx-auto border-gray-100 mt-4" />

          </div>

          {/* ==============================
              ESTADÍSTICAS
          ============================== */}
          <div className="flex justify-around w-full max-w-2xl mt-6 px-4">

            {/* PUNTOS */}
            <StatItem
              img="perfil/hoja.png"
              label="Puntos"
              value={puntos}
            />

            {/* NIVEL */}
            <StatItem
              img="perfil/reci.png"
              label="Nivel"
              value={nivel}
            />

            {/* RACHA */}
            <StatItem
              img="perfil/achievement.png"
              label="Racha"
              value={racha}
            />

          </div>

          {/* ==============================
              BOTONES
          ============================== */}
          <div className="w-full max-w-2xl mt-7 px-6 space-y-4">

            {/* BOTÓN SOLO VISUAL */}
            <Link
              to="/EditarPerfil"
              className="w-full block"
            >
              <MenuButton
                label="Editar perfil"
              />
            </Link>

            {/* SOPORTE */}
            <Link
                to="/soporte"
                className="w-full block"
            >

              <MenuButton
                label="Soporte técnico"
              />

            </Link>

            {/* CERRAR SESIÓN */}
            <button
              onClick={handleLogout}
              className="w-full block bg-red-50/60 py-4 px-7 rounded-2xl text-center text-sm md:text-base font-semibold text-red-800 border border-red-100 hover:bg-red-100 transition-all"
            >

              Cerrar sesión

            </button>

          </div>

        </div>

      </div>

    </main>
  );
}

/* ==================================================
   COMPONENTE DE ESTADÍSTICAS
================================================== */
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
        className="w-16 h-16 md:w-18 md:h-18 object-contain"
      />

      {/* TEXTO */}
      <p className="text-[13px] md:text-xs text-gray-600 mt-2 font-medium">
        {label}
      </p>

      {/* VALOR */}
      <p className="text-lg md:text-xl font-bold text-green-700 mt-1">
        {value}
      </p>

    </div>
  );
}

/* ==================================================
   COMPONENTE BOTONES
================================================== */
function MenuButton({
  label,
}) {

  return (

    <button className="w-full bg-green-50/60 py-4 px-7 rounded-2xl flex justify-between items-center border border-green-100 hover:bg-green-100 transition-all">

      <span className="text-sm md:text-base font-semibold text-green-800">
        {label}
      </span>

      <span className="text-2xl text-green-300 font-bold">
        ›
      </span>

    </button>
  );
}

export default Perfil;