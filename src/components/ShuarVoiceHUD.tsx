import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  RotateCcw, 
  X, 
  Languages, 
  Radio, 
  Headphones,
  CheckCircle2
} from 'lucide-react';
import { shuarVoiceService, ShuarVoiceEntry } from '../utils/shuarVoiceService';

export const ShuarVoiceHUD: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [entry, setEntry] = useState<ShuarVoiceEntry | null>(null);
  const [isGuideModeActive, setIsGuideModeActive] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const unsubscribe = shuarVoiceService.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setEntry(state.entry);
      setIsGuideModeActive(state.isGuideModeActive);
    });
    return () => unsubscribe();
  }, []);

  if (!isGuideModeActive && !isPlaying) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className="bg-slate-950/95 text-white rounded-3xl border-2 border-amber-400 shadow-2xl backdrop-blur-xl p-4 overflow-hidden relative group ring-4 ring-amber-400/20"
      >
        {/* Top Header Row of HUD */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black transition-colors ${
              isPlaying ? 'bg-amber-400 text-slate-950 animate-pulse' : 'bg-slate-800 text-amber-400 border border-slate-700'
            }`}>
              {isPlaying ? <Headphones className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Guía de Voz Shuar Activa</span>
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-black px-1.5 py-0.2 rounded-full">
                  2026 GAD
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium block">
                {isPlaying ? 'Reproduciendo audio en Shuar...' : 'Toca cualquier botón u opción para escuchar'}
              </span>
            </div>
          </div>

          {/* Quick HUD Controls */}
          <div className="flex items-center space-x-1">
            {entry && (
              <button
                type="button"
                onClick={() => shuarVoiceService.speak(entry.key)}
                title="Repetir audio actual"
                className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsMinimized(!isMinimized)}
              title={isMinimized ? "Expandir detalles" : "Minimizar"}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-xs font-bold"
            >
              {isMinimized ? '＋' : '－'}
            </button>

            <button
              type="button"
              onClick={() => shuarVoiceService.setGuideMode(false)}
              title="Desactivar guía de voz Shuar"
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Section (Expandable) */}
        {!isMinimized && (
          <div className="pt-3 space-y-2.5">
            {/* Audio Wave Visualizer Animation */}
            {isPlaying && (
              <div className="flex items-center justify-center space-x-1 py-1 bg-amber-400/10 rounded-xl border border-amber-400/20">
                <span className="text-[10px] font-bold text-amber-300 mr-2 flex items-center space-x-1">
                  <Radio className="w-3 h-3 animate-ping text-amber-400 mr-1" />
                  Voz Shuar:
                </span>
                {[40, 75, 95, 60, 100, 50, 85, 45, 90, 65, 80, 50].map((height, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: isPlaying ? [`${height * 0.25}px`, `${height * 0.25}px`] : '4px' }}
                    transition={{
                      duration: 0.45,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      delay: i * 0.05,
                      ease: 'easeInOut'
                    }}
                    className="w-1 bg-amber-400 rounded-full"
                    style={{ minHeight: '4px', maxHeight: '20px' }}
                  />
                ))}
              </div>
            )}

            {/* Currently Active / Spoken Shuar Text */}
            {entry ? (
              <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-black text-amber-300">
                  <div className="flex items-center space-x-1.5">
                    <Languages className="w-3.5 h-3.5 text-amber-400" />
                    <span>{entry.titleEs}</span>
                  </div>
                  <span className="text-[9.5px] font-mono bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-400/30">
                    Shuar Chicham
                  </span>
                </div>

                {/* Shuar Original */}
                <p className="text-xs font-bold text-white leading-snug">
                  "{entry.shuarText}"
                </p>

                {/* Spanish Explanation */}
                <p className="text-[10.5px] text-slate-300 font-medium leading-tight">
                  <span className="text-amber-400/90 font-bold">Significado: </span>
                  {entry.explanationEs}
                </p>
              </div>
            ) : (
              <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 text-center space-y-1">
                <p className="text-xs font-bold text-slate-200">
                  Toca cualquier botón o tarjeta en la pantalla
                </p>
                <p className="text-[10.5px] text-slate-400">
                  La aplicación reproducirá automáticamente la guía hablada en idioma Shuar para cada opción que elijas.
                </p>
              </div>
            )}

            {/* Bottom Status Bar */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
              <span className="flex items-center space-x-1 text-emerald-400 font-bold">
                <CheckCircle2 className="w-3 h-3" />
                <span>Interculturalidad Activa</span>
              </span>
              <button
                type="button"
                onClick={() => shuarVoiceService.speak('welcome_intro')}
                className="text-amber-400 hover:underline font-bold cursor-pointer"
              >
                ¿Cómo funciona?
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
