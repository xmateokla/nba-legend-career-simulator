import React, { useState } from 'react';
import { Player, SeasonStats, TrophyCase, CareerEvent, EventChoice } from '../types/game';
import { getTeamById, NBA_TEAMS } from '../data/nbaTeams';
import { simulateSeason, playAudioEffect } from '../utils/simulator';
import { CAREER_EVENTS } from '../data/nbaEvents';
import { EventModal } from './EventModal';
import { OffseasonDecisionModal } from './OffseasonDecisionModal';
import { LifestyleStoreModal } from './LifestyleStoreModal';
import { AttributesPanel } from './AttributesPanel';
import {
  ChampionshipRingIcon,
  LarryOBrienTrophyIcon,
  NbaCupTrophyIcon,
  OlympicGoldMedalIcon,
  FibaWorldCupIcon,
  MvpTrophyIcon,
  AllStarKobeIcon,
} from './TrophyAssets';
import { Trophy, Award, Star, Flame, Sparkles, TrendingUp, DollarSign, Calendar, RefreshCw, ShieldCheck, Heart, LogOut, HelpCircle, ChevronRight, Zap, Building, Car, Globe, Clock, Dna, Activity, Dumbbell } from 'lucide-react';

interface CareerDashboardProps {
  player: Player;
  onUpdatePlayer: (updated: Player) => void;
  seasonYear: number;
  onAdvanceSeasonYear: () => void;
  onRetire: () => void;
  careerHistory: SeasonStats[];
  onAddSeasonHistory: (stats: SeasonStats) => void;
  trophyCase: TrophyCase;
  onUpdateTrophyCase: (trophies: TrophyCase) => void;
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
  const [showLifestyleModal, setShowLifestyleModal] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const currentTeam = getTeamById(player.currentTeamId);

  // Helper to trigger next season simulation
  const handleSimulateSeason = () => {
    setIsSimulating(true);

    setTimeout(() => {
      // 1. Simulate season stats and credit income
      const { stats, updatedTrophyCase, wasTraded, newTeamId, earnedIncomeMillions } = simulateSeason(player, seasonYear, trophyCase);
      
      onAddSeasonHistory(stats);
      onUpdateTrophyCase(updatedTrophyCase);

      // 2. Audio feedback
      if (stats.awardsWon.some(a => a.includes('Campeón') || a.includes('MVP') || a.includes('Oro'))) {
        playAudioEffect('cheer');
      } else {
        playAudioEffect('cash');
      }

      // 3. Update player team if traded and credit seasonal income
      const activeTeam = wasTraded && newTeamId ? newTeamId : player.currentTeamId;
      const updatedPlayer: Player = {
        ...player,
        currentTeamId: activeTeam,
        age: player.age + 1,
        earningsMillions: player.earningsMillions + earnedIncomeMillions,
      };

      onUpdatePlayer(updatedPlayer);
      setIsSimulating(false);

      // 4. Check for mid-career random event
      if (Math.random() < 0.55 && CAREER_EVENTS.length > 0) {
        const stageFilter = updatedPlayer.age < 22 ? 'rookie' : updatedPlayer.age > 32 ? 'veteran' : 'prime';
        const uncompletedEvents = CAREER_EVENTS.filter(e => !player.completedEventIds.includes(e.id));
        const eligibleEvents = (uncompletedEvents.length > 0 ? uncompletedEvents : CAREER_EVENTS).filter(
          e => e.stage === stageFilter || e.stage === 'any'
        );

        if (eligibleEvents.length > 0) {
          const randomEv = eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)];
          setActiveEvent(randomEv);
          onUpdatePlayer({ ...updatedPlayer, completedEventIds: [...player.completedEventIds, randomEv.id] });
        }
      }

      // 5. Open Mandatory Offseason Decision Modal
      setShowOffseasonModal(true);
    }, 1000);
  };

  // Event choice handle
  const handleEventChoice = (choice: EventChoice) => {
    if (!activeEvent) return;

    let newAttributes = { ...player.attributes };
    let ovrDelta = 0;
    let earningsDelta = 0;
    let repDelta = 0;
    let marketDelta = 0;
    const newBadges = [...player.unlockedBadges];

    if (choice.unlockedBadge && !newBadges.includes(choice.unlockedBadge)) {
      newBadges.push(choice.unlockedBadge);
    }

    if (choice.statChanges) {
      const { ovr, earningsMillions, reputation, marketability, ...attrs } = choice.statChanges;
      if (ovr) ovrDelta = ovr;
      if (earningsMillions) earningsDelta = earningsMillions;
      if (reputation) repDelta = reputation;
      if (marketability) marketDelta = marketability;

      newAttributes = { ...newAttributes, ...attrs };
    }

    const updated: Player = {
      ...player,
      ovr: Math.min(player.potentialMaxOvr || 99, Math.max(65, player.ovr + ovrDelta)),
      earningsMillions: Math.max(0, player.earningsMillions + earningsDelta),
      reputation: Math.min(100, Math.max(0, player.reputation + repDelta)),
      marketability: Math.min(100, Math.max(0, player.marketability + marketDelta)),
      attributes: newAttributes,
      unlockedBadges: newBadges,
    };

    onUpdatePlayer(updated);
    setActiveEvent(null);
  };

  const handleOffseasonComplete = (updatedPlayer: Player) => {
    onUpdatePlayer(updatedPlayer);
    setShowOffseasonModal(false);
    onAdvanceSeasonYear();
  };

  const latestStats = careerHistory.length > 0 ? careerHistory[careerHistory.length - 1] : null;

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6 my-2 sm:my-4 pb-28 sm:pb-8">
      
      {/* Mid-Career Random Event Modal */}
      {activeEvent && (
        <EventModal
          event={activeEvent}
          onChoiceSelect={handleEventChoice}
        />
      )}

      {/* Mandatory Offseason Decision Modal */}
      {showOffseasonModal && latestStats && (
        <OffseasonDecisionModal
          player={player}
          latestSeason={latestStats}
          onDecisionComplete={handleOffseasonComplete}
        />
      )}

      {/* Lifestyle & Investments Store Modal */}
      {showLifestyleModal && (
        <LifestyleStoreModal
          player={player}
          onUpdatePlayer={onUpdatePlayer}
          onClose={() => setShowLifestyleModal(false)}
        />
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">EXIGENCIA DE EQUIPOS & REALISMO 💡</h3>
              <button onClick={() => setShowHelpModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>
            <div className="space-y-3 text-slate-300">
              <p><strong className="text-amber-400">Exigencia por Franquicia:</strong> Dinastías como Celtics o Lakers exigen pelear por el título desde el Día 1. Equipos en reconstrucción como Pistons o Wizards te otorgan libertad total de tiros.</p>
              <p><strong className="text-amber-400">Minutos por Partido:</strong> Si estás en un superequipo como novato, deberás ganarte los minutos desde el banquillo.</p>
              <p><strong className="text-amber-400">Torneos Mundiales:</strong> Participa en la NBA Cup, Juegos Olímpicos 🥇 y Copa Mundial FIBA 🌍.</p>
            </div>
          </div>
        </div>
      )}

      {/* TOP HERO BANNER */}
      <div 
        className="rounded-2xl sm:rounded-3xl p-4 sm:p-8 border shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{
          backgroundColor: '#0F172A',
          borderColor: currentTeam.primaryColor,
          backgroundImage: `linear-gradient(135deg, ${currentTeam.primaryColor}35 0%, #0F172A 70%)`,
        }}
      >
        {/* Player Profile Brief */}
        <div className="flex items-center gap-3.5 sm:gap-5">
          {/* Team Logo Badge */}
          <div
            className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl flex items-center justify-center p-2.5 shadow-2xl border-2 bg-slate-950/90 flex-shrink-0"
            style={{ borderColor: currentTeam.secondaryColor }}
          >
            <img src={currentTeam.logoUrl} alt={currentTeam.name} className="w-full h-full object-contain drop-shadow-md" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {player.position} • #{player.jerseyNumber}
              </span>
              <span className="text-[11px] text-slate-300 font-semibold truncate">{currentTeam.city} {currentTeam.name}</span>
            </div>
            <h1 className="font-display text-3xl sm:text-6xl font-black text-white uppercase tracking-tight leading-none truncate">
              {player.name}
            </h1>
            
            {/* Team Expectations */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300 mt-1.5">
              <span className="text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded text-[10px]">
                {currentTeam.pressureLabel}
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">${player.earningsMillions.toFixed(1)}M Fortuna</span>
            </div>
          </div>

          <button
            onClick={() => setShowHelpModal(true)}
            className="text-slate-400 hover:text-amber-400 p-2 sm:hidden"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Action Controls */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => setShowLifestyleModal(true)}
            className="bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold text-xs px-4 py-4 rounded-2xl transition-all flex items-center gap-2 shadow-lg"
          >
            <Building className="w-4 h-4 text-emerald-400" />
            <span>INVERSIONES (${player.earningsMillions.toFixed(1)}M)</span>
          </button>

          <button
            disabled={isSimulating}
            onClick={handleSimulateSeason}
            className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-display font-black text-xl uppercase tracking-wider px-8 py-4 rounded-2xl shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'SIMULANDO...' : `SIMULAR TEMPORADA ${seasonYear}`}</span>
          </button>

          {player.age >= 32 && (
            <button
              onClick={onRetire}
              className="bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-300 font-bold text-xs px-4 py-4 rounded-2xl transition-all"
            >
              RETIRARSE 🏛️
            </button>
          )}
        </div>
      </div>

      {/* MAIN DASHBOARD CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* MAIN COLUMN (Rendered First for Mobile Priority: Latest Stats & History) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* LATEST SEASON PERFORMANCE FEED & TEAM INFO */}
          {latestStats ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl sm:rounded-3xl p-5 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">ÚLTIMA TEMPORADA COMPLETADA</div>
                  <h3 className="font-display text-2xl sm:text-3xl font-black text-white uppercase">{latestStats.year} (Edad {latestStats.age})</h3>
                </div>
                <div className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full font-bold text-xs">
                  {latestStats.summaryBadge}
                </div>
              </div>

              {/* Stats Averages Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5">
                  <div className="text-[9px] text-slate-400 uppercase font-semibold">PPG</div>
                  <div className="font-display font-black text-xl text-amber-400">{latestStats.ppg}</div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5">
                  <div className="text-[9px] text-slate-400 uppercase font-semibold">APG</div>
                  <div className="font-display font-black text-xl text-blue-400">{latestStats.apg}</div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5">
                  <div className="text-[9px] text-slate-400 uppercase font-semibold">RPG</div>
                  <div className="font-display font-black text-xl text-emerald-400">{latestStats.rpg}</div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5">
                  <div className="text-[9px] text-slate-400 uppercase font-semibold">FG%</div>
                  <div className="font-display font-black text-lg text-white">{latestStats.fgPct}%</div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5">
                  <div className="text-[9px] text-slate-400 uppercase font-semibold">3P%</div>
                  <div className="font-display font-black text-lg text-white">{latestStats.threePct}%</div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5">
                  <div className="text-[9px] text-slate-400 uppercase font-semibold">RÉCORD & SEED</div>
                  <div className="font-display font-black text-sm text-amber-300">{latestStats.teamRecord.wins}-{latestStats.teamRecord.losses} (#{latestStats.teamRecord.seed})</div>
                </div>
              </div>

              {/* Awards Badges */}
              {latestStats.awardsWon.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Premios De La Temporada:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {latestStats.awardsWon.map((aw, i) => (
                      <span key={i} className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>{aw}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl sm:rounded-3xl p-6 text-center space-y-3">
              <LarryOBrienTrophyIcon className="w-16 h-16 mx-auto drop-shadow-lg" />
              <h3 className="font-display text-2xl font-black text-white uppercase">CARRERA NBA LISTA PARA INICIAR</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Toca el botón <span className="text-amber-400 font-bold">"SIMULAR TEMPORADA"</span> para jugar tu primer año oficial en la NBA.
              </p>
            </div>
          )}

          {/* DETAILED SEASON HISTORY TABLE WITH CONFERENCE SEED & PLAYOFF ROUND */}
          {careerHistory.length > 0 && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3">
              <h3 className="font-bold text-white text-sm">HISTORIAL NARRATIVO DE TEMPORADAS NBA</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
                      <th className="pb-2.5 px-2">Año</th>
                      <th className="pb-2.5 px-2">Equipo</th>
                      <th className="pb-2.5 px-2 text-center font-bold">Récord & Seed</th>
                      <th className="pb-2.5 px-2 text-center">PPG</th>
                      <th className="pb-2.5 px-2 text-center">APG</th>
                      <th className="pb-2.5 px-2 text-center">RPG</th>
                      <th className="pb-2.5 px-2 text-right">Resultado Playoffs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {careerHistory.map((s, idx) => {
                      const t = getTeamById(s.teamId);
                      return (
                        <tr key={idx} className="hover:bg-slate-800/40 font-medium">
                          <td className="py-2.5 px-2 font-bold text-amber-400">{s.year}</td>
                          <td className="py-2.5 px-2 text-white flex items-center gap-1.5">
                            <img src={t.logoUrl} alt={t.name} className="w-4 h-4 object-contain" />
                            <span>{t.abbreviation}</span>
                          </td>
                          <td className="py-2.5 px-2 text-center text-amber-300 font-bold">
                            {s.teamRecord.wins}-{s.teamRecord.losses} <span className="text-[10px] font-normal text-slate-400">(#{s.teamRecord.seed} {t.conference})</span>
                          </td>
                          <td className="py-2.5 px-2 text-center text-white font-bold">{s.ppg}</td>
                          <td className="py-2.5 px-2 text-center text-slate-300">{s.apg}</td>
                          <td className="py-2.5 px-2 text-center text-slate-300">{s.rpg}</td>
                          <td className="py-2.5 px-2 text-right text-slate-200 font-semibold">{s.playoffResult}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* SIDE COLUMN: COLLAPSIBLE ATTRIBUTES & SINGLE-LINE TROPHY CAROUSEL */}
        <div className="space-y-6">
          
          {/* COLLAPSIBLE ATTRIBUTES PANEL */}
          <AttributesPanel player={player} />

          {/* Hall of Fame Meter */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl sm:rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-sm">PROBABILIDAD HALL OF FAME</h3>
              </div>
              <span className="font-display font-black text-2xl text-amber-400">{trophyCase.hallOfFameChance}%</span>
            </div>
            
            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-1000"
                style={{ width: `${trophyCase.hallOfFameChance}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-400">Gana anillos NBA, Oros Olímpicos, Copas Mundiales y trofeos MVP.</p>
          </div>

          {/* TROPHY CABINET: SINGLE HORIZONTAL SCROLLING ROW FOR MOBILE / CLEAN GRID FOR DESKTOP */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl sm:rounded-3xl p-5 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>VITRINA DE CAMPEONATOS HD</span>
            </h3>

            {/* Single Horizontal Carousel Row for Mobile / Compact Grid on Desktop */}
            <div className="flex sm:grid sm:grid-cols-2 gap-3 text-xs overflow-x-auto pb-2 sm:pb-0 scrollbar-thin">
              <div className="min-w-[110px] sm:min-w-0 bg-gradient-to-b from-slate-950 to-slate-900 border border-amber-500/30 rounded-xl p-3 text-center space-y-1 shadow-lg flex-shrink-0">
                <ChampionshipRingIcon className="w-10 h-10 mx-auto drop-shadow-md" />
                <div className="font-display font-black text-xl text-amber-300">{trophyCase.championships}</div>
                <div className="text-slate-300 text-[9px] uppercase font-bold tracking-wider">ANILLOS NBA</div>
              </div>

              <div className="min-w-[110px] sm:min-w-0 bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 rounded-xl p-3 text-center space-y-1 shadow-lg flex-shrink-0">
                <NbaCupTrophyIcon className="w-10 h-10 mx-auto drop-shadow-md" />
                <div className="font-display font-black text-xl text-amber-400">{trophyCase.nbaCupTitles || 0}</div>
                <div className="text-slate-300 text-[9px] uppercase font-bold tracking-wider">NBA CUP</div>
              </div>

              <div className="min-w-[110px] sm:min-w-0 bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 rounded-xl p-3 text-center space-y-1 shadow-lg flex-shrink-0">
                <OlympicGoldMedalIcon className="w-10 h-10 mx-auto drop-shadow-md" />
                <div className="font-display font-black text-xl text-amber-300">{trophyCase.olympicGoldMedals || 0}</div>
                <div className="text-slate-300 text-[9px] uppercase font-bold tracking-wider">ORO OLÍMPICO</div>
              </div>

              <div className="min-w-[110px] sm:min-w-0 bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 rounded-xl p-3 text-center space-y-1 shadow-lg flex-shrink-0">
                <FibaWorldCupIcon className="w-10 h-10 mx-auto drop-shadow-md" />
                <div className="font-display font-black text-xl text-cyan-400">{trophyCase.fibaWorldCups || 0}</div>
                <div className="text-slate-300 text-[9px] uppercase font-bold tracking-wider">MUNDIAL FIBA</div>
              </div>

              <div className="min-w-[110px] sm:min-w-0 bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 rounded-xl p-3 text-center space-y-1 shadow-lg flex-shrink-0">
                <MvpTrophyIcon className="w-10 h-10 mx-auto drop-shadow-md" />
                <div className="font-display font-black text-xl text-amber-400">{trophyCase.regularMvp}</div>
                <div className="text-slate-300 text-[9px] uppercase font-bold tracking-wider">MVP REGULAR</div>
              </div>

              <div className="min-w-[110px] sm:min-w-0 bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 rounded-xl p-3 text-center space-y-1 shadow-lg flex-shrink-0">
                <AllStarKobeIcon className="w-10 h-10 mx-auto drop-shadow-md" />
                <div className="font-display font-black text-xl text-blue-400">{trophyCase.allStarSelections}</div>
                <div className="text-slate-300 text-[9px] uppercase font-bold tracking-wider">ALL-STAR NBA</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* MOBILE STICKY BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 p-3 sm:hidden backdrop-blur-md flex items-center justify-between gap-2">
        <button
          onClick={() => setShowLifestyleModal(true)}
          className="bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold text-xs p-3.5 rounded-xl flex items-center gap-1"
        >
          <Building className="w-4 h-4 text-emerald-400" />
          <span>NEGOCIOS</span>
        </button>

        <button
          disabled={isSimulating}
          onClick={handleSimulateSeason}
          className="flex-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black font-display font-black text-lg uppercase tracking-wider py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
          <span>{isSimulating ? 'SIMULANDO...' : `SIMULAR ${seasonYear}`}</span>
        </button>
      </div>

    </div>
  );
};
