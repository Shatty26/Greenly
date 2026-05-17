import { useEffect, useState } from "react";

import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

import {
  sendPasswordResetEmail,
} from "firebase/auth";

import {
  auth,
  db,
} from "../firebase/config";

import {
  useNavigate,
} from "react-router-dom";

function EditarPerfil() {

  // =========================================
  // NAVEGACIÓN
  // =========================================
  const navigate =
    useNavigate();

  // =========================================
  // USUARIO ACTUAL
  // =========================================
  const user =
    auth.currentUser;

  // =========================================
  // ESTADOS
  // =========================================
  const [nombre, setNombre] =
    useState("");

  const [fotoPerfil, setFotoPerfil] =
    useState("");

  const [documentoId, setDocumentoId] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [mensaje, setMensaje] =
    useState("");

  const [error, setError] =
    useState("");

  // =========================================
  // FOTO ALEATORIA
  // =========================================
  const seleccionarFotoAleatoria =
    () => {

      const cantidadImagenes = 8;

      const numeroAleatorio =
        Math.floor(
          Math.random() *
            cantidadImagenes
        ) + 1;

      return `/src/imgEco/ecoimg${numeroAleatorio}.jfif`;
    };

  // =========================================
  // OBTENER DATOS USUARIO
  // =========================================
  useEffect(() => {

    const obtenerUsuario =
      async () => {

        try {

          const q = query(
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

          const querySnapshot =
            await getDocs(q);

          querySnapshot.forEach(
            (documento) => {

              const data =
                documento.data();

              // NOMBRE
              setNombre(
                data.nombre
              );

              // ID DOCUMENTO
              setDocumentoId(
                documento.id
              );

            }
          );

        } catch (error) {

          console.error(error);

        }
      };

    if (user) {

      obtenerUsuario();

      setFotoPerfil(
        seleccionarFotoAleatoria()
      );
    }

  }, [user]);

  // =========================================
  // GUARDAR NUEVO NOMBRE
  // =========================================
  const guardarCambios =
    async () => {

      setMensaje("");
      setError("");

      // VALIDACIÓN
      if (
        nombre.trim() === ""
      ) {

        setError(
          "El nombre no puede estar vacío"
        );

        return;
      }

      try {

        setLoading(true);

        // REFERENCIA DOCUMENTO
        const documentoRef =
          doc(
            db,
            "usuarios",
            documentoId
          );

        // ACTUALIZAR
        await updateDoc(
          documentoRef,
          {
            nombre: nombre,
          }
        );

        setMensaje(
          "Perfil actualizado correctamente 💚"
        );

      } catch (error) {

        console.error(error);

        setError(
          "Ocurrió un error al actualizar"
        );

      } finally {

        setLoading(false);

      }
    };

  // =========================================
  // CAMBIAR CONTRASEÑA
  // =========================================
  const cambiarPassword =
    async () => {

      try {

        await sendPasswordResetEmail(
          auth,
          user.email
        );

        setMensaje(
          "Te enviamos un correo para cambiar tu contraseña 💚"
        );

      } catch (error) {

        console.error(error);

        setError(
          "No se pudo enviar el correo"
        );

      }
    };

  return (

    <main className="relative min-h-screen w-full overflow-hidden bg-gray-100 flex justify-center">

      {/* =========================================
          FONDO
      ========================================= */}
      <div className="absolute inset-0 z-0">

        <img
          src="/fondo.png"
          alt="background"
          className="w-full h-full object-cover"
        />

      </div>

      {/* =========================================
          BOTÓN REGRESAR
      ========================================= */}
      <button
        onClick={() =>
          navigate(-1)
        }
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

      {/* =========================================
          CONTENEDOR PRINCIPAL
      ========================================= */}
      <div className="relative z-10 w-full max-w-4xl lg:max-w-[1500px] min-h-screen flex flex-col items-center px-4 md:px-10 pt-10 pb-28">

        {/* =========================================
            CARD
        ========================================= */}
        <div className="w-full bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col items-center pb-10">

          {/* HEADER */}
          <div className="w-full h-48 md:h-52 bg-gradient-to-b from-lime-500 to-green-800 rounded-b-[150px] flex justify-center pt-10">

            <h2 className="text-white text-2xl md:text-3xl font-bold text-center leading-tight">
              Editar <br /> perfil
            </h2>

          </div>

          {/* FOTO */}
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

          {/* =========================================
              FORMULARIO
          ========================================= */}
          <div className="w-full max-w-2xl px-6 mt-8">

            {/* NOMBRE */}
            <div className="flex flex-col gap-2">

              <label className="text-green-900 font-bold text-lg">

                Nombre

              </label>

              <input
                type="text"
                value={nombre}
                onChange={(e) =>
                  setNombre(
                    e.target.value
                  )
                }
                className="
                  w-full py-4 px-6
                  rounded-2xl bg-gray-100
                  outline-none text-gray-700
                  placeholder-gray-500
                  font-medium
                  focus:ring-2 focus:ring-green-400
                "
                placeholder="Tu nombre"
              />

            </div>

            {/* MENSAJES */}
            {mensaje && (

              <div className="mt-5 bg-green-100 text-green-700 text-sm rounded-xl py-3 px-4 font-medium">

                {mensaje}

              </div>

            )}

            {error && (

              <div className="mt-5 bg-red-100 text-red-700 text-sm rounded-xl py-3 px-4 font-medium">

                {error}

              </div>

            )}

            {/* BOTONES */}
            <div className="mt-8 space-y-4">

              {/* GUARDAR */}
              <button
                onClick={
                  guardarCambios
                }
                disabled={loading}
                className="
                  w-full py-4 px-7
                  rounded-2xl
                  bg-gradient-to-r from-green-800 to-green-500
                  text-white font-bold text-lg
                  shadow-lg hover:opacity-90 transition
                  disabled:opacity-50
                "
              >

                {loading
                  ? "Guardando..."
                  : "Guardar cambios"}

              </button>

              {/* CAMBIAR PASSWORD */}
              <button
                onClick={
                  cambiarPassword
                }
                className="
                  w-full bg-green-50/60 
                  py-4 px-7 rounded-2xl 
                  flex justify-between items-center 
                  border border-green-100 
                  hover:bg-green-100 
                  transition-all
                "
              >

                <span className="text-sm md:text-base font-semibold text-green-800">

                  Cambiar contraseña

                </span>

                <span className="text-2xl text-green-300 font-bold">
                  ›
                </span>

              </button>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

export default EditarPerfil;