import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import { Player, TrophyCase, SeasonStats } from '../types/game';
import { getTeamById } from '../data/nbaTeams';
import { Trophy, Award, Star, Download, Sparkles, Flame, Shield } from 'lucide-react';

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
  const cardRef = useRef<HTMLDivElement>(null);
  const currentTeam = getTeamById(player.currentTeamId);

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `${player.name.replace(/\s+/g, '_')}_NBA_Legend_Card.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error downloading card image:', err);
    }
  };

  const isHof = trophyCase.hallOfFameChance >= 65 || trophyCase.regularMvp > 0 || trophyCase.championships >= 2;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 my-8 space-y-8 text-center">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase px-4 py-1.5 rounded-full">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>TARJETA DIGITAL DE COLECCIÓN DE LA NBA</span>
        </div>
        <h2 className="font-display text-4xl sm:text-6xl font-black text-white uppercase">
          LEGADO INMORTAL DE CARRERA
        </h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Tu carrera en la NBA ha finalizado. Exporta tu tarjeta holográfica tipo Panini Prizm para guardar y compartir tu historia.
        </p>
      </div>

      {/* PANINI PRIZM STYLE CARD */}
      <div className="flex justify-center py-4">
        <div
          ref={cardRef}
          className="w-full max-w-sm bg-slate-950 rounded-3xl p-6 border-4 shadow-2xl relative overflow-hidden text-left space-y-5"
          style={{
            borderColor: currentTeam.primaryColor,
            backgroundImage: `radial-gradient(circle at top right, ${currentTeam.primaryColor}40, #0B0F19 80%)`,
          }}
        >
          {/* Top Shiny Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-2xl tracking-wider text-amber-400">PANINI PRIZM</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-bold uppercase">HOF EDITION</span>
            </div>
            <div
              className="w-10 h-10 rounded-xl p-1 flex items-center justify-center border bg-slate-950/90 shadow-lg"
              style={{
                borderColor: currentTeam.secondaryColor,
              }}
            >
              <img src={currentTeam.logoUrl} alt={currentTeam.name} className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Player Graphic Silhouette / Card Center */}
          <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 text-center space-y-2 overflow-hidden shadow-inner">
            <div className="absolute top-2 right-2 text-4xl opacity-20">🏀</div>
            <div className="font-display text-7xl font-black text-amber-400 leading-none drop-shadow-md">
              {player.ovr}
            </div>
            <div className="text-xs uppercase font-bold text-slate-400 tracking-widest">OVERALL RATING</div>
            
            {/* Hall of Fame Badge */}
            {isHof && (
              <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-300 text-black px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-lg animate-pulse">
                <Star className="w-3.5 h-3.5 fill-black" />
                <span>HALL OF FAME INDUCTEE 🏛️</span>
              </div>
            )}
          </div>

          {/* Player Identity */}
          <div>
            <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">{player.position} • #{player.jerseyNumber}</div>
            <h3 className="font-display text-4xl font-black text-white uppercase tracking-tight leading-none">{player.name}</h3>
            <p className="text-xs text-slate-400 font-medium mt-1">Pick #{player.draftPick} del Draft • {player.college}</p>
          </div>

          {/* Key Stats Summary */}
          <div className="grid grid-cols-3 gap-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 text-center text-xs">
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-semibold">ANILLOS</div>
              <div className="font-display font-black text-xl text-amber-400">💍 {trophyCase.championships}</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-semibold">MVP REGULAR</div>
              <div className="font-display font-black text-xl text-amber-400">🏅 {trophyCase.regularMvp}</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-semibold">ALL-STAR</div>
              <div className="font-display font-black text-xl text-amber-400">🌟 {trophyCase.allStarSelections}</div>
            </div>
          </div>

          {/* Career Points Totals */}
          <div className="flex justify-between items-center bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs">
            <span className="text-slate-400 font-bold">PUNTOS TOTALES CARRERA:</span>
            <span className="font-display font-black text-xl text-white">{trophyCase.totalPoints.toLocaleString()} PTS</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={handleDownloadImage}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-display font-black text-xl uppercase tracking-wider px-8 py-4 rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-105 transition-all"
        >
          <Download className="w-5 h-5" />
          <span>DESCARGAR TARJETA PNG (1-CLICK)</span>
        </button>

        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all"
        >
          <span>JUGAR OTRA CARRERA NBA 🏀</span>
        </button>
      </div>
    </div>
  );
};
