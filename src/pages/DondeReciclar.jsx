import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Componente asistente para controlar la cámara del mapa
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  if (center) {
    map.setView(center, zoom, { animate: true, duration: 1 });
  }
  return null;
};

const DondeReciclar = () => {
  const navigate = useNavigate();
  const [places] = useState([
    { 
      id: 1, 
      name: 'Almacenamiento Todo Verde', 
      address: 'San Antonio Achichilquito, San Vicente', 
      type: 'Reciclaje', 
      coords: [13.6444, -88.7833],
      details: 'Acopiadora. Acepta: Todo tipo, incluyendo equipos electrónicos, baterías ácido plomo, mercurio, computadoras, accesorios, desechos eléctricos con materiales pesados.'
    },
    { 
      id: 2, 
      name: 'Alas Doradas', 
      address: 'Km. 27 1/2 Carretera a Santa Ana', 
      type: 'Reciclaje', 
      coords: [13.8425, -89.3456],
      details: 'Recicladora especializada en Papel. Se enfocan en la transformación de productos de papel y cartón para su reutilización industrial.'
    },
    { 
      id: 3, 
      name: 'Corinca', 
      address: 'Carretera a San Juan Opico, entrada a Quezaltepeque', 
      type: 'Reciclaje', 
      coords: [13.8342, -89.3248],
      details: 'Empresa recicladora e importadora. Tipo de desecho: Acero, aluminio e importación de sustancias peligrosas bajo estrictos estándares de seguridad.'
    },
    { 
      id: 4, 
      name: 'Distribuidora y Recicladora Textil', 
      address: 'Col. Las Flores, Calle José Matías Delgado No 9 Bis, Soyapango', 
      type: 'Reciclaje', 
      coords: [13.7125, -89.1389],
      details: 'Compra y venta de textiles. Especialistas en el manejo de residuos de tela para su aprovechamiento en diversas industrias.'
    },
    { 
      id: 5, 
      name: 'AVANGARD', 
      address: 'Bulevar del Ejército, Km. 7 1/2, Soyapango', 
      type: 'Reciclaje', 
      coords: [13.7082, -89.1432],
      details: 'Planta acopiadora. Especializada en el manejo de Plásticos y otros materiales reciclables.'
    },
    { 
      id: 6, 
      name: 'Central de Reciclaje "Marceya"', 
      address: 'Km. 13 Carretera a Quezaltepeque, desvío Col. Las Margaritas', 
      type: 'Reciclaje', 
      coords: [13.8123, -89.2845],
      details: 'Empresa recicladora que procesa todo tipo de material reciclable.'
    },
    { 
      id: 7, 
      name: 'Chatarrera Méndez', 
      address: 'Puente el Tomayate, carretera Troncal del Norte KM 14 1/2', 
      type: 'Reciclaje', 
      coords: [13.8228, -89.1685],
      details: 'Planta acopiadora encargada del manejo de desechos comunes.'
    },
    { 
      id: 8, 
      name: 'CHONSA PLÁSTICOS INDUSTRIAL', 
      address: 'Carretera a Sonsonate Km. 23 1/2, contiguo a Mercado de Lourdes, Colón', 
      type: 'Reciclaje', 
      coords: [13.7381, -89.3552],
      details: 'Empresa recicladora dedicada exclusivamente al procesamiento de Plástico.'
    },
    {
      id: 9,
      name: 'CONAVE (ex. REPACESA)',
      address: 'Prolongación Alameda Juan Pablo II, Bodegas San Jorge',
      type: 'Reciclaje',
      coords: [13.7075, -89.2130],
      details: 'Planta acopiadora. Materiales: Papel.'
    },
    {
      id: 10,
      name: 'DIPARVEL',
      address: 'Boulevard del Ejército Nacional, Soyapango',
      type: 'Reciclaje',
      coords: [13.7050, -89.1520],
      details: 'Planta acopiadora. Especializada en Baterías ácido plomo usadas.'
    },
    {
      id: 11,
      name: 'El Reciclon',
      address: 'Final Av. Buenos Aires Col. España, Mejicanos',
      type: 'Reciclaje',
      coords: [13.7250, -89.2180],
      details: 'Planta acopiadora. Recolección de desechos comunes.'
    },
    {
      id: 12,
      name: 'FIBERTEX',
      address: 'Calle Nueva y Calle Palmira, Edif. Matex costado sur, Col. Santa Lucía, Ilopango',
      type: 'Reciclaje',
      coords: [13.7020, -89.1210],
      details: 'Recolección y venta de desperdicios textiles.'
    },
    {
      id: 13,
      name: 'FIBRAS RECICLADAS S.A. de C.V.',
      address: 'Colonia América, 10 Avenida Sur Pje. Llerena No 1822',
      type: 'Reciclaje',
      coords: [13.6820, -89.1920],
      details: 'Empresa recicladora. Materiales: Cuero.'
    },
    {
      id: 14,
      name: 'GARBAL S.A. de C.V.',
      address: 'Bulevar Venezuela No 2731, San Salvador',
      type: 'Reciclaje',
      coords: [13.6890, -89.2230],
      details: 'Empresa recicladora. Materiales: PVC Flexible (bolsas, mangueras, inflables, purgas).'
    },
    {
      id: 15,
      name: 'Geocycle El Salvador',
      address: 'Edificio Holcim, Antiguo Cuscatlán',
      type: 'Reciclaje',
      coords: [13.6690, -89.2450],
      details: 'Empresa recicladora. Manejo de aceites, lubricantes y desechos especiales.'
    },
    {
      id: 16,
      name: 'HISPALIA S.A. de C.V.',
      address: 'Calle Troncal del Norte, Km. 9 1/2 Ciudad Delgado',
      type: 'Reciclaje',
      coords: [13.7650, -89.1720],
      details: 'Empresa recicladora. Materiales: Papel y cartón.'
    },
    {
      id: 17,
      name: 'Holcim',
      address: 'Urbanización Madre Selva, Antiguo Cuscatlán',
      type: 'Reciclaje',
      coords: [13.6710, -89.2470],
      details: 'Empresa de cemento y coprocesamiento. Materiales: Llantas usadas, aceite usado y desechos peligrosos.'
    },
    {
      id: 18,
      name: 'IBERPLASTIC',
      address: 'Bulevar Venezuela No 2731, San Salvador',
      type: 'Reciclaje',
      coords: [13.6895, -89.2235],
      details: 'Empresa recicladora. Materiales: Plásticos y aceite usado.'
    },
    {
      id: 19,
      name: 'IMACASA',
      address: 'Final Calle Libertad Parque Industrial Santa Lucía, Santa Ana',
      type: 'Reciclaje',
      coords: [13.9780, -89.5720],
      details: 'Empresa recicladora. Especialistas en el manejo de: Aceites y lubricantes.'
    },
    {
      id: 20,
      name: 'IMPRESSA, S.A.',
      address: 'Km 17.5 carretera a Quezaltepeque, Apopa',
      type: 'Reciclaje',
      coords: [13.7950, -89.2550],
      details: 'Planta acopiadora. Especialistas en Baterías ácido plomo usadas.'
    },
    {
      id: 21,
      name: 'Industrias CAYAGUANCA',
      address: 'Colonia Libertad Av. Bolivar No 222, San Salvador',
      type: 'Reciclaje',
      coords: [13.7150, -89.2050],
      details: 'Planta acopiadora. Acepta todo tipo de materiales.'
    },
    {
      id: 22,
      name: 'INVEMA',
      address: 'Bulevar Venezuela No 2011, Barrio Lourdes, San Salvador',
      type: 'Reciclaje',
      coords: [13.6920, -89.2120],
      details: 'Planta acopiadora. Materiales: Cartón, plásticos y latas.'
    },
    {
      id: 23,
      name: 'INVEMA ZARTEX',
      address: '38 Avenida Sur y Bulevar Venezuela, San Salvador',
      type: 'Reciclaje',
      coords: [13.6915, -89.2115],
      details: 'Planta acopiadora. Manejo de desechos comunes.'
    },
    {
      id: 24,
      name: 'IRCA- Agencia MOYSI-RAMIZ',
      address: 'Bld. Distrito Comercial Central, 11 Avenida Sur No 309, San Salvador',
      type: 'Reciclaje',
      coords: [13.6965, -89.1950],
      details: 'Empresa recicladora (Compra y venta). Materiales: Todo tipo de material reciclable.'
    },
    {
      id: 25,
      name: 'Kimberly Clark',
      address: 'Km. 32 1/2 Carretera a San Juan Opico, La Libertad',
      type: 'Reciclaje',
      coords: [13.8560, -89.3620],
      details: 'Empresa recicladora. Materiales: Papel y cartón.'
    },
    {
      id: 26,
      name: 'LISA SA. De C.V.',
      address: '6a. Calle Oriente Final Avenida San Martín No 4-7, Santa Tecla',
      type: 'Reciclaje',
      coords: [13.6740, -89.2780],
      details: 'Recepción de materiales. Especializados en: Botellas de vidrio.'
    },
    {
      id: 27,
      name: 'Matricería Industrial ROXY',
      address: 'Carretera Troncal del Norte Km. 7 1/2, Ciudad Delgado',
      type: 'Reciclaje',
      coords: [13.7480, -89.1850],
      details: 'Empresa recicladora. Especialidad: Reciclaje de plásticos.'
    },
    {
      id: 28,
      name: 'NECONSA',
      address: 'Carretera Panamericana Km. 13 1/2 No 78, San Martín',
      type: 'Reciclaje',
      coords: [13.7010, -89.0550],
      details: 'Compra y venta de materiales industriales. Materiales: Hierro y chatarra.'
    },
    {
      id: 29,
      name: 'Plásticos EL PANDA, S.A. de C.V.',
      address: 'Calle El Pedregal, Pol. A-1 No 16, Ciudad Merliot',
      type: 'Reciclaje',
      coords: [13.6785, -89.2550],
      details: 'Empresa recicladora especializada en el procesamiento de Plástico.'
    },
    {
      id: 30,
      name: 'R/P reciclaje',
      address: 'Col. Arboledas "z" lote #5, Lourdes, Colón',
      type: 'Reciclaje',
      coords: [13.7310, -89.3680],
      details: 'Planta acopiadora encargada del manejo de desechos comunes.'
    },
    {
      id: 31,
      name: 'Rabo Recycling S.A. de C.V.',
      address: 'Carretera Ruta Militar, Beneficio de Café Col. La Carmenza, San Miguel',
      type: 'Reciclaje',
      coords: [13.4920, -88.1630],
      details: 'Recicladora y venta. Especialistas en: Plástico Pet y derivados.'
    },
    {
      id: 32,
      name: 'Walmart San Miguel',
      address: 'Carretera Ruta Militar, San Miguel, El Salvador',
      type: 'Reciclaje',
      coords: [13.4945, -88.1612],
      details: 'Punto de reciclaje: Acepta todo residuo. Recibe botellas de bebidas, latas de jugos o sodas y cartones corrugados.'
    },
    {
      id: 33,
      name: 'Walmart Soyapango',
      address: 'Bulevar del Ejército Nacional, Soyapango',
      type: 'Reciclaje',
      coords: [13.7095, -89.1410],
      details: 'Punto de reciclaje: Acepta todo residuo. Es ideal para llevar cajas grandes de cartón, botellas plásticas y latas de aluminio limpias.'
    },
    {
      id: 34,
      name: 'Walmart Constitución',
      address: 'Frente a Redondel Schafik Handal, Bulevar Constitución, Mejicanos',
      type: 'Reciclaje',
      coords: [13.7294, -89.2118],
      details: 'Punto de reciclaje: Acepta todo residuo. Reciben activamente botes plásticos de detergente (PEAD), frascos de vidrio vacíos, periódicos y papel de oficina.'
    },
    {
      id: 35,
      name: 'Walmart Escalón',
      address: 'Entre Calle Nueva #1 y Calle Nueva #2, sobre Avenida Manuel Enrique Araujo, Colonia Escalón, San Salvador',
      type: 'Reciclaje',
      coords: [13.7018, -89.2241],
      details: 'Aceptan: Todo residuo. Está optimizada para la entrega rápida de envases PET, aluminio y catálogos o papelería para reciclar.'
    },
    {
      id: 36,
      name: 'Walmart Santa Elena',
      address: 'Bulevar Orden de Malta, Antiguo Cuscatlán, La Libertad',
      type: 'Reciclaje',
      coords: [13.6653, -89.2489],
      details: 'Aceptan: Todo residuo. Facilita a los usuarios el depósito y empaques limpios de cartón.'
    },
    {
      id: 37,
      name: 'La Despensa de Don Juan Antiguo Cuscatlán',
      address: 'Calle Cuscatlán Oriente y Avenida El Espino, Antiguo Cuscatlán, La Libertad',
      type: 'Reciclaje',
      coords: [13.6706, -89.2512],
      details: 'Aceptan: Todo residuo. Recibe Periódicos viejos, cuadernos en desuso, latas de aluminio de bebidas y botellas plásticas (PET) de refrescos bien enjuagados.'
    },
    {
      id: 38,
      name: 'La Despensa de Don Juan Escalón Norte',
      address: '75 Avenida Norte y Prolongación Juan Pablo II, San Salvador',
      type: 'Reciclaje',
      coords: [13.7121, -89.2205],
      details: 'Aceptan: Todo residuo. Reciben activamente botellas plásticas (PET y PEAD), empaques de snacks (multicapa), latas de aluminio, envases de vidrio y cartón corrugados.'
    },
    {
      id: 39,
      name: 'La Despensa de Don Juan La Cima',
      address: 'Calle a Huizúcar y Calle San Nicolás, Urbanización La Cima II, San Salvador',
      type: 'Reciclaje',
      coords: [13.6672, -89.2219],
      details: 'Aceptan: Todo residuo.'
    },
    {
      id: 40,
      name: 'La Despensa de Don Juan Holanda',
      address: 'Paseo General Escalón y Calle Nueva 2, Colonia Escalón, San Salvador',
      type: 'Reciclaje',
      coords: [13.7022, -89.2425],
      details: 'Aceptan: Todo residuo. Estación optimizada para la recolección de envases de vidrio, botellas de plástico, revistas, papel de oficina y empaques laminados de galletas.'
    },
    {
      id: 41,
      name: 'PriceSmart Santa Elena (Área de Parqueo)',
      address: 'Bulevar Orden de Malta y Avenida El Pepeto, Antiguo Cuscatlán, La Libertad',
      type: 'Reciclaje',
      coords: [13.6641, -89.2551],
      details: 'Aceptan: Reciclaje con incentive (Alianza Parque Industrial Verde). Es una estación donde puedes llevar materiales PET, latas de aluminio, cartón y papel. También destacan por recibir chatarra electrónica (cables, celulares viejos) y metales a cambio de un pequeño estímulo económico.'
    },
    {
      id: 42,
      name: 'PriceSmart San Miguel',
      address: 'Carretera Panamericana, junto al Parque Industrial Verde, cerca del desvío de Febles (Quelepa), San Miguel',
      type: 'Reciclaje',
      coords: [13.5042, -88.2033],
      details: 'Aceptan: Todo residuo. Centro de recolección de alta capacidad que recibe plásticos HDPE (botes de leche), PET transparente, aluminio y diversos equipos electrónicos en desuso.'
    },
    {
      id: 43,
      name: 'Texaco Santa Elena',
      address: 'Bulevar Cuscatlán, Nuevo Cuscatlán, La Libertad (Contiguo a Residencial Greenside)',
      type: 'Reciclaje',
      coords: [13.6515, -89.2630],
      details: 'Aceptan: Botellas PET y aluminio. Es un punto de fácil acceso para personas que transitan por la zona de Santa Elena y Nuevo Cuscatlán.'
    },
    {
      id: 44,
      name: 'Metrocentro San Salvador',
      address: 'Bulevar de Los Héroes, San Salvador',
      type: 'Reciclaje',
      coords: [13.7067, -89.2025],
      details: 'Aceptan: Plástico, latas y papel. Cuentan con estaciones de reciclaje identificadas para que los visitantes depositen botellas plásticas y latas de bebidas mientras realizan sus compras.'
    }
  ]);

  const [selectedPlace, setSelectedPlace] = useState(null); 
  
  // Nuevo estado para controlar hacia dónde enfoca la cámara del mapa
  const [mapCenter, setMapCenter] = useState([13.7942, -88.8965]);
  const [mapZoom, setMapZoom] = useState(9);
  
  // Estado para forzar que se abra el popup del marcador seleccionado
  const [openPopupId, setOpenPopupId] = useState(null);

  const handleGoToPlace = (place) => {
    setMapCenter(place.coords);
    setMapZoom(15); // Hace un zoom cercano para ver las calles aledañas
    setOpenPopupId(place.id); // Almacena el ID para gatillar la apertura del popup
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-screen bg-[#eef8ec] overflow-hidden font-[Poppins]">
      
      <aside className="w-full md:w-[380px] h-[60vh] md:h-full bg-white shadow-2xl z-20 overflow-y-auto">
        <div className="p-5">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 cursor-pointer"
            >
              <img
                src="/img/regresar.png"
                alt="Regresar"
                className="w-10 h-10 object-contain"
              />
            </button>
          <h1 className="text-[42px] lg:text-[100px] font-black leading-none text-center mb-3"
          style={{ color: "#005016" }}>
            Donde Reciclar
          </h1>

          <h2 className="text-xl md:text-2xl font-bold text-[#608f45] mb-4">Lugares cercanos</h2>

          <div className="space-y-4">
            {places.map((place) => (
              <div key={place.id} className="bg-[#f8fff4] border-2 border-[#cfe6bc] rounded-2xl p-4 hover:border-[#4e9024] transition-all">
                <div className="text-md font-bold text-[#005016] mb-1">{place.name}</div>
                <div className="text-xs text-[#4e9024] mb-3 leading-tight">{place.address}</div>
                <div className="inline-block bg-[#78bb4d] text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase mb-4">
                  {place.type}
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedPlace(place)}
                    className="flex-1 bg-[#edf7e4] text-[#009329] py-2 rounded-xl font-semibold border border-[#009329] text-[11px] cursor-pointer hover:bg-white transition-colors"
                  >
                    Más info
                  </button>
                  <button 
                    onClick={() => handleGoToPlace(place)}
                    className="flex-1 bg-[#009329] text-white py-2 rounded-xl font-semibold text-[11px] shadow-sm hover:bg-[#005016] active:scale-95 transition-all cursor-pointer"
                  >
                    Ver dirección
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <main className="flex-1 relative h-[40vh] md:h-full">
        {selectedPlace && (
          <div className="absolute inset-0 z-[2000] flex items-end md:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-t-3xl md:rounded-3xl p-6 max-w-sm w-full shadow-2xl border-t-8 border-[#13a147] animate-in slide-in-from-bottom md:zoom-in duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-[#005016]">{selectedPlace.name}</h3>
                <button onClick={() => setSelectedPlace(null)} className="text-gray-400 text-3xl cursor-pointer">&times;</button>
              </div>
              <p className="text-[#4e9024] text-sm mb-6 bg-[#f0f9eb] p-4 rounded-xl">
                {selectedPlace.details}
              </p>
              <button 
                onClick={() => setSelectedPlace(null)}
                className="w-full bg-[#13a147] text-white py-3 rounded-xl font-bold cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        )}

        <div className="w-full h-full">
          <MapContainer center={mapCenter} zoom={mapZoom} className="w-full h-full z-10" zoomControl={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            <ChangeView center={mapCenter} zoom={mapZoom} />

            {places.map((place) => (
              <Marker 
                key={place.id} 
                position={place.coords}
                eventHandlers={{
                  click: () => {
                    setOpenPopupId(place.id);
                  },
                }}
                ref={(markerRef) => {
                  if (markerRef && openPopupId === place.id) {
                    markerRef.openPopup();
                    setOpenPopupId(null); 
                  }
                }}
              >
                <Popup>
                  <div className="p-1 font-[Poppins]">
                    <strong className="text-[#005016] block mb-1">{place.name}</strong>
                    <span className="text-xs text-gray-600">{place.address}</span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </main>

      <style>{`
        .leaflet-container { width: 100%; height: 100%; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default DondeReciclar;