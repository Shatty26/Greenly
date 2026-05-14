import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";

function Perfil() {

  const navigate = useNavigate();// Para redirigir después de logout
  const [nombre, setNombre] = useState("Cargando...");// Estado para el nombre del usuario
  const [fotoPerfil, setFotoPerfil] = useState(""); // Estado para la foto aleatoria

  const user = auth.currentUser;

  // Función para seleccionar foto aleatoria
  const seleccionarFotoAleatoria = () => {
    const cantidadImagenes = 8; 
    const numeroAleatorio = Math.floor(Math.random() * cantidadImagenes) + 1;
    return `/src/imgEco/ecoimg${numeroAleatorio}.jfif`;
  };

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const q = query(
          collection(db, "usuarios"),
          where("uid", "==", user.uid)
        );

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          setNombre(doc.data().nombre);
        });

      } catch (error) {
        console.error("Error obteniendo usuario:", error);
      }
    };

    if (user) {
      obtenerUsuario();
      // Asignar foto aleatoria cada vez que cargue el perfil o cambie el usuario
      setFotoPerfil(seleccionarFotoAleatoria());
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gray-100 flex justify-center">
      
      {/* Fondo */}
      <div className="absolute inset-0 z-0">
        <img
          src="/fondo.png"
          alt="background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenedor principal */}
      <div className="relative z-10 w-full max-w-4xl min-h-screen flex flex-col items-center px-4 md:px-10 pt-10 pb-28">
        
        {/* Card Principal */}
        <div className="w-full bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col items-center pb-10">
          
          {/* Header */}
          <div className="w-full h-48 md:h-52 bg-gradient-to-b from-lime-500 to-green-800 rounded-b-[150px] flex justify-center pt-10">
            <h2 className="text-white text-2xl md:text-3xl font-bold text-center leading-tight">
              My <br /> profile
            </h2>
          </div>

          {/* FOTO DE PERFIL ALEATORIA */}
          <div className="relative -mt-12 w-36 h-36 md:w-40 md:h-40 rounded-full bg-white p-2 shadow-xl">
            <div className="w-full h-full rounded-full bg-gradient-to-b from-green-300 to-green-600 flex items-center justify-center overflow-hidden">
              {fotoPerfil ? (
                <img
                  src={fotoPerfil}
                  alt="perfil aleatorio"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 animate-pulse"></div> // Skeleton mientras carga
              )}
            </div>
          </div>

          {/* Nombre e Info */}
          <div className="text-center mt-5 w-full">
            <h3 className="text-xl md:text-2xl font-bold text-green-900">
              {nombre}
            </h3>
            <p className="text-gray-400 text-sm md:text-base mt-1">
              Greenly User
            </p>
            <hr className="w-1/2 mx-auto border-gray-100 mt-4" />
          </div>

          {/* Stats */}
          <div className="flex justify-around w-full max-w-2xl mt-6 px-4">
            <StatItem img="perfil/hoja.png" label="Points" value="1200" />
            <StatItem img="perfil/reci.png" label="Recycling" value="15" />
            <StatItem img="perfil/achievement.png" label="Challenges" value="6" />
          </div>

          {/* Botones */}
          <div className="w-full max-w-2xl mt-7 px-6 space-y-4">
            <MenuButton label="Edit profile" />
            <MenuButton label="Change password" />
            <button
              onClick={handleLogout}
              className="w-full block bg-red-50/60 py-4 px-7 rounded-2xl text-center text-sm md:text-base font-semibold text-red-800 border border-red-100 hover:bg-red-100 transition-all"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

/* --- Componentes --- */
function StatItem({ img, label, value }) {
  return (
    <div className="flex flex-col items-center">
      <img
        src={img}
        alt={label}
        className="w-16 h-16 md:w-18 md:h-18 object-contain"
      />
      <p className="text-[13px] md:text-xs text-gray-600 mt-2 font-medium">
        {label}
      </p>
      <p className="text-lg md:text-xl font-bold text-green-700 mt-1">
        {value}
      </p>
    </div>
  );
}

function MenuButton({ label }) {
  return (
    <button className="w-full bg-green-50/60 py-4 px-7 rounded-2xl flex justify-between items-center border border-green-100 hover:bg-green-100 transition-all">
      <span className="text-sm md:text-base font-semibold text-green-800">
        {label}
      </span>
      <span className="text-2xl text-green-300 font-bold">›</span>
    </button>
  );
}

export default Perfil;
