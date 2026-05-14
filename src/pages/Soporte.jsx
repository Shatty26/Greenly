import {
  MessageCircle,
  Lock,
  Users,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export function Soporte() {

  const navigate = useNavigate();

  const abrirWhatsApp = () => {

    const numero = "50370923402";

    const mensaje =
      "Hola, necesito ayuda con Greenly.%0A%0AMi problema es:";

    window.open(
      `https://wa.me/${numero}?text=${mensaje}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-[#F4FBF4] p-6 font-poppins pb-5">

      {/* HEADER */}
      <div className="relative flex items-center mb-3">

        <button
          onClick={() => navigate("/perfil")}
          className="text-green-800 text-2xl absolute left-0"
        >
          ←
        </button>

        <h1 className="w-full text-center text-[23px] font-bold text-green-900">
          Soporte técnico
        </h1>

      </div>

      {/* CARD PRINCIPAL */}
      <div className="w-full bg-green-50/60 py-4 px-6 rounded-2xl border border-green-100 flex flex-col items-center text-center space-y-2 mb-3">

        <img
          src="img/suport.png"
          alt="suporte"
          className="w-60 h-38 object-contain"
        />

        <h2 className="text-[26px] font-bold text-green-800">
          Soporte técnico
        </h2>

        <p className="text-[14px] text-gray-500 leading-tight">
          ¿Tienes algún problema? Estamos aquí para ayudarte
        </p>

      </div>

      {/* TARJETAS */}
      <div className="space-y-3 mb-5">

        <Card
          icon={<MessageCircle className="text-[#2E7D32]" size={22} />}
          title="Atención rápida"
          text="Te responderemos lo antes posible."
        />

        <Card
          icon={<Lock className="text-[#2E7D32]" size={22} />}
          title="Información segura"
          text="Tus mensajes estarán protegidos."
        />

        <Card
          icon={<Users className="text-[#2E7D32]" size={22} />}
          title="Equipo especializado"
          text="Nuestro equipo está listo para ayudarte."
        />

      </div>

      {/* WHATSAPP */}
      <div className="bg-white rounded-[32px] p-5 shadow-lg">

        <div className="flex items-center gap-4 mb-4">

          <div className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-md">
            <MessageCircle className="text-white" size={28} />
          </div>

          <div>

            <h2 className="text-[16px] font-bold text-[#124D18]">
              Contáctanos por WhatsApp
            </h2>

            <p className="text-sm text-[#5B6B5C] mt-1 leading-tight">
              Cuéntanos tu problema y te ayudaremos.
            </p>

          </div>

        </div>

        <button
          onClick={abrirWhatsApp}
          className="w-full bg-[#25D366] hover:bg-[#1ebe5d] transition py-3 rounded-2xl text-white text-base font-bold"
        >
          Abrir WhatsApp
        </button>

      </div>

    </div>
  );
}

/* COMPONENTE TARJETA */
function Card({ icon, title, text }) {
  return (
    <div className="bg-white rounded-3xl p-4 shadow-md flex items-center gap-3">

      <div className="w-12 h-12 rounded-2xl bg-[#E7F7E7] flex items-center justify-center">
        {icon}
      </div>

      <div>
        <h3 className="font-bold text-[#124D18] text-[16px]">
          {title}
        </h3>

        <p className="text-[#5B6B5C] text-[13px]">
          {text}
        </p>
      </div>

    </div>
  );
}

export default Soporte;