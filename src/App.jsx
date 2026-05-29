import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

//Componentes
import Navbar from "./components/Navbar";

//Páginas
import WelcomeScreen from "./pages/WelcomeScreen";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ModuloInfo from "./pages/ModuloInfo";
import ClasificadorIA from "./pages/ClasificadorIA";
import Chatbot from "./pages/Chatbot";
import Retos from "./pages/Retos";
import Calculadora from "./pages/Calculadora";
import Calcu1 from "./pages/Calcu1";
import Perfil from "./pages/Perfil";
import EditarPerfil from "./pages/EditarPerfil";
import Soporte from "./pages/Soporte";
import HomEmpresa from "./pages/HomEmpresa";
import CompanyRegister from "./pages/CompanyRegister";
import RegisterEmploee from "./pages/RegisterEmploee";
import SelectProfile from "./pages/SelectProfile";
import PricingScreen from "./pages/PricingScreen";
import DondeReciclar from "./pages/DondeReciclar";
import TipoUsuario from "./pages/TipoUsuario"

function Layout() {
  const location = useLocation();

  // Rutas donde NO se debe mostrar el Navbar
  const noNavbarRoutes = ["/", "/WelcomeScreen", "/login", "/Register", "/ModuloInfo", "/soporte","/PricingScreen", "/SelectProfile", "/RegisterEmploee","/RecuperarPassword", "/Chatbot", "/TipoUsuario", "/CompanyRegister",];

   


  return (
    <>
      {/* El Navbar solo aparece si la ruta actual NO está en el array */}
      {!noNavbarRoutes.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/moduloinfo" element={<ModuloInfo />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/calcu1" element={<Calcu1 />} />
        <Route path="/calculadora" element={<Calculadora />} />
        <Route path="/clasificadoria" element={<ClasificadorIA />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/retos" element={<Retos />} />
        <Route path="/soporte" element={<Soporte />} />
        <Route path="/companyregister" element={<CompanyRegister/>} />
        <Route path="/selectprofile" element={<SelectProfile />} />
        <Route path="/registeremploee" element={<RegisterEmploee />} />
        <Route path="/pricingscreen" element={<PricingScreen />} />
        <Route path="/dondereciclar" element={<DondeReciclar />} />
        <Route path="/editarperfil" element={<EditarPerfil />} />
        <Route path="/TipoUsuario" element={<TipoUsuario />} />
        <Route path="/homempresa" element={<HomEmpresa />} />

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

export default App