import React, { useState } from 'react';
import { Player } from '../types/game';
import { ftInToCm } from './ProspectCreator';
import { Sparkles, ArrowRight, Activity, Trophy, MessageSquare, Flame, Shield, Award, Dumbbell, Zap } from 'lucide-react';

interface CombineTestsProps {
  player: Player;
  onComplete: (updatedPlayer: Player) => void;
}

export const CombineTests: React.FC<CombineTestsProps> = ({ player, onComplete }) => {
  const [step, setStep] = useState<'athletic' | 'scrimmage' | 'interview'>('athletic');
  const [testScore, setTestScore] = useState({ verticalCm: 92, sprintSec: 3.22, shootingPct: 70 });
  const [scrimmageResult, setScrimmageResult] = useState<{ pts: number; ast: number; reb: number; story: string } | null>(null);
  const [scoutPoints, setScoutPoints] = useState(0);

  const playerHeightCm = ftInToCm(player.heightFeet, player.heightInches);
  const playerWingspanCm = Math.round(playerHeightCm * 1.06);

  // Step 1: Run Physical Combine Drills
  const handleRunAthleticDrills = () => {
    const vertical = Math.min(115, Math.max(75, Math.round(player.attributes.athletic * 1.1 + Math.random() * 8)));
    const sprint = parseFloat((3.45 - (player.attributes.athletic * 0.005) - Math.random() * 0.1).toFixed(2));
    const shooting = Math.min(95, Math.max(50, Math.round(player.attributes.shooting3P * 0.8 + Math.random() * 15)));

    setTestScore({ verticalCm: vertical, sprintSec: sprint, shootingPct: shooting });
    setStep('scrimmage');
  };

  // Step 2: 5v5 Rookie Scrimmage Simulation
  const handlePlayScrimmage = (playstyle: 'aggressive' | 'team_play' | 'defensive') => {
    let pts = 14;
    let ast = 4;
    let reb = 5;
    let story = '';

    if (playstyle === 'aggressive') {
      pts = Math.round(18 + Math.random() * 8);
      ast = Math.round(2 + Math.random() * 3);
      story = 'Dominaste el marcador con ataques explosivos al aro. Varios scouts anotaron tu capacidad de generar tu propio tiro.';
    } else if (playstyle === 'team_play') {
      pts = Math.round(12 + Math.random() * 4);
      ast = Math.round(7 + Math.random() * 4);
      story = 'Manejaste el ritmo con madurez, distribuyendo el balón y encontrando compañeros desmarcados en transición.';
    } else {
      pts = Math.round(10 + Math.random() * 5);
      reb = Math.round(8 + Math.random() * 4);
      story = 'Fuiste un cerrojo defensivo: 3 robos y 2 tapas. Los entrenadores elogiaron tu intensidad en la primera línea.';
    }

    setScrimmageResult({ pts, ast, reb, story });
    setStep('interview');
  };

  // Step 3: GM Interview with Horizontal Choice Cards
  const handleAnswerInterview = (bonusOvr: number, reputationBonus: number) => {
    const updatedPlayer: Player = {
      ...player,
      ovr: player.ovr + bonusOvr,
      reputation: player.reputation + reputationBonus,
      marketability: player.marketability + (bonusOvr > 1 ? 8 : 4),
    };
    onComplete(updatedPlayer);
  };

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 my-2 sm:my-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Activity className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>PASO 2: NBA COMBINE EN CHICAGO 🇺🇸</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
              EVALUACIÓN DE PROSPECTO
            </h2>
            <p className="text-xs text-slate-400">Demuestra tus atributos físicos y talento baloncestístico ante los 30 General Managers de la NBA.</p>
          </div>

          <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-2xl text-right">
            <div className="text-[10px] text-slate-400 font-bold uppercase">PROSPECTO</div>
            <div className="font-bold text-white text-sm">{player.name} ({player.position})</div>
            <div className="text-xs text-amber-400 font-bold">{playerHeightCm} cm • Envergadura: {playerWingspanCm} cm</div>
          </div>
        </div>

        {/* STEP 1: PHYSICAL DRILLS (METRIC SYSTEM) */}
        {step === 'athletic' && (
          <div className="space-y-6 text-center py-4">
            <div className="max-w-md mx-auto space-y-2">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl mx-auto flex items-center justify-center text-3xl">
                📏
              </div>
              <h3 className="font-display font-black text-2xl text-white uppercase">PRUEBAS BIOMÉTRICAS Y ATLETISMO</h3>
              <p className="text-xs text-slate-400">Salto vertical en centímetros, velocidad de sprint y efectividad de tiro perimetral.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-center">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">ALTURA REAL</div>
                <div className="font-display font-black text-2xl text-white">{playerHeightCm} cm</div>
                <div className="text-[10px] text-slate-500 font-medium">({player.heightFeet}'{player.heightInches}")</div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">ENVERGADURA</div>
                <div className="font-display font-black text-2xl text-amber-400">{playerWingspanCm} cm</div>
                <div className="text-[10px] text-slate-500 font-medium">({(playerWingspanCm/100).toFixed(2)} metros)</div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">SALTO ESTIMADO</div>
                <div className="font-display font-black text-2xl text-emerald-400">~95 cm</div>
                <div className="text-[10px] text-slate-500 font-medium">Alcance Máximo</div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">PESO CORPORAL</div>
                <div className="font-display font-black text-2xl text-cyan-400">{Math.round(player.weightLbs * 0.453592)} kg</div>
                <div className="text-[10px] text-slate-500 font-medium">({player.weightLbs} lbs)</div>
              </div>
            </div>

            <button
              onClick={handleRunAthleticDrills}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-display font-black text-xl uppercase tracking-wider px-10 py-4 rounded-2xl shadow-xl shadow-amber-500/20 active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <span>EJECUTAR PRUEBAS FÍSICAS EN CHICAGO</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 2: 5V5 ROOKIE SCRIMMAGE */}
        {step === 'scrimmage' && (
          <div className="space-y-6 py-2">
            <div className="text-center max-w-lg mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase">
                <span>RESULTADOS DE MEDIDAS COMPLETADOS</span>
              </div>
              <h3 className="font-display font-black text-3xl text-white uppercase">PARTIDO DE SIMULACIÓN 5V5 (SCRIMMAGE)</h3>
              <p className="text-xs text-slate-400">Elige tu plan táctico para el partido frente a los scouts de la NBA:</p>
            </div>

            {/* Results of athletic tests */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 grid grid-cols-3 gap-3 text-center max-w-xl mx-auto">
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">SALTO VERTICAL</div>
                <div className="font-display font-black text-xl text-emerald-400">{testScore.verticalCm} cm</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">SPRINT 3/4 CANCHA</div>
                <div className="font-display font-black text-xl text-amber-400">{testScore.sprintSec}s</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">TIRO DE 3P</div>
                <div className="font-display font-black text-xl text-cyan-400">{testScore.shootingPct}%</div>
              </div>
            </div>

            {/* Side by Side Horizontal Cards for Playstyle */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <button
                type="button"
                onClick={() => handlePlayScrimmage('aggressive')}
                className="bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/60 rounded-2xl p-5 text-left transition-all space-y-3 shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="text-amber-400 font-bold text-base flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-400" />
                    <span>Ataque Agresivo 💥</span>
                  </div>
                  <p className="text-xs text-slate-300">Buscar anotación individual en cada posesión con penetraciones explosivas.</p>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg font-bold">
                  +Puntos / Destaca en Anotación
                </span>
              </button>

              <button
                type="button"
                onClick={() => handlePlayScrimmage('team_play')}
                className="bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/60 rounded-2xl p-5 text-left transition-all space-y-3 shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="text-blue-400 font-bold text-base flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-400" />
                    <span>Juego Colectivo 🧠</span>
                  </div>
                  <p className="text-xs text-slate-300">Organizar la ofensiva, mover el balón y repartir asistencias.</p>
                </div>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-lg font-bold">
                  +Asistencias / IQ Elevado
                </span>
              </button>

              <button
                type="button"
                onClick={() => handlePlayScrimmage('defensive')}
                className="bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/60 rounded-2xl p-5 text-left transition-all space-y-3 shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="text-emerald-400 font-bold text-base flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    <span>Intensidad Defensiva 🛡️</span>
                  </div>
                  <p className="text-xs text-slate-300">Presionar toda la cancha, forzar pérdidas y asegurar rebotes.</p>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-lg font-bold">
                  +Robos / Tapas & Físico
                </span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: GM INTERVIEW WITH HORIZONTAL CARDS SIDE-BY-SIDE */}
        {step === 'interview' && scrimmageResult && (
          <div className="space-y-6 py-2">
            
            {/* Scrimmage Stat Line Banner */}
            <div className="bg-gradient-to-r from-amber-500/20 via-slate-900 to-slate-950 border border-amber-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <div className="text-[10px] text-amber-400 font-bold uppercase">ESTADÍSTICAS DEL PARTIDO 5V5</div>
                <div className="font-display font-black text-2xl text-white">
                  {scrimmageResult.pts} PTS • {scrimmageResult.ast} AST • {scrimmageResult.reb} REB
                </div>
                <p className="text-xs text-slate-300 mt-0.5">{scrimmageResult.story}</p>
              </div>
              <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-center flex-shrink-0">
                <span className="text-amber-300 text-xs font-bold">VALORACIÓN SCOUT: 9.2/10</span>
              </div>
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-display font-black text-3xl text-white uppercase">ENTREVIS TASTIVAS CON LOS GENERAL MANAGERS</h3>
              <p className="text-xs text-slate-400">El General Manager de una franquicia Top 5 te pregunta: <strong className="text-amber-400">"¿Qué impacto aportarás a nuestro equipo?"</strong></p>
            </div>

            {/* SIDE-BY-SIDE CARDS FOR INTERVIEW CHOICES (As requested by user!) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              
              {/* Choice Card 1: Team Leader */}
              <button
                type="button"
                onClick={() => handleAnswerInterview(2, 8)}
                className="bg-slate-950 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/80 rounded-2xl p-5 text-left transition-all space-y-4 shadow-xl flex flex-col justify-between hover:scale-[1.02]"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl">
                    🤝
                  </div>
                  <h4 className="font-bold text-white text-base">"Trabaré más fuerte que nadie y haré lo que pida el coach."</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Demuestras humildad profesional, ética de trabajo estricta y mentalidad de ganar campeonatos.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[11px] font-bold text-emerald-400">
                  +2 OVR • Impresiona a Entrenadores Veteranos
                </div>
              </button>

              {/* Choice Card 2: Super Confidence */}
              <button
                type="button"
                onClick={() => handleAnswerInterview(1, 12)}
                className="bg-slate-950 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/80 rounded-2xl p-5 text-left transition-all space-y-4 shadow-xl flex flex-col justify-between hover:scale-[1.02]"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-xl">
                    👑
                  </div>
                  <h4 className="font-bold text-white text-base">"Soy el mejor jugador de esta clase y vengo a dominar."</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Confianza de superestrella generacional. Atrae la atención de los grandes medios de comunicación.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[11px] font-bold text-purple-400">
                  +12 Comercialización • Grandes Mercados (LA/NY)
                </div>
              </button>

              {/* Choice Card 3: Tactical Analyst */}
              <button
                type="button"
                onClick={() => handleAnswerInterview(2, 6)}
                className="bg-slate-950 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/80 rounded-2xl p-5 text-left transition-all space-y-4 shadow-xl flex flex-col justify-between hover:scale-[1.02]"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-xl">
                    🧠
                  </div>
                  <h4 className="font-bold text-white text-base">"He estudiado sus sistemas tácticos y sé exactamente cómo encajar."</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Demuestras un IQ de juego sobresaliente, estudio de vídeo previo y profesionalismo avanzado.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[11px] font-bold text-blue-400">
                  +2 OVR • Eleva Proyección en el Draft
                </div>
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
