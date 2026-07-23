import React, { useState } from 'react';
import { Player } from '../types/game';
import { getTeamById } from '../data/nbaTeams';
import { playAudioEffect } from '../utils/simulator';
import { CheckCircle, XCircle, Zap, Trophy, Star, TrendingUp, Globe, Award, Heart, Users, Zap as ZapIcon } from 'lucide-react';

interface QuickStartOffseasonModalProps {
  player: Player;
  newOvr: number;
  earningsGained: number;
  wonChampionship: boolean;
  wonMvp: boolean;
  wonAllStar: boolean;
  careerYears: number;
  onComplete: (updatedPlayer: Player) => void;
}

// ============================================================
// CARRERA STAGE DETECTION
// ============================================================
type CareerStage = 'rookie' | 'rising' | 'prime' | 'veteran';

const getCareerStage = (player: Player, careerYears: number): CareerStage => {
  if (careerYears === 0) return 'rookie';
  if (careerYears <= 3) return 'rising';
  if (player.age >= 34) return 'veteran';
  return 'prime';
};

// ============================================================
// STAGE-SPECIFIC DECISION POOLS - NO GENERIC "STAY OR LEAVE"
// ============================================================
type ChoiceType = 'development' | 'brand' | 'team' | 'international' | 'lifestyle' | 'personal';

const rookieDecisions = [
  {
    id: 'summer_league',
    type: 'development' as ChoiceType,
    title: '¿Trabajo en verano?',
    description: 'Tienes 6 semanas antes de tu segunda temporada. ¿Cómo las aprovechas?',
    icon: '🏋️',
    choiceA: {
      text: 'Jugar Summer League',
      prob: 60,
      narrative: 'Buen rendimiento en Summer League. Los coaches vieron mejora en tu juego.',
      ovrDelta: +2,
    },
    choiceB: {
      text: 'Entrenar por tu cuenta',
      prob: 65,
      narrative: 'Trabajo silencioso pero efectivo. Llegaste复读 a pretemporada con mejor tiro.',
      ovrDelta: +3,
    },
  },
  {
    id: 'rookie_mentor',
    type: 'team' as ChoiceType,
    title: 'Veterano ofrece mentorship',
    description: 'Un veterano del equipo te ofrece ser tu mentor personal.',
    icon: '👴',
    choiceA: {
      text: 'Aceptar el mentor',
      prob: 75,
      narrative: 'Aprendiste los trucos del oficio. El veterano te tomó bajo su ala.',
      ovrDelta: +2,
    },
    choiceB: {
      text: 'Trabajar solo',
      prob: 50,
      narrative: 'Aprendiste de tus errores pero sin guía fue más difícil.',
      ovrDelta: 0,
    },
  },
  {
    id: 'national_team_rookie',
    type: 'international' as ChoiceType,
    title: 'Convocatoria Selección',
    description: 'Tu federación te llama para jugar las clasificatorias.',
    icon: '🌍',
    choiceA: {
      text: 'Ir con la Selección',
      prob: 55,
      narrative: 'Experiencia internacional valiosa. Conociste elbasketball de otro nivel.',
      ovrDelta: +1,
    },
    choiceB: {
      text: 'Quedarme en la NBA',
      prob: 70,
      narrative: 'Te enfocaste 100% en tu equipo. Los compañeros respetan tu compromiso.',
      ovrDelta: +2,
    },
  },
  {
    id: 'rookie_brand',
    type: 'brand' as ChoiceType,
    title: 'Primera oferta de patrocinio',
    description: 'Una marca local te ofrece tu primer patrocinio. Muy poco dinero pero visibilidad.',
    icon: '📸',
    choiceA: {
      text: 'Aceptar patrocinio',
      prob: 80,
      narrative: 'Tu cara empieza a aparecer en vallas publicitarias de tu ciudad.',
      ovrDelta: +1,
    },
    choiceB: {
      text: 'Esperar mejor oferta',
      prob: 45,
      narrative: 'No came nada esta vez, pero mantuviste tu imagen limpia.',
      ovrDelta: 0,
    },
  },
  {
    id: 'rookie_attitude',
    type: 'personal' as ChoiceType,
    title: 'Los rookies deben pagar',
    description: 'Los veteranos te piden que pagues las cenas del equipo esta semana.',
    icon: '🍽️',
    choiceA: {
      text: 'Pagar sin drama',
      prob: 85,
      narrative: 'Te ganaste el respeto del vestuario. chemistry instantánea.',
      ovrDelta: +1,
    },
    choiceB: {
      text: 'Poner límites',
      prob: 40,
      narrative: 'Hubo roces pero mantuviste tu posición. No todos quedaron encantados.',
      ovrDelta: -1,
    },
  },
  {
    id: 'rookie_leadership',
    type: 'team' as ChoiceType,
    title: 'Organizar entrenamiento extra',
    description: 'Quieres motivar a tus compañeros para hacer trabajo extra voluntary.',
    icon: '💪',
    choiceA: {
      text: 'Liderar el grupo',
      prob: 50,
      narrative: 'Algunos se unieron, otros no. El coach notó tu iniciativa.',
      ovrDelta: +1,
    },
    choiceB: {
      text: 'Enfocarte en tu juego',
      prob: 65,
      narrative: 'Mejoraste individualmente sin distracciones.',
      ovrDelta: +2,
    },
  },
];

