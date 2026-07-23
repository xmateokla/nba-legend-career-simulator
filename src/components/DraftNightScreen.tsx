import React, { useState } from 'react';
import { Player, Position } from '../types/game';
import { NBA_TEAMS, getTeamById } from '../data/nbaTeams';
import { playAudioEffect } from '../utils/simulator';
import { Sparkles, Trophy, Award, Flame, ArrowRight, Dice5, CheckCircle, Shield } from 'lucide-react';

interface DraftNightScreenProps {
  player: Player;
  onDraftComplete: (teamId: string, pickNumber: number) => void;
}

export const DraftNightScreen: React.FC<DraftNightScreenProps> = ({ player, onDraftComplete }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [draftedTeamId, setDraftedTeamId] = useState<string | null>(null);
  const [pickNumber, setPickNumber] = useState<number | null>(null);

  // 25% Random Wildcard Lottery Jump to Top Picks!
  const handleStartDraftLottery = () => {
    setIsSimulating(true);
    playAudioEffect('badge');

    setTimeout(() => {
      // Full 30 team shuffle
      const shuffledTeams = [...NBA_TEAMS].sort(() => 0.5 - Math.random());
      
      let finalPick = 1;
      let finalTeam = shuffledTeams[0];

      // Tier influence on pick probability
      if (player.prospectTier === '5_STAR') {
        finalPick = Math.floor(Math.random() * 3) + 1; // Top 1-3
      } else if (player.prospectTier === '4_STAR') {
        finalPick = Math.floor(Math.random() * 11) + 4; // Pick 4-14
      } else if (player.prospectTier === 'UNDERRATED') {
        finalPick = Math.floor(Math.random() * 16) + 15; // Pick 15-30
      } else {
        finalPick = Math.floor(Math.random() * 8) + 3; // International Pick 3-10
      }

      // 25% Random Wildcard Lottery Jump!
      if (Math.random() < 0.25) {
        finalPick = Math.floor(Math.random() * 3) + 1;
      }

      finalTeam = shuffledTeams[finalPick - 1] || shuffledTeams[0];

      setDraftedTeamId(finalTeam.id);
      setPickNumber(finalPick);
      setIsSimulating(false);
      playAudioEffect('cheer');
    }, 2200);
  };

  const handleConfirmTeam = () => {
    if (draftedTeamId && pickNumber) {
      onDraftComplete(draftedTeamId, pickNumber);
    }
  };

  const draftedTeam = draftedTeamId ? getTeamById(draftedTeamId) : null;

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 my-2 sm:my-6">
      <div className="game-card-panel border border-slate-700/80 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 holographic-edge">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>BARCLAYS CENTER • BROOKLYN, NEW YORK 🗽</span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl font-black text-white uppercase tracking-tight">
              NOCHE DEL DRAFT NBA {new Date().getFullYear() + 1}
            </h2>
            <p className="text-xs text-slate-400">Adam Silver sube al podio para anunciar la selección oficial de tu franquicia.</p>
          </div>

          <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-2xl text-right">
            <div className="text-[10px] text-slate-400 font-bold uppercase">PROSPECTO DE DRAFT</div>
            <div className="font-bold text-white text-sm">{player.name} ({player.position})</div>
            <div className="text-xs text-amber-400 font-bold">{player.college} • {player.ovr} OVR</div>
          </div>
        </div>

        {/* REVEAL CARD AREA */}
        {!draftedTeam ? (
          <div className="text-center py-10 space-y-6">
            <div className="w-24 h-24 rounded-3xl bg-slate-950 border-2 border-amber-500/40 mx-auto flex items-center justify-center text-4xl gold-glow animate-float">
              🎩
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="font-display text-3xl font-black text-white uppercase">
                {isSimulating ? 'SIMULANDO LOTERÍA DEL DRAFT...' : '¡EL PODIO ESTÁ LISTO!'}
              </h3>
              <p className="text-xs text-slate-400">
                {isSimulating
                  ? 'Analizando necesidades de las 30 franquicias y combinaciones de lotería...'
                  : 'Haz clic para revelar el pick oficial y el equipo que seleccionará tu talento.'}
              </p>
            </div>

            {!isSimulating && (
              <button
                onClick={handleStartDraftLottery}
                className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 text-black font-display font-black text-2xl uppercase tracking-wider px-12 py-4 rounded-2xl shadow-2xl shadow-amber-500/30 active:scale-95 transition-all inline-flex items-center gap-3 gold-glow"
              >
                <span>REVELAR SELECCIÓN EN EL DRAFT</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            )}
          </div>
        ) : (
          /* REVEALED DRAFT CARD RESULT */
          <div className="space-y-6 animate-fadeIn py-4">
            <div className="game-card-gold rounded-3xl p-6 border-2 border-amber-400/80 text-center space-y-4 max-w-xl mx-auto holographic-edge gold-glow">
              
              <div className="inline-flex items-center gap-2 bg-amber-500 text-black font-display font-black text-sm px-4 py-1 rounded-full uppercase tracking-wider">
                <span>PICK #{pickNumber} GENERAL DEL DRAFT</span>
              </div>

              <div className="w-24 h-24 mx-auto p-2 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center">
                <img src={draftedTeam.logoUrl} alt={draftedTeam.name} className="w-full h-full object-contain drop-shadow" />
              </div>

              <div className="space-y-1">
                <div className="text-xs text-amber-300 font-bold uppercase">{draftedTeam.city}</div>
                <h3 className="font-display font-black text-4xl text-white uppercase">{draftedTeam.name}</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto italic bg-slate-950/60 p-3 rounded-xl border border-slate-800 mt-2">
                  "Con la selección #{pickNumber} del Draft NBA, los {draftedTeam.name} seleccionan a {player.name}, de {player.college}."
                </p>
              </div>

            </div>

            <div className="text-center pt-2">
              <button
                onClick={handleConfirmTeam}
                className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 text-black font-display font-black text-xl uppercase tracking-wider px-10 py-4 rounded-2xl shadow-xl shadow-amber-500/20 active:scale-95 transition-all inline-flex items-center gap-2"
              >
                <span>FIRMAR CONTRATO & COMENZAR MI TEMPORADA ROOKIE 🏀</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
