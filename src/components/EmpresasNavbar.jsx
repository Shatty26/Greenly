import { Link, useLocation } from "react-router-dom"

function EmpresasNavbar () {
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
        <Link to="/homempresa" className="flex items-center justify-center text-black-500">
          <img
            src="/img/home.png"
            alt="homepresa"
            className={`w-10 h-10 sm:w-10 sm:h-12 ${
              isActive("/homempresa") ? "opacity-100" : "opacity-50"
            }`}
          />
        </Link>

        {/* Calculadora */}
        <Link to="/calculadoraempresa" className="flex items-center justify-center text-gray-500">
          <img
            src="/img/calculadora.png"
            className={`w-10 h-10 ${isCalcActive ? "opacity-100" : "opacity-50"}`}
            alt="calculadoraempresa"
          />
        </Link>

        {/* Reportes y Estadisticas */}
        <Link to="/reportesretos" className="flex items-center justify-center text-gray-500">
          <img
            src="/img/reportes.png"
            alt="retos"
            className={`w-10 h-10 sm:w-10 sm:h-12 ${
              isActive("/reportesretos") ? "opacity-100" : "opacity-50"
            }`}
          />
        </Link>

        {/* Perfil */}
        <Link to="/perfilempresa" className="flex items-center justify-center text-gray-500">
         <img
            src="/img/perfil.png"
            alt="profile"
            className={`w-10 h-10 sm:w-11 sm:h-12 ${
                isActive("/perfilempresa") ? "opacity-100" : "opacity-50"
             }`}
         />
        </Link>
      </div>
    </nav>
  )
}

export default EmpresasNavbar