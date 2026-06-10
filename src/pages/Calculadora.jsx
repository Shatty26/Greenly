import { Link } from "react-router-dom"
function Calculadora() {
  return (
    <main className="relative min-h-screen bg-white overflow-hidden">

      {/* Forma (mano + rectángulo en una sola imagen) */}
      <img
        src="img/forma.png"
        alt="forma"
        className="
          absolute right-0 bottom-[50px]
          w-[500px] sm:w-[380px] md:w-[480px] lg:w-[650px]
          h-auto
          z-[1]
          pointer-events-none

          translate-y-[-150px]
          md:translate-y-0
        "
      />

      {/* SECCIÓN PRINCIPAL */}
      <section className="relative z-10 max-w-7xl mx-auto px-3 md:px-10 lg:px-16 pt-10 md:pt-16">
        <div className="grid md:grid-cols-2 gap-y-10 md:gap-y-0 gap-x-6 md:gap-x-10 items-start w-full">

          {/* TEXTO */}
          <div className="order-1 pl-2 md:pl-10 mt-4 md:-mt-6">
            <h1 className="leading-none font-black tracking-tight text-left">
              <span className="block text-[53px] sm:text-7xl md:text-7xl"
              style={{ color: "#005016" }}>
                Calculadora de huella
              </span>
              <span className="block text-5xl sm:text-8xl md:text-8xl"
              style={{ color: "#67ba1e" }}>
                de carbono
              </span>
            </h1>
          </div>

        </div>
      </section>

      {/* TARJETA */}
      <section className="relative z-30 px-7 md:px-13 mt-80 sm:mt-24 md:mt-5 lg:mt-10 pb-32">
       <div className="max-w-sm sm:max-w-md md:max-w-lg bg-white rounded-[24px] shadow-xl p-4 sm:p-6 md:p-8 mx-auto lg:ml-40">
          <h2 className="text-xl md:text-3xl font-bold text-green-900">
            Conoce tu impacto
          </h2>

          <p className="mt-3 text-sm md:text-lg text-green-900/80 leading-relaxed">
            Descubre la huella de tus hábitos diarios en el ambiente
          </p>

          <Link
          to="/calcu1"
          className="mt-5 inline-block bg-gradient-to-r from-green-700 to-lime-500 text-white px-6 py-2 rounded-2xl text-base font-semibold shadow-lg hover:scale-105 transition-all">
          Comenzar
          </Link>

        </div>
      </section>

    </main>
  )
}

export default Calculadora