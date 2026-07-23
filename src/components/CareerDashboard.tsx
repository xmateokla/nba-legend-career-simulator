import React, { useState } from 'react';
import { Player, SeasonStats, TrophyCase, CareerEvent, EventChoice, ChoiceOutcomeDetails } from '../types/game';
import { getTeamById } from '../data/nbaTeams';
import { simulateSeason, playAudioEffect, EXPANDED_CAREER_EVENTS } from '../utils/simulator';
import { CAREER_EVENTS } from '../data/nbaEvents';
import { EventModal } from './EventModal';
import { OffseasonDecisionModal } from './OffseasonDecisionModal';
import { LifestyleStoreModal } from './LifestyleStoreModal';
import { Trophy, Star, Award, Zap, Play, Calendar, DollarSign, Flame, ShieldCheck, Heart, Sparkles, Building, UserCheck, ArrowUpRight, FastForward, Medal, History } from 'lucide-react';

interface CareerDashboardProps {
  player: Player;
  onUpdatePlayer: (updated: Player) => void;
  seasonYear: number;
  onAdvanceSeasonYear: () => void;
  onRetire: () => void;
  careerHistory: SeasonStats[];
  onAddSeasonHistory: (stats: SeasonStats) => void;
  trophyCase: TrophyCase;
  onUpdateTrophyCase: (updated: TrophyCase) => void;
}

