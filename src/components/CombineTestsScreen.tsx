import React, { useState } from 'react';
import { Player } from '../types/game';
import { calculateOvr, playAudioEffect } from '../utils/simulator';
import { Ruler, Activity, Flame, ArrowRight, ShieldCheck, Dumbbell, Award, Sparkles, MessageSquare, Target, Trophy, Zap, AlertTriangle, Dice5, Check, HelpCircle } from 'lucide-react';

interface CombineTestsScreenProps {
  player: Player;
  onCombineComplete: (updatedPlayer: Player) => void;
}

export interface TacticalPlanOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  proText: string;
  statBoost: { key: keyof Player['attributes']; val: number };
}

export interface GmInterviewOption {
  id: string;
  text: string;
  description: string;
  bonusType: string;
  bonusStat: { key: string; val: number };
}

export interface GmQuestionDefinition {
  questionText: string;
  gmRole: string;
  options: GmInterviewOption[];
}

// 1. DYNAMIC POOL OF 9 RANDOMIZABLE SCRIMMAGE TACTICAL PLANS
const SCRIMMAGE_PLANS_POOL: TacticalPlanOption[] = [
  {
    id: 'plan_iso_scorer',
    title: '💥 Ataque Individual & Aislamiento (Iso-Scorer)',
    description: 'Buscas anotar en cada posesión desafiando al defensor 1v1 con penetraciones explosivas.',
    icon: '💥',
    proText: '+3 Finalización en Pintura',
    statBoost: { key: 'finishing', val: 3 },
  },
  {
    id: 'plan_playmaker_pnr',
    title: '🧠 Pick & Roll & Visión Colectiva',
    description: 'Lees la defensa rival, desarticulando el esquema con pases filtrados a tus compañeros.',
    icon: '🧠',
    proText: '+3 Pase & Visión',
    statBoost: { key: 'playmaking', val: 3 },
  },
  {
    id: 'plan_perimeter_clamp',
    title: '🛡️ Presión Perimetral & Robos (Lockdown)',
    description: 'Presionas toda la cancha, forzando pérdidas de balón y cortando líneas de pase.',
    icon: '🛡️',
    proText: '+3 Defensa & Robos',
    statBoost: { key: 'defense', val: 3 },
  },
  {
    id: 'plan_3p_rain',
    title: '🎯 Lluvia de Triples & Tiro Lejano',
    description: 'Abres la cancha saliendo de cortinas indirectas para encestar triples en transición.',
    icon: '🎯',
    proText: '+3 Tiro de 3P',
    statBoost: { key: 'shooting3P', val: 3 },
  },
  {
    id: 'plan_fastbreak_heat',
    title: '⚡ Transición Relámpago & Contraataque',
    description: 'Empujas el ritmo de juego a máxima velocidad apenas tu equipo recupera el balón.',
    icon: '⚡',
    proText: '+3 Atletismo & Salto',
    statBoost: { key: 'athletic', val: 3 },
  },
  {
    id: 'plan_post_power',
    title: '🏋️ Dominio Físico & Juego de Poste',
    description: 'Te estableces en la pintura castigando el contacto físico y asegurando rebotes ofensivos.',
    icon: '🏋️',
    proText: '+3 Rebote & Fuerza',
    statBoost: { key: 'rebounding', val: 3 },
  },
];

// 2. DYNAMIC POOL OF RANDOMIZABLE GM INTERVIEW QUESTIONS
const GM_QUESTIONS_POOL: GmQuestionDefinition[] = [
  {
    questionText: '¿Cuál es tu verdadera mentalidad ante la presión de ser un novato en la NBA?',
    gmRole: 'General Manager Franquicia Top 5',
    options: [
      { id: 'gm_humble', text: '🤝 "Trabajaré más fuerte que nadie y aceptaré cualquier rol que pida el coach."', description: 'Demuestras ética de trabajo estricta y humildad profesional.', bonusType: '+2 Durabilidad & Respeto', bonusStat: { key: 'durability', val: 2 } },
      { id: 'gm_star', text: '👑 "Soy el mejor jugador de esta clase y vengo a liderar esta franquicia."', description: 'Confianza de superestrella. Atrae atención de medios de comunicación.', bonusType: '+12 Comercialización', bonusStat: { key: 'marketability', val: 12 } },
      { id: 'gm_tactician', text: '🧠 "He estudiado sus sistemas tácticos y sé exactamente cómo encajar."', description: 'IQ de juego sobresaliente y estudio avanzado de video.', bonusType: '+2 OVR Proyección', bonusStat: { key: 'ovr', val: 2 } },
    ]
  },
  {
    questionText: 'Si el equipo decide enviarte a la banca al inicio de la temporada, ¿cómo reaccionarías?',
    gmRole: 'Presidente de Operaciones de Baloncesto',
    options: [
      { id: 'gm_bench_pro', text: '💪 "Seré el primero en animar y aprovecharé cada minuto que me den."', description: 'Madurez profesional impecable.', bonusType: '+8 Reputación', bonusStat: { key: 'reputation', val: 8 } },
      { id: 'gm_bench_fire', text: '🔥 "Demostraré en cada entrenamiento que soy demasiado bueno para la banca."', description: 'Intensidad competitiva feroz.', bonusType: '+3 Factor Clutch', bonusStat: { key: 'clutch', val: 3 } },
      { id: 'gm_bench_adapt', text: '📊 "Aprenderé observando el juego desde afuera antes de entrar."', description: 'Visión analítica táctica.', bonusType: '+2 IQ Baloncesto', bonusStat: { key: 'playmaking', val: 2 } },
    ]
  },
  {
    questionText: '¿Qué pesa más para ti en tu carrera: ganar anillos o maximizar tus contratos?',
    gmRole: 'Scout Jefe de la Conferencia Oeste',
    options: [
      { id: 'gm_rings_first', text: '🏆 "Vine a esta liga a ser inmortal y ganar campeonatos."', description: 'Mentalidad de ganador enfocado en el legado.', bonusType: '+5 Factor Clutch', bonusStat: { key: 'clutch', val: 5 } },
      { id: 'gm_balance_biz', text: '💼 "Entiendo que la NBA es un negocio; busco éxito en ambos lados."', description: 'Visión de negocios moderna.', bonusType: '+10 Comercialización', bonusStat: { key: 'marketability', val: 10 } },
      { id: 'gm_culture_loyalty', text: '💖 "Construir una cultura ganadora y ser leal a la ciudad que me draftee."', description: 'Lealtad y química de vestuario.', bonusType: '+10 Reputación', bonusStat: { key: 'reputation', val: 10 } },
    ]
  }
];

export const CombineTestsScreen: React.FC<CombineTestsScreenProps> = ({ player, onCombineComplete }) => {
  const [activeStep, setActiveStep] = useState<'minigame' | 'scrimmage' | 'interview' | 'scout_report'>('minigame');
  
  // Physical measurements calculated in CM
  const heightCm = Math.round((player.heightFeet * 12 + player.heightInches) * 2.54);
  const wingspanCm = Math.round(player.wingspanInches * 2.54);
  const verticalJumpCm = player.archetype === 'slasher' ? 105 : player.position === 'C' ? 88 : 96;

  // MINIGAME TIMING METER STATE
  const [meterValue, setMeterValue] = useState(10);
  const [meterDirection, setMeterDirection] = useState<'up' | 'down'>('up');
  const [isMeterRunning, setIsMeterRunning] = useState(false);
  const [minigameScore, setMinigameScore] = useState<number | null>(null);

  // RANDOMIZED SCRIMMAGE MATCH PLANS (Selected 3 randomly from pool!)
  const [randomTacticalPlans] = useState<TacticalPlanOption[]>(() => {
    const shuffled = [...SCRIMMAGE_PLANS_POOL].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  });
  const [selectedPlan, setSelectedPlan] = useState<TacticalPlanOption | null>(null);
  const [scrimmageResult, setScrimmageResult] = useState<{ pts: number; ast: number; reb: number } | null>(null);

  // RANDOMIZED GM INTERVIEW QUESTION (Selected 1 question randomly from pool!)
  const [randomGmQuestion] = useState<GmQuestionDefinition>(() => {
    return GM_QUESTIONS_POOL[Math.floor(Math.random() * GM_QUESTIONS_POOL.length)];
  });
  const [selectedInterviewAnswer, setSelectedInterviewAnswer] = useState<GmInterviewOption | null>(null);

  // INTERACTIVE MINIGAME TIMING METER LOOP
  React.useEffect(() => {
    if (!isMeterRunning) return;

    const interval = setInterval(() => {
      setMeterValue(prev => {
        if (prev >= 100) {
          setMeterDirection('down');
          return 98;
        }
        if (prev <= 0) {
          setMeterDirection('up');
          return 2;
        }
        return meterDirection === 'up' ? prev + 4 : prev - 4;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [isMeterRunning, meterDirection]);

  const handleStartMinigame = () => {
    setMeterValue(10);
    setMeterDirection('up');
    setIsMeterRunning(true);
    setMinigameScore(null);
  };

  const handleStopMinigame = () => {
    setIsMeterRunning(false);
    const score = meterValue;
    setMinigameScore(score);

    if (score >= 80 && score <= 94) {
      playAudioEffect('cheer');
    } else if (score >= 60) {
      playAudioEffect('badge');
    } else {
      playAudioEffect('draft_buzzer');
    }
  };

  const handleSelectTacticalPlan = (plan: TacticalPlanOption) => {
    setSelectedPlan(plan);
    playAudioEffect('draft_buzzer');

    let pts = Math.floor(Math.random() * 8) + 14;
    let ast = Math.floor(Math.random() * 5) + 3;
    let reb = Math.floor(Math.random() * 5) + 3;

    if (plan.id.includes('iso') || plan.id.includes('3p')) pts += 8;
    if (plan.id.includes('playmaker')) ast += 6;
    if (plan.id.includes('post') || plan.id.includes('clamp')) reb += 5;

    setScrimmageResult({ pts, ast, reb });
    setActiveStep('interview');
  };

  const handleSelectInterviewAnswer = (answer: GmInterviewOption) => {
    setSelectedInterviewAnswer(answer);
    playAudioEffect('badge');
    setActiveStep('scout_report');
  };

  // Dynamic Scout Evaluation Grade Calculation
  const calculateScoutGrade = () => {
    let score = player.ovr;
    
    if (minigameScore !== null) {
      if (minigameScore >= 80 && minigameScore <= 94) score += 4;
      else if (minigameScore >= 60) score += 2;
      else score -= 3;
    }

    if (scrimmageResult) {
      score += scrimmageResult.pts * 0.3 + scrimmageResult.ast * 0.4 + scrimmageResult.reb * 0.4;
    }

    if (score >= 86) return { grade: 'S+', title: 'PRODIGIO TOP 1 EN LA LOTERÍA 🌟', color: 'text-amber-400', desc: '¡Desempeño espectacular! Los scouts te proyectan Pick Top 3 en el Draft.', ovrDelta: +2 };
    if (score >= 80) return { grade: 'A+', title: 'LOTERÍA TOP 5 ASEGURADA 👑', color: 'text-emerald-400', desc: 'Gran química física e IQ táctico verificado en Chicago.', ovrDelta: +1 };
    if (score >= 74) return { grade: 'A', title: 'TOP 14 DEL NBA DRAFT 🎯', color: 'text-blue-400', desc: 'Prospecto titular con buen techo de desarrollo.', ovrDelta: 0 };
    return { grade: 'B-', title: 'CAÍDA AL MID 1ST ROUND ⚠️', color: 'text-rose-400', desc: 'Dudas en las pruebas. Los GM cuestionan tu consistencia.', ovrDelta: -1 };
  };

  const handleFinishCombine = () => {
    const scout = calculateScoutGrade();
    
    let updatedAttrs = { ...player.attributes };
    if (selectedPlan) {
      const key = selectedPlan.statBoost.key;
      updatedAttrs[key] = Math.min(88, (updatedAttrs[key] || 70) + selectedPlan.statBoost.val);
    }

    let repBonus = 5;
    let marketBonus = 0;
    if (selectedInterviewAnswer) {
      if (selectedInterviewAnswer.bonusStat.key === 'marketability') marketBonus = selectedInterviewAnswer.bonusStat.val;
      if (selectedInterviewAnswer.bonusStat.key === 'reputation') repBonus += selectedInterviewAnswer.bonusStat.val;
    }

    const finalOvr = Math.min(
      player.potentialMaxOvr || 99,
      Math.max(62, player.ovr + scout.ovrDelta)
    );

    const updatedPlayer: Player = {
      ...player,
      ovr: finalOvr,
      attributes: updatedAttrs,
      reputation: Math.min(100, player.reputation + repBonus),
      marketability: Math.min(100, player.marketability + marketBonus),
    };

    onCombineComplete(updatedPlayer);
  };

  const scoutEval = calculateScoutGrade();

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 my-2 sm:my-6">
      <div className="game-card-panel border border-slate-700/80 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 holographic-edge">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>NBA COMBINE • CHICAGO, ILLINOIS 🇺🇸</span>
          </div>
          <span className="text-xs font-bold text-slate-400">PASO 2 DE 2: EVALUACIÓN Y DRAFT</span>
        </div>

        {/* STEP 1: INTERACTIVE SKILL TIMING MINIGAME */}
        {activeStep === 'minigame' && (
          <div className="space-y-6 animate-fadeIn text-center">
            <div className="max-w-xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-3 py-1 rounded-full uppercase">
                <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>PRUEBA FÍSICA INTERACTIVA: TIMING & PRECISIÓN</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-white uppercase">
                DEMUESTRA TU REFLEJO ANTE LOS SCOUTS
              </h2>
              <p className="text-xs text-slate-300">
                Haz clic en <strong className="text-amber-400">"¡LANZAR AHORA!"</strong> cuando la aguja cruce la <span className="text-emerald-400 font-bold">ZONA VERDE (80% - 94%)</span>.
              </p>
            </div>

            {/* DYNAMIC TIMING METER DISPLAY */}
            <div className="bg-slate-950 border-2 border-slate-800 rounded-3xl p-6 space-y-5 max-w-lg mx-auto shadow-2xl relative overflow-hidden">
              
              {/* Target Zone Bar */}
              <div className="relative w-full h-10 bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden flex items-center">
                <div className="h-full bg-red-950/60 w-[65%]" />
                <div className="h-full bg-amber-950/80 w-[15%]" />
                <div className="h-full bg-emerald-500/80 w-[14%] flex items-center justify-center text-[10px] font-black text-black uppercase">
                  ZONA VERDE 🎯
                </div>
                <div className="h-full bg-amber-950/80 w-[6%]" />

                <div 
                  className="absolute top-0 bottom-0 w-3 bg-amber-400 border-2 border-white shadow-lg transition-all duration-75"
                  style={{ left: `${meterValue}%` }}
                />
              </div>

              {minigameScore === null ? (
                <div className="text-xs font-bold text-slate-400">
                  {isMeterRunning ? '⚡ ¡LA AGUJA SE MUEVE! APUNTA A LA ZONA VERDE...' : 'HAZ CLIC EN "INICIAR PRUEBA" PARA EMPEZAR'}
                </div>
              ) : (
                <div className={`p-4 rounded-2xl border text-sm font-bold animate-fadeIn ${
                  minigameScore >= 80 && minigameScore <= 94 
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' 
                    : minigameScore >= 60 
                    ? 'bg-amber-950/80 border-amber-500 text-amber-300' 
                    : 'bg-red-950/80 border-red-500 text-red-300'
                }`}>
                  {minigameScore >= 80 && minigameScore <= 94 ? (
                    <div>🌟 ¡PERFECTO! ({minigameScore}%) Precisión impecable. Scouts eufóricos.</div>
                  ) : minigameScore >= 60 ? (
                    <div>👍 BUEN REGISTRO ({minigameScore}%). Rendimiento físico consistente.</div>
                  ) : (
                    <div>⚠️ PRUEBA DEFICIENTE ({minigameScore}%). Falta de ritmo bajo presión.</div>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {!isMeterRunning && minigameScore === null && (
                  <button
                    onClick={handleStartMinigame}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-display font-black text-lg uppercase py-3.5 rounded-2xl shadow-xl transition-all"
                  >
                    INICIAR PRUEBA DE PRECISIÓN 🎯
                  </button>
                )}

                {isMeterRunning && (
                  <button
                    onClick={handleStopMinigame}
                    className="w-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600 text-black font-display font-black text-xl uppercase py-4 rounded-2xl shadow-2xl animate-pulse transition-all"
                  >
                    ¡LANZAR AHORA! 🏀
                  </button>
                )}

                {!isMeterRunning && minigameScore !== null && (
                  <button
                    onClick={() => setActiveStep('scrimmage')}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-black font-display font-black text-lg uppercase py-3.5 rounded-2xl shadow-xl transition-all"
                  >
                    CONTINUAR AL PARTIDO 5v5 (SCRIMMAGE) 👉
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

        {/* STEP 2: DYNAMIC SCRIMMAGE MATCH WITH RANDOMIZED TACTICAL CARDS */}
        {activeStep === 'scrimmage' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">SCRIMMAGE 5v5 EN CHICAGO</div>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-white uppercase">
                SELECCIONA TU PLAN TÁCTICO DE JUEGO
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">Los 30 General Managers están en la grada evaluando cómo juegas:</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {randomTacticalPlans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => handleSelectTacticalPlan(plan)}
                  className="bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl p-5 text-left space-y-3 transition-all hover:scale-105 card-hover-effect holographic-edge"
                >
                  <div className="text-3xl">{plan.icon}</div>
                  <div>
                    <h4 className="font-bold text-white text-sm leading-tight">{plan.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">{plan.description}</p>
                  </div>
                  <div className="bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold p-2 rounded-xl">
                    Efecto: {plan.proText}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: RANDOMIZED GM INTERVIEWS WITH RANDOM QUESTION AND ANSWERS */}
        {activeStep === 'interview' && scrimmageResult && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-400 uppercase font-bold">ESTADÍSTICAS DEL SCRIMMAGE</span>
                <div className="font-display font-black text-2xl text-white">
                  {scrimmageResult.pts} PTS • {scrimmageResult.ast} AST • {scrimmageResult.reb} REB
                </div>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                Línea Registrada
              </span>
            </div>

            <div>
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">{randomGmQuestion.gmRole.toUpperCase()}</span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-white uppercase mt-0.5">
                "{randomGmQuestion.questionText}"
              </h2>
              <p className="text-xs text-slate-400">Responde la pregunta clave para cerrar tus evaluaciones:</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {randomGmQuestion.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelectInterviewAnswer(option)}
                  className="bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl p-4 text-left space-y-2 transition-all card-hover-effect holographic-edge"
                >
                  <div className="font-bold text-white text-sm leading-snug">{option.text}</div>
                  <p className="text-xs text-slate-400 leading-relaxed">{option.description}</p>
                  <div className="text-[10px] text-amber-400 font-bold bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                    Bono: {option.bonusType}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: FINAL SCOUT EVALUATION CARD */}
        {activeStep === 'scout_report' && (
          <div className="space-y-6 animate-fadeIn text-center">
            <div className="bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
              
              <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase px-4 py-1.5 rounded-full">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>INFORME FINAL DE SCOUTING NBA</span>
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
                <span>ENTRAR A LA NOCHE DEL NBA DRAFT 🏀</span>
                <ArrowRight className="w-5 h-5" />
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