const risingDecisions = [
  {
    id: 'extension_vs_ring',
    type: 'team' as ChoiceType,
    title: 'Extensión de contrato',
    description: 'Tu equipo te ofrece extensión de 4 años. Otra franquicia te quiere ahora.',
    icon: '📝',
    choiceA: {
      text: 'Firmar extensión aquí',
      prob: 70,
      narrative: 'Te comprometiste con el proyecto. Los fanescelebraron tu lealtad.',
      ovrDelta: +1,
    },
    choiceB: {
      text: 'Buscar nuevo equipo',
      prob: 45,
      narrative: 'Te fuiste a un nuevo desafío. Nueva ciudad, nuevas oportunidades.',
      ovrDelta: 0,
      tradeTeam: true,
    },
  },
  {
    id: 'all_star_push',
    type: 'personal' as ChoiceType,
    title: '¿Ir por el All-Star?',
    description: 'Estás cerca del nivel All-Star. ¿Cuánto esfuerzo le pones a llegar?',
    icon: '⭐',
    choiceA: {
      text: 'Todo por el All-Star',
      prob: 50,
      narrative: 'Duelos increíbles toda la temporada. ¡ALL-STAR!',
      ovrDelta: +3,
    },
    choiceB: {
      text: 'Mejorar como equipo',
      prob: 70,
      narrative: 'El equipo mejoró como unidad. Tu juego se volvió más completo.',
      ovrDelta: +2,
    },
  },
  {
    id: 'celebrity_deal',
    type: 'brand' as ChoiceType,
    title: 'Marca grande te quiere',
    description: 'Nike o Adidas te ofrece un contrato de zapatos. Gran exposición pero mucho demanded.',
    icon: '👟',
    choiceA: {
      text: 'Aceptar deal masivo',
      prob: 60,
      narrative: 'Tus zapatos se venden como pan caliente. Eres una estrella de marca.',
      ovrDelta: +1,
    },
    choiceB: {
      text: 'Mantener perfil bajo',
      prob: 75,
      narrative: 'Te enfocaste solo en basketball. Las marcas volverán cuando seas leyenda.',
      ovrDelta: +2,
    },
  },
  {
    id: 'olympics_rising',
    type: 'international' as ChoiceType,
    title: 'Juegos Olímpicos',
    description: 'Te convocan para los Juegos. Representar a tu país es un honor único.',
    icon: '🥇',
    choiceA: {
      text: 'Ir a los Juegos',
      prob: 55,
      narrative: '¡MEDALLA! Tu rendimiento en Juegos te puso en el mapa mundial.',
      ovrDelta: +3,
    },
    choiceB: {
      text: 'Preparar la temporada NBA',
      prob: 70,
      narrative: 'Llegaste复读 a la NBA descansado y listo. Temporada de breakout incoming.',
      ovrDelta: +2,
    },
  },
  {
    id: 'team_conflict',
    type: 'team' as ChoiceType,
    title: 'Conflicto en el vestuario',
    description: 'Un compañero te critic publicly. Tienes que decidir cómo responder.',
    icon: '🔥',
    choiceA: {
      text: 'Enfrentarlo directamente',
      prob: 45,
      narrative: 'La confrontación salió mal. El vestuario quedó divided.',
      ovrDelta: -2,
    },
    choiceB: {
      text: 'Hablarlo privado',
      prob: 65,
      narrative: 'Resolviste el conflicto maturely. El equipo quedó stronger.',
      ovrDelta: +1,
    },
  },
  {
    id: 'offseason_trainer',
    type: 'development' as ChoiceType,
    title: 'Entrenamiento con leyenda',
    description: 'Una leyenda de la NBA te invita a entrenar en su gimnasio privado.',
    icon: '🏀',
    choiceA: {
      text: 'Aceptar la invitación',
      prob: 55,
      narrative: 'Aprendiste secretos del oficio. Tu juego dio un salto cualitativo.',
      ovrDelta: +3,
    },
    choiceB: {
      text: 'Programa propio',
      prob: 65,
      narrative: 'Tu propio plan rindió frutos. Sin distracciones.',
      ovrDelta: +2,
    },
  },
  {
    id: 'ring_chase_early',
    type: 'team' as ChoiceType,
    title: 'Oferta de contender',
    description: 'Un equipo candidato al título te quiere. Menos dinero pero chance de anillo.',
    icon: '💍',
    choiceA: {
      text: 'Ir por el anillo',
      prob: 40,
      narrative: 'Te uniste a un powerhouse. La presión es alta pero la recompensa es geg.',
      ovrDelta: +1,
      tradeTeam: true,
    },
    choiceB: {
      text: 'Quedarme a construir',
      prob: 60,
      narrative: 'Elegiste ser la estrella de tu propio equipo. Larga pero gratificante.',
      ovrDelta: +2,
    },
  },
];

