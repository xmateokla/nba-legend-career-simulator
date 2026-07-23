import React, { useState } from 'react';
import { Player, Position } from '../types/game';
import { Zap, User, Target, ArrowRight, Hash } from 'lucide-react';

interface QuickStartCreatorProps {
  onComplete: (player: Player) => void;
}

const POSITIONS: { id: Position; label: string; icon: string }[] = [
  { id: 'PG', label: 'Base', icon: '🧠' },
  { id: 'SG', label: 'Escolta', icon: '🎯' },
  { id: 'SF', label: 'Alero', icon: '⚡' },
  { id: 'PF', label: 'Ala-Pívot', icon: '🏋️' },
  { id: 'C',  label: 'Pívot', icon: '🛡️' },
];

export const QuickStartCreator: React.FC<QuickStartCreatorProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState<Position>('PG');
  const [jerseyNumber, setJerseyNumber] = useState(23);

  const handleCreate = () => {
    const newPlayer: Player = {
      id: `player_${Date.now()}`,
      name: name.trim() || 'Mi Jugador',
      country: 'Estados Unidos',
      position,
      archetype: 'playmaker',
      prospectTier: '5_STAR',
      difficulty: 'NORMAL',
      potentialMaxOvr: 97,
      heightFeet: 6,
      heightInches: 5,
      weightLbs: 200,
      wingspanInches: 83,
      jerseyNumber,
      college: 'Duke',
      age: 19,
      ovr: 75,
      reputation: 50,
      marketability: 55,
      earningsMillions: 0,
      passiveIncomeMillions: 0,
      attributes: {
        shooting3P: 72,
        shootingMid: 70,
        finishing: 74,
        playmaking: 78,
        defense: 68,
        athletic: 76,
        durability: 75,
        rebounding: 65,
        clutch: 70,
      },
      currentTeamId: null,
      draftPick: null,
      draftTeamId: null,
      contractYearsRemaining: 4,
      contractSalaryMillions: 4.5,
      shoeSponsor: null,
      hasSignatureShoe: false,
      injuriesHistory: [],
      completedEventIds: [],
      unlockedBadges: ['🔥 Novato'],
      investments: [],
    };
    onComplete(newPlayer);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-lg space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>NBA LEGEND</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white uppercase tracking-tight">
            Crea tu Leyenda
          </h1>
          <p className="text-slate-400 text-sm">Solo lo esencial. Tu carrera empieza ahora.</p>
        </div>

        {/* Form Card */}
        <div className="game-card-panel border border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-6">
          
          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase flex items-center gap-2">
              <User className="w-4 h-4 text-amber-400" />
              Tu Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ej. LeBron James"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-white font-bold text-lg focus:border-amber-400 outline-none transition-all placeholder:text-slate-600"
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
            />
          </div>

          {/* Position */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-400" />
              Posición
            </label>
            <div className="grid grid-cols-5 gap-2">
              {POSITIONS.map(pos => (
                <button
                  key={pos.id}
                  onClick={() => setPosition(pos.id)}
                  className={`py-3 rounded-2xl border-2 transition-all text-center ${
                    position === pos.id
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 gold-glow'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div className="text-xl mb-0.5">{pos.icon}</div>
                  <div className="text-xs font-bold">{pos.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Jersey Number */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase flex items-center gap-2">
              <Hash className="w-4 h-4 text-amber-400" />
              Número de Dorsal
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                max="99"
                value={jerseyNumber}
                onChange={e => setJerseyNumber(parseInt(e.target.value) || 0)}
                className="w-24 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white font-bold text-2xl text-center focus:border-amber-400 outline-none"
              />
              <div className="flex flex-wrap gap-2">
                {[0, 1, 3, 8, 11, 13, 21, 23, 24, 30, 33].map(n => (
                  <button
                    key={n}
                    onClick={() => setJerseyNumber(n)}
                    className={`w-10 h-10 rounded-xl border text-sm font-bold transition-all ${
                      jerseyNumber === n
                        ? 'border-amber-400 bg-amber-500/20 text-amber-400'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Create Button */}
          <button
            onClick={handleCreate}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-display font-black text-lg uppercase px-8 py-4 rounded-2xl shadow-xl shadow-amber-500/20 active:scale-95 transition-all inline-flex items-center justify-center gap-2"
          >
            <span>Comenzar Carrera 🏀</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
