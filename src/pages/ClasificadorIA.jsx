import React, { useState, useEffect, useRef } from 'react';

// tf and tmImage are loaded from CDN scripts in index.html (window.tf, window.tmImage)
/* global tf, tmImage */

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

  // Limpieza al desmontar el componente para liberar la cámara
  useEffect(() => {
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
          // Cargando modelo desde la URL de Teachable Machine
          loadedModel = await tmImage.load(URL_MODEL + "model.json", URL_MODEL + "metadata.json");
          setModel(loadedModel);
        }

        const newWebcam = new tmImage.Webcam(350, 350, true); // width, height, flip
        await newWebcam.setup(); // Aquí es donde suele pedir los permisos
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
    <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Poppins, sans-serif' }}>
      <style>{`
        .card-glass { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border-radius: 30px; padding: 20px; border: 1px solid white; flex: 1; min-width: 300px; }
        .spinner { width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.1); border-left-color: #40916c; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .manual-btn { background: white; border: 1px solid #e2e8f0; padding: 10px; border-radius: 18px; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: 0.2s; }
        .manual-btn:hover { border-color: #40916c; background: #f0f7f4; transform: translateY(-2px); }
      `}</style>

      <header style={{ background: 'white', padding: '20px 0 0', textAlign: 'center' }}>
        <h1 style={{ color: '#40916c', fontSize: '26px', fontWeight: 'bold' }}>Greenly Clasificador</h1>
        <div style={{ height: '5px', background: '#40916c', marginTop: '15px' }}></div>
      </header>

      <div style={{ maxWidth: '1100px', width: '100%', margin: 'auto', padding: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        
        {/* PANEL CÁMARA */}
        <div className="card-glass">
          <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#40916c', textAlign: 'center', marginBottom: '15px', letterSpacing: '1px' }}>CAPTURA DE RESIDUO</p>
          
          <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', background: '#e8f5e9', borderRadius: '20px', overflow: 'hidden', border: '2px solid #b7e4c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {loading.active && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(26, 38, 27, 0.95)', zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <div className="spinner" style={{ marginBottom: '10px' }}></div>
                <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{loading.text}</div>
                {loading.percent > 0 && <div style={{ fontSize: '24px' }}>{loading.percent}%</div>}
              </div>
            )}
            
            <div ref={webcamContainerRef} style={{ width: '100%', height: '100%', display: cameraActive ? 'block' : 'none' }} />
            {photoPreview && <img src={photoPreview} alt="Captura" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' }} />}
            {!cameraActive && !photoPreview && <i className="fa-solid fa-camera" style={{ fontSize: '40px', color: '#b7e4c7' }}></i>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
            {!cameraActive && !photoPreview && (
              <button onClick={initCamera} style={{ background: '#40916c', color: 'white', border: 'none', padding: '12px', borderRadius: '15px', fontWeight: 600, cursor: 'pointer' }}>Activar Cámara</button>
            )}
            {cameraActive && (
              <button onClick={capture} style={{ background: '#ff9f1c', color: 'white', border: 'none', padding: '12px', borderRadius: '15px', fontWeight: 600, cursor: 'pointer' }}>Analizar Ahora</button>
            )}
            {photoPreview && (
              <button onClick={initCamera} style={{ background: '#73a580', color: 'white', border: 'none', padding: '12px', borderRadius: '15px', fontWeight: 600, cursor: 'pointer' }}>Reintentar</button>
            )}
          </div>
        </div>

        {/* PANEL MANUAL Y RESULTADOS */}
        <div className="card-glass">
          <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#40916c', textAlign: 'center', marginBottom: '15px' }}>RESULTADO Y SELECCIÓN</p>

          {resultado && (
            <div style={{ background: 'white', borderRadius: '20px', padding: '15px', marginBottom: '15px', borderLeft: '5px solid #40916c', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <i className={`fa-solid ${wasteData[resultado].icon}`} style={{ color: '#40916c' }}></i>
                <h4 style={{ margin: 0 }}>{resultado}</h4>
              </div>
              <ul style={{ fontSize: '11px', paddingLeft: '15px', marginTop: '10px', color: '#4b5563' }}>
                {wasteData[resultado].tips.map((tip, index) => (
                  <li key={index} style={{ marginBottom: '4px' }}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {Object.keys(wasteData).map((cat) => (
              <div key={cat} className="manual-btn" onClick={() => setResultado(cat)} style={cat === "Otros" ? { gridColumn: 'span 2' } : {}}>
                <div style={{ width: '30px', height: '30px', background: '#ecfdf5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className={`fa-solid ${wasteData[cat].icon}`} style={{ color: '#40916c', fontSize: '14px' }}></i>
                </div>
                <span style={{ fontSize: '12px' }}>{cat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClasificadorIA;