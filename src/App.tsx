import React, { useState } from 'react';
import { GamePhase, Player, SeasonStats, TrophyCase } from './types/game';
import { Navbar } from './components/Navbar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ProspectCreator } from './components/ProspectCreator';
import { CombineTests } from './components/CombineTests';
import { DraftNightScreen } from './components/DraftNightScreen';
import { CareerDashboard } from './components/CareerDashboard';
import { TradingCardExport } from './components/TradingCardExport';

export const App: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>('WELCOME');
  const [player, setPlayer] = useState<Player | null>(null);
  const [seasonYear, setSeasonYear] = useState<number>(2026);
  const [careerHistory, setCareerHistory] = useState<SeasonStats[]>([]);
  const [trophyCase, setTrophyCase] = useState<TrophyCase>({
    championships: 0,
    finalsMvp: 0,
    regularMvp: 0,
    rookieOfTheYear: false,
    dpoy: 0,
    allStarSelections: 0,
    allNbaFirstTeam: 0,
    scoringTitles: 0,
    nbaCupTitles: 0,
    nbaCupMvp: 0,
    olympicGoldMedals: 0,
    fibaWorldCups: 0,
    dunkContestChampion: false,
    threePointChampion: false,
    totalPoints: 0,
    totalAssists: 0,
    totalRebounds: 0,
    hallOfFameChance: 0,
  });

  const handleResetGame = () => {
    setPhase('WELCOME');
    setPlayer(null);
    setSeasonYear(2026);
    setCareerHistory([]);
    setTrophyCase({
      championships: 0,
      finalsMvp: 0,
      regularMvp: 0,
      rookieOfTheYear: false,
      dpoy: 0,
      allStarSelections: 0,
      allNbaFirstTeam: 0,
      scoringTitles: 0,
      nbaCupTitles: 0,
      nbaCupMvp: 0,
      olympicGoldMedals: 0,
      fibaWorldCups: 0,
      dunkContestChampion: false,
      threePointChampion: false,
      totalPoints: 0,
      totalAssists: 0,
      totalRebounds: 0,
      hallOfFameChance: 0,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19]">
      <Navbar player={player} seasonYear={seasonYear} onReset={handleResetGame} />

      <main className="flex-1">
        {phase === 'WELCOME' && (
          <WelcomeScreen onStart={() => setPhase('PROSPECT_CREATION')} />
        )}

        {phase === 'PROSPECT_CREATION' && (
          <ProspectCreator
            onComplete={createdPlayer => {
              setPlayer(createdPlayer);
              setPhase('COMBINE_TESTS');
            }}
          />
        )}

        {phase === 'COMBINE_TESTS' && player && (
          <CombineTests
            player={player}
            onComplete={updatedPlayer => {
              setPlayer(updatedPlayer);
              setPhase('DRAFT_NIGHT');
            }}
          />
        )}

        {phase === 'DRAFT_NIGHT' && player && (
          <DraftNightScreen
            player={player}
            onDraftComplete={(draftTeamId: string, pickNumber: number) => {
              setPlayer({
                ...player,
                draftTeamId,
                currentTeamId: draftTeamId,
                draftPick: pickNumber,
              });
              setPhase('SEASON_DASHBOARD');
            }}
          />
        )}

        {phase === 'SEASON_DASHBOARD' && player && (
          <CareerDashboard
            player={player}
            onUpdatePlayer={setPlayer}
            seasonYear={seasonYear}
            onAdvanceSeasonYear={() => setSeasonYear(prev => prev + 1)}
            onRetire={() => setPhase('HALL_OF_FAME')}
            careerHistory={careerHistory}
            onAddSeasonHistory={stats => setCareerHistory(prev => [...prev, stats])}
            trophyCase={trophyCase}
            onUpdateTrophyCase={setTrophyCase}
          />
        )}

        {phase === 'HALL_OF_FAME' && player && (
          <TradingCardExport
            player={player}
            trophyCase={trophyCase}
            careerStatsHistory={careerHistory}
            onRestart={handleResetGame}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 px-4 text-center text-xs text-slate-400">
        <p>NBA LEGEND • Simulador de Carrera & Draft NBA © 2026. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default App;
