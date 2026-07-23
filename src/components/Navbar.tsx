import React from 'react';
import { Player } from '../types/game';
import { getTeamById } from '../data/nbaTeams';
import { Trophy, Award, DollarSign, Flame, Sparkles, RefreshCw, Home } from 'lucide-react';

interface NavbarProps {
  player: Player | null;
  seasonYear: number;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ player, seasonYear, onReset }) => {
  const currentTeam = player?.currentTeamId ? getTeamById(player.currentTeamId) : null;

  const handleResetConfirm = () => {
    if (window.confirm('¿Quieres reiniciar tu carrera y volver al inicio?')) {
      onReset();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#080C14]/90 backdrop-blur-xl border-b border-slate-800/80 px-3 sm:px-6 py-3 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={onReset}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 flex items-center justify-center font-display text-2xl font-bold text-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            🏀
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display tracking-wider text-2xl font-black bg-gradient-to-r from-amber-400 via-amber-200 to-white bg-clip-text text-transparent">
                NBA LEGEND
              </span>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full">
                BROADCAST 2K
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">Simulador de Carrera & Draft NBA</p>
          </div>
        </div>

        {/* Player Quick Info Bar */}
        {player ? (
          <div className="flex items-center gap-2 sm:gap-4 bg-slate-900/90 border border-slate-800/80 rounded-2xl px-3 sm:px-4 py-1.5 shadow-xl">
            {/* Team & Name */}
            <div className="flex items-center gap-2">
              {currentTeam ? (
                <div className="w-8 h-8 rounded-xl p-1 flex items-center justify-center shadow-md border border-slate-800 bg-slate-950">
                  <img src={currentTeam.logoUrl} alt={currentTeam.name} className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-[10px] text-slate-400">
                  DRAFT
                </div>
              )}

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs sm:text-sm text-white truncate max-w-[100px] sm:max-w-[160px]">{player.name}</span>
                  <span className="text-[10px] text-slate-400">#{player.jerseyNumber}</span>
                </div>
                <div className="text-[10px] text-amber-400 font-medium flex items-center gap-1">
                  <span>{player.position}</span>
                  <span>•</span>
                  <span>{seasonYear}</span>
                </div>
              </div>
            </div>

            {/* OVR Badge */}
            <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/40 rounded-xl px-2.5 py-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <div>
                <div className="font-display font-black text-base sm:text-lg leading-none text-amber-400">{player.ovr}</div>
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleResetConfirm}
              className="text-slate-400 hover:text-red-400 p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
              title="Reiniciar Carrera"
            >
              <Home className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-xs text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
            NUEVO PROSPECTO 🌟
          </div>
        )}

      </div>
    </header>
  );
};
