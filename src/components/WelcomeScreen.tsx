import React, { useState } from 'react';
import { Sparkles, Trophy, Flame, Play, Shield, Dice5, Star, Award, Zap, ChevronRight, Dna } from 'lucide-react';
import { playAudioEffect } from '../utils/simulator';

interface WelcomeScreenProps {
  onStart: () => void;
  onQuickStart: () => void;
}

const HIGHLIGHT_CARDS = [
  {
    title: '🐍 MAMBA MENTALITY',
    icon: '🐍',
    desc: 'Workout privado a las 4 AM. Eleva tu Factor Clutch a 99.',
    badge: 'LEYENDA MÍTICA',
    color: 'from-amber-500/20 border-amber-500/40 text-amber-300',
  },
  {
    title: '🎯 RANGO CURRY 3P',
    icon: '🎯',
    desc: 'Lanza desde 9 metros. 90+ Tiro de 3 puntos y soltado instantáneo.',
    badge: 'FRANCOTIRADOR',
    color: 'from-purple-500/20 border-purple-500/40 text-purple-300',
  },
  {
    title: '👑 DREAM SHAKE POSTE',
    icon: '👑',
    desc: 'Fintas en el poste bajo con Hakeem Olajuwon.',
    badge: 'MAESTRO DEL POSTE',
    color: 'from-emerald-500/20 border-emerald-500/40 text-emerald-300',
  },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onQuickStart }) => {
  const [activeHighlight, setActiveHighlight] = useState(0);

  const handleStart = () => {
    playAudioEffect('badge');
    onStart();
  };

  const handleQuickStart = () => {
    playAudioEffect('badge');
    onQuickStart();
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center p-3 sm:p-6 relative overflow-hidden">
      
      {/* Background Animated Neon Court Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-slate-950 to-slate-950 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl w-full game-card-panel rounded-3xl p-6 sm:p-12 space-y-8 holographic-edge shadow-2xl relative z-10 my-auto">
        
        {/* Top 2K Broadcast Banner */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-ping"></div>
            <span className="font-display font-black text-xs text-amber-400 uppercase tracking-widest">
              NBA LEGEND • MODULO MI CARRERA 2026
            </span>
          </div>

          <div className="bg-slate-950 border border-slate-800 px-3 py-1 rounded-full text-[10px] text-slate-400 font-bold">
            VERSIÓN 2.5 • GAMING EDITION
          </div>
        </div>

        {/* Hero Title & Tagline */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider gold-glow">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>SIMULADOR PROFESIONAL DE CARRERA & DRAFT NBA</span>
          </div>

          <h1 className="font-display text-5xl sm:text-7xl font-black text-white tracking-tight uppercase leading-none">
            CONSTRUYE TU <span className="gold-gradient-text">LEYENDA EN LA NBA</span>
          </h1>

          <p className="text-xs sm:text-base text-slate-300 leading-relaxed font-medium">
            Crea tu prospecto desde cero, domina las pruebas del Combine en Chicago, entra al Draft entre 30 franquicias y toma decisiones de riesgo que definirán tu camino al Salón de la Fama.
          </p>
        </div>

        {/* GAMER CAROUSEL SHOWCASE CARDS */}
        <div className="space-y-3">
          <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
            INSIGNIAS & EVENTOS MÍTICOS DISPONIBLES EN EL SIMULADOR
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {HIGHLIGHT_CARDS.map((card, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setActiveHighlight(idx)}
                className={`game-card-panel rounded-2xl p-5 border text-left space-y-3 transition-all duration-300 holographic-edge card-hover-effect cursor-pointer ${
                  activeHighlight === idx ? 'border-amber-400 game-card-gold gold-glow scale-105' : 'border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{card.icon}</span>
                  <span className="text-[9px] font-black bg-slate-900 text-amber-400 px-2 py-0.5 rounded border border-slate-800 uppercase">
                    {card.badge}
                  </span>
                </div>

                <h3 className="font-display font-black text-xl text-white uppercase">{card.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main GAMER START CTA Buttons */}
        <div className="pt-2 space-y-3">
          {/* Mode buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {/* Quick Start - THE SIMPLE WAY */}
            <button
              onClick={handleQuickStart}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-white font-display font-black text-lg uppercase px-8 py-4 rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all inline-flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              <span>⚡ MODO RÁPIDO</span>
            </button>

            {/* Full Mode */}
            <button
              onClick={handleStart}
              className="flex-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 text-black font-display font-black text-lg uppercase px-8 py-4 rounded-2xl shadow-xl shadow-amber-500/20 active:scale-95 transition-all inline-flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-black" />
              <span>MODO COMPLETO</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
          <p className="text-center text-xs text-slate-500">Modo Rápido: nombre + posición → directo a jugar.Modo Completo: combina, draft y todas las opciones.</p>
        </div>

      </div>
    </div>
  );
};