export const CareerDashboard: React.FC<CareerDashboardProps> = ({
  player,
  onUpdatePlayer,
  seasonYear,
  onAdvanceSeasonYear,
  onRetire,
  careerHistory,
  onAddSeasonHistory,
  trophyCase,
  onUpdateTrophyCase,
}) => {
  const [activeEvent, setActiveEvent] = useState<CareerEvent | null>(null);
  const [showOffseasonModal, setShowOffseasonModal] = useState(false);
  const [showLifestyleStore, setShowLifestyleStore] = useState(false);

  const currentTeam = getTeamById(player.currentTeamId);
  const latestSeason = careerHistory.length > 0 ? careerHistory[careerHistory.length - 1] : null;

  // Single Season Simulation
  const handleSimulateSingleSeason = () => {
    playAudioEffect('badge');

    const result = simulateSeason(player, seasonYear, trophyCase);
    
    onAddSeasonHistory(result.stats);
    onUpdateTrophyCase(result.updatedTrophyCase);

    let updatedPlayer: Player = {
      ...player,
      age: player.age + 1,
      ovr: result.newOvr,  // Apply realistic OVR progression
      earningsMillions: player.earningsMillions + result.earnedIncomeMillions,
      currentTeamId: result.wasTraded && result.newTeamId ? result.newTeamId : player.currentTeamId,
      contractYearsRemaining: Math.max(0, player.contractYearsRemaining - 1),
      // Track synced attributes & durability loss from injuries
      attributes: result.injuryOccurred
        ? { ...(result.updatedAttributes || player.attributes), durability: Math.max(40, ((result.updatedAttributes || player.attributes)?.durability ?? 75) - 3) }
        : (result.updatedAttributes || player.attributes),
    };

    onUpdatePlayer(updatedPlayer);

    // Play special sounds for achievements
    if (result.stats.awardsWon?.some((a: string) => a.includes('Campeón'))) {
      playAudioEffect('championship');
    } else if (result.stats.awardsWon?.some((a: string) => a.includes('All-Star'))) {
      playAudioEffect('allstar');
    }

    // Trigger career event (50% chance, using expanded events pool)
    const availableEvents = EXPANDED_CAREER_EVENTS.filter(e => !player.completedEventIds.includes(e.id));
    if (availableEvents.length > 0 && Math.random() < 0.50) {
      const selectedEv = availableEvents[Math.floor(Math.random() * availableEvents.length)];
      setActiveEvent(selectedEv);
    } else {
      setShowOffseasonModal(true);
    }
  };

  // Handle Event Choice Completion
  const handleEventChoiceSelect = (choice: EventChoice, resolvedDetails?: ChoiceOutcomeDetails) => {
    if (!activeEvent) return;

    const details = resolvedDetails || choice.successOutcome || choice;
    let newAttrs = { ...player.attributes };
    let ovrDelta = 0;
    let earningsDelta = 0;
    let repDelta = 0;
    let marketDelta = 0;
    const newBadges = [...player.unlockedBadges];

    if (details.unlockedBadge && !newBadges.includes(details.unlockedBadge)) {
      newBadges.push(details.unlockedBadge);
    }

    if (details.statChanges) {
      const { ovr, earningsMillions, reputation, marketability, ...attrs } = details.statChanges;
      if (ovr) ovrDelta = ovr;
      if (earningsMillions) earningsDelta = earningsMillions;
      if (reputation) repDelta = reputation;
      if (marketability) marketDelta = marketability;

      for (const k in attrs) {
        const key = k as keyof typeof attrs;
        if (typeof attrs[key] === 'number') {
          newAttrs[key] = Math.min(99, Math.max(40, (newAttrs[key] || 50) + (attrs[key] as number)));
        }
      }
    }

    const updatedPlayer: Player = {
      ...player,
      ovr: Math.min(player.potentialMaxOvr || 99, Math.max(65, player.ovr + ovrDelta)),
      earningsMillions: Math.max(0, player.earningsMillions + earningsDelta),
      reputation: Math.min(100, Math.max(0, player.reputation + repDelta)),
      marketability: Math.min(100, Math.max(0, player.marketability + marketDelta)),
      attributes: newAttrs,
      unlockedBadges: newBadges,
      completedEventIds: [...player.completedEventIds, activeEvent.id],
    };

    onUpdatePlayer(updatedPlayer);
    setActiveEvent(null);
    setShowOffseasonModal(true);
  };

  // Handle Offseason Decision Finish
  const handleOffseasonComplete = (updatedPlayer: Player) => {
    onUpdatePlayer(updatedPlayer);
    setShowOffseasonModal(false);
    onAdvanceSeasonYear();
  };

  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-6 space-y-4 sm:space-y-6">

      {/* COPERO-STYLE HEADER */}
      <div className="game-card-panel border border-slate-700/80 rounded-3xl p-4 sm:p-6 holographic-edge shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 p-1.5 flex items-center justify-center flex-shrink-0">
            <img src={currentTeam.logoUrl} alt={currentTeam.name} className="w-full h-full object-contain" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white uppercase leading-tight">{player.name}</h1>
            <div className="text-xs text-slate-400 font-semibold flex items-center gap-2 justify-center sm:justify-start flex-wrap">
              <span>{currentTeam.name}</span>
              <span className="text-slate-600">•</span>
              <span>Edad {player.age}</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-bold">${player.earningsMillions.toFixed(1)}M</span>
            </div>
          </div>
          <div className="game-card-gold rounded-2xl px-5 py-3 text-center gold-glow flex-shrink-0">
            <div className="text-[9px] text-amber-400 font-black uppercase">OVR</div>
            <div className="font-display font-black text-4xl gold-gradient-text leading-none">{player.ovr}</div>
          </div>
        </div>

        <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-slate-500 font-bold">
          <Calendar className="w-4 h-4" />
          <span>TEMPORADA {seasonYear} • {careerHistory.length} temporadas jugadas</span>
        </div>

        {/* ONE BIG BUTTON */}
        <button
          onClick={handleSimulateSingleSeason}
          className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 text-black font-display font-black text-xl sm:text-2xl uppercase tracking-wider py-5 rounded-2xl shadow-xl shadow-amber-500/30 active:scale-[0.98] transition-all gold-glow"
        >
          SIGUIENTE TEMPORADA 🏀
        </button>

        {player.age >= 38 && (
          <button
            onClick={onRetire}
            className="w-full bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 font-display font-black text-sm uppercase px-5 py-3 rounded-xl transition-all"
          >
            RETIRARSE 🏆
          </button>
        )}
      </div>

      {/* SEASON HISTORY - SIMPLIFIED */}
      <div className="space-y-4">

        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-amber-400" />
          <h2 className="font-display font-black text-xl text-white uppercase">
            MI CARRERA
          </h2>
        </div>

        {careerHistory.length === 0 ? (
          <div className="game-card-panel rounded-3xl p-8 text-center space-y-3">
            <span className="text-4xl">🏀</span>
            <h3 className="font-display font-black text-xl text-white uppercase">Tu carrera comienza aquí</h3>
            <p className="text-xs text-slate-400">Presiona <strong className="text-amber-400">"Siguiente Temporada"</strong> para jugar tu primera temporada NBA.</p>
          </div>
        ) : (
          /* COPERO-STYLE COMPACT SEASON LIST */
          <div className="space-y-2">
            {careerHistory.slice().reverse().map((season, idx) => {
              const team = getTeamById(season.teamId);
              const isChampionshipYear = season.awardsWon.some(a => a.includes('Campeón'));
              const isMvpYear = season.awardsWon.some(a => a.includes('MVP'));

              return (
                <div
                  key={season.year}
                  className={`game-card-panel rounded-2xl p-3 flex items-center gap-3 transition-all ${
                    isChampionshipYear 
                      ? 'game-card-gold border-amber-400/60 gold-glow' 
                      : isMvpYear
                      ? 'game-card-rare border-purple-400/60 purple-glow'
                      : 'border border-slate-800'
                  }`}
                >
                  {/* Team logo */}
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 p-1 flex-shrink-0">
                    <img src={team.logoUrl} alt={team.name} className="w-full h-full object-contain" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-sm">{season.year}</span>
                      <span className="text-slate-500 text-xs">{team.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>PTS {season.ppg}</span>
                      <span>REB {season.rpg}</span>
                      <span>AST {season.apg}</span>
                    </div>
                  </div>

                  {/* Awards */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {season.awardsWon.slice(0, 2).map((award, i) => (
                      <span key={i} className="text-lg" title={award}>
                        {award.includes('Campeón') ? '🏆' : award.includes('MVP') ? '👑' : '⭐'}
                      </span>
                    ))}
                    {season.awardsWon.length > 2 && (
                      <span className="text-xs text-slate-500">+{season.awardsWon.length - 2}</span>
                    )}
                  </div>

                  {/* OVR */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-[9px] text-slate-500 uppercase font-bold">OVR</div>
                    <div className={`font-display font-black text-lg ${isChampionshipYear ? 'text-amber-400' : 'text-white'}`}>
                      {season.ovrAtEndOfSeason ?? player.ovr}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* MODALS */}
      {activeEvent && (
        <EventModal
          event={activeEvent}
          onChoiceSelect={handleEventChoiceSelect}
        />
      )}

      {showOffseasonModal && latestSeason && (
        <OffseasonDecisionModal
          player={player}
          latestSeason={latestSeason}
          onDecisionComplete={handleOffseasonComplete}
        />
      )}

      {showLifestyleStore && (
        <LifestyleStoreModal
          player={player}
          onUpdatePlayer={onUpdatePlayer}
          onClose={() => setShowLifestyleStore(false)}
        />
      )}

    </div>
  );
};
