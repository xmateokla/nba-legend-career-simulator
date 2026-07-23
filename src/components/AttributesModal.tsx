import React from 'react';
import { Player } from '../types/game';
import { Sparkles, ShieldCheck, Flame, Zap, Award, Star, Dna, Activity, Heart, TrendingUp, Dumbbell } from 'lucide-react';

interface AttributesModalProps {
  player: Player;
  onClose: () => void;
}

export const AttributesModal: React.FC<AttributesModalProps> = ({ player, onClose }) => {
  const attrs = player.attributes;

  const attributeList = [
    { label: 'Tiro de 3 Puntos (3P)', val: attrs.shooting3P, icon: '🎯', color: 'bg-amber-500' },
    { label: 'Tiro Media Distancia', val: attrs.shootingMid, icon: '🏀', color: 'bg-amber-400' },
    { label: 'Entradas y Clavadas (Finishing)', val: attrs.finishing, icon: '💥', color: 'bg-red-500' },
    { label: 'Pase y Visión (Playmaking)', val: attrs.playmaking, icon: '🧠', color: 'bg-blue-500' },
    { label: 'Defensa Perimetral e Intimidación', val: attrs.defense, icon: '🛡️', color: 'bg-emerald-500' },
    { label: 'Dominio de Rebote', val: attrs.rebounding, icon: '🖐️', color: 'bg-cyan-500' },
    { label: 'Atletismo, Velocidad y Salto', val: attrs.athletic, icon: '⚡', color: 'bg-yellow-400' },
    { label: 'Factor Clutch / Minutos Finales', val: attrs.clutch, icon: '🔥', color: 'bg-orange-500' },
    { label: 'Durabilidad Física & Salud', val: attrs.durability, icon: '🩺', color: 'bg-rose-500' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-5 sm:p-8 space-y-6 shadow-2xl relative my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Dna className="w-4 h-4" />
            <span>PERFIL FÍSICO, ATRIBUTOS Y FAMA</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Player Profile Headline */}
        <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div>
            <h3 className="font-display font-black text-2xl text-white uppercase">{player.name}</h3>
            <p className="text-xs text-amber-300 font-bold">{player.position} • Potencial Max: {player.potentialMaxOvr} OVR</p>
          </div>
          <div className="bg-amber-500/20 border border-amber-500/40 rounded-2xl px-4 py-2 text-center">
            <div className="text-[10px] text-amber-400 font-bold uppercase">MEDIA (OVR)</div>
            <div className="font-display font-black text-3xl text-amber-400 leading-none">{player.ovr}</div>
          </div>
        </div>

        {/* Reputation & Marketability Meters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Reputation / Fame Meter */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400" />
                <span>REPUTACIÓN & FAMA EN LA LIGA</span>
              </span>
              <span className="font-display font-black text-amber-400">{player.reputation} / 100</span>
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${player.reputation}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-400">Determina el respeto del público, la prensa y el salario en contratos.</p>
          </div>

          {/* Marketability Meter */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>ATRACTIVO COMERCIAL & MARCAS</span>
              </span>
              <span className="font-display font-black text-emerald-400">{player.marketability} / 100</span>
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className="bg-gradient-to-r from-emerald-500 to-emerald-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${player.marketability}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-400">Atrae patrocinios de tenis de firma e ingresos comerciales.</p>
          </div>
        </div>

        {/* Detailed Attributes Skill Bars Grid */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            ATRIBUTOS TÁCTICOS Y BIOMÉTRICOS ({attributeList.length} CATEGORÍAS)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
            {attributeList.map((item, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <span>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </span>
                  <span className="font-display font-black text-white">{item.val}</span>
                </div>

                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`${item.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${item.val}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unlocked Badges */}
        {player.unlockedBadges && player.unlockedBadges.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">INSIGNIAS DE ÉLITE DESBLOQUEADAS</h4>
            <div className="flex flex-wrap gap-2">
              {player.unlockedBadges.map((badge, i) => (
                <span key={i} className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{badge}</span>
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
