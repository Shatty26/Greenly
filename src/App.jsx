import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import EmpresaNavbar from "./components/EmpresasNavbar"; 
// Páginas
import WelcomeScreen from "./pages/WelcomeScreen";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ModuloInfo from "./pages/ModuloInfo";
import ClasificadorIA from "./pages/ClasificadorIA";
import Chatbot from "./pages/Chatbot";
import Calculadora from "./pages/Calculadora";
import Calcu1 from "./pages/Calcu1";
import PerfilEmpresa from "./pages/PerfilEmpresa";
import Retos from "./pages/Retos";
import Perfil from "./pages/Perfil";
import Soporte from "./pages/Soporte";
import HomEmpresa from "./pages/HomEmpresa";
import CalculadoraEmpresa from "./pages/CalculadoraEmpresa";
import CompanyRegister from "./pages/CompanyRegister";
import RegisterEmpleados from "./pages/RegisterEmpleados";
import PricingScreen from "./pages/PricingScreen";
import DondeReciclar from "./pages/DondeReciclar";
import TipoUsuario from "./pages/TipoUsuario";
import ReportesRetos from "./pages/ReportesRetos";

function Layout() {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase(); 

  // Rutas que NO deben llevar ningún Navbar
  const noNavbarRoutes = [
    "/",
    "/welcomescreen",
    "/login",
    "/register",
    "/moduloinfo",
    "/soporte",
    "/pricingscreen",
    "/tipousuario",
    "/companyregister",
  ];

  // Rutas que llevan el Navbar de Empresa
  const empresaRoutes = [
    "/homempresa",
    "/perfilempresa",
    "/calculadoraempresa",
    "/reportesretos",
  ];

  // Renderizado condicional de los Navbars
  const renderNavbar = () => {
    if (noNavbarRoutes.includes(currentPath)) {
      return null; // Sin Navbar
    }
    if (empresaRoutes.includes(currentPath)) {
      return <EmpresaNavbar />; // Navbar de Empresa
    }
    return <Navbar />; // Navbar por defecto (Usuarios normales)
  };

  return (
    <>
      {renderNavbar()}

      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/moduloinfo" element={<ModuloInfo />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/calcu1" element={<Calcu1 />} />
        <Route path="/calculadora" element={<Calculadora />} />
        <Route path="/clasificadoria" element={<ClasificadorIA />} />
        <Route path="/retos" element={<Retos />} />
        <Route path="/soporte" element={<Soporte />} />
        <Route path="/companyregister" element={<CompanyRegister />} />
        <Route path="/registerempleados" element={<RegisterEmpleados />} />
        <Route path="/pricingscreen" element={<PricingScreen />} />
        <Route path="/dondereciclar" element={<DondeReciclar />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/perfilempresa" element={<PerfilEmpresa />} />
        <Route path="/tipousuario" element={<TipoUsuario />} />
        <Route path="/homempresa" element={<HomEmpresa />} />
        <Route path="/calculadoraempresa" element={<CalculadoraEmpresa />} />
        <Route path="/reportesretos" element={<ReportesRetos />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;