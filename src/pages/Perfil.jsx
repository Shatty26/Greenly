import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import { auth, db } from "../firebase/config";

import { useEffect, useState } from "react";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

function Perfil() {

  // ==============================
  // NAVEGACIÓN
  // ==============================
  const navigate = useNavigate();

  // ==============================
  // ESTADOS
  // ==============================
  const [nombre, setNombre] = useState("");

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

  // NUEVOS ESTADOS PARA LA EDICIÓN EN LA MISMA PANTALLA
  const [editando, setEditando] = useState(false);
  const [docId, setDocId] = useState(""); // ¡Aquí guardaremos el ID real del documento (sea aleatorio o el uid)!
  const [coleccionOrigen, setColeccionOrigen] = useState(""); // Guarda si es 'usuarios' o 'empleados'
  const [loading, setLoading] = useState(false);

  // USUARIO ACTUAL
  const user = auth.currentUser;

  // ==============================
  // FUNCIÓN PARA FOTO ALEATORIA
  // ==============================
  const seleccionarFotoAleatoria = () => {

    // CANTIDAD DE IMÁGENES
    const cantidadImagenes = 10;

    // NÚMERO ALEATORIO
    const numeroAleatorio =
      Math.floor(
        Math.random() * cantidadImagenes
      ) + 1;

    // RETORNA IMAGEN
    return `/src/imgEco/ecoimg${numeroAleatorio}.jfif`;
  };

  // ==============================
  // OBTENER DATOS DEL USUARIO O EMPLEADO
  // ==============================
  useEffect(() => {

    const obtenerUsuario =
      async () => {

        try {
          // 1. Intentar buscar primero en la colección de 'usuarios'
          let q = query(
            collection(db, "usuarios"),
            where("uid", "==", user.uid)
          );
          let querySnapshot = await getDocs(q);
          let origen = "usuarios";

          // 2. Si no encuentra nada en 'usuarios', busca en 'empleados'
          if (querySnapshot.empty) {
            q = query(
              collection(db, "empleados"),
              where("uid", "==", user.uid)
            );
            querySnapshot = await getDocs(q);
            origen = "empleados";
          }

          querySnapshot.forEach(
            (documento) => {

              const data =
                documento.data();

              // GUARDAMOS EL ID REAL DEL DOCUMENTO (sea el hash aleatorio o el uid)
              setDocId(documento.id);
              setColeccionOrigen(origen);

              // ==============================
              // NOMBRE (Maneja propiedad 'nombre' o 'nombreCompleto')
              // ==============================
              setNombre(
                data.nombre || data.nombreCompleto || ""
              );

              // ==============================
              // PUNTOS (Soporta 'puntos', 'puntosAcumulados' o 'ecoScore')
              // ==============================
              const puntosUsuario =
                data.puntos !== undefined ? data.puntos : (data.puntosAcumulados !== undefined ? data.puntosAcumulados : (data.ecoScore || 0));

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
          // Captura silenciosa
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
  // GUARDAR NUEVO NOMBRE EN FIRESTORE
  // ==============================
  const guardarCambios = async () => {
    if (nombre.trim() === "") {
      alert("El nombre no puede estar vacío.");
      return;
    }

    if (!docId || !coleccionOrigen) {
      alert("No se ha detectado el origen del usuario correctamente.");
      return;
    }

    try {
      setLoading(true);
      
      // Ahora usamos 'docId' que contiene el ID exacto que Firebase encontró al cargar el perfil
      const docRef = doc(db, coleccionOrigen, docId);
      
      // Actualizamos ambas propiedades por si tu estructura varía entre colecciones
      await updateDoc(docRef, {
        nombre: nombre,
        nombreCompleto: nombre
      });

      setEditando(false);
    } catch (error) {
      alert("No se pudieron guardar los cambios. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // CERRAR SESIÓN
  // ==============================
  const handleLogout =
    async () => {

      try {

        await signOut(auth);

        navigate("/");

      } catch (error) {
         // Salida silenciosa
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
              NOMBRE E INSIGNIA / FORMULARIO EDICIÓN
          ============================== */}
          <div className="text-center mt-5 w-full px-6 flex flex-col items-center min-h-[90px]">

            {!editando ? (
              <>
                <h3 className="text-xl md:text-2xl font-bold text-green-900">
                  {nombre || "Eco Usuario"}
                </h3>

                <p className="text-green-600 text-sm md:text-base mt-1 font-semibold">
                  {insignia}
                </p>
              </>
            ) : (
              <div className="w-full max-w-md flex flex-col gap-2 text-left mt-2">
                <label className="text-green-900 font-bold text-sm ml-1">Cambiar nombre:</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full py-3 px-5 rounded-2xl bg-gray-50 border border-green-100 outline-none text-gray-700 font-medium focus:ring-2 focus:ring-green-400"
                  placeholder="Escribe tu nuevo nombre"
                />
                <button
                  type="button"
                  onClick={() => setEditando(false)}
                  className="text-xs text-gray-400 hover:text-gray-600 font-semibold self-end mr-2"
                >
                  Cancelar
                </button>
              </div>
            )}

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
              BOTONES / ACCIONES
          ============================== */}
          <div className="w-full max-w-2xl mt-7 px-6 space-y-4">

            {!editando ? (
              <div onClick={() => setEditando(true)} className="w-full cursor-pointer">
                <MenuButton label="Editar perfil" />
              </div>
            ) : (
              <button
                onClick={guardarCambios}
                disabled={loading}
                className="w-full py-4 px-7 rounded-2xl bg-gradient-to-r from-green-800 to-green-500 text-white font-bold text-base md:text-lg shadow-md hover:opacity-90 transition-all disabled:opacity-50"
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
            )}

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