const primeDecisions = [
  {
    id: 'supermax_offer',
    type: 'team' as ChoiceType,
    title: 'Supermáximo disponible',
    description: 'Eres elegible para el Supermáximo. Pero el equipo tendrá que hacer sacrifices.',
    icon: '💰',
    choiceA: {
      text: 'Exigir el Supermáx',
      prob: 70,
      narrative: '$$$ Firmado. Eres LA prioridad de la franquicia.',
      ovrDelta: 0,
    },
    choiceB: {
      text: 'Dar descuento al equipo',
      prob: 55,
      narrative: 'Tu descuento permitió firmar otro estrella. Ahora sí hay roster geg.',
      ovrDelta: +2,
    },
  },
  {
    id: 'trade_demand_prime',
    type: 'team' as ChoiceType,
    title: '¿Pedir traspaso?',
    description: 'El equipo no está competing. Puedes pedir que te traspasen a un contender.',
    icon: '🔄',
    choiceA: {
      text: 'Pedir traspaso',
      prob: 45,
      narrative: '¡TRASPASO! Te fuiste a un equipo candidato. Todo nuevo.',
      ovrDelta: 0,
      tradeTeam: true,
    },
    choiceB: {
      text: 'Luchar desde aquí',
      prob: 60,
      narrative: 'Lideraste al equipo a playoffs. El fandom te respeta por siempre.',
      ovrDelta: +2,
    },
  },
  {
    id: 'mvp_campaign',
    type: 'personal' as ChoiceType,
    title: '¿Campaña por MVP?',
    description: 'Estás en tu prime. Tienes chance real de MVP esta temporada.',
    icon: '🏆',
    choiceA: {
      text: 'Ir por el MVP',
      prob: 40,
      narrative: '¡MVP DE LA TEMPORADA! Tu nombre está en la historia.',
      ovrDelta: +3,
    },
    choiceB: {
      text: 'Ganar como equipo',
      prob: 65,
      narrative: 'El equipo rindió al máximo nivel. Chemistry excepcional.',
      ovrDelta: +2,
    },
  },
  {
    id: 'podcast_interview',
    type: 'brand' as ChoiceType,
    title: 'Podcast viral',
    description: 'Un podcast famous te invita a hablar sin filtro sobre tus opinions.',
    icon: '🎙️',
    choiceA: {
      text: 'Hablar sin filtro',
      prob: 40,
      narrative: '¡VIRAL! El mundo entero habló de ti. Algunas cosas no cayeron bien.',
      ovrDelta: -1,
    },
    choiceB: {
      text: 'Mantener profesionalismo',
      prob: 75,
      narrative: 'Respetaste la línea. El vestuario te agradece.',
      ovrDelta: +1,
    },
  },
  {
    id: 'fiba_worldcup',
    type: 'international' as ChoiceType,
    title: 'Mundial FIBA',
    description: 'El Mundial de baloncesto te convoca. Competir por el título mundial.',
    icon: '🌍',
    choiceA: {
      text: 'Ir al Mundial',
      prob: 55,
      narrative: '¡CAMPEONES DEL MUNDO! Tu país celebra este título histórico.',
      ovrDelta: +2,
    },
    choiceB: {
      text: 'Preparar la NBA',
      prob: 65,
      narrative: 'Llegaste复读 a la NBA descansado y en peak condition.',
      ovrDelta: +1,
    },
  },
  {
    id: 'hollywood_movie',
    type: 'brand' as ChoiceType,
    title: 'Protagonizar película',
    description: 'Quieren que protagonices una película deportiva sobre un legendario jugador.',
    icon: '🎬',
    choiceA: {
      text: 'Aceptar el papel',
      prob: 50,
      narrative: '¡TAQUILLA! Tu actuación sorprendió a todos. Eres estrella global.',
      ovrDelta: 0,
    },
    choiceB: {
      text: 'Elbasketball es priority',
      prob: 65,
      narrative: 'Te mantuviste enfocado en lo que importa. El legado se construye aquí.',
      ovrDelta: +1,
    },
  },
  {
    id: 'injury_prime',
    type: 'personal' as ChoiceType,
    title: 'Lesión en pretemporada',
    description: 'Sientes dolor en la rodilla. Los médicos te dicen que pares 4 semanas o sigas playing.',
    icon: '🏥',
    choiceA: {
      text: 'Infiltrarse y jugar',
      prob: 35,
      narrative: 'Jugaste lesionado toda la temporada. El dolor era insoportable.',
      ovrDelta: -2,
    },
    choiceB: {
      text: 'Descansar completo',
      prob: 80,
      narrative: 'Recuperación completa. Llegaste复读 100% para la segunda mitad.',
      ovrDelta: +1,
    },
  },
];

