import React, { useState } from 'react';
import { Player, TrophyCase } from '../types/game';
import { getTeamById } from '../data/nbaTeams';
import { Trophy, Star, Award, Zap, ShieldCheck, Heart, Sparkles, ChevronDown, ChevronUp, DollarSign, Flame, Dumbbell } from 'lucide-react';

interface NavbarProps {
  player: Player;
  trophies: TrophyCase;
  currentYear: number;
  onResetGame: () => void;
  onOpenLifestyleStore: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  player,
  trophies,
  currentYear,
  onResetGame,
  onOpenLifestyleStore,
}) => {
  const [showAttributes, setShowAttributes] = useState(false);
  const currentTeam = getTeamById(player.currentTeamId);

  const formatStat = (val: number | undefined) => (val !== undefined ? val : 50);

  return (
    <nav className="game-card-panel border-b border-slate-800 sticky top-0 z-40 px-3 sm:px-6 py-3 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* PLAYER BRAND & LOGO SECTION */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-500 p-0.5 shadow-lg shadow-amber-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-display font-black text-amber-400 text-xl">
                  #{player.jerseyNumber}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.2 rounded-md uppercase border border-black shadow">
                {player.position}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-black text-xl text-white tracking-wide uppercase">
                  {player.name}
                </h1>
                <img src={currentTeam.logoUrl} alt={currentTeam.name} className="w-5 h-5 object-contain" />
              </div>
              <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
                <span>{currentTeam.name}</span>
                <span>•</span>
                <span className="text-amber-400 font-bold">${player.earningsMillions.toFixed(1)}M USD</span>
              </div>
            </div>
          </div>

          {/* OVR RATING BADGE */}
          <div className="bg-slate-950 border border-amber-500/40 rounded-2xl px-3.5 py-1.5 text-center game-card-gold gold-glow">
            <div className="text-[9px] text-amber-400 font-black tracking-widest uppercase">OVR</div>
            <div className="font-display font-black text-2xl gold-gradient-text leading-none">{player.ovr}</div>
          </div>
        </div>

        {/* QUICK ACTION BUTTONS */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          
          {/* Toggle Attributes Dropdown Button */}
          <button
            onClick={() => setShowAttributes(!showAttributes)}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>ATRIBUTOS ({player.ovr})</span>
            {showAttributes ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Open Store */}
          <button
            onClick={onOpenLifestyleStore}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-display font-black text-xs uppercase px-4 py-2 rounded-xl shadow-lg transition-all"
          >
            <DollarSign className="w-4 h-4" />
            <span>TIENDA (${player.earningsMillions.toFixed(1)}M)</span>
          </button>

          {/* Reset Career */}
          <button
            onClick={onResetGame}
            title="Reiniciar Carrera"
            className="bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 font-bold text-xs p-2 rounded-xl transition-all"
          >
            🏠
          </button>
        </div>

      </div>

      {/* DROPDOWN ATTRIBUTES CARD PANEL */}
      {showAttributes && (
        <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-slate-800/80 animate-fadeIn">
          <div className="grid grid-cols-3 sm:grid-cols-9 gap-2 text-center text-xs">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-2">
              <span className="text-[9px] text-slate-400 uppercase font-bold block">Tiro 3P</span>
              <span className="font-bold text-amber-300 text-sm">{formatStat(player.attributes.shooting3P)}</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-2">
              <span className="text-[9px] text-slate-400 uppercase font-bold block">Tiro Mid</span>
              <span className="font-bold text-amber-300 text-sm">{formatStat(player.attributes.shootingMid)}</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-2">
              <span className="text-[9px] text-slate-400 uppercase font-bold block">Finaliz.</span>
              <span className="font-bold text-amber-300 text-sm">{formatStat(player.attributes.finishing)}</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-2">
              <span className="text-[9px] text-slate-400 uppercase font-bold block">Pase</span>
              <span className="font-bold text-amber-300 text-sm">{formatStat(player.attributes.playmaking)}</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-2">
              <span className="text-[9px] text-slate-400 uppercase font-bold block">Defensa</span>
              <span className="font-bold text-amber-300 text-sm">{formatStat(player.attributes.defense)}</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-2">
              <span className="text-[9px] text-slate-400 uppercase font-bold block">Rebote</span>
              <span className="font-bold text-amber-300 text-sm">{formatStat(player.attributes.rebounding)}</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-2">
              <span className="text-[9px] text-slate-400 uppercase font-bold block">Físico</span>
              <span className="font-bold text-amber-300 text-sm">{formatStat(player.attributes.athletic)}</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-2">
              <span className="text-[9px] text-slate-400 uppercase font-bold block">Clutch</span>
              <span className="font-bold text-amber-300 text-sm">{formatStat(player.attributes.clutch)}</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-2">
              <span className="text-[9px] text-slate-400 uppercase font-bold block">Salud</span>
              <span className="font-bold text-emerald-300 text-sm">{formatStat(player.attributes.durability)}</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
