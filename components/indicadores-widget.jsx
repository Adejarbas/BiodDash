'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, Thermometer, Gauge, DropletsIcon } from 'lucide-react';

const BiodigestorMonitoring = () => {
  const [temperature, setTemperature] = useState(35);
  const [pressure, setPressure] = useState(1.5);
  const [ph, setPh] = useState(7.0);
  const [showAlert, setShowAlert] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const openCalendly = () => {
    // A função initPopupWidget deve ser chamada para abrir a janela
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/deadvader865'
      });
    }
  };

  // Efeito 1: Simulação dos dados e controle do alerta
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(prev => (prev + 1) % 13);
      
      if (timeElapsed >= 5 && timeElapsed < 10) {
        setTemperature(prev => {
          const newTemp = prev + 1.5;
          if (newTemp > 40) setShowAlert(true);
          return newTemp;
        });
      } else if (timeElapsed >= 10) {
        setTemperature(prev => {
          const newTemp = prev - 1.2;
          if (newTemp < 36) {
            setShowAlert(false);
            return 35;
          }
          return newTemp;
        });
      } else {
        setTemperature(prev => {
          const variation = (Math.random() - 0.5) * 0.5;
          return Math.max(34.5, Math.min(35.5, prev + variation));
        });
      }
      
      setPressure(prev => Math.max(1.3, Math.min(1.7, prev + (Math.random() - 0.5) * 0.1)));
      setPh(prev => Math.max(6.8, Math.min(7.2, prev + (Math.random() - 0.5) * 0.1)));
    }, 2000);

    return () => clearInterval(interval);
  }, [timeElapsed]);

  // Efeito 2: Carregamento do script do Calendly (sempre que o componente for montado)
  useEffect(() => {
    // Adiciona o CSS do Calendly
    const link = document.createElement('link');
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Adiciona o JavaScript do Calendly
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    // Limpeza quando o componente for desmontado
    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
      // O widget de badge não é usado, então não precisa de limpeza extra
    };
  }, []); // Array de dependências vazio para rodar apenas uma vez

  return (
    <div className="fixed bottom-6 right-4 space-y-2 w-72 z-[9999]">
      <div className="space-y-2">
        {/* Temperatura */}
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 transform transition-all hover:scale-105">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className={`w-5 h-5 ${temperature > 40 ? 'text-red-500' : 'text-blue-500'}`} />
              <span className="font-medium">Temperatura</span>
            </div>
            <span className={`font-bold ${temperature > 40 ? 'text-red-500' : 'text-gray-700'}`}>
              {temperature.toFixed(1)}°C
            </span>
          </div>
        </div>

        {/* Pressão */}
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 transform transition-all hover:scale-105">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-green-500" />
              <span className="font-medium">Pressão</span>
            </div>
            <span className="font-bold text-gray-700">
              {pressure.toFixed(2)} bar
            </span>
          </div>
        </div>

        {/* PH */}
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 transform transition-all hover:scale-105">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DropletsIcon className="w-5 h-5 text-purple-500" />
              <span className="font-medium">pH</span>
            </div>
            <span className="font-bold text-gray-700">
              {ph.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Alerta com botão do Calendly integrado */}
        {showAlert && (
          <div className="bg-red-100 rounded-lg shadow-lg border border-red-200 overflow-hidden">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="font-medium text-red-700">
                  Temperatura muito elevada!
                </span>
              </div>
              <button
                onClick={openCalendly}
                className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                Agende agora uma manutenção
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BiodigestorMonitoring;