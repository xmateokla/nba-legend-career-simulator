import React, { useState } from 'react';
import { Player, NBATeam } from '../types/game';
import { getTeamById, NBA_TEAMS } from '../data/nbaTeams';
import { playAudioEffect } from '../utils/simulator';
import { JerseyPreview } from './JerseyPreview';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, ArrowRight, Volume2, ShieldCheck, ListOrdered, Shuffle, ArrowRightLeft, Flame } from 'lucide-react';

interface DraftNightScreenProps {
  player: Player;
  onDraftComplete: (draftTeamId: string, pickNumber: number) => void;
}

// 14 Real NBA Lottery Base Teams
const LOTTERY_TEAMS = ['WAS', 'DET', 'POR', 'CHA', 'UTA', 'BKN', 'SAS', 'TOR', 'CHI', 'ATL', 'HOU', 'MEM', 'NOP', 'SAC'];
const CONTENDER_SURPRISE_TEAMS = ['LAL', 'GSW', 'BOS', 'NYK', 'MIA', 'MIL', 'DAL', 'PHX', 'LAC', 'PHI', 'DEN', 'MIN'];
const LATE_FIRST_TEAMS = ['IND', 'ORL', 'CLE', 'MIA', 'NYK', 'PHX', 'LAC', 'MIN', 'PHI', 'OKC', 'DEN', 'DAL', 'GSW', 'BOS', 'LAL'];

export const DraftNightScreen: React.FC<DraftNightScreenProps> = ({ player, onDraftComplete }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [showTradeOfferModal, setShowTradeOfferModal] = useState(false);

  // Build 14-team Draft Board with dynamic surprise lottery jumps anywhere in Picks #1 through #14
  const [draftBoard] = useState(() => {
    const board = LOTTERY_TEAMS.map((tId, idx) => ({
      pick: idx + 1,
      team: getTeamById(tId),
      isSurpriseJump: false,
    }));

    // 40% chance of 1 to 3 contender/big market teams jumping into ANY of the 14 Lottery Picks
    if (Math.random() < 0.40) {
      const numberOfJumps = Math.floor(Math.random() * 2) + 1; // 1 to 2 teams jump
      const usedPicks = new Set<number>();
      const usedTeams = new Set<string>();

      for (let i = 0; i < numberOfJumps; i++) {
        // Pick a random lottery pick position between 1 and 14
        const surprisePickIndex = Math.floor(Math.random() * 14);
        if (usedPicks.has(surprisePickIndex)) continue;

        // Pick a random contender/big market team
        const availableContenders = CONTENDER_SURPRISE_TEAMS.filter(t => !usedTeams.has(t));
        if (availableContenders.length === 0) break;

        const randomContenderId = availableContenders[Math.floor(Math.random() * availableContenders.length)];
        
        board[surprisePickIndex] = {
          pick: surprisePickIndex + 1,
          team: getTeamById(randomContenderId),
          isSurpriseJump: true,
        };

        usedPicks.add(surprisePickIndex);
        usedTeams.add(randomContenderId);
      }
    }

    return board;
  });

  // Dynamic Pick Determination based on Prospect Tier & OVR
  const calculateDraftPickAndTeam = (): { pickNumber: number; teamId: string } => {
    let pick = 1;

    if (player.prospectTier === '5_STAR') {
      pick = player.ovr >= 78 ? 1 : player.ovr >= 76 ? 2 : 3;
    } else if (player.prospectTier === 'OVERSEAS') {
      pick = player.ovr >= 76 ? 3 : player.ovr >= 74 ? 7 : 11;
    } else if (player.prospectTier === '4_STAR') {
      pick = player.ovr >= 76 ? 4 : player.ovr >= 73 ? 8 : 14;
    } else {
      // UNDERRATED (3-Star)
      pick = player.ovr >= 73 ? 12 : player.ovr >= 70 ? 20 : 28;
    }

    // Add random variance (+/- 1 or 2 picks)
    const variance = Math.floor(Math.random() * 3) - 1;
    pick = Math.max(1, Math.min(60, pick + variance));

    // Team selection according to pick number from actual draft board
    let teamId = 'DET';
    if (pick <= 14 && draftBoard[pick - 1]) {
      teamId = draftBoard[pick - 1].team.id;
    } else {
      const idx = (pick - 15) % LATE_FIRST_TEAMS.length;
      teamId = LATE_FIRST_TEAMS[idx];
    }

    return { pickNumber: pick, teamId };
  };

  const [{ pickNumber, teamId: initialDraftTeamId }] = useState(calculateDraftPickAndTeam);
  const draftingTeam: NBATeam = getTeamById(initialDraftTeamId);

  // Check for Random Draft Night Trade (35% probability)
  const [tradeDestinationTeam] = useState<NBATeam | null>(() => {
    if (Math.random() < 0.35) {
      const potentialTradeTeams = NBA_TEAMS.filter(t => t.id !== initialDraftTeamId);
      return potentialTradeTeams[Math.floor(Math.random() * potentialTradeTeams.length)];
    }
    return null;
  });

  const [activeTeam, setActiveTeam] = useState<NBATeam>(draftingTeam);

  const handleRevealPick = () => {
    setIsRevealed(true);
    playAudioEffect('draft_buzzer');

    try {
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 },
        colors: [draftingTeam.primaryColor, draftingTeam.secondaryColor, '#F59E0B'],
      });
    } catch (_) {}

    // Trigger trade offer modal if trade destination exists
    if (tradeDestinationTeam) {
      setTimeout(() => {
        setShowTradeOfferModal(true);
      }, 1200);
    }
  };

  const handleAcceptTrade = () => {
    if (tradeDestinationTeam) {
      setActiveTeam(tradeDestinationTeam);
      setShowTradeOfferModal(false);
      playAudioEffect('cash');
    }
  };

  const handleDeclineTrade = () => {
    setShowTradeOfferModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 my-2 sm:my-4">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-10 backdrop-blur-md shadow-2xl text-center space-y-8 relative overflow-hidden">
        
        {/* Background Glow */}
        <div 
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: activeTeam.primaryColor }}
        ></div>

        {/* Barclays Center Header */}
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>BARCLAYS CENTER • BROOKLYN, NY</span>
          </div>
          <h1 className="font-display text-4xl sm:text-7xl font-black text-white uppercase tracking-tight">
            NOCHE DEL NBA DRAFT
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            El Comisionado de la NBA, Adam Silver, se dirige al podio para anunciar las elecciones oficiales de la 1ª Ronda.
          </p>
        </div>

        {/* DRAFT NIGHT TRADE ALERT MODAL */}
        {showTradeOfferModal && tradeDestinationTeam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
            <div className="bg-slate-900 border-2 border-red-500/80 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 text-center shadow-2xl relative">
              <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-black uppercase px-4 py-1.5 rounded-full animate-bounce">
                <ArrowRightLeft className="w-4 h-4 text-red-400" />
                <span>🚨 TRASPASO INMEDIATO EN LA NOCHE DEL DRAFT</span>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-3xl font-black text-white uppercase">
                  ¡TUS DERECHOS HAN SIDO TRASPASADOS!
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800 italic">
                  "Los <strong className="text-amber-400">{draftingTeam.name}</strong> han acordado enviar tus derechos de novato a los <strong className="text-emerald-400">{tradeDestinationTeam.city} {tradeDestinationTeam.name}</strong> a cambio de 2 selecciones futuras de 1ª ronda y dinero."
                </p>
              </div>

              {/* Trade Visual Comparison */}
              <div className="grid grid-cols-2 gap-3 items-center bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="space-y-1">
                  <img src={draftingTeam.logoUrl} alt="" className="w-10 h-10 object-contain mx-auto" />
                  <div className="text-[10px] text-slate-400 font-bold">{draftingTeam.name}</div>
                </div>
                <div className="space-y-1">
                  <img src={tradeDestinationTeam.logoUrl} alt="" className="w-10 h-10 object-contain mx-auto" />
                  <div className="text-[10px] text-emerald-400 font-bold">{tradeDestinationTeam.name}</div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleAcceptTrade}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-black font-display font-black text-base uppercase py-3.5 rounded-xl shadow-lg transition-all"
                >
                  ✈️ ACEPTAR TRASPASO Y PONERSE LA GORRA DE {tradeDestinationTeam.name.toUpperCase()}
                </button>

                <button
                  onClick={handleDeclineTrade}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-3 rounded-xl transition-all"
                >
                  ✍️ RECHAZAR TRASPASO Y PERMANECER EN {draftingTeam.name.toUpperCase()}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Unrevealed Podium Screen & Live Draft Board */}
        {!isRevealed ? (
          <div className="space-y-6 relative z-10">
            
            {/* Live NBA Draft Board Preview (All picks neutral to maintain full suspense!) */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 max-w-3xl mx-auto space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                  <ListOrdered className="w-4 h-4 text-amber-400" />
                  <span>TABLA OFICIAL DE LOTERÍA DEL DRAFT (PICKS 1-14)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">1ª RONDA EN PROGRESO</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
                {draftBoard.map(b => (
                  <div
                    key={b.pick}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      b.isSurpriseJump
                        ? 'border-amber-500/80 bg-amber-500/10 shadow-lg'
                        : 'border-slate-800 bg-slate-900/90'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-bold">
                      <span>PICK #{b.pick}</span>
                      {b.isSurpriseJump && <Flame className="w-3 h-3 text-amber-400" />}
                    </div>
                    <img src={b.team.logoUrl} alt={b.team.name} className="w-6 h-6 object-contain mx-auto my-1 drop-shadow" />
                    <div className="text-[9px] font-bold text-white truncate">{b.team.abbreviation}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Green Room Envelope Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md mx-auto space-y-5 shadow-xl">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl mx-auto flex items-center justify-center text-3xl">
                ✉️
              </div>
              
              <div className="space-y-1">
                <h3 className="font-display font-black text-2xl text-white uppercase">
                  {player.name || 'TU PROSPECTO'} • GREEN ROOM
                </h3>
                <p className="text-xs text-amber-300 font-semibold">
                  Proyección: {player.prospectTier === '5_STAR' ? 'Top 3 Garantizado' : player.prospectTier === '4_STAR' ? 'Lotería Top 14' : 'Primera Ronda'}
                </p>
              </div>

              <div className="py-2">
                <JerseyPreview name={player.name} jerseyNumber={player.jerseyNumber} countryName={player.country} size="sm" />
              </div>

              <button
                onClick={handleRevealPick}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-display font-black text-xl uppercase tracking-wider py-4 rounded-2xl shadow-xl shadow-amber-500/20 active:scale-95 transition-all"
              >
                ESCUCHAR ANUNCIO DE ADAM SILVER 🎙️
              </button>
            </div>
          </div>
        ) : (
          /* REVEALED PICK SCREEN */
          <div className="bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-10 max-w-lg mx-auto space-y-6 shadow-2xl relative z-10 animate-fadeIn">
            
            {/* Team Logo Badge */}
            <div
              className="w-28 h-28 rounded-3xl mx-auto flex items-center justify-center p-4 border-2 bg-slate-950 shadow-2xl"
              style={{ borderColor: activeTeam.secondaryColor }}
            >
              <img src={activeTeam.logoUrl} alt={activeTeam.name} className="w-full h-full object-contain drop-shadow-lg" />
            </div>

            <div className="space-y-3">
              <div className="text-amber-400 font-display font-black text-3xl sm:text-4xl uppercase tracking-wider">
                PICK #{pickNumber} • SELECCIÓN OFICIAL
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 italic text-sm text-slate-200 shadow-inner">
                "With the {pickNumber}{pickNumber === 1 ? 'st' : pickNumber === 2 ? 'nd' : pickNumber === 3 ? 'rd' : 'th'} pick in the NBA Draft, the <strong className="text-amber-400 font-bold">{activeTeam.city} {activeTeam.name}</strong> select <strong className="text-white font-bold">{player.name}</strong>, from {player.college}!"
              </div>
            </div>

            {/* Render Visual NBA Team Jersey */}
            <div className="py-2">
              <JerseyPreview name={player.name} jerseyNumber={player.jerseyNumber} teamId={activeTeam.id} size="md" />
            </div>

            <button
              onClick={() => onDraftComplete(activeTeam.id, pickNumber)}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-display font-black text-xl uppercase tracking-wider py-4 rounded-2xl shadow-xl shadow-amber-500/20 active:scale-95 transition-all"
            >
              <span>PONERSE LA GORRA DE LOS {activeTeam.name.toUpperCase()}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
