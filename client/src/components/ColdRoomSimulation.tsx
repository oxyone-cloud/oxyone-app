import React, { useState, useMemo, useEffect } from 'react';
import { CONFIG, PIXELS_PER_M, STEPS } from '@/lib/coldRoomConfig';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Play, RotateCcw, DoorOpen, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ColdRoomSimulation() {
  const [step, setStep] = useState(0);
  const [isExploded, setIsExploded] = useState(false);
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [currentTemp, setCurrentTemp] = useState(25);

  // Dimensions in pixels
  const dims = useMemo(() => ({
    innerW: Math.round(CONFIG.internal.W * PIXELS_PER_M),
    innerH: Math.round(CONFIG.internal.H * PIXELS_PER_M),
    innerL: Math.round(CONFIG.internal.L * PIXELS_PER_M),
    panel: Math.round(CONFIG.panelThickness_m * PIXELS_PER_M),
    doorH: Math.round(CONFIG.doorHeight_m * PIXELS_PER_M),
    doorW: Math.round((CONFIG.internal.L * PIXELS_PER_M) * 0.25)
  }), []);

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
          if (prev <= 4) return 4;
          return prev - 1;
        });
      }, 500);
      return () => clearInterval(interval);
    } else {
      setCurrentTemp(25);
    }
  }, [step]);

  // Reset view on step change if needed, or trigger animations
  useEffect(() => {
    if (step === 0) {
      setIsExploded(true);
      setTimeout(() => setIsExploded(false), 1500);
    }
  }, [step]);

  const totalLength = dims.innerL + 2 * dims.panel;
  const totalHeight = dims.innerH + 2 * dims.panel;
  const totalWidth = dims.innerW + 2 * dims.panel;

  // Face styles helper - Dark metallic look
  const faceStyle = (w: number, h: number, transform: string, isInner = false) => ({
    width: w,
    height: h,
    transform,
    position: 'absolute' as const,
    border: isInner ? '1px solid rgba(0,255,65,0.1)' : '2px solid rgba(0,255,65,0.15)',
    background: isInner 
      ? 'linear-gradient(180deg,#1a1d1a,#0f1410)' 
      : 'linear-gradient(180deg,#2a2a2a,#1a1a1a)',
    boxShadow: isInner ? 'inset 0 2px 5px rgba(0,255,65,0.05)' : '0 6px 20px rgba(0,0,0,0.8), 0 0 20px rgba(0,255,65,0.1)',
    borderRadius: isInner ? '4px' : '6px',
    transition: 'transform 0.9s cubic-bezier(.2,.9,.3,1), opacity 0.5s ease',
    backfaceVisibility: 'hidden' as const,
  });

  const explodeGap = isExploded ? 40 : 0;

  const showWalls = step >= 1;
  const showRoofFloor = step >= 2;
  const showDoor = step >= 3;
  const isCooling = step >= 4;

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full max-w-[1100px] mx-auto p-6 bg-[#34495e] rounded-lg shadow-2xl border-4 border-[#7f8c8d]"
      style={{boxShadow: 'inset 2px 2px 5px rgba(255,255,255,0.1), 10px 10px 30px rgba(0,0,0,0.5)'}}>
      
      {/* LEFT: 3D Stage */}
      <div className="flex-1 w-full min-h-[520px] screen-bg rounded-lg border-4 border-[#222] relative overflow-hidden perspective-scene">
        
        <div className="absolute top-4 left-4 z-10">
           <div className="px-3 py-1 rounded bg-[#1a1d1a] border border-[#00ff41] text-[#00ff41] text-xs font-mono font-bold">
             3D VIEW
           </div>
        </div>

        {/* SCENE CONTAINER */}
        <div 
          className="w-full h-full relative preserve-3d transition-transform duration-1000 ease-in-out"
          style={{ 
            transform: 'rotateX(10deg) rotateY(-25deg) translateZ(0) scale(0.85)',
            transformOrigin: 'center center'
          }}
        >
          {/* CENTER POINT */}
          <div className="absolute top-1/2 left-1/2 preserve-3d" style={{ transform: 'translate(-50%, -50%)' }}>
            
            {/* OUTER SHELL (Structure) */}
            <div className={cn("relative preserve-3d transition-all duration-1000", isExploded ? "scale-95" : "")}>
              
              {/* Floor (Outer) */}
              <div style={faceStyle(totalLength, totalWidth, `rotateX(90deg) translateZ(${totalHeight / 2 + explodeGap}px)`)} />
              
              {/* Ceiling (Outer) */}
              <div style={{
                 ...faceStyle(totalLength, totalWidth, `rotateX(90deg) translateZ(-${totalHeight / 2 + explodeGap}px)`),
                 opacity: showRoofFloor ? 1 : 0.1
              }} />

              {/* Back Wall */}
              <div style={{
                 ...faceStyle(totalLength, totalHeight, `translateZ(-${totalWidth / 2 + explodeGap}px)`),
                 opacity: showWalls ? 1 : 0.1
              }} />

              {/* Front Wall */}
              <div style={{
                 ...faceStyle(totalLength, totalHeight, `translateZ(${totalWidth / 2 + explodeGap}px)`),
                 opacity: showWalls ? 0.1 : 0,
                 pointerEvents: 'none'
              }} />

              {/* Left Wall */}
              <div style={{
                 ...faceStyle(totalWidth, totalHeight, `rotateY(-90deg) translateZ(${totalLength / 2 + explodeGap}px)`),
                 opacity: showWalls ? 1 : 0.1
              }} />

              {/* Right Wall */}
              <div style={{
                 ...faceStyle(totalWidth, totalHeight, `rotateY(90deg) translateZ(${totalLength / 2 + explodeGap}px)`),
                 opacity: showWalls ? 1 : 0.1
              }} />

              {/* INNER BOX (Internal Dimensions) */}
              <div className="preserve-3d" style={{ transform: isExploded ? 'translateY(-20px)' : 'none', transition: 'transform 1s' }}>
                 <div style={faceStyle(dims.innerL, dims.innerH, `translateZ(-${dims.innerW/2}px)`, true)} />
                 <div style={faceStyle(dims.innerW, dims.innerH, `rotateY(-90deg) translateZ(${dims.innerL/2}px)`, true)} />
                 <div style={faceStyle(dims.innerW, dims.innerH, `rotateY(90deg) translateZ(${dims.innerL/2}px)`, true)} />
                 <div style={faceStyle(dims.innerL, dims.innerW, `rotateX(90deg) translateZ(${dims.innerH/2}px)`, true)} />
                 <div style={faceStyle(dims.innerL, dims.innerW, `rotateX(90deg) translateZ(-${dims.innerH/2}px)`, true)} />
              </div>

              {/* DOOR */}
              {showDoor && (
                <div 
                  className="absolute z-20 flex items-center justify-center transition-transform duration-1000 origin-left"
                  style={{
                    width: dims.doorW,
                    height: dims.doorH,
                    transform: `translateZ(${dims.innerW / 2 + dims.panel + 2}px) translateX(${totalLength/2 - dims.doorW - 40}px) translateY(${totalHeight/2 - dims.doorH - dims.panel}px) ${isDoorOpen ? 'rotateY(-105deg)' : 'rotateY(0deg)'}`,
                    background: 'linear-gradient(180deg,#2a2a2a,#1a1a1a)',
                    border: '3px solid rgba(0,255,65,0.2)',
                    borderRadius: '6px',
                    boxShadow: '2px 0 15px rgba(0,255,65,0.2)'
                  }}
                >
                  <span className="text-[10px] font-mono text-[#00ff41] absolute top-1 left-2">
                    H: {CONFIG.doorHeight_m.toFixed(2)}m
                  </span>
                  <div className="w-2 h-8 rounded-full bg-[#00ff41] absolute right-2 top-1/2 -translate-y-1/2 shadow-md" style={{boxShadow: '0 0 8px #00ff41'}} />
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Industrial Control Panel */}
      <div className="w-full lg:w-[340px] flex flex-col gap-4">
        
        {/* Digital Temperature Display */}
        <div className="screen-bg p-5 rounded-lg flex flex-col items-center border-2 border-[#222]">
          <p className="text-xs text-[#7f8c8d] font-mono mb-3 uppercase tracking-wider">Temperature</p>
          <div className="led-display text-6xl font-bold mb-2">{currentTemp.toFixed(0)}°C</div>
          <p className="text-xs text-[#7f8c8d] font-mono">
            {isCooling ? 'COOLING...' : 'STANDBY'}
          </p>
          <div className="flex gap-2 mt-4 w-full">
            <div className="flex-1 flex flex-col items-center">
              <div className={cn("led mb-2", isCooling && "on")} />
              <span className="text-[10px] text-[#7f8c8d] font-mono">POWER</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className={cn("led mb-2", isCooling && "on")} />
              <span className="text-[10px] text-[#7f8c8d] font-mono">COOL</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className={cn("led mb-2", isDoorOpen && "on")} style={{backgroundColor: isDoorOpen ? '#ff0000' : '#333'}} />
              <span className="text-[10px] text-[#7f8c8d] font-mono">DOOR</span>
            </div>
          </div>
        </div>

        {/* Specs Panel */}
        <div className="bg-[#34495e] p-5 rounded-lg border-2 border-[#7f8c8d] shadow-inner" style={{boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.3)'}}>
          <h3 className="text-[#00ff41] font-bold text-base mb-3 font-mono uppercase tracking-wider">SPECIFICATIONS</h3>
          
          <div className="space-y-2 text-[#ecf0f1] text-sm font-mono">
            <div className="flex justify-between text-xs">
              <span className="text-[#7f8c8d]">INT. DIMENSIONS</span>
              <span className="text-[#00ff41]">L{CONFIG.internal.L}m × W{CONFIG.internal.W}m × H{CONFIG.internal.H}m</span>
            </div>
            <div className="h-px bg-[#7f8c8d] opacity-30" />
            <div className="flex justify-between text-xs">
              <span className="text-[#7f8c8d]">VOLUME</span>
              <span className="text-[#00ff41]">10 M³</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#7f8c8d]">CHARGE LIMIT</span>
              <span className="text-[#00ff41]">250 KG/M²</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#7f8c8d]">TARGET TEMP.</span>
              <span className="text-[#00ff41]">+1°C TO +10°C</span>
            </div>
            <div className="h-px bg-[#7f8c8d] opacity-30" />
            <div className="flex justify-between text-xs">
              <span className="text-[#7f8c8d]">PANEL THK.</span>
              <span className="text-[#00ff41]">80 MM</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#7f8c8d]">DOOR THK.</span>
              <span className="text-[#00ff41]">60 MM</span>
            </div>
          </div>
        </div>

        {/* Step Info */}
        <div className="bg-[#2a2a2a] p-4 rounded-lg border-2 border-[#7f8c8d] min-h-[90px] flex flex-col">
          <p className="text-[#00ff41] text-xs font-mono font-bold mb-2 uppercase">STEP {step + 1} / {STEPS.length}</p>
          <p className="text-[#ecf0f1] text-xs leading-relaxed">
            <span className="text-[#00ff41] font-mono block mb-1 text-[10px]">{STEPS[step].label}</span>
            <span className="text-[#bdc3c7] text-[11px]">{STEPS[step].description}</span>
          </p>
        </div>

        {/* Industrial Buttons */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button 
              className="industrial-btn w-full text-sm"
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              ◀ PREV
            </button>
            <button 
              className="industrial-btn w-full text-sm"
              onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
              disabled={step === STEPS.length - 1}
            >
              NEXT ▶
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button 
              className={cn("industrial-btn text-xs flex-1", isExploded && "bg-[#00ff41] text-black")}
              onClick={() => setIsExploded(!isExploded)}
            >
              {isExploded ? '⊟' : '⊞'}
            </button>
            <button 
              className={cn("industrial-btn text-xs flex-1", isDoorOpen && "bg-[#ff0000] text-white")}
              onClick={() => setIsDoorOpen(!isDoorOpen)}
              disabled={!showDoor}
            >
              🚪
            </button>
            <button 
              className={cn("industrial-btn text-xs flex-1", autoPlay && "bg-[#00ff41] text-black")}
              onClick={() => setAutoPlay(!autoPlay)}
            >
              ▶
            </button>
          </div>

          <button 
            className="industrial-btn w-full text-xs text-red-700"
            onClick={() => {
              setStep(0);
              setIsDoorOpen(false);
              setIsExploded(false);
              setAutoPlay(false);
              setCurrentTemp(25);
            }}
          >
            ⟲ RESET
          </button>
        </div>

      </div>
    </div>
  );
}