const veteranDecisions = [
  {
    id: 'ring_chase_veteran',
    type: 'team' as ChoiceType,
    title: 'Última chance de anillo',
    description: 'Un contender te ofrece un contrato mínimo por la última oportunidad de anillo.',
    icon: '💍',
    choiceA: {
      text: 'Ir por el anillo',
      prob: 35,
      narrative: 'Te uniste a un powerhouse. Esta podría ser tu última temporada.',
      ovrDelta: 0,
      tradeTeam: true,
    },
    choiceB: {
      text: 'Seguir como estrella',
      prob: 65,
      narrative: 'Seguir siendo THE GUY en tu equipo. Los fanes te aman.',
      ovrDelta: 0,
    },
  },
  {
    id: 'last_contract',
    type: 'team' as ChoiceType,
    title: '¿Último contrato?',
    description: 'Gerencia te ofrece un último contrato de 2 años. ¿Qué decides?',
    icon: '📋',
    choiceA: {
      text: 'Firmar los 2 años',
      prob: 85,
      narrative: '2 años más de basketball. Tu legado continúa.',
      ovrDelta: 0,
    },
    choiceB: {
      text: 'Uno más y retirarse',
      prob: 50,
      narrative: 'Decidiste que 1 año más es suficiente. Tiempo de pensar en el retiro.',
      ovrDelta: 0,
    },
  },
  {
    id: 'hometown_discount',
    type: 'team' as ChoiceType,
    title: 'Descuento por lealtad',
    description: 'Tu equipo original te pide un descuento para poder firmar otro estrella.',
    icon: '❤️',
    choiceA: {
      text: 'Dar el descuento',
      prob: 60,
      narrative: 'Tu sacrificio permitió armar un roster geg. El legado continúa.',
      ovrDelta: +1,
    },
    choiceB: {
      text: 'Cobrar cada centavo',
      prob: 70,
      narrative: 'Te ganaste cada dólar. La gerencia tendrá que hacer sacrificios.',
      ovrDelta: 0,
    },
  },
  {
    id: 'retirement_path',
    type: 'personal' as ChoiceType,
    title: '¿Seguir jugando?',
    description: 'El cuerpo ya no responde igual. Pero el fuego sigue ardiendo.',
    icon: '🔥',
    choiceA: {
      text: '¡Una temporada más!',
      prob: 55,
      narrative: 'Demostraste que la edad es solo un número. Temporada memorable.',
      ovrDelta: 0,
    },
    choiceB: {
      text: 'Planificar el retiro',
      prob: 70,
      narrative: 'Empezaste a construir tu vida post-basketball. Inversiones y negocios.',
      ovrDelta: 0,
    },
  },
  {
    id: 'hall_of_fame_veteran',
    type: 'personal' as ChoiceType,
    title: 'Posición en la historia',
    description: 'Los medios te preguntan: ¿Te consideras un Hall of Famer?',
    icon: '🏛️',
    choiceA: {
      text: '"Soy un Hall of Famer"',
      prob: 60,
      narrative: 'Confianza absoluta. Los debate mediáticos te pusieron en el conversation.',
      ovrDelta: +1,
    },
    choiceB: {
      text: 'Dejar que hablen los números',
      prob: 75,
      narrative: 'Humildad classy. Los números hablan por sí mismos.',
      ovrDelta: 0,
    },
  },
  {
    id: 'charity_veteran',
    type: 'lifestyle' as ChoiceType,
    title: 'Fundación benéfica',
    description: 'Quieres abrir una fundación para niños de tu ciudad natal.',
    icon: '💖',
    choiceA: {
      text: 'Crear la fundación',
      prob: 80,
      narrative: 'HÉROE DE LA COMUNIDAD. Tu impacto trasciende el basketball.',
      ovrDelta: +1,
    },
    choiceB: {
      text: 'Enfocarse en la temporada',
      prob: 65,
      narrative: 'Te mantuviste enfocado en la NBA. Los negocios pueden esperar.',
      ovrDelta: 0,
    },
  },
  {
    id: 'ownership_stake',
    type: 'lifestyle' as ChoiceType,
    title: 'Inversión en franquicia',
    description: 'Te ofrecen ser propietario minoritario de una franquicia WNBA.',
    icon: '🏟️',
    choiceA: {
      text: 'Aceptar la inversión',
      prob: 55,
      narrative: 'Ahora eres dueño de un equipo. Tu influencia trasciende la duela.',
      ovrDelta: 0,
    },
    choiceB: {
      text: 'Mantener el foco',
      prob: 70,
      narrative: 'El basketball es lo único que importa ahora. Hasta el final.',
      ovrDelta: 0,
    },
  },
];

