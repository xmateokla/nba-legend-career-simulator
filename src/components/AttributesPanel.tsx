import React, { useState } from 'react';
import { Player } from '../types/game';
import { Sparkles, ShieldCheck, Flame, Zap, Award, Star, Dna, Activity, Heart, TrendingUp, Dumbbell, Target, ChevronDown, ChevronUp } from 'lucide-react';

interface AttributesPanelProps {
  player: Player;
}

export const AttributesPanel: React.FC<AttributesPanelProps> = ({ player }) => {
  // Collapsible toggle state (open by default on desktop, collapsible on mobile)
  const [isOpen, setIsOpen] = useState(false);
  const attrs = player.attributes;

  // Sanitize attribute values to integers between 40 and 99
  const clean = (val: number) => Math.min(99, Math.max(40, Math.round(val > 1 ? val : val * 100)));

  const categories = [
    { label: 'Tiro 3P', val: clean(attrs.shooting3P), icon: '🎯', color: 'from-amber-500 to-amber-300' },
    { label: 'Tiro Media Dist.', val: clean(attrs.shootingMid), icon: '🏀', color: 'from-amber-400 to-yellow-200' },
    { label: 'Clavadas/Entradas', val: clean(attrs.finishing), icon: '💥', color: 'from-red-500 to-orange-400' },
    { label: 'Pase & Visión', val: clean(attrs.playmaking), icon: '🧠', color: 'from-blue-500 to-cyan-300' },
    { label: 'Defensa Aro/Perím.', val: clean(attrs.defense), icon: '🛡️', color: 'from-emerald-500 to-teal-300' },
    { label: 'Dominio Rebote', val: clean(attrs.rebounding), icon: '🖐️', color: 'from-cyan-500 to-blue-300' },
    { label: 'Atletismo & Salto', val: clean(attrs.athletic), icon: '⚡', color: 'from-yellow-400 to-amber-200' },
    { label: 'Factor Clutch', val: clean(attrs.clutch), icon: '🔥', color: 'from-orange-500 to-red-400' },
    { label: 'Salud & Durabilidad', val: clean(attrs.durability), icon: '🩺', color: 'from-rose-500 to-pink-300' },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl">
      {/* Panel Header with Collapsible Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left cursor-pointer group"
      >
        <div className="flex items-center gap-2">
          <Dna className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
          <div>
            <h3 className="font-bold text-white text-sm">HABILIDADES & ATRIBUTOS</h3>
            <span className="text-[10px] text-slate-400 font-medium">Toca para {isOpen ? 'contraer ▲' : 'desplegar 9 categorías ▼'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl px-2.5 py-1 text-center">
            <span className="font-display font-black text-lg leading-none">{player.ovr} OVR</span>
          </div>
          <div className="text-slate-400 p-1">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </button>

      {/* Collapsible Content Body */}
      {isOpen && (
        <div className="space-y-4 pt-2 border-t border-slate-800/80 animate-fadeIn">
          {/* Reputation & Marketability Dual Gauge */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-slate-300 flex items-center gap-1 text-[10px]">⭐ Fama Liga</span>
                <span className="text-amber-400 font-display font-black">{player.reputation}</span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full border border-slate-800 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full" style={{ width: `${player.reputation}%` }}></div>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-slate-300 flex items-center gap-1 text-[10px]">📈 Marcas/Sponsors</span>
                <span className="text-emerald-400 font-display font-black">{player.marketability}</span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full border border-slate-800 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-300 h-full rounded-full" style={{ width: `${player.marketability}%` }}></div>
              </div>
            </div>
          </div>

          {/* 9 Attributes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 text-xs">
            {categories.map((c, i) => (
              <div key={i} className="bg-slate-950 border border-slate-800/80 rounded-xl p-2 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 flex items-center gap-1 text-[10px]">
                    <span>{c.icon}</span>
                    <span className="truncate">{c.label}</span>
                  </span>
                  <span className="font-display font-black text-amber-400">{c.val}</span>
                </div>

                <div className="w-full bg-slate-900 h-1.5 rounded-full border border-slate-800 overflow-hidden">
                  <div className={`bg-gradient-to-r ${c.color} h-full rounded-full`} style={{ width: `${c.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Unlocked Badges Directly in Sidebar */}
          {player.unlockedBadges && player.unlockedBadges.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>INSIGNIAS DE ÉLITE DESBLOQUEADAS:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {player.unlockedBadges.map((badge, idx) => (
                  <span key={idx} className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
