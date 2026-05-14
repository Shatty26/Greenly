import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet (esto es necesario aunque uses Tailwind)
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const DondeReciclar = () => {
  const [places] = useState([
    { id: 1, name: 'Vivero Central', address: 'San Salvador, ES', type: 'Vivero', coords: [13.6929, -89.2182] },
    { id: 2, name: 'Vivero Don José', address: 'Santa Ana, ES', type: 'Vivero', coords: [13.9942, -89.5597] },
    { id: 3, name: 'Centro de Reciclaje San Miguel', address: 'San Miguel, ES', type: 'Reciclaje', coords: [13.4833, -88.1833] },
  ]);

  const [activeFilter, setActiveFilter] = useState('Todos');
  const centerElSalvador = [13.7942, -88.8965];

  return (
    <div className="flex flex-col md:flex-row w-full h-screen bg-[#eef8ec] overflow-hidden font-[Poppins]">
      
      {/* PANEL IZQUIERDO */}
      <aside className="w-full md:w-[350px] h-1/2 md:h-full bg-white p-6 overflow-y-auto shadow-xl z-20">
        <h2 className="text-2xl font-bold text-[#005016] mb-5">Lugares cercanos</h2>
        
        {/* FILTROS */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {['Todos', 'Vivero', 'Reciclaje'].map((filter) => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeFilter === filter 
                ? 'bg-[#009329] text-white' 
                : 'bg-[#edf7e4] text-[#009329] hover:bg-[#4e9024] hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* LISTA DE TARJETAS */}
        <div className="space-y-4">
          {places
            .filter(p => activeFilter === 'Todos' || p.type === activeFilter)
            .map((place) => (
              <div key={place.id} className="bg-[#f8fff4] border-2 border-[#cfe6bc] rounded-2xl p-4 hover:-translate-y-1 hover:border-[#4e9024] hover:shadow-lg transition-all cursor-pointer">
                <div className="text-lg font-bold text-[#005016] mb-1">{place.name}</div>
                <div className="text-sm text-[#4e9024] mb-3">{place.address}</div>
                <div className="inline-block bg-[#78bb4d] text-white text-[11px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  {place.type}
                </div>
                <button className="w-full mt-4 bg-[#009329] text-white py-2 rounded-xl font-semibold hover:bg-[#005016] transition-colors">
                  Ver direcciones
                </button>
              </div>
            ))}
        </div>
      </aside>

      {/* SECCIÓN DEL MAPA (DERECHA) */}
      <main className="flex-1 relative h-1/2 md:h-full">
        
        {/* HEADER FLOTANTE (BUSCADOR) */}
        <div className="absolute top-5 left-5 right-5 flex justify-between items-center z-[1000] pointer-events-none">
          <div className="w-[70%] bg-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg border-2 border-[#9bbb4d] pointer-events-auto">
            <i className="fas fa-search text-[#009329]"></i>
            <input 
              type="text" 
              placeholder="Buscar en El Salvador..." 
              className="w-full outline-none text-[#005016] bg-transparent text-sm"
            />
          </div>
          <button className="w-12 h-12 bg-[#009329] text-white rounded-2xl shadow-lg hover:scale-110 transition-transform flex items-center justify-center pointer-events-auto">
            <i className="fas fa-location-arrow text-xl"></i>
          </button>
        </div>

        {/* MAPA */}
        <div className="w-full h-full">
          <MapContainer 
            center={centerElSalvador} 
            zoom={8} 
            className="w-full h-full z-10"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap'
            />
            {places.map((place) => (
              <Marker key={place.id} position={place.coords}>
                <Popup>
                  <div className="text-center font-[Poppins]">
                    <span className="font-bold text-[#005016]">{place.name}</span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </main>

      {/* Estilo inline para arreglar el z-index del popup de Leaflet y scrollbar si no usas plugin */}
      <style>{`
        .leaflet-container { z-index: 10 !important; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default DondeReciclar;