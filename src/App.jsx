import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

//Componentes
import Navbar from "./components/Navbar";

//Páginas
import WelcomeScreen from "./pages/WelcomeScreen";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ModuloInfo from "./pages/ModuloInfo";
import Chatbot from "./pages/Chatbot";
import ClasificadorIA from "./pages/ClasificadorIA";
import Retos from "./pages/Retos";
import Calculadora from "./pages/Calculadora";
import Calcu1 from "./pages/Calcu1";
import Perfil from "./pages/Perfil";
import Soporte from "./pages/Soporte";
import DashboardBusiness from "./pages/DashboardBusiness";
import LoginBusiness from "./pages/LoginCompany";
import RegisterBusiness from "./pages/RegisterEmploee";
import TipoUsuario from "./pages/TipoUsuario";
import WelcomeBusiness from "./pages/WelcomeBusiness";
import SelectProfile from "./pages/SelectProfile";
import EmployeeLogin from "./pages/EmployeeLogin";
import CompanyRegister from "./pages/CompanyRegister";
import PricingScreen from "./pages/PricingScreen"
import DondeReciclar from "./pages/DondeReciclar"; 

function Layout() {
  const location = useLocation();

  // Rutas donde NO se debe mostrar el Navbar
  const noNavbarRoutes = ["/", "/WelcomeScreen", "/login", "/register", "/ModuloInfo", "/soporte"];

   // Rutas donde NO se debe mostrar el Chatbot
  const noChatbotRoutes = ["/", "/login", "/register"];


  return (
    <>
      {/* El Navbar solo aparece si la ruta actual NO está en el array */}
      {!noNavbarRoutes.includes(location.pathname) && <Navbar />}

      {!noChatbotRoutes.includes(location.pathname.toLowerCase()) && <Chatbot />}

      <Routes>
        <Route path="/" element={<TipoUsuario />} />
        <Route path="/welcomescreen" element={<WelcomeScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/moduloinfo" element={<ModuloInfo />} />
        <Route path="/calcu1" element={<Calcu1 />} />
        <Route path="/calculadora" element={<Calculadora />} />
        <Route path="/clasificadoria" element={<ClasificadorIA />} />
        <Route path="/retos" element={<Retos />} />
        <Route path="/soporte" element={<Soporte />} />
        <Route path="/loginbusiness" element={<LoginBusiness />} />
        <Route path="/registerbusiness" element={<RegisterBusiness />} />
        <Route path="/dashboardbusiness" element={<DashboardBusiness />} />
        <Route path="/welcomebusiness" element={<WelcomeBusiness />} />
        <Route path="/selectprofile" element={<SelectProfile />} />
        <Route path="/employee" element={<EmployeeLogin />} />
        <Route path="/companyregister" element={<CompanyRegister />} />
        <Route path="/pricingscreen" element={<PricingScreen />} />
        <Route path="/dondereciclar" element={<DondeReciclar />} />

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