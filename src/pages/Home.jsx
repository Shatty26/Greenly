import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Firebase (¡Nuestros salvavidas de la base de datos!)
import { auth, db } from "../firebase/config";
import { signOut } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

function Home() {
  // ==========================================
  // NAVIGATE: Para movernos entre pantallas
  // ==========================================
  const navigate = useNavigate();

  // ==========================================
  // ESTADOS: Aquí guardamos la info de la app
  // ==========================================
  const [username, setUsername] = useState(""); // Por si las moscas, empieza en "Usuario"
  const [saludo, setSaludo] = useState("");            // Cambia según la hora del día
  const [emoji, setEmoji] = useState("🌞");            // El mood del clima en emoji
  const [totalMensual, setTotalMensual] = useState(0); // Huella mensual de carbono (kg CO2)
  const [totalAnual, setTotalAnual] = useState(0);     // Huella anual de carbono (toneladas)

  // ==========================================
  // SALUDO DINÁMICO: ¡Un toque personalizado!
  // ==========================================
  useEffect(() => {
    const hora = new Date().getHours(); // Agarramos la hora exacta del sistema

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
  }, []); // Se ejecuta una sola vez al montar el componente. ¡Al toque!

  // ==========================================
  // OBTENER DATOS DE FIREBASE (¡LA MAGIA AQUÍ!)
  // ==========================================
  useEffect(() => {
    /* ⚠️ ¡OJO AQUÍ! Usamos onAuthStateChanged porque Firebase tarda unos milisegundos 
      en conectar y saber quién está logueado. Esto se queda "escuchando" hasta que 
      Firebase dice: "¡Hey, ya tengo al usuario!". En ese momento, corre todo lo de adentro.
    */
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // ----------------------------------------
          // 1. BUSCAR NOMBRE DEL USUARIO
          // ----------------------------------------
          // Buscamos en la colección "usuarios" donde el campo "uid" sea igual al del usuario logueado
          const lusuarios = query(
            collection(db, "usuarios"),
            where("uid", "==", user.uid)
          );

          const usuarioSnapshot = await getDocs(lusuarios);

          if (!usuarioSnapshot.empty) {
            usuarioSnapshot.forEach((documento) => {
              const data = documento.data();
              // Guardamos el campo "nombre" de la base de datos ("Florence", etc.)
              if (data.nombre) {
                setUsername(data.nombre);
              }
            });
          } else {
            console.log("No se encontró ningún documento con el UID:", user.uid);
            setUsername("usuarios");
          }

          // ----------------------------------------
          // 2. BUSCAR DATOS DE LA CALCULADORA
          // ----------------------------------------
          // Buscamos todos los registros de la huella de carbono de este usuario específico
          const qCalculadora = query(
            collection(db, "calculadora"),
            where("uid", "==", user.uid)
          );

          const snapshot = await getDocs(qCalculadora);
          let ultimoRegistro = null;

          // Recorremos los registros para encontrar el más nuevito usando la fecha
          snapshot.forEach((doc) => {
            const data = doc.data();
            if (
              !ultimoRegistro ||
              data.fecha.seconds > ultimoRegistro.fecha.seconds
            ) {
              ultimoRegistro = data; // Guardamos el registro más reciente temporalmente
            }
          });

          // Si encontramos aunque sea un cálculo, actualizamos la pantalla con esos números
          if (ultimoRegistro) {
            setTotalMensual(ultimoRegistro.totalMensual || 0);
            setTotalAnual(ultimoRegistro.totalAnual || 0);
          }

        } catch (error) {
          console.error("¡Rayos! Algo salió mal obteniendo datos de Firestore:", error);
        }
      } else {
        // Alerta roja: Si Firebase confirma que NO hay nadie logueado, ¡pa' fuera! Al login de una.
        navigate("/");
      }
    });

    // Limpieza total: Cuando el usuario se vaya de esta pantalla, apagamos este "escuchador" 
    // para que la app no gaste memoria de gusto. ¡Código limpio!
    return () => unsubscribe();
  }, [navigate]);

  // ==========================================
  // LOGOUT: Cerrar sesión y limpiar todo
  // ==========================================
  const handleLogout = async () => {
    try {
      await signOut(auth); // Le decimos a Firebase que cierre la sesión actual
      navigate("/");       // Nos manda directo al inicio
    } catch (error) {
      console.error("¡Ups! No se pudo cerrar sesión correctamente:", error);
    }
  };

  // ==========================================
  // DISEÑO VISUAL (INTERFAZ)
  // ==========================================
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-emerald-100 font-[Poppins]">
      <div className="pt-6 md:pt-14 px-6 md:px-10 pb-28 max-w-[1300px] mx-auto">
        
        {/* HEADER: Saludo personalizado */}
        <div className="mb-7">
          <h1 className="text-[28px] md:text-[30px] font-bold text-gray-900 flex items-center gap-2">
            {saludo} {emoji}
          </h1>
          <div className="h-[5px] w-[110px] md:h-[4px] md:w-[90px] bg-gradient-to-r from-emerald-500 to-green-400 rounded-full mt-3"></div>
        </div>

        {/* TARJETA DE PROGRESO: Muestra el impacto ambiental */}
        <div className="relative mx-auto mb-8 w-full max-w-[360px] md:max-w-[1200px] h-[175px] md:h-[300px] overflow-hidden rounded-[28px] shadow-xl">
          {/* Imagen de Fondo */}
          <img
            src="/img/cuadroVerde.png"
            alt="weekly progress"
            className="w-full h-full object-cover"
          />

          {/* Imagen Decorativa */}
          <img
            src="/img/manocontierra.png"
            alt="mano con tierra"
            className="absolute top-3 right-0 md:right-[20px] w-[140px] md:w-[260px] z-20"
          />

          {/* Textos Informativos cargados desde Firestore */}
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
              {totalAnual.toFixed(2)} toneladas / año
            </p>
          </div>
        </div>

        {/* HERRAMIENTAS ECOLÓGICAS: Seccion de botones y accesos */}
        <div>
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-6">
            Herramientas ecológicas
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-7 text-center">
            
            {/* BOTÓN: CLASIFICADOR CON IA */}
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

            {/* BOTÓN: DÓNDE RECICLAR */}
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

            {/* BOTÓN: MÓDULO EDUCATIVO */}
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

            {/* BOTÓN: RETOS DIARIOS */}
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

        {/* BOTÓN EXTRA DE CONTROL: Puedes colocar un botón que llame a {handleLogout} 
          en tu barra de navegación o pie de página cuando quieras dar la opción de salir.
        */}

      </div>
    </div>
  );
}

export default Home;