import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';

const ClasificadorIA = () => {
  const [model, setModel] = useState(null);
  const [webcam, setWebcam] = useState(null);
  const [loading, setLoading] = useState({ active: false, text: "", percent: 0 });
  const [resultado, setResultado] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  const webcamContainerRef = useRef(null);
  const URL_MODEL = "https://teachablemachine.withgoogle.com/models/R-u08slDC/";

  const wasteData = {
    "Plástico": { icon: "fa-bottle-water", tips: ["Separa las botellas de bolsas plásticas.", "Retira etiquetas gruesas.", "Evita envases con químicos.", "Entrega en puntos de acopio."] },
    "Papel": { icon: "fa-note-sticky", tips: ["Sin papel brillante/plastificado.", "Sin cinta adhesiva.", "Desarma las cajas.", "No recicles servilletas sucias."] },
    "Vidrio": { icon: "fa-wine-bottle", tips: ["Retira tapas.", "No mezcles con cerámica.", "Si está roto, protégelo.", "Prioriza reutilizar."] },
    "Metal": { icon: "fa-dice-d6", tips: ["Limpia latas de comida.", "Sin restos de grasa.", "Protege objetos punzantes.", "Retira etiquetas de papel."] },
    "Orgánico": { icon: "fa-leaf", tips: ["Sin sal ni condimentos.", "Sin huesos grandes.", "Mezcla secos con húmedos.", "Vacía recipientes frecuente."] },
    "Electrónicos": { icon: "fa-microchip", tips: ["No basura común.", "Retira baterías.", "Borra info personal.", "Busca centros E-waste."] },
    "Otros": { icon: "fa-ellipsis", tips: ["Busca manejo especial.", "Desechos peligrosos a centros.", "No mezcles por error.", "Repara antes de descartar."] }
  };

  // Cargar FontAwesome dinámicamente para asegurar que los iconos se muestren siempre
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link);
    
    return () => {
      if (webcam) {
        webcam.stop();
      }
    };
  }, [webcam]);

  const showOverlay = (message, isPercent, callback) => {
    setLoading({ active: true, text: message, percent: 0 });
    
    if (isPercent) {
      let currentPercent = 0;
      const interval = setInterval(() => {
        currentPercent += Math.floor(Math.random() * 20) + 5;
        if (currentPercent >= 100) {
          currentPercent = 100;
          clearInterval(interval);
          setTimeout(() => {
            setLoading(prev => ({ ...prev, active: false }));
            if (callback) callback();
          }, 500);
        }
        setLoading(prev => ({ ...prev, percent: currentPercent }));
      }, 100);
    } else {
      setTimeout(() => {
        setLoading(prev => ({ ...prev, active: false }));
        if (callback) callback();
      }, 1500);
    }
  };

  const initCamera = async () => {
    showOverlay("INICIANDO IA", true, async () => {
      try {
        let loadedModel = model;
        if (!loadedModel) {
          loadedModel = await tmImage.load(URL_MODEL + "model.json", URL_MODEL + "metadata.json");
          setModel(loadedModel);
        }

        const newWebcam = new tmImage.Webcam(350, 350, true);
        await newWebcam.setup();
        await newWebcam.play();
        
        setWebcam(newWebcam);
        setCameraActive(true);
        setPhotoPreview(null);
        
        if (webcamContainerRef.current) {
          webcamContainerRef.current.innerHTML = ""; 
          webcamContainerRef.current.appendChild(newWebcam.canvas);
        }

        const loop = () => {
          if (newWebcam && newWebcam.canvas) {
            newWebcam.update();
            requestAnimationFrame(loop);
          }
        };
        requestAnimationFrame(loop);

      } catch (e) {
        console.error("Error detallado:", e);
        if (e.name === "NotAllowedError") {
          alert("Error: No diste permiso para usar la cámara.");
        } else {
          alert("Error de cámara: Asegúrate de que no esté siendo usada por otra app.");
        }
      }
    });
  };

  const capture = async () => {
    if (!webcam || !model) return;

    const canvas = webcam.canvas;
    setPhotoPreview(canvas.toDataURL("image/png"));
    setCameraActive(false);

    showOverlay("ANALIZANDO RESIDUO", false, async () => {
      webcam.stop();
      const prediction = await model.predict(canvas);
      let high = 0, res = "Otros";
      
      prediction.forEach(p => {
        if (p.probability > high) {
          high = p.probability;
          res = p.className;
        }
      });
      setResultado(high > 0.60 ? res : "Otros");
    });
  };

  return (
    <div className="relative min-h-screen bg-[#EEF1E8] flex justify-center px-3 py-4 font-['Poppins'] overflow-x-hidden">
      <style>{`
        .card-glass { background: #ffffff; border-radius: 24px; padding: 28px; border: 1px solid #e2e8f0; flex: 1; min-width: 320px; box-shadow: 0 10px 25px -5px rgba(40, 92, 70, 0.05), 0 8px 10px -6px rgba(40, 92, 70, 0.05); transition: all 0.3s ease; }
        .spinner { width: 45px; height: 45px; border: 4px solid rgba(255,255,255,0.2); border-left-color: #52b788; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .manual-btn { background: #ffffff; border: 1px solid #e2e8f0; padding: 14px; border-radius: 16px; display: flex; align-items: center; gap: 12px; cursor: pointer; transition: all 0.2s ease-in-out; }
        .manual-btn:hover { border-color: #40916c; background: #f4fbf7; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(64, 145, 108, 0.08); }
        .manual-btn.active { border-color: #40916c; background: #e8f5e9; font-weight: 600; box-shadow: 0 4px 12px rgba(64, 145, 108, 0.1); }
        .btn-action { border: none; padding: 14px; border-radius: 16px; font-weight: 600; font-size: 15px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; text-transform: uppercase; letter-spacing: 0.5px; }
        .btn-action:hover { transform: translateY(-1px); filter: brightness(1.05); }
        .back-arrow { display: flex; align-items: center; justify-content: center; width: 42px; height: 42px; border-radius: 50%; background: #f4fbf7; color: #40916c; cursor: pointer; transition: all 0.2s ease; border: 1px solid #e2e8f0; }
        .back-arrow:hover { background: #40916c; color: #ffffff; border-color: #40916c; transform: translateX(-3px); }
        
        /* Ajuste específico para forzar que el canvas de Teachable Machine ocupe el contenedor */
        #webcam-container canvas { width: 100% !important; height: 100% !important; object-fit: cover; border-radius: 18px; }
      `}</style>

      {/* FONDO IMAGEN INTERNO */}
      <div className="absolute inset-0 z-0">
        <img
          src="/fondo.png"
          alt="background"
          className="w-full h-full object-cover opacity-90"
        />
      </div>

      {/* PANEL PRINCIPAL FLOTANTE (z-10 sobre el fondo, estructura unificada como la de Retos) */}
      <div className="relative z-10 w-full max-w-[420px] lg:max-w-[1200px] min-h-screen flex flex-col items-center px-2 md:px-6 pt-2 pb-24">
        
        {/* TARJETA BLANCA DE CONTENIDO PRINCIPAL */}
        <div className="w-full lg:max-w-[1100px] bg-[#F8F8F8] rounded-[28px] overflow-hidden shadow-sm flex flex-col">
          
          {/* HEADER INTEGRADO */}
          <header style={{ background: '#ffffff', padding: '16px 24px', borderBottom: '1px solid #e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div className="back-arrow" onClick={() => window.history.back()} title="Volver atrás">
              <i className="fa-solid fa-arrow-left" style={{ fontSize: '18px' }}></i>
            </div>
            <h1 style={{ color: '#1b4332', fontSize: '22px', fontWeight: '700', margin: 0, textAlign: 'center', flex: 1, marginRight: '42px' }}>
              Greenly <span style={{ color: '#40916c', fontWeight: '400' }}>Clasificador</span>
            </h1>
          </header>

          {/* CUERPO DEL CLASIFICADOR */}
          <div style={{ width: '100%', padding: '30px 24px', display: 'flex', gap: '24px', flexWrap: 'wrap', boxSizing: 'border-box' }}>
            
            {/* PANEL CÁMARA */}
            <div className="card-glass">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', justifyContent: 'center' }}>
                <i className="fa-solid fa-circle" style={{ fontSize: '8px', color: cameraActive ? '#52b788' : '#cbd5e1' }}></i>
                <p style={{ fontSize: '12px', fontWeight: '700', color: '#40916c', margin: 0, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Captura de Residuo</p>
              </div>
              
              <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', background: '#f4fbf7', borderRadius: '20px', overflow: 'hidden', border: '2px dashed #b7e4c7', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.02)' }}>
                {loading.active && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(27, 67, 50, 0.96)', zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#ffffff', padding: '20px', textAlign: 'center' }}>
                    <div className="spinner" style={{ marginBottom: '16px' }}></div>
                    <div style={{ fontSize: '14px', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase', color: '#b7e4c7' }}>{loading.text}</div>
                    {loading.percent > 0 && <div style={{ fontSize: '32px', fontWeight: '700', marginTop: '8px', color: '#ffffff' }}>{loading.percent}%</div>}
                  </div>
                )}
                
                <div id="webcam-container" ref={webcamContainerRef} style={{ width: '100%', height: '100%', display: cameraActive ? 'block' : 'none' }} />
                {photoPreview && <img src={photoPreview} alt="Captura" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' }} />}
                {!cameraActive && !photoPreview && (
                  <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <i className="fa-solid fa-camera-retro" style={{ fontSize: '48px', color: '#b7e4c7' }}></i>
                    <span style={{ color: '#94a3b8', fontSize: '13px' }}>Cámara desactivada</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
                {!cameraActive && !photoPreview && (
                  <button className="btn-action" onClick={initCamera} style={{ background: '#40916c', color: '#ffffff', boxShadow: '0 4px 14px rgba(64, 145, 108, 0.3)' }}>
                    <i className="fa-solid fa-power-off"></i> Activar Cámara
                  </button>
                )}
                {cameraActive && (
                  <button className="btn-action" onClick={capture} style={{ background: '#52b788', color: '#ffffff', boxShadow: '0 4px 14px rgba(82, 183, 136, 0.3)' }}>
                    <i className="fa-solid fa-wand-magic-sparkles"></i> Analizar Ahora
                  </button>
                )}
                {photoPreview && (
                  <button className="btn-action" onClick={initCamera} style={{ background: '#ffffff', color: '#40916c', border: '2px solid #40916c' }}>
                    <i className="fa-solid fa-arrow-rotate-left"></i> Reintentar Captura
                  </button>
                )}
              </div>
            </div>

            {/* PANEL MANUAL Y RESULTADOS */}
            <div className="card-glass">
              <p style={{ fontSize: '12px', fontWeight: '700', color: '#40916c', textAlign: 'center', marginBottom: '20px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Resultado y Selección</p>

              {resultado && (
                <div style={{ background: '#f4fbf7', borderRadius: '20px', padding: '20px', marginBottom: '24px', border: '1px solid #b7e4c7', boxShadow: '0 4px 12px rgba(40, 92, 70, 0.02)' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', borderBottom: '1px solid #e8f5e9', paddingBottom: '12px', marginBottom: '12px' }}>
                    <div style={{ width: '36px', height: '36px', background: '#40916c', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                      <i className={`fa-solid ${wasteData[resultado].icon}`} style={{ fontSize: '16px' }}></i>
                    </div>
                    <h4 style={{ margin: 0, color: '#1b4332', fontSize: '18px', fontWeight: '600' }}>{resultado}</h4>
                  </div>
                  <ul style={{ fontSize: '13px', paddingLeft: '0', marginTop: '0', color: '#2d6a4f', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {wasteData[resultado].tips.map((tip, index) => (
                      <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: '1.4' }}>
                        <i className="fa-solid fa-check" style={{ color: '#52b788', marginTop: '3px', fontSize: '11px' }}></i>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {Object.keys(wasteData).map((cat) => (
                  <div 
                    key={cat} 
                    className={`manual-btn ${resultado === cat ? 'active' : ''}`} 
                    onClick={() => setResultado(cat)} 
                    style={cat === "Otros" ? { gridColumn: 'span 2' } : {}}
                  >
                    <div style={{ width: '32px', height: '32px', background: resultado === cat ? '#ffffff' : '#f4fbf7', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                      <i className={`fa-solid ${wasteData[cat].icon}`} style={{ color: '#40916c', fontSize: '14px' }}></i>
                    </div>
                    <span style={{ fontSize: '13px', color: '#2d6a4f' }}>{cat}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ClasificadorIA;