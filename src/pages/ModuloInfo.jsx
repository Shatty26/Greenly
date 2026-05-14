import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// IMÁGENES (ajusta la ruta si están en otra carpeta)
import lupa from "/Modu/lupa.png";
import avionModulo from "/Modu/avionModulo.png";

import mundoModulo from "/Modu/mundoModulo.png";
import focoModulo from "/Modu/focoModulo.png";
import consuModulo from "/Modu/consuModulo.png";
import reciModulo from "/Modu/reciModulo.png";
import huellaModulo from "/Modu/huellaModulo.png";
import flecha from "/Modu/flecha.png";

const ModuloInfo = () => {
  // --- ESTADOS ---
  const [filtro, setFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);

  const navigate = useNavigate();

  // --- BASE DE DATOS ---
  const articulos = [
    {
      titulo: "Compostaje: qué es y cómo hacerlo",
      texto: "Aprende a separar correctamente la basura.",
      subtitulo: "Transforma tus residuos en abono natural",
      categoria: "reciclaje",
      img: "https://images.stockcake.com/public/8/a/3/8a31b965-65e4-4e92-bb8d-9a075ca0bea7_large/composting-organic-waste-stockcake.jpg",
      imgExtra:
        "https://images.stockcake.com/public/8/2/c/82cbf27f-9921-4dfd-a81b-4d799983e633_large/composting-organic-waste-stockcake.jpg",
      contenido: `<h3>¿Qué es el compostaje?</h3><p>El compostaje es un proceso natural en el que microorganismos descomponen residuos orgánicos para convertirlos en compost, un abono rico en nutrientes.</p><h3>🌍 ¿Por qué es importante?</h3><p>Ayuda a reducir residuos en vertederos y disminuye el impacto ambiental del desperdicio de alimentos.</p>`,
      contenidoExtra: `<h3>🌿 Beneficios del compost</h3><p>Mejora el suelo aumentando la retención de agua y aporta nutrientes esenciales.</p><h3>♻️ ¿Cómo se hace?</h3><p>Recolectando residuos orgánicos y manteniendo condiciones de oxígeno y humedad adecuadas.</p>`,
      fuente: "Información adaptada de la FAO (2015).",
    },
    {
      titulo: "Beneficios del reciclaje",
      texto: "Descubre como el reciclaje ayuda a proteger al planeta.",
      subtitulo: "Un respiro para el planeta",
      categoria: "reciclaje",
      img: "https://images.stockcake.com/public/5/9/c/59c5df2a-2fef-4ca1-8200-08186a158e7a_large/recycling-plastic-bottles-stockcake.jpg",
      imgExtra:
        "https://images.stockcake.com/public/d/0/2/d020c946-c313-496b-8231-8edb8cb4ea36_large/recycling-plastic-bottles-stockcake.jpg",
      contenido: `<h3>♻️ Importancia</h3><p>Acción fundamental para reducir el impacto ambiental según el UNEP.</p><h3>🌍 Beneficios</h3><p>Disminuye la contaminación en aire, agua y suelo, protegiendo la biodiversidad.</p>`,
      contenidoExtra: `<h3>🌡️ Cambio climático</h3><p>Reduce emisiones de gases de efecto invernadero al consumir menos energía en producción.</p><h3>🔄 Economía circular</h3><p>Mantiene materiales en uso el mayor tiempo posible.</p>`,
      fuente: "Información adaptada del UNEP (2023).",
    },
    {
      titulo: "Impacto de la basura en el medio ambiente",
      texto: "Cómo los residuos afectan la naturaleza.",
      subtitulo: "El costo de lo que desechamos",
      categoria: "clima",
      img: "https://images.stockcake.com/public/5/9/7/59783855-6471-44c7-899d-fe9a2575b3ce/coastal-pollution-crisis-stockcake.jpg",
      imgExtra:
        "https://images.stockcake.com/public/b/c/e/bce3db95-4820-4796-855c-91cebb81a7a5_large/wetland-pollution-scene-stockcake.jpg",
      contenido: `<h3>🌍 El Problema</h3><p>Los plásticos pueden permanecer siglos en el ambiente acumulando contaminación.</p><h3>🌊 Ecosistemas</h3><p>Desechos en ríos y océanos alteran hábitats y la calidad del agua.</p>`,
      contenidoExtra: `<h3>🐾 Fauna</h3><p>Animales confunden basura con alimento, causando lesiones graves o muerte.</p><h3>⚠️ Microplásticos</h3><p>Fragmentos que entran en la cadena alimentaria afectando a todos los seres vivos.</p>`,
      fuente: "Información adaptada de National Geographic Society.",
    },
    {
      titulo: "Tipos de residuos: orgánicos e inorgánicos",
      texto: "Aprende a diferenciar los residuos correctamente.",
      subtitulo: "La clave para reciclar mejor",
      categoria: "reciclaje",
      img: "https://images.stockcake.com/public/7/4/6/74628cb7-5073-49c5-988b-8559afc79422_large/composting-organic-waste-stockcake.jpg",
      imgExtra:
        "https://images.stockcake.com/public/e/8/6/e86812a4-a969-4d55-a40e-d90d567c4603_large/recycling-at-home-stockcake.jpg",
      contenido: `<h3>🌱 Orgánicos</h3><p>Restos de alimentos y plantas que se descomponen naturalmente.</p><h3>🧴 Inorgánicos</h3><p>Materiales como plásticos, metales y vidrio que tardan mucho en degradarse.</p>`,
      contenidoExtra: `<h3>⚠️ Separación</h3><p>Facilita el reciclaje y evita que materiales aprovechables terminen en vertederos.</p>`,
      fuente: "Información adaptada de la EPA.",
    },
    {
      titulo: "Contaminación por plástico en océanos",
      texto: "Cómo los plásticos afectan la vida marina.",
      subtitulo: "Un problema que llega al mar",
      categoria: "clima",
      img: "https://images.stockcake.com/public/4/b/8/4b8a6533-3437-478d-8c84-60fc546ae452_large/polluted-shoreline-aerial-stockcake.jpg",
      imgExtra:
        "https://images.stockcake.com/public/5/f/a/5fa22743-898a-468d-b307-f9bf6aa58c63_large/beach-pollution-scene-stockcake.jpg",
      contenido: `<h3>🌊 Amenaza Marina</h3><p>El plástico representa una de las mayores amenazas para los ecosistemas marinos.</p>`,
      contenidoExtra: `<h3>🐢 Fauna Afectada</h3><p>Tortugas y peces ingieren plásticos accidentalmente.</p>`,
      fuente: "Información adaptada de Ocean Conservancy.",
    },
    {
      titulo: "El problema de la basura en ciudades",
      texto: "Aumento de residuos urbanos y calidad de vida.",
      subtitulo: "Un desafío urbano creciente",
      categoria: "clima",
      img: "https://images.stockcake.com/public/1/a/4/1a4cab87-1fea-486a-8306-d4e611fe909a_large/overflowing-city-bin-stockcake.jpg",
      imgExtra:
        "https://images.stockcake.com/public/e/6/8/e68ed3a4-469a-482e-973c-f5a8ee08b067_large/urban-waste-problem-stockcake.jpg",
      contenido: `<h3>🏙️ Crecimiento Urbano</h3><p>Muchas ciudades no tienen sistemas para manejar el aumento de basura.</p>`,
      contenidoExtra: `<h3>🚮 Gestión de Residuos</h3><p>Invertir en recolección es clave para ciudades sostenibles.</p>`,
      fuente: "Información adaptada del World Bank.",
    },
    {
      titulo: "Consumo responsable",
      texto: "Decisiones de compra que ayudan al planeta.",
      subtitulo: "Elegir mejor para vivir mejor",
      categoria: "consumo",
      img: "https://images.stockcake.com/public/0/e/1/0e16d059-d09b-4c8a-956b-084bf3df72ec_large/fresh-market-day-stockcake.jpg",
      imgExtra:
        "https://images.stockcake.com/public/b/7/4/b74d4598-7325-4eb4-9d12-e22f72d502cc_large/shopping-spree-crowd-stockcake.jpg",
      contenido: `<h3>🛍️ Concepto</h3><p>Considerar el impacto ambiental y social antes de comprar.</p>`,
      contenidoExtra: `<h3>♻️ Hábitos</h3><p>Elegir productos duraderos y evitar compras innecesarias.</p>`,
      fuente: "Información de las Naciones Unidas (ODS 12).",
    },
    {
      titulo: "Exceso de empaques en el consumo",
      texto: "Impacto ambiental de las envolturas innecesarias.",
      subtitulo: "Más envoltura, más problema",
      categoria: "consumo",
      img: "https://images.stockcake.com/public/5/7/7/57774561-da13-4431-b26b-1eb84fda3fee_large/worker-packaging-boxes-stockcake.jpg",
      imgExtra:
        "https://images.stockcake.com/public/1/6/4/164af59d-d3d4-41fa-b7c6-76ab92e8dcb6_large/warehouse-inventory-restock-stockcake.jpg",
      contenido: `<h3>📦 Residuos de Empaque</h3><p>Gran parte de los desechos urbanos provienen de envolturas innecesarias.</p>`,
      contenidoExtra: `<h3>⚠️ Dificultad de Reciclaje</h3><p>Empaques multimaterial son muy difíciles de procesar.</p>`,
      fuente: "Información adaptada del World Bank.",
    },
    {
      titulo: "Identificar productos sostenibles",
      texto: "Claves para compras responsables.",
      subtitulo: "Elegir con conciencia",
      categoria: "consumo",
      img: "https://images.stockcake.com/public/3/8/1/38191f18-64f6-479d-90c5-63dc3005fc1e_large/eco-friendly-gift-box-stockcake.jpg",
      imgExtra:
        "https://images.stockcake.com/public/d/9/9/d99aefef-9244-4a20-b4f3-391aac1e73a8_large/organic-shelf-display-stockcake.jpg",
      contenido: `<h3>🛍️ Productos Sostenibles</h3><p>Diseñados para durar más y usar menos recursos en su creación.</p>`,
      contenidoExtra: `<h3>🔍 Etiquetas</h3><p>Prestar atención a la durabilidad y facilidad de reciclaje.</p>`,
      fuente: "Información adaptada del UNEP.",
    },
    {
      titulo: "Cómo reducir la basura en casa",
      texto: "Acciones simples para generar menos residuos.",
      subtitulo: "Menos basura, más impacto positivo",
      categoria: "huella",
      img: "https://images.stockcake.com/public/5/6/3/56397ee9-5b17-4ec7-abbf-bf7a77f1f71c_large/composting-vegetable-scraps-stockcake.jpg",
      imgExtra:
        "https://images.stockcake.com/public/9/1/3/913a64fd-6d4a-4d1d-b7e0-46e7a37f5695_large/recycling-project-together-stockcake.jpg",
      contenido: `<h3>🏠 Acciones en el Hogar</h3><p>La mayoría de residuos domésticos pueden evitarse con mejores hábitos.</p>`,
      contenidoExtra: `<h3>🧺 Reutilizar</h3><p>Dar una segunda vida a objetos antes de desecharlos.</p>`,
      fuente: "Información de Zero Waste International Alliance.",
    },
    {
      titulo: "¿Qué es la huella ecológica?",
      texto: "Entiende tu impacto en el planeta.",
      subtitulo: "Tu huella en la Tierra",
      categoria: "huella",
      img: "https://images.stockcake.com/public/4/3/b/43b7f5b8-36f6-47de-8e29-85bd4f526077_large/healing-our-planet-stockcake.jpg",
      imgExtra:
        "https://images.stockcake.com/public/2/e/4/2e47bd59-7376-4ed8-973c-dfec01f636a1_large/hand-holding-plant-stockcake.jpg",
      contenido: `<h3>🌍 Definición</h3><p>Calcula los recursos que consumes vs la capacidad de la Tierra para regenerarlos.</p>`,
      contenidoExtra: `<h3>🌱 Reducción</h3><p>Pequeños cambios en energía y transporte marcan la diferencia.</p>`,
      fuente: "Información de Global Footprint Network.",
    },
    {
      titulo: "Transporte sostenible",
      texto: "Elegir mejor al moverte ayuda al planeta.",
      subtitulo: "Muévete de forma consciente",
      categoria: "huella",
      img: "https://images.stockcake.com/public/0/c/a/0cad9200-19dd-417f-81da-52b8cdc5b24e_large/urban-retirement-adventure-stockcake.jpg",
      imgExtra:
        "https://images.stockcake.com/public/6/4/5/645f8988-82df-45b5-9bca-17392f487fa0_large/mother-child-walk-stockcake.jpg",
      contenido: `<h3>🚶‍♀️ Movilidad</h3><p>Caminar, usar bicicleta o transporte público reduce emisiones.</p>`,
      contenidoExtra: `<h3>🚲 Beneficios</h3><p>Mejora la calidad del aire y reduce la congestión urbana.</p>`,
      fuente: "Información de las Naciones Unidas.",
    },
  ];

  // --- FILTRADO ---
  const articulosFiltrados = useMemo(() => {
    return articulos.filter((a) => {
      const coincideFiltro = filtro === "todos" || a.categoria === filtro;
      const coincideBusqueda =
        a.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        a.texto.toLowerCase().includes(busqueda.toLowerCase());
      return coincideFiltro && coincideBusqueda;
    });
  }, [filtro, busqueda]);

  // --- CATEGORÍAS CON ICONOS ---
  const categorias = [
    { key: "todos", label: "Todos", icon: focoModulo },
    { key: "clima", label: "Clima", icon: mundoModulo },
    { key: "reciclaje", label: "Reciclaje", icon: reciModulo },
    { key: "consumo", label: "Consumo", icon: consuModulo },
    { key: "huella", label: "Huella", icon: huellaModulo },
  ];

return (
  <div className="min-h-screen w-full bg-gradient-to-b from-[#F4FBF4] via-[#EAF7EA] to-[#DDF0DD] px-4 pb-24 pt-9 font-poppins">
    <div className="mx-auto w-full max-w-6xl">

      {/* HEADER + BUSCADOR + CATEGORÍAS */}
      <div>
        {/* TITULO PRINCIPAL */}
        <div className="relative flex items-center justify-center text-center px-10">
          <button
            onClick={() => navigate("/home")}
            className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md hover:bg-green-50 transition"
          >
            <img src={flecha} alt="Volver" className="h-5 w-5" />
          </button>

          <h1 className="text-4xl font-extrabold text-green-900 sm:text-4xl">
            Módulo Educativo
          </h1>
        </div>

        <div className="mt-2 flex justify-center">
          <div className="h-2 w-20 rounded-full bg-gradient-to-r from-green-900 to-green-500 shadow-md" />
        </div>

        {/* BUSCADOR */}
        <div className="mt-6 flex justify-center">
          <div className="flex w-full max-w-xl items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-lg shadow-green-900/10">
            <img src={lupa} alt="Buscar" className="h-6 w-6" />

            <input
              type="text"
              placeholder="Buscar temas..."
              className="w-full bg-transparent text-base text-gray-700 placeholder:text-gray-400 outline-none"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        {/* CATEGORÍAS */}
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {categorias.map((c) => (
            <button
              key={c.key}
              onClick={() => setFiltro(c.key)}
              className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold shadow-md transition-all duration-200
              ${
                filtro === c.key
                  ? "bg-gradient-to-r from-green-900 to-green-600 text-white scale-[1.03]"
                  : "bg-white text-green-800 hover:bg-green-50"
              }`}
            >
              <img src={c.icon} alt={c.label} className="h-5 w-5" />
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* LISTA DE ARTÍCULOS */}
      <div className="mt-5">
        {/* TITULO SECCIÓN */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 shadow-sm">
            <img src={avionModulo} alt="Explorar" className="h-7 w-7" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-green-950">
              Explorar temas
            </h2>
            <p className="text-sm text-gray-500">
              Aprende, actúa y transforma tu impacto
            </p>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {articulosFiltrados.map((a, i) => (
            <div
              key={i}
              onClick={() => {
                setArticuloSeleccionado(a);
                window.scrollTo(0, 0);
              }}
              className="group flex cursor-pointer items-center justify-between gap-4 rounded-3xl bg-white p-6 shadow-xl shadow-green-900/10 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="w-[70%]">
                <h2 className="text-lg font-extrabold text-green-950 leading-tight group-hover:text-green-700 transition">
                  {a.titulo}
                </h2>

                <p className="mt-2 text-sm text-gray-500">{a.texto}</p>

                {/* BOTON APRENDER */}
                <button className="mt-4 rounded-xl bg-gradient-to-r from-green-800 to-green-500 px-6 py-2 text-sm font-bold text-white shadow-md transition hover:scale-105">
                  Aprender
                </button>
              </div>

              <div className="h-[110px] w-[110px] overflow-hidden rounded-2xl bg-gray-100 shadow-md">
                <img
                  src={a.img}
                  alt={a.titulo}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                />
              </div>
            </div>
          ))}
        </div>

        {/* NO HAY RESULTADOS */}
        {articulosFiltrados.length === 0 && (
          <div className="mt-10 text-center text-gray-500">
            No se encontraron resultados.
          </div>
        )}
      </div>
    </div>

    {/* DETALLE DEL ARTÍCULO EN PANTALLA COMPLETA */}
    {articuloSeleccionado && (
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#F4FBF4] via-[#EAF7EA] to-[#DDF0DD] overflow-y-auto px-4 py-8">
        <div className="mx-auto w-full max-w-5xl rounded-3xl bg-white p-6 shadow-2xl shadow-green-900/20 sm:p-10">

          <button
            onClick={() => setArticuloSeleccionado(null)}
            className="mb-6 inline-flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2 text-sm font-bold text-green-800 transition hover:bg-green-100"
          >
            <img src={flecha} alt="Volver" className="h-4 w-4" />
            Volver
          </button>

          <h2 className="text-3xl font-extrabold text-green-950">
            {articuloSeleccionado.titulo}
          </h2>

          <p className="mt-2 text-sm italic text-gray-500">
            {articuloSeleccionado.subtitulo}
          </p>

          {/* IMAGEN PRINCIPAL */}
          <div className="mt-8 overflow-hidden rounded-3xl shadow-lg">
            <img
              src={articuloSeleccionado.img}
              alt="Principal"
              className="h-[260px] w-full object-cover sm:h-[380px]"
            />
          </div>

          {/* CONTENIDO */}
          <div className="mt-8 text-justify text-gray-700 leading-relaxed space-y-4">
            <div
              className="prose max-w-none prose-h3:text-green-950 prose-h3:font-extrabold prose-p:text-gray-600"
              dangerouslySetInnerHTML={{
                __html: articuloSeleccionado.contenido,
              }}
            />
          </div>

          {/* IMAGEN EXTRA */}
          <div className="mt-10 overflow-hidden rounded-3xl shadow-lg">
            <img
              src={articuloSeleccionado.imgExtra}
              alt="Extra"
              className="h-[260px] w-full object-cover sm:h-[380px]"
            />
          </div>

          {/* CONTENIDO EXTRA */}
          <div className="mt-8 text-justify text-gray-700 leading-relaxed space-y-4">
            <div
              className="prose max-w-none prose-h3:text-green-950 prose-h3:font-extrabold prose-p:text-gray-600"
              dangerouslySetInnerHTML={{
                __html: articuloSeleccionado.contenidoExtra,
              }}
            />
          </div>

          {/* FUENTE */}
          <div className="mt-10 border-t pt-5 text-xs text-gray-400">
            {articuloSeleccionado.fuente}
          </div>
        </div>
      </div>
    )}
  </div>
);
};

export default ModuloInfo;