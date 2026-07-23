import React from 'react';
import { Trophy, Award, Sparkles, Flame, Shield, ArrowRight, Zap, Target, Star } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center p-4 overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl w-full text-center space-y-8 py-10">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 via-red-500/20 to-blue-500/20 border border-amber-500/40 rounded-full px-4 py-1.5 backdrop-blur-md shadow-lg shadow-amber-500/10 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
            EL SIMULADOR DEFINITIVO DE BALONCESTO NBA
          </span>
        </div>

        {/* Hero Title */}
        <div className="space-y-3">
          <h1 className="font-display tracking-tight text-5xl sm:text-7xl md:text-8xl font-black uppercase text-white leading-none">
            CONVIÉRTETE EN UNA <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent drop-shadow-lg">
              LEYENDA DE LA NBA
            </span>
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            Crea tu prospecto, supera el NBA Combine, vive la emoción del <span className="text-amber-400 font-semibold">NBA Draft en vivo</span>, toma decisiones que definirán tu legado y persigue los Anillos de Campeón 🏆.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-3xl mx-auto">
          <div className="bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-3">
              <Flame className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="font-bold text-white text-base">Creación & Combine</h3>
            <p className="text-xs text-slate-400 mt-1">Elige biometría, posición y arquetipo. Impresiona a los scouts en las pruebas atléticas.</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-3">
              <Trophy className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="font-bold text-white text-base">Decisiones & Contratos</h3>
            <p className="text-xs text-slate-400 mt-1">Traspasos, ofertas Supermax de $250M, patrocinios con Jordan/Nike y tiros decisivos.</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mb-3">
              <Star className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-bold text-white text-base">Trading Card Panini</h3>
            <p className="text-xs text-slate-400 mt-1">Al retirarte, exporta tu tarjeta digital holográfica de Hall of Fame en alta resolución.</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <button
            onClick={onStart}
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-display font-black text-2xl uppercase tracking-wider px-10 py-5 rounded-2xl shadow-2xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <span>INICIAR MI CARRERA NBA</span>
            <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
