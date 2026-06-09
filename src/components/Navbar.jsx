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
            src="/img/home.png"
            alt="home"
            className={`w-10 h-10 sm:w-10 sm:h-12 ${
              isActive("/home") ? "opacity-100" : "opacity-50"
            }`}
          />
        </Link>

        {/* Calculadora */}
        <Link to="/calculadora" className="flex items-center justify-center">
          <img
            src="/img/calculadora.png"
            className={`w-10 h-10 ${isCalcActive ? "opacity-100" : "opacity-50"}`}
            alt="calculadora"
          />
        </Link>

        {/* Chabot */}
        <Link to="/Chatbot" className="flex items-center justify-center">
          <img
            src="/img/chabot.png"
            alt="chabot"
            className={`w-10 h-10 sm:w-10 sm:h-12 ${
              isActive("/Chatbot") ? "opacity-100" : "opacity-50"
            }`}
          />
        </Link>

        {/* Perfil */}
        <Link to="/perfil" className="flex items-center justify-center">
         <img
            src="/img/perfil.png"
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