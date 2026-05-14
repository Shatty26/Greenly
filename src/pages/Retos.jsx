import React, { useEffect, useState } from "react";

import manomundo from "/ret/manomundo.png";
import manoretos from "/ret/manoretos.png";
import reciverde from "/ret/reciverde.png";

import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

import { db, auth } from "../firebase/config";

// ==========================
// TODOS LOS RETOS
// ==========================

const TODOS_LOS_RETOS = [
  "Apaga los dispositivos electrónicos que no estés usando.",
  "Desconecta cargadores cuando no estén conectados al teléfono.",
  "Usa una botella reutilizable en lugar de comprar plástico.",
  "Evita usar pajillas durante el día.",
  "Camina o usa bicicleta para un trayecto corto.",
  "Toma duchas de menos de 5 minutos.",
  "Reutiliza una hoja de papel para apuntes o borradores.",
  "Recoge al menos 5 pedazos de basura que encuentres.",
  "Usa luz natural durante el día en vez de focos.",
  "Lleva tu propia bolsa reutilizable al comprar algo.",
  "Come una comida sin desperdiciar alimentos.",
  "Riega las plantas usando agua reutilizada.",
  "Evita imprimir documentos innecesarios.",
  "Clasifica basura reciclable y orgánica.",
  "Comparte un consejo ecológico con un amigo.",
  "Reduce el brillo de tu computadora o celular.",
  "Planta una semilla o cuida una planta.",
  "Usa ambos lados de una hoja de papel.",
  "Evita comprar productos con mucho plástico.",
  "Cierra la llave mientras te cepillas los dientes.",
  "Lava tu ropa solo con carga completa.",
  "Reutiliza frascos o recipientes.",
  "Pasa una hora sin aire acondicionado.",
  "Limpia y organiza reutilizando objetos viejos.",
  "Investiga una especie en peligro de extinción.",
  "Cambia bolsas plásticas por bolsas de tela.",
  "Haz un mini reto cero basura durante una comida.",
  "Dona ropa o libros que ya no uses.",
  "Usa transporte público en vez de carro.",
  "Evita usar productos desechables por un día.",
];

// ==========================
// IMÁGENES
// ==========================

const imagenes = [
  manomundo,
  manoretos,
  reciverde,
];

// ==========================
// GENERAR RETOS
// ==========================

const generarRetosDelDia = () => {

  const hoy = new Date();

  const seed =
    hoy.getDate() +
    hoy.getMonth() * 31 +
    hoy.getFullYear();

  const retos = [];

  for (let i = 0; i < 3; i++) {

    const index =
      (seed + i * 7) % TODOS_LOS_RETOS.length;

    retos.push({
      id: i + 1,
      texto: TODOS_LOS_RETOS[index],
      completado: false,
      imagen: imagenes[i % imagenes.length],
    });
  }

  return retos;
};

// ==========================
// COMPONENTE
// ==========================

const Retos = () => {

  const [retos, setRetos] = useState([]);

  const hoy =
    new Date().toISOString().split("T")[0];

  // ==========================
  // CARGAR RETOS
  // ==========================

  useEffect(() => {

    const cargarRetos = async () => {

      try {

        const user = auth.currentUser;

        console.log(user);

        if (!user) return;

        const ref = doc(
          db,
          "retosDiarios",
          user.uid
        );

        const snapshot = await getDoc(ref);

        if (snapshot.exists()) {

          const data = snapshot.data();

          if (data.fecha === hoy) {

            setRetos(data.retos);

          } else {

            const nuevos =
              generarRetosDelDia();

            setRetos(nuevos);

            await setDoc(ref, {
              fecha: hoy,
              retos: nuevos,
            });
          }

        } else {

          const nuevos =
            generarRetosDelDia();

          setRetos(nuevos);

          await setDoc(ref, {
            fecha: hoy,
            retos: nuevos,
          });
        }

      } catch (error) {

        console.log(
          "Error cargando retos:",
          error
        );
      }
    };

    cargarRetos();

  }, []);

  // ==========================
  // COMPLETAR RETO
  // ==========================

  const completarReto = async (id) => {

    try {

      const nuevosRetos = retos.map((reto) =>
        reto.id === id
          ? {
              ...reto,
              completado: !reto.completado,
            }
          : reto
      );

      setRetos(nuevosRetos);

      const user = auth.currentUser;

      if (!user) return;

      await setDoc(
        doc(
          db,
          "retosDiarios",
          user.uid
        ),
        {
          fecha: hoy,
          retos: nuevosRetos,
        }
      );

    } catch (error) {

      console.log(
        "Error guardando reto:",
        error
      );
    }
  };

  // ==========================
  // UI
  // ==========================

  return (
    <div className="relative min-h-screen bg-[#EEF1E8] flex justify-center px-3 py-4 font-['Poppins'] overflow-hidden">

      {/* FONDO */}
      <div className="absolute inset-0 z-0">
        <img
          src="/fondo.png"
          alt="background"
          className="w-full h-full object-cover opacity-90"
        />
      </div>

      {/* CONTENIDO */}
      <div className="relative z-10 w-full max-w-[420px] lg:max-w-[1200px] min-h-screen flex flex-col items-center px-4 md:px-6 pt-2 pb-23">

        {/* CARD PRINCIPAL */}
        <div className="w-full lg:max-w-[1000px] bg-[#F8F8F8] rounded-[28px] overflow-hidden shadow-sm">

          {/* HERO */}
          <div className="grid grid-cols-2 min-h-[140px] lg:min-h-[300px]">

            {/* TEXTO */}
            <div className="flex flex-col justify-center px-5 py-3">

              <h1 className="text-[26px] lg:text-[42px] lg:leading-[46px] font-extrabold text-[#23322B] mt-2">
                Retos ecológicos
              </h1>

              <p className="text-[#6F6F6F] text-sm lg:text-lg mt-4 leading-5">
                Completa retos y ayuda al planeta
              </p>

            </div>

            {/* IMAGEN */}
            <div className="relative bg-[#228B22] rounded-bl-[90px] overflow-hidden flex items-center justify-center">

              <img
                src={manoretos}
                alt="Retos"
                className="absolute bottom-0 right-0 lg:right-[-10px] lg:bottom-[-17px] w-[97%] lg:w-[80%] object-contain z-10"
              />

            </div>
          </div>

          {/* RETOS */}
          <div className="bg-[#ECECEC] px-4 pt-5 pb-6">

            {/* TITULO */}
            <div className="flex justify-between items-center mb-4">

              <h2 className="text-[#2FA63A] text-[26px] font-bold">
                Retos diarios
              </h2>

              <span className="text-[#888] text-sm">
                Hoy
              </span>

            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">

              {retos.map((reto) => (

                <div
                  key={reto.id}
                  className="bg-white rounded-[22px] p-4 shadow-md w-full"
                >

                  <div className="flex gap-3 items-start">

                    {/* IMAGEN */}
                    <img
                      src={reto.imagen}
                      alt="reto"
                      className="w-15 h-25 lg:w-20 lg:h-20 object-contain"
                    />

                    {/* CONTENIDO */}
                    <div className="flex-1">

                      {/* TEXTO + CHECK */}
                      <div className="flex justify-between items-start gap-3">

                        <p className="text-[15px] lg:text-[18px] lg:leading-[24px] font-semibold text-[#2D3A36]">

                          {reto.texto}

                        </p>

                        {/* CHECK */}
                        <button
                          onClick={() =>
                            completarReto(reto.id)
                          }
                          className={`
                            min-w-[38px]
                            h-[38px]
                            flex-shrink-0
                            rounded-full
                            flex
                            items-center
                            justify-center
                            text-white
                            text-lg
                            transition-all
                            duration-300
                            ${
                              reto.completado
                                ? "bg-[#37B24D]"
                                : "bg-[#B7DDA6]"
                            }
                          `}
                        >
                          ✓
                        </button>

                      </div>

                      {/* ESTADO */}
                      <div className="mt-3">

                        <span
                          className={`
                            text-xs
                            font-semibold
                            px-3
                            py-1
                            rounded-full
                            ${
                              reto.completado
                                ? "bg-[#DDF5E1] text-[#2E8B57]"
                                : "bg-[#EEF1E8] text-[#7A7A7A]"
                            }
                          `}
                        >
                          {reto.completado
                            ? "Completado"
                            : "Pendiente"}
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Retos;