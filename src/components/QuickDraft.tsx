import React, { useState, useEffect } from 'react';
import { Player } from '../types/game';
import { getTeamById, NBA_TEAMS } from '../data/nbaTeams';
import { playAudioEffect } from '../utils/simulator';
import { Trophy, Zap, TrendingUp } from 'lucide-react';

interface QuickDraftProps {
  player: Player;
  onDraftComplete: (teamId: string) => void;
}

// Starting teams - realistic rookie draft picks
const DRAFT_TEAMS: { id: string; tier: 'contender' | 'playoff' | 'rebuild' }[] = [
  // Rebuild/Small market teams where rookies typically start
  { id: 'spurs', tier: 'rebuild' },
  { id: 'rockets', tier: 'rebuild' },
  { id: 'thunder', tier: 'rebuild' },
  { id: 'jazz', tier: 'rebuild' },
  { id: 'magic', tier: 'rebuild' },
  { id: 'hornets', tier: 'rebuild' },
  { id: 'wizards', tier: 'rebuild' },
  { id: 'pistons', tier: 'rebuild' },
  { id: 'blazers', tier: 'rebuild' },
  { id: 'pacers', tier: 'playoff' },
  { id: 'grizzlies', tier: 'playoff' },
  { id: 'pelicans', tier: 'playoff' },
  { id: 'cavaliers', tier: 'playoff' },
  { id: 'kings', tier: 'playoff' },
  { id: 'hawks', tier: 'playoff' },
  // Occasionally contenders
  { id: 'mavericks', tier: 'contender' },
  { id: 'celtics', tier: 'contender' },
  { id: 'nuggets', tier: 'contender' },
  { id: 'heat', tier: 'contender' },
];

export const QuickDraft: React.FC<QuickDraftProps> = ({ player, onDraftComplete }) => {
  const [phase, setPhase] = useState<'lottery' | 'pick'>('lottery');
  const [selectedTeam] = useState(() => {
    return DRAFT_TEAMS[Math.floor(Math.random() * DRAFT_TEAMS.length)].id;
  });

  const team = getTeamById(selectedTeam);

  useEffect(() => {
    playAudioEffect('draft_buzzer');
    const timer = setTimeout(() => {
      playAudioEffect('cheer');
      setPhase('pick');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleConfirm = () => {
    playAudioEffect('badge');
    onDraftComplete(selectedTeam);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-lg space-y-6 text-center">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>DRAFT NBA</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white uppercase">
            Tu Equipo
          </h1>
        </div>

        {/* Draft Result */}
        <div className={`game-card-panel border-2 ${phase === 'lottery' ? 'border-amber-500/50' : 'border-emerald-500/50'} rounded-3xl p-8 space-y-4 transition-all`}>
          
          {phase === 'lottery' ? (
            <>
              <div className="w-20 h-20 rounded-full bg-slate-950 border-2 border-amber-500/50 mx-auto flex items-center justify-center animate-pulse">
                <Trophy className="w-10 h-10 text-amber-400" />
              </div>
              <div className="space-y-1">
                <h2 className="font-display font-black text-2xl text-amber-400 uppercase animate-pulse">
                  SORTEO EN PROGRESO...
                </h2>
                <p className="text-sm text-slate-400">Analizando combinaciones de lotería</p>
              </div>
            </>
          ) : (
            <>
              {/* Team Logo */}
              <div className="w-24 h-24 rounded-2xl bg-slate-950 border-2 border-emerald-500/50 mx-auto flex items-center justify-center shadow-xl">
                <img src={team.logoUrl} alt={team.name} className="w-full h-full object-contain drop-shadow-lg" />
              </div>

              {/* Team Name */}
              <div className="space-y-1">
                <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                  CON {team.city}
                </div>
                <h2 className="font-display font-black text-4xl text-white uppercase">
                  {team.name}
                </h2>
                <p className="text-sm text-slate-400 italic">
                  "{player.name}" ha sido seleccionado
                </p>
              </div>

              {/* Player Summary */}
              <div className="bg-slate-900/80 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">{player.position} • #{player.jerseyNumber ?? '?'}</span>
                  <span className="text-amber-400 font-bold">OVR {player.ovr}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Edad {player.age}</span>
                  <span className="text-slate-400">{player.country}</span>
                </div>
              </div>

              {/* Stats Preview */}
              <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
                <TrendingUp className="w-3 h-3" />
                <span>Tu carrera comienza ahora</span>
              </div>
            </>
          )}
        </div>

        {/* Confirm Button */}
        {phase === 'pick' && (
          <button
            onClick={handleConfirm}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-black text-xl uppercase px-8 py-5 rounded-2xl shadow-xl shadow-amber-500/20 active:scale-95 transition-all"
          >
            FIRMAR CONTRATO & COMENZAR 🏀
          </button>
        )}
      </div>
    </div>
  );
};