// Pick decisions based on career stage
const getStageDecisions = (stage: CareerStage) => {
  switch (stage) {
    case 'rookie': return rookieDecisions;
    case 'rising': return risingDecisions;
    case 'prime': return primeDecisions;
    case 'veteran': return veteranDecisions;
  }
};

const stageLabels: Record<CareerStage, string> = {
  rookie: 'NOVATO',
  rising: 'SUBIENDO',
  prime: 'PRIME',
  veteran: 'VETERANO',
};

export const QuickStartOffseasonModal: React.FC<QuickStartOffseasonModalProps> = ({
  player,
  newOvr,
  earningsGained,
  wonChampionship,
  wonMvp,
  wonAllStar,
  careerYears,
  onComplete,
}) => {
  const stage = getCareerStage(player, careerYears);
  const stageDecisions = getStageDecisions(stage);

  const [step, setStep] = useState<'result' | 'choice' | 'resolved'>('result');
  const [allChoices] = useState(() => {
    // Pick 3 diverse decisions from the stage pool
    const shuffled = [...stageDecisions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  });
  const [choiceIndex, setChoiceIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [resolved, setResolved] = useState<{ success: boolean; text: string; ovrDelta: number; tradeTeam?: boolean } | null>(null);
  const [showMoreChoices, setShowMoreChoices] = useState(false);

  const currentTeam = getTeamById(player.currentTeamId);
  const choice = allChoices[choiceIndex % allChoices.length];

  const handleOption = (opt: 'A' | 'B') => {
    setSelectedOption(opt);
    const option = opt === 'A' ? choice.choiceA : choice.choiceB;
    const success = Math.random() * 100 < option.prob;

    playAudioEffect(success ? 'cheer' : 'draft_buzzer');

    setResolved({
      success,
      text: success ? option.narrative : (
        opt === 'A'
          ? `No funcionó: ${choice.choiceA.narrative}`
          : `No funcionó: ${choice.choiceB.narrative}`
      ),
      ovrDelta: success ? option.ovrDelta : (opt === 'A' ? choice.choiceA.ovrDelta : choice.choiceB.ovrDelta),
      tradeTeam: success ? (option as any).tradeTeam : undefined,
    });
    setStep('resolved');
  };

  const handleContinue = () => {
    if (!resolved) {
      onComplete({ ...player, ovr: newOvr, earningsMillions: player.earningsMillions + earningsGained });
      return;
    }

    const finalOvr = Math.min(99, Math.max(62, newOvr + resolved.ovrDelta));

    // Determine new team if trade happened
    const shouldTrade = resolved.tradeTeam && resolved.success;
    const newTeamId = shouldTrade
      ? (['lakers', 'celtics', 'warriors', 'heat', 'nuggets', 'suns', 'bucks', 'celtics', 'mavericks'][Math.floor(Math.random() * 9)] || player.currentTeamId)
      : player.currentTeamId;

    const finalPlayer: Player = {
      ...player,
      ovr: finalOvr,
      earningsMillions: player.earningsMillions + earningsGained,
      currentTeamId: newTeamId,
    };

    onComplete(finalPlayer);
  };

  const handleNextChoice = () => {
    if (choiceIndex + 1 >= allChoices.length && !showMoreChoices) {
      setShowMoreChoices(true);
      // Add more choices from the pool
      const moreChoices = [...stageDecisions]
        .filter(d => !allChoices.some(c => c.id === d.id))
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
      allChoices.push(...moreChoices);
    }
    setChoiceIndex(prev => prev + 1);
    setResolved(null);
    setSelectedOption(null);
    setStep('choice');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn">
      <div className="bg-slate-950 border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">

        {/* SEASON RESULT */}
        {step === 'result' && (
          <>
            {/* Team logo */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 p-2 shadow-lg">
                <img src={currentTeam.logoUrl} alt={currentTeam.name} className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Milestone banners */}
            {wonChampionship && (
              <div className="flex flex-col items-center gap-1 text-center">
                <div className="flex items-center gap-2 text-amber-400">
                  <Trophy className="w-7 h-7" />
                  <span className="font-black text-2xl">¡CAMPEONATO NBA!</span>
                  <Trophy className="w-7 h-7" />
                </div>
                <p className="text-amber-300/80 text-sm italic">"{player.name}" es campeão de la NBA 💍</p>
              </div>
            )}
            {wonMvp && !wonChampionship && (
              <div className="flex items-center justify-center gap-2 text-purple-400">
                <Star className="w-6 h-6" />
                <span className="font-black text-xl">¡MVP DE LA TEMPORADA!</span>
              </div>
            )}
            {wonAllStar && !wonMvp && !wonChampionship && (
              <div className="flex items-center justify-center gap-2 text-cyan-400">
                <Award className="w-5 h-5" />
                <span className="font-bold text-lg">¡ALL-STAR SELECCIÓN!</span>
              </div>
            )}

            <div className="flex items-center justify-center gap-4 py-3">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Año {careerYears + 1}</div>
                <div className="text-xs text-slate-400">{currentTeam.name}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Tu OVR</div>
                <div className="font-display font-black text-4xl text-amber-400">{newOvr}</div>
              </div>
              {earningsGained > 0 && (
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Ingresos</div>
                  <div className="font-display font-black text-2xl text-emerald-400">+${earningsGained.toFixed(1)}M</div>
                </div>
              )}
            </div>

            <div className="text-xs text-slate-400 text-center">
              {player.age} años • {player.position} • {player.country} • #{player.jerseyNumber ?? '?'}
            </div>

            <button
              onClick={() => setStep('choice')}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-black text-lg uppercase py-4 rounded-2xl shadow-xl transition-all"
            >
              DECISIÓN DE VERANO 🏀
            </button>
          </>
        )}

        {/* BINARY CHOICE - CLEAN COPERO STYLE */}
        {step === 'choice' && choice && (
          <>
            {/* Team logo + stage badge */}
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 p-1">
                <img src={currentTeam.logoUrl} alt={currentTeam.name} className="w-full h-full object-contain" />
              </div>
              <div className="bg-slate-900 border border-slate-700 rounded-full px-3 py-1">
                <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">
                  {stageLabels[stage]} • #{player.jerseyNumber ?? '?'}
                </span>
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                <ZapIcon className="w-3 h-3" />
                {choice.icon} {choice.type === 'development' ? 'Desarrollo' : choice.type === 'brand' ? 'Marca' : choice.type === 'team' ? 'Equipo' : choice.type === 'international' ? 'Internacional' : choice.type === 'personal' ? 'Personal' : 'Estilo'}
              </div>
              <h2 className="font-display font-black text-2xl text-white uppercase leading-tight">{choice.title}</h2>
              <p className="text-sm text-slate-300">{choice.description}</p>
            </div>

            <div className="space-y-3">
              {/* Option A */}
              <button
                onClick={() => handleOption('A')}
                className="w-full game-card-panel border border-slate-700 hover:border-emerald-500/50 rounded-2xl p-4 text-left transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-lg">{choice.choiceA.text}</span>
                  <span className={`text-xs font-black px-3 py-1 rounded-full ${
                    choice.choiceA.prob >= 60
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : choice.choiceA.prob >= 45
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {choice.choiceA.prob}%
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  {choice.choiceA.ovrDelta > 0 ? `+${choice.choiceA.ovrDelta} OVR si funciona` :
                   choice.choiceA.ovrDelta < 0 ? `${choice.choiceA.ovrDelta} OVR si funciona` :
                   'Sin cambio de OVR'}
                </div>
              </button>

              {/* Option B */}
              <button
                onClick={() => handleOption('B')}
                className="w-full game-card-panel border border-slate-700 hover:border-purple-500/50 rounded-2xl p-4 text-left transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-lg">{choice.choiceB.text}</span>
                  <span className={`text-xs font-black px-3 py-1 rounded-full ${
                    choice.choiceB.prob >= 60
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : choice.choiceB.prob >= 45
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {choice.choiceB.prob}%
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  {choice.choiceB.ovrDelta > 0 ? `+${choice.choiceB.ovrDelta} OVR si funciona` :
                   choice.choiceB.ovrDelta < 0 ? `${choice.choiceB.ovrDelta} OVR si funciona` :
                   'Sin cambio de OVR'}
                </div>
              </button>
            </div>

            {/* Navigation */}
            <div className="flex gap-2">
              {allChoices.length > 1 && (
                <button
                  onClick={handleNextChoice}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold text-xs uppercase py-2.5 rounded-xl transition-all"
                >
                  Siguiente situación →
                </button>
              )}
              <button
                onClick={handleContinue}
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-black text-sm uppercase py-3 rounded-xl shadow-xl transition-all"
              >
                SIGUIENTE TEMPORADA 🏀
              </button>
            </div>
          </>
        )}

        {/* RESOLVED */}
        {step === 'resolved' && resolved && (
          <>
            {/* Team logo with success/fail indicator */}
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-full border-2 flex items-center justify-center shadow-lg"
                style={{
                  backgroundColor: resolved.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  borderColor: resolved.success ? '#10b981' : '#ef4444'
                }}
              >
                <img src={currentTeam.logoUrl} alt={currentTeam.name} className="w-10 h-10 object-contain" />
              </div>
            </div>

            <div className="text-center space-y-3">
              <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center border-2 ${
                resolved.success ? 'bg-emerald-950 border-emerald-500' : 'bg-red-950 border-red-500'
              }`}>
                {resolved.success
                  ? <CheckCircle className="w-10 h-10 text-emerald-400" />
                  : <XCircle className="w-10 h-10 text-red-400" />
                }
              </div>

              <h3 className={`font-display font-black text-3xl uppercase ${
                resolved.success ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {resolved.success ? '¡ÉXITO!' : '¡NO FUNCIONÓ!'}
              </h3>

              <p className="text-sm text-slate-200 bg-slate-900/80 p-4 rounded-xl border border-slate-800 italic">
                "{resolved.text}"
              </p>

              {/* Trade notification */}
              {resolved.tradeTeam && resolved.success && (
                <div className="flex items-center justify-center gap-2 text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-3">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">¡Nuevo equipo!</span>
                </div>
              )}

              {/* OVR change */}
              <div className="flex items-center justify-center gap-3 py-2">
                <div className="text-center">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Tu OVR</div>
                  <div className="font-display font-black text-2xl text-slate-300">{newOvr}</div>
                </div>
                <div className="text-2xl text-slate-600">→</div>
                <div className="text-center">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Nuevo OVR</div>
                  <div className={`font-display font-black text-2xl ${resolved.ovrDelta > 0 ? 'text-emerald-400' : resolved.ovrDelta < 0 ? 'text-red-400' : 'text-slate-300'}`}>
                    {Math.min(99, Math.max(62, newOvr + resolved.ovrDelta))}
                    {resolved.ovrDelta !== 0 && (
                      <span className="text-sm ml-1">
                        ({resolved.ovrDelta > 0 ? '+' : ''}{resolved.ovrDelta})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-black text-lg uppercase py-4 rounded-2xl shadow-xl transition-all"
            >
              SIGUIENTE TEMPORADA 🏀
            </button>
          </>
        )}
      </div>
    </div>
  );
};
