import React from 'react';
import { Player, TrophyCase, SeasonStats } from '../types/game';
import { getTeamById } from '../data/nbaTeams';
import { Trophy, Star, Award, Sparkles, RotateCcw, Share2, Download } from 'lucide-react';
import { playAudioEffect } from '../utils/simulator';

interface TradingCardExportProps {
  player: Player;
  trophyCase: TrophyCase;
  careerStatsHistory: SeasonStats[];
  onRestart: () => void;
}

export const TradingCardExport: React.FC<TradingCardExportProps> = ({
  player,
  trophyCase,
  careerStatsHistory,
  onRestart,
}) => {
  const currentTeam = getTeamById(player.currentTeamId);

  // Total career points calculation
  const totalCareerPoints = trophyCase.totalPoints;
  const totalSeasons = careerStatsHistory.length;
  const avgPpg = totalSeasons > 0 ? (totalCareerPoints / (totalSeasons * 76)).toFixed(1) : '0.0';

  const isHallOfFamer = trophyCase.hallOfFameChance >= 60;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 my-4 text-center space-y-8 animate-fadeIn">
      
      {/* Hall of Fame Banner */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider gold-glow">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>CARTA OFICIAL DE RETIRO NBA • HALL OF FAME CLASS</span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl font-black text-white uppercase tracking-tight">
          {isHallOfFamer ? '🏛️ INDUCTEE AL SALÓN DE LA FAMA' : '📜 FIN DE CARRERA PROFESIONAL'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Resumen definitivo del legado deportivo, trofeos acumulados y estadísticas de por vida de {player.name}.
        </p>
      </div>

      {/* 3D HOLOGRAPHIC TRADING CARD */}
      <div className="max-w-sm mx-auto game-card-gold rounded-3xl p-6 border-2 border-amber-400/80 holographic-edge gold-glow shadow-2xl space-y-5 text-left relative overflow-hidden">
        
        {/* Top Card Badge */}
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
          <div className="flex items-center gap-2">
            <img src={currentTeam.logoUrl} alt={currentTeam.name} className="w-7 h-7 object-contain" />
            <span className="font-display font-black text-lg text-white uppercase">{currentTeam.name}</span>
          </div>

          <div className="bg-amber-500 text-black font-display font-black text-xl px-2.5 py-0.5 rounded-lg shadow">
            {player.ovr} OVR
          </div>
        </div>

        {/* Player Name & Info */}
        <div className="space-y-1">
          <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">#{player.jerseyNumber} • {player.position}</div>
          <h2 className="font-display font-black text-3xl text-white uppercase leading-none">{player.name}</h2>
          <div className="text-xs text-slate-300">{player.college} • {player.country}</div>
        </div>

        {/* Career Stat Line Box */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-[9px] text-slate-400 font-bold uppercase">PUNTOS TOTALES</div>
            <div className="font-display font-black text-xl text-amber-400">{totalCareerPoints.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-[9px] text-slate-400 font-bold uppercase">TEMPORADAS</div>
            <div className="font-display font-black text-xl text-cyan-400">{totalSeasons}</div>
          </div>
          <div>
            <div className="text-[9px] text-slate-400 font-bold uppercase">ANILLOS</div>
            <div className="font-display font-black text-xl text-emerald-400">{trophyCase.championships} 💍</div>
          </div>
        </div>

        {/* Major Trophies List */}
        <div className="space-y-1.5 text-xs font-semibold text-slate-200">
          {trophyCase.regularMvp > 0 && <div className="flex justify-between"><span>🏆 MVP de Temporada:</span><span className="text-amber-400 font-bold">{trophyCase.regularMvp}x</span></div>}
          {trophyCase.finalsMvp > 0 && <div className="flex justify-between"><span>🏆 MVP de las Finales:</span><span className="text-amber-400 font-bold">{trophyCase.finalsMvp}x</span></div>}
          {trophyCase.allStarSelections > 0 && <div className="flex justify-between"><span>🌟 Selecciones All-Star:</span><span className="text-purple-300 font-bold">{trophyCase.allStarSelections}x</span></div>}
          {trophyCase.olympicGoldMedals > 0 && <div className="flex justify-between"><span>🥇 Medallas de Oro:</span><span className="text-amber-300 font-bold">{trophyCase.olympicGoldMedals}x</span></div>}
        </div>

        {/* Hall of Fame Stamp */}
        <div className="pt-2 border-t border-amber-500/30 text-center">
          <div className="text-[10px] text-amber-400 font-black tracking-widest uppercase">
            {isHallOfFamer ? '⭐ OFICIALMENTE EN EL SALÓN DE LA FAMA ⭐' : 'CARRERA CONCLUIDA'}
          </div>
        </div>

      </div>

      {/* Restart Game Button */}
      <div className="pt-4">
        <button
          onClick={onRestart}
          className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 text-black font-display font-black text-xl uppercase tracking-wider px-10 py-4 rounded-2xl shadow-xl shadow-amber-500/20 active:scale-95 transition-all inline-flex items-center gap-2 gold-glow"
        >
          <RotateCcw className="w-5 h-5 text-black" />
          <span>INICIAR UNA NUEVA CARRERA LEGENDARIA 🏀</span>
        </button>
      </div>

    </div>
  );
};
