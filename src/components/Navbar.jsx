import { Link, useLocation } from "react-router-dom"

function Navbar() {
  const location = useLocation()

  const isCalcActive =
  location.pathname.startsWith("/calculadora") ||
  location.pathname.startsWith("/cal1")

  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-center z-50 pb-3">
      
      {/* Barra responsive */}
      <div className="w-[97%] max-w-[650px] h-[75px] sm:h-[85px] bg-white rounded-3xl shadow-2xl flex justify-around items-center px-5 sm:px-14">

        {/* Home */}
        <Link to="/home" className="flex items-center justify-center">
          <img
            src="barraNav/casa.png"
            alt="home"
            className={`w-10 h-10 sm:w-10 sm:h-12 ${
              isActive("/home") ? "opacity-100" : "opacity-50"
            }`}
          />
        </Link>

        {/* Calculadora */}
        <Link to="/calculadora" className="flex items-center justify-center">
          <img
            src="barraNav/calculadora.png"
            className={`w-10 h-10 ${isCalcActive ? "opacity-100" : "opacity-50"}`}
            alt="calculadora"
          />
        </Link>

        {/* Retos */}
        <Link to="/retos" className="flex items-center justify-center">
          <img
            src="barraNav/retos.png"
            alt="retos"
            className={`w-10 h-10 sm:w-10 sm:h-12 ${
              isActive("/retos") ? "opacity-100" : "opacity-50"
            }`}
          />
        </Link>

        {/* Perfil */}
        <Link to="/perfil" className="flex items-center justify-center">
         <img
            src="barraNav/perfil.png"
            alt="profile"
            className={`w-10 h-10 sm:w-11 sm:h-12 ${
                isActive("/perfil") ? "opacity-100" : "opacity-50"
             }`}
         />
        </Link>
      </div>
    </nav>
  )
}

export default Navbar