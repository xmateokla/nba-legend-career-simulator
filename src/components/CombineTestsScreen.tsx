import React, { useState } from 'react';
import { Player } from '../types/game';
import { calculateOvr, playAudioEffect } from '../utils/simulator';
import { JerseyPreview } from './JerseyPreview';
import { Ruler, Activity, Flame, ArrowRight, ShieldCheck, Dumbbell, Award, Sparkles, MessageSquare, Target, Trophy } from 'lucide-react';

interface CombineTestsScreenProps {
  player: Player;
  onCombineComplete: (updatedPlayer: Player) => void;
}

export const CombineTestsScreen: React.FC<CombineTestsScreenProps> = ({ player, onCombineComplete }) => {
  const [activeStep, setActiveStep] = useState<'measurements' | 'scrimmage' | 'interview' | 'scout_report'>('measurements');
  
  // Physical measurements calculated in CM
  const heightCm = Math.round((player.heightFeet * 12 + player.heightInches) * 2.54);
  const wingspanCm = Math.round(player.wingspanInches * 2.54);
  const verticalJumpCm = player.archetype === 'slasher' ? 105 : player.position === 'C' ? 88 : 96;
  const sprintThreeQuartersSec = player.position === 'PG' ? 3.12 : player.position === 'C' ? 3.45 : 3.24;

  // Scrimmage State
  const [tacticalPlan, setTacticalPlan] = useState<'scoring' | 'playmaking' | 'defense'>('scoring');
  const [scrimmageResult, setScrimmageResult] = useState<{ pts: number; ast: number; reb: number } | null>(null);

  // Interview Choice
  const [gmResponse, setGmResponse] = useState<string | null>(null);

  // Dynamic Scout Evaluation Grade Calculation
  const calculateScoutGrade = () => {
    let score = player.ovr;
    if (verticalJumpCm >= 100) score += 3;
    if (scrimmageResult) {
      score += scrimmageResult.pts * 0.4 + scrimmageResult.ast * 0.6 + scrimmageResult.reb * 0.5;
    }
    if (gmResponse === 'leader') score += 2;
    if (gmResponse === 'tactician') score += 2;

    if (score >= 88) return { grade: 'S+', title: 'PRODIGIO TOP 1 EN LA LOTERÍA 🌟', color: 'text-amber-400', desc: 'Los scouts te comparan con leyendas generacionales. Salto vertical sobresaliente y dominio de la cancha.' };
    if (score >= 82) return { grade: 'A+', title: 'LOTERÍA TOP 3 ASEGURADA 👑', color: 'text-emerald-400', desc: 'Cuerpo técnico e impresionado por tu IQ táctico y presencia física.' };
    if (score >= 76) return { grade: 'A', title: 'TOP 10 DEL NBA DRAFT 🎯', color: 'text-blue-400', desc: 'Prospecto titular con alto techo de desarrollo y atletismo verificado.' };
    return { grade: 'B+', title: 'PRIMERA RONDA ASEGURADA 🏀', color: 'text-cyan-400', desc: 'Rendimiento sólido en las pruebas físicas y buena actitud profesional.' };
  };

  const handleSimulateScrimmage = (plan: 'scoring' | 'playmaking' | 'defense') => {
    setTacticalPlan(plan);
    playAudioEffect('draft_buzzer');

    let pts = 18;
    let ast = 5;
    let reb = 4;

    if (plan === 'scoring') {
      pts = Math.floor(Math.random() * 8) + 24;
      ast = Math.floor(Math.random() * 4) + 3;
    } else if (plan === 'playmaking') {
      pts = Math.floor(Math.random() * 6) + 14;
      ast = Math.floor(Math.random() * 6) + 10;
    } else {
      pts = Math.floor(Math.random() * 6) + 16;
      reb = Math.floor(Math.random() * 6) + 9;
    }

    setScrimmageResult({ pts, ast, reb });
    setActiveStep('interview');
  };

  const handleInterviewChoice = (choice: string) => {
    setGmResponse(choice);
    playAudioEffect('badge');
    setActiveStep('scout_report');
  };

  const handleFinishCombine = () => {
    const scout = calculateScoutGrade();
    let ovrBonus = 0;
    if (scout.grade === 'S+' || scout.grade === 'A+') ovrBonus = 2;

    const updatedAttrs = { ...player.attributes };
    if (tacticalPlan === 'scoring') updatedAttrs.finishing += 2;
    if (tacticalPlan === 'playmaking') updatedAttrs.playmaking += 2;
    if (tacticalPlan === 'defense') updatedAttrs.defense += 2;

    const updatedPlayer: Player = {
      ...player,
      ovr: Math.min(player.potentialMaxOvr || 99, player.ovr + ovrBonus),
      attributes: updatedAttrs,
      reputation: player.reputation + 5,
    };

    onCombineComplete(updatedPlayer);
  };

  const scoutEval = calculateScoutGrade();

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 my-2 sm:my-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>NBA COMBINE • CHICAGO, ILLINOIS 🇺🇸</span>
          </div>
          <span className="text-xs font-bold text-slate-400">PASO 2 DE 3</span>
        </div>

        {/* STEP 1: PHYSICAL MEASUREMENTS IN CM & METERS */}
        {activeStep === 'measurements' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-white uppercase">
                PRUEBAS BIOMÉTRICAS & MEDIDAS
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">Mediciones verificadas por los scouts oficiales de la NBA en Chicago:</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-bold">ALTURA OFICIAL</div>
                <div className="font-display font-black text-3xl text-amber-400">{heightCm} cm</div>
                <div className="text-[10px] text-slate-400">({player.heightFeet}'{player.heightInches}")</div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-bold">ENVERGADURA</div>
                <div className="font-display font-black text-3xl text-emerald-400">{wingspanCm} cm</div>
                <div className="text-[10px] text-slate-400">({(wingspanCm / 100).toFixed(2)} m)</div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-bold">SALTO VERTICAL</div>
                <div className="font-display font-black text-3xl text-cyan-400">{verticalJumpCm} cm</div>
                <div className="text-[10px] text-slate-400">Impulso Máximo</div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-bold">SPRINT 3/4 CANCHA</div>
                <div className="font-display font-black text-3xl text-rose-400">{sprintThreeQuartersSec} seg</div>
                <div className="text-[10px] text-slate-400">Velocidad Pura</div>
              </div>
            </div>

            <button
              onClick={() => setActiveStep('scrimmage')}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-display font-black text-xl uppercase tracking-wider py-4 rounded-2xl shadow-xl shadow-amber-500/20 active:scale-95 transition-all"
            >
              <span>CONTINUAR AL PARTIDO 5v5 DE NOVIOS (SCRIMMAGE)</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 2: CHICAGO 5v5 SCRIMMAGE MATCH */}
        {activeStep === 'scrimmage' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-white uppercase">
                PARTIDO 5v5 DE EXHIBICIÓN (SCRIMMAGE)
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">Los 30 General Managers están en las gradas evaluando tu plan de juego:</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => handleSimulateScrimmage('scoring')}
                className="bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500 rounded-2xl p-5 text-left space-y-2 transition-all hover:scale-105"
              >
                <div className="font-bold text-amber-400 text-base">💥 Ataque Agresivo</div>
                <p className="text-xs text-slate-400">Buscas anotar en cada posesión y demostrar tu capacidad de súper anotador.</p>
              </button>

              <button
                onClick={() => handleSimulateScrimmage('playmaking')}
                className="bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-blue-500 rounded-2xl p-5 text-left space-y-2 transition-all hover:scale-105"
              >
                <div className="font-bold text-blue-400 text-base">🧠 Juego Colectivo</div>
                <p className="text-xs text-slate-400">Generas juego para tus compañeros y dominas el ritmo con asistencias.</p>
              </button>

              <button
                onClick={() => handleSimulateScrimmage('defense')}
                className="bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500 rounded-2xl p-5 text-left space-y-2 transition-all hover:scale-105"
              >
                <div className="font-bold text-emerald-400 text-base">🛡️ Intensidad Defensiva</div>
                <p className="text-xs text-slate-400">Presionas toda la cancha, robas balones y dominas los rebotes.</p>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: GM INTERVIEWS SIDE-BY-SIDE CARDS */}
        {activeStep === 'interview' && scrimmageResult && (
          <div className="space-y-6 animate-fadeIn">
            {/* Scrimmage Result Stat Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-400 uppercase font-bold">LÍNEA ESTADÍSTICA DEL SCRIMMAGE</span>
                <div className="font-display font-black text-2xl text-white">
                  {scrimmageResult.pts} PTS • {scrimmageResult.ast} AST • {scrimmageResult.reb} REB
                </div>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                Impresionó a los Scouts
              </span>
            </div>

            <div>
              <h2 className="font-display text-3xl font-black text-white uppercase">ENTREVISTAS CON GENERAL MANAGERS</h2>
              <p className="text-xs text-slate-400">Los ejecutivos te preguntan cuál es tu mentalidad ante tu temporada de novato:</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => handleInterviewChoice('humble')}
                className="bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500 rounded-2xl p-4 text-left space-y-2 transition-all"
              >
                <div className="font-bold text-white text-sm">🤝 "Trabajaré más fuerte que nadie y haré lo que pida el coach."</div>
                <p className="text-xs text-slate-400">Humildad y ética de trabajo. (+2 Durabilidad)</p>
              </button>

              <button
                onClick={() => handleInterviewChoice('star')}
                className="bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500 rounded-2xl p-4 text-left space-y-2 transition-all"
              >
                <div className="font-bold text-white text-sm">👑 "Soy el mejor jugador de esta clase y vengo a dominar."</div>
                <p className="text-xs text-slate-400">Confianza de superestrella. (+12 Comercialización)</p>
              </button>

              <button
                onClick={() => handleInterviewChoice('tactician')}
                className="bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500 rounded-2xl p-4 text-left space-y-2 transition-all"
              >
                <div className="font-bold text-white text-sm">🧠 "He estudiado sus sistemas tácticos y sé encajar perfectamente."</div>
                <p className="text-xs text-slate-400">Alto IQ basquetbolístico. (+2 OVR)</p>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: DYNAMIC SCOUT EVALUATION BREAKDOWN CARD */}
        {activeStep === 'scout_report' && (
          <div className="space-y-6 animate-fadeIn text-center">
            <div className="bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
              
              <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase px-4 py-1.5 rounded-full">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>INFORME FINAL DEL CUERPO DE SCOUTS DE LA NBA</span>
              </div>

              <div className="space-y-1">
                <div className={`font-display font-black text-6xl ${scoutEval.color}`}>
                  GRADO {scoutEval.grade}
                </div>
                <h3 className="font-display font-black text-2xl text-white uppercase">{scoutEval.title}</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto italic">{scoutEval.desc}</p>
              </div>

              <button
                onClick={handleFinishCombine}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-display font-black text-xl uppercase tracking-wider py-4 rounded-2xl shadow-xl shadow-amber-500/20 active:scale-95 transition-all"
              >
                <span>IR A LA NOCHE DEL NBA DRAFT</span>
                <ArrowRight className="w-5 h-5" />
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
