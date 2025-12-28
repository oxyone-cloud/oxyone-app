import React, { useState, useEffect } from 'react';
import { CONFIG, STEPS } from '@/lib/coldRoomConfig';
import { ThreeJsViewer } from '@/components/ThreeJsViewer';
import { cn } from '@/lib/utils';

export function ColdRoomSimulation() {
  const [step, setStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [currentTemp, setCurrentTemp] = useState(-18.4);
  const [setpointTemp, setSetpointTemp] = useState(4);
  const [humidity, setHumidity] = useState(42);
  const [isRunning, setIsRunning] = useState(true);
  const [hasAlarm, setHasAlarm] = useState(false);

  // Auto-play logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoPlay) {
      interval = setInterval(() => {
        setStep(prev => {
          if (prev >= STEPS.length - 1) {
            setAutoPlay(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [autoPlay]);

  // Simulate temperature cooling when step >= 4
  useEffect(() => {
    if (step >= 4) {
      const interval = setInterval(() => {
        setCurrentTemp(prev => {
          if (prev <= setpointTemp) return setpointTemp;
          return prev - 0.5;
        });
        setIsRunning(true);
      }, 500);
      return () => clearInterval(interval);
    } else {
      setCurrentTemp(-18.4);
      setIsRunning(false);
    }
  }, [step, setpointTemp]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full max-w-7xl mx-auto h-screen lg:h-[600px]">
      
      {/* LEFT: 3D Stage */}
      <div className="flex-1 w-full h-full bg-[#e1e5ea] rounded-xl border border-[#d1d9e6] overflow-hidden shadow-lg">
        <div className="absolute top-4 left-4 z-10 bg-white/90 px-3 py-2 rounded-lg border border-[#ccc] text-xs font-mono">
          <strong>Modèle CR-274</strong><br />
          Dim: 2.74m × 1.83m × 2.00m<br />
          <small className="text-[#666]">Utilisez la souris pour pivoter / zoomer</small>
        </div>
        <ThreeJsViewer step={step} />
      </div>

      {/* RIGHT: Control Panel */}
      <div className="w-full lg:w-[360px] flex flex-col gap-4 h-full lg:h-auto overflow-y-auto">
        
        {/* Header with Title and Status Lights */}
        <div className="neomorph-box p-4 rounded-xl">
          <h1 className="text-[#7f8c8d] font-bold text-sm font-mono uppercase tracking-widest mb-3 text-center border-b border-[#3498db] pb-2">Unité De Contrôle CR-400</h1>
          <div className="flex justify-center gap-6">
            <div className="flex flex-col items-center gap-1">
              <div className={cn("led w-3 h-3 rounded-full transition-all", isRunning ? "bg-[#3498db] shadow-[0_0_6px_rgba(52,149,235,0.6)]" : "bg-[#d1d9e6]")} />
              <span className="text-[#34495e] text-xs font-mono">RUN</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className={cn("led w-3 h-3 rounded-full transition-all", hasAlarm ? "bg-[#ff0000] shadow-[0_0_6px_rgba(255,0,0,0.6)]" : "bg-[#d1d9e6]")} />
              <span className="text-[#34495e] text-xs font-mono">ALARM</span>
            </div>
          </div>
        </div>

        {/* Digital Temperature Display */}
        <div className="screen-bg p-5 rounded-xl flex flex-col items-center">
          <p className="text-xs text-[#34495e] font-mono mb-2 uppercase tracking-wider">Température Intérieure</p>
          <div className="led-display text-5xl font-bold mb-1">{currentTemp.toFixed(1)}°C</div>
          <p className="text-xs text-[#34495e] font-mono">HUMIDITÉ: {humidity}%</p>
        </div>

        {/* Controls Section */}
        <div className="neomorph-box p-4 rounded-xl space-y-4">
          <div>
            <p className="text-[#7f8c8d] text-xs font-mono font-bold uppercase tracking-wider mb-3 text-center">Consigne</p>
            <div className="flex justify-center gap-3 items-center">
              <button 
                className="industrial-btn text-lg w-12 h-12 p-0 rounded-lg font-bold"
                onClick={() => setSetpointTemp(prev => Math.min(10, prev + 1))}
              >
                ▲
              </button>
              <div className="screen-bg px-4 py-2 text-center min-w-24 rounded-lg">
                <div className="led-display text-3xl font-bold">{setpointTemp}°C</div>
              </div>
              <button 
                className="industrial-btn text-lg w-12 h-12 p-0 rounded-lg font-bold"
                onClick={() => setSetpointTemp(prev => Math.max(1, prev - 1))}
              >
                ▼
              </button>
            </div>
          </div>

          <div className="h-px bg-[#d1d9e6]" />

          {/* Step Navigation */}
          <p className="text-[#7f8c8d] text-xs font-mono font-bold uppercase tracking-wider mb-2 text-center">Étape {step + 1}/{STEPS.length}</p>
          <div className="bg-[#f5f7fa] p-3 rounded-lg border border-[#d1d9e6] min-h-16">
            <p className="text-[#34495e] text-[10px] font-mono mb-1 uppercase font-bold">{STEPS[step].label}</p>
            <p className="text-[#34495e] text-[11px] leading-tight">{STEPS[step].description}</p>
          </div>

          {/* Navigation Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button 
              className="industrial-btn rounded-lg text-xs font-bold"
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              ◀ PREV
            </button>
            <button 
              className="industrial-btn rounded-lg text-xs font-bold"
              onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
              disabled={step === STEPS.length - 1}
            >
              NEXT ▶
            </button>
          </div>

          {/* Auto Play and Reset */}
          <div className="grid grid-cols-2 gap-2">
            <button 
              className={cn("industrial-btn rounded-lg text-xs font-bold transition-all", autoPlay && "bg-[#b2dfdb] text-[#264653]")}
              onClick={() => setAutoPlay(!autoPlay)}
              title="Auto-play"
            >
              ▶ AUTO
            </button>
            <button 
              className="industrial-btn rounded-lg text-xs font-bold"
              onClick={() => {
                setStep(0);
                setAutoPlay(false);
                setCurrentTemp(-18.4);
                setSetpointTemp(4);
                setHasAlarm(false);
              }}
            >
              ⟲ RESET
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
