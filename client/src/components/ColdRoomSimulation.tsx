import React, { useState, useMemo, useEffect } from 'react';
import { CONFIG, PIXELS_PER_M, STEPS } from '@/lib/coldRoomConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Play, RotateCcw, DoorOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function ColdRoomSimulation() {
  const [step, setStep] = useState(0);
  const [isExploded, setIsExploded] = useState(false);
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  // Dimensions in pixels
  const dims = useMemo(() => ({
    innerW: Math.round(CONFIG.internal.W * PIXELS_PER_M), // Width (Depth in 3D terms usually, but let's stick to snippet mapping)
    innerH: Math.round(CONFIG.internal.H * PIXELS_PER_M), // Height
    innerL: Math.round(CONFIG.internal.L * PIXELS_PER_M), // Length (Width in screen terms)
    panel: Math.round(CONFIG.panelThickness_m * PIXELS_PER_M),
    doorH: Math.round(CONFIG.doorHeight_m * PIXELS_PER_M),
    doorW: Math.round((CONFIG.internal.L * PIXELS_PER_M) * 0.25) // ~25% of length
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

  // Reset view on step change if needed, or trigger animations
  useEffect(() => {
    if (step === 0) {
      setIsExploded(true);
      setTimeout(() => setIsExploded(false), 1500);
    }
  }, [step]);

  const totalLength = dims.innerL + 2 * dims.panel;
  const totalHeight = dims.innerH + 2 * dims.panel;
  const totalWidth = dims.innerW + 2 * dims.panel; // Depth

  // Face styles helper
  const faceStyle = (w: number, h: number, transform: string, isInner = false) => ({
    width: w,
    height: h,
    transform,
    position: 'absolute' as const,
    border: isInner ? '1px solid rgba(0,0,0,0.06)' : '2px solid rgba(20,40,100,0.20)',
    background: isInner 
      ? 'linear-gradient(180deg,#ffffff,#eef6ff)' 
      : 'linear-gradient(180deg,#dbe8ff,#bdd6ff)',
    boxShadow: isInner ? 'inset 0 1px 0 rgba(255,255,255,0.6)' : '0 6px 20px rgba(10,35,90,0.06)',
    borderRadius: isInner ? '4px' : '6px',
    transition: 'transform 0.9s cubic-bezier(.2,.9,.3,1), opacity 0.5s ease',
    backfaceVisibility: 'hidden' as const,
  });

  // Exploded view modifiers
  const explodeGap = isExploded ? 40 : 0;

  // Step visibility logic (simplified for prototype)
  // 0: Base, 1: Walls, 2: Roof/Floor, 3: Door, 4: Unit, 5: Final
  const showWalls = step >= 1;
  const showRoofFloor = step >= 2;
  const showDoor = step >= 3;

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full max-w-[1000px] mx-auto p-6 bg-card rounded-xl shadow-2xl border border-border/50">
      
      {/* LEFT: 3D Stage */}
      <div className="flex-1 w-full min-h-[500px] bg-gradient-to-b from-secondary to-white rounded-xl border border-white/60 shadow-inner relative overflow-hidden perspective-scene">
        
        <div className="absolute top-4 left-4 z-10">
           <Badge variant="outline" className="bg-white/80 backdrop-blur text-primary border-primary/20">
             Vue 3D interactive
           </Badge>
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
              
              {/* Ceiling (Outer) - Only show if step >= 2 */}
              <div style={{
                 ...faceStyle(totalLength, totalWidth, `rotateX(90deg) translateZ(-${totalHeight / 2 + explodeGap}px)`),
                 opacity: showRoofFloor ? 1 : 0.1
              }} />

              {/* Back Wall */}
              <div style={{
                 ...faceStyle(totalLength, totalHeight, `translateZ(-${totalWidth / 2 + explodeGap}px)`),
                 opacity: showWalls ? 1 : 0.1
              }} />

              {/* Front Wall (Transparent-ish or open to see inside?) -> In the snippet it's a box. 
                  Let's render it but maybe with lower opacity if we want to see inside, 
                  or just render the Back/Left/Right/Top/Bottom. 
                  Snippet renders ALL faces. 
              */}
              <div style={{
                 ...faceStyle(totalLength, totalHeight, `translateZ(${totalWidth / 2 + explodeGap}px)`),
                 opacity: showWalls ? 0.1 : 0, // Keep front transparent to see inside
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
                 {/* We render inner faces to give depth */}
                 <div style={faceStyle(dims.innerL, dims.innerH, `translateZ(-${dims.innerW/2}px)`, true)} /> {/* Back */}
                 <div style={faceStyle(dims.innerW, dims.innerH, `rotateY(-90deg) translateZ(${dims.innerL/2}px)`, true)} /> {/* Left */}
                 <div style={faceStyle(dims.innerW, dims.innerH, `rotateY(90deg) translateZ(${dims.innerL/2}px)`, true)} /> {/* Right */}
                 <div style={faceStyle(dims.innerL, dims.innerW, `rotateX(90deg) translateZ(${dims.innerH/2}px)`, true)} /> {/* Floor */}
                 <div style={faceStyle(dims.innerL, dims.innerW, `rotateX(90deg) translateZ(-${dims.innerH/2}px)`, true)} /> {/* Ceiling */}
              </div>

              {/* DOOR */}
              {showDoor && (
                <div 
                  className="absolute z-20 flex items-center justify-center transition-transform duration-1000 origin-left"
                  style={{
                    width: dims.doorW,
                    height: dims.doorH,
                    // Position: Front face (translateZ width/2), Right side
                    transform: `translateZ(${dims.innerW / 2 + dims.panel + 2}px) translateX(${totalLength/2 - dims.doorW - 40}px) translateY(${totalHeight/2 - dims.doorH - dims.panel}px) ${isDoorOpen ? 'rotateY(-105deg)' : 'rotateY(0deg)'}`,
                    background: 'linear-gradient(180deg,#fff,#f2f8ff)',
                    border: '3px solid rgba(0,0,0,0.08)',
                    borderRadius: '6px',
                    boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
                  }}
                >
                  <span className="text-[10px] font-mono text-slate-500 absolute top-1 left-2">
                    H: {CONFIG.doorHeight_m.toFixed(2)}m
                  </span>
                  <div className="w-2 h-8 rounded-full bg-slate-200 absolute right-2 top-1/2 -translate-y-1/2 shadow-sm" />
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Controls & Info */}
      <div className="w-full lg:w-[320px] flex flex-col gap-4">
        
        {/* Specs Card */}
        <Card className="p-5 shadow-lg border-none bg-white/80 backdrop-blur">
          <h3 className="text-primary font-bold text-base mb-4 flex items-center justify-between">
            Fiche Technique
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </h3>
          
          <div className="space-y-3 text-sm">
            <div className="group">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Dimensions Internes</p>
              <p className="text-slate-800 font-medium bg-slate-50 p-2 rounded border border-slate-100">
                L {CONFIG.internal.L}m × l {CONFIG.internal.W}m × H {CONFIG.internal.H}m
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
               <div>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Volume</p>
                 <p className="text-slate-800 font-semibold">10 m³</p>
               </div>
               <div>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Charge</p>
                 <p className="text-slate-800 font-semibold">250 kg/m²</p>
               </div>
            </div>

            <div>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Température</p>
               <div className="flex items-center gap-2 text-slate-700">
                 <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-bold">+1°C</span>
                 <span>à</span>
                 <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-bold">+10°C</span>
               </div>
            </div>
          </div>

          {/* Live Indicators */}
          <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Épaisseur Panneaux</span>
              <span className="font-mono text-slate-700">80 mm</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Épaisseur Porte</span>
              <span className="font-mono text-slate-700">60 mm</span>
            </div>
          </div>
        </Card>

        {/* Controls Card */}
        <Card className="p-5 shadow-lg border-none bg-white/80 backdrop-blur flex-1 flex flex-col">
          <h3 className="text-primary font-bold text-base mb-2">Contrôles</h3>
          
          <div className="mb-6 bg-slate-50 p-3 rounded-lg border border-slate-100 min-h-[80px] flex items-center">
            <p className="text-sm text-slate-700 leading-relaxed">
              <span className="font-bold text-primary block mb-1">{STEPS[step].label}</span>
              {STEPS[step].description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <Button 
              variant="default" 
              className="w-full"
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Précédent
            </Button>
            <Button 
              variant="default" 
              className="w-full"
              onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
              disabled={step === STEPS.length - 1}
            >
              Suivant <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-auto">
            <Button 
              variant="secondary" 
              size="sm" 
              className="h-auto py-2 flex flex-col gap-1 text-[10px]"
              onClick={() => setIsExploded(!isExploded)}
            >
              {isExploded ? <Minimize2 className="w-4 h-4"/> : <Maximize2 className="w-4 h-4"/>}
              {isExploded ? 'Grouper' : 'Éclater'}
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              className="h-auto py-2 flex flex-col gap-1 text-[10px]"
              onClick={() => setIsDoorOpen(!isDoorOpen)}
              disabled={!showDoor}
            >
              <DoorOpen className="w-4 h-4"/>
              {isDoorOpen ? 'Fermer' : 'Ouvrir'}
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              className={cn("h-auto py-2 flex flex-col gap-1 text-[10px]", autoPlay && "bg-blue-100 text-blue-700 border-blue-200")}
              onClick={() => setAutoPlay(!autoPlay)}
            >
              <Play className="w-4 h-4"/>
              {autoPlay ? 'Stop' : 'Auto'}
            </Button>
          </div>
          
          <Button variant="ghost" size="sm" className="mt-2 text-xs text-slate-400 hover:text-slate-600" onClick={() => {
            setStep(0);
            setIsDoorOpen(false);
            setIsExploded(false);
            setAutoPlay(false);
          }}>
            <RotateCcw className="w-3 h-3 mr-1"/> Réinitialiser la simulation
          </Button>
        </Card>

      </div>
    </div>
  );
}
