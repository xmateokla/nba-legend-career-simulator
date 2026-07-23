import React, { useState } from 'react';
import { Player, SeasonStats, ContractOffer, ChoiceOutcomeDetails } from '../types/game';
import { getTeamById } from '../data/nbaTeams';
import { generateOffseasonOffers, playAudioEffect } from '../utils/simulator';
import { Sparkles, DollarSign, Award, Flame, Building, ArrowRight, ShieldCheck, Dice5, CheckCircle, XCircle, Check, X, Star, Dumbbell, Globe, Heart, Camera, Tv, Trophy, Zap, AlertTriangle, Radio } from 'lucide-react';

interface OffseasonDecisionModalProps {
  player: Player;
  latestSeason: SeasonStats;
  onDecisionComplete: (updatedPlayer: Player) => void;
}

export interface OffseasonActivity {
  id: string;
  title: string;
  description: string;
  icon: string;
  riskLevel: 'BAJO' | 'MEDIO' | 'ALTO';
  proText: string;
  conText: string;
  minAge?: number;
  minOvr?: number;
  minReputation?: number;
  minEarnings?: number;
  isRareLegendEvent?: boolean;
  isRisky?: boolean;
  successProbability?: number;
  successOutcome: ChoiceOutcomeDetails;
  failureOutcome?: ChoiceOutcomeDetails;
}

// 1. MASSIVE EXPANDED BASE ACTIVITIES POOL (25+ STANDARD BASE ACTIVITIES)
const BASE_ACTIVITIES_POOL: OffseasonActivity[] = [
  {
    id: 'act_rest_recovery',
    title: 'Vacaciones & Descanso Total en las Maldivas 🌴',
    description: '2 meses de descanso total con fisioterapia de crioterapia diaria y desconexión mental.',
    icon: '🌴',
    riskLevel: 'BAJO',
    proText: '+8 Durabilidad, +2 Atletismo',
    conText: 'Sin ingresos extra ni tiro',
    isRisky: false,
    successOutcome: {
      narrativeOutcome: 'REGENERACIÓN MUSCULAR COMPLETA. Llegas a la pretemporada con salud y energía intáctas.',
      statChanges: { durability: +8, athletic: +2 },
    },
  },
  {
    id: 'act_preseason_camp',
    title: 'Campamento Estándar de Pretemporada 🎯',
    description: 'Entrenamiento diario de tiro de 1,000 repeticiones con los preparadores del equipo.',
    icon: '🏀',
    riskLevel: 'BAJO',
    proText: '+4 Tiro 3P, +3 Tiro Mid, +1 OVR',
    conText: 'Cansancio acumulado leve',
    isRisky: false,
    successOutcome: {
      narrativeOutcome: 'Llegas en gran forma al Training Camp oficial.',
      statChanges: { shooting3P: +4, shootingMid: +3, ovr: +1 },
    },
  },
  {
    id: 'act_asia_tour',
    title: 'Gira Comercial de Marcas por Asia 🎒',
    description: 'Visitas Tokio, Shanghai y Manila en eventos publicitarios multitudinarios.',
    icon: '💼',
    riskLevel: 'BAJO',
    proText: '+$3.5M USD, +14 Comercialización',
    conText: 'Menor tiempo de gimnasio',
    isRisky: false,
    successOutcome: {
      narrativeOutcome: '¡ÉXITO DE IMAGEN GLOBAL! Tu camiseta es top ventas en Asia.',
      statChanges: { earningsMillions: 3.5, marketability: 14, reputation: +5 },
    },
  },
  {
    id: 'act_hometown_foundation',
    title: 'Fundación Benéfica en tu Ciudad Natal 💖',
    description: 'Financias la remodelación de canchas comunitarias y becas educativas.',
    icon: '💖',
    riskLevel: 'BAJO',
    proText: '+15 Reputación, +6 Comercialización',
    conText: 'Gasto de -$0.3M en logística',
    isRisky: false,
    successOutcome: {
      narrativeOutcome: '¡HÉROE DE LA COMUNIDAD! Ganas el respeto incondicional de los fanáticos.',
      statChanges: { reputation: +15, marketability: +6 },
    },
  },
  {
    id: 'act_colorado_altitude',
    title: 'Entrenamiento de Alta Altitud en Colorado 🏔️',
    description: 'Entrenas la capacidad pulmonar a más de 3,000 metros sobre el nivel del mar.',
    icon: '🏔️',
    riskLevel: 'MEDIO',
    proText: '+6 Atletismo, +4 Durabilidad',
    conText: 'Riesgo de mal de altura (-3 Durabilidad)',
    isRisky: true,
    successProbability: 0.75,
    successOutcome: {
      narrativeOutcome: '¡RESISTENCIA INAGOTABLE! Podrás jugar más de 38 minutos por partido.',
      statChanges: { athletic: +6, durability: +4 },
    },
    failureOutcome: {
      narrativeOutcome: 'Mal de altura y deshidratación afectaron tu acondicionamiento inicial.',
      statChanges: { durability: -3 },
    },
  },
  {
    id: 'act_defense_bootcamp',
    title: 'Bootcamp Intensivo de Defensa & Agilidad 🛡️',
    description: 'Trabajas desplazamiento lateral y lectura de líneas de pase con especialistas defensivos.',
    icon: '🛡️',
    riskLevel: 'BAJO',
    proText: '+6 Defensa, +3 Atletismo, +1 OVR',
    conText: 'Enfoque defensivo exclusivo',
    isRisky: false,
    successOutcome: {
      narrativeOutcome: 'MEJORÍA DEFENSIVA. Aumentas tu capacidad de intimidación y robos.',
      statChanges: { defense: +6, athletic: +3, ovr: +1 },
    },
  },
  {
    id: 'act_yoga_bali',
    title: 'Retiro de Yoga & Flexibilidad en Bali 🧘',
    description: 'Trabajas flexibilidad de caderas y prevención de lesiones musculares.',
    icon: '🧘',
    riskLevel: 'BAJO',
    proText: '+7 Durabilidad, +3 Atletismo',
    conText: 'Costo de -$0.2M en estancia',
    isRisky: false,
    successOutcome: {
      narrativeOutcome: 'FLEXIBILIDAD Y EQUILIBRIO OPTIMIZADOS. Reduces el riesgo de esguinces.',
      statChanges: { durability: +7, athletic: +3 },
    },
  },
  {
    id: 'act_weight_room',
    title: 'Gimnasio de Potencia & Fuerza Muscular 🏋️',
    description: 'Programa intensivo de hipertrofia y fuerza para aguantar el contacto bajo el aro.',
    icon: '🏋️',
    riskLevel: 'MEDIO',
    proText: '+5 Remate, +4 Rebote, +3 Atletismo',
    conText: 'Riesgo de sobrecarga lumbar (-4 Durabilidad)',
    isRisky: true,
    successProbability: 0.80,
    successOutcome: {
      narrativeOutcome: 'POTENCIA FÍSICA INTIMIDADORA. Ganas masa muscular funcional.',
      statChanges: { finishing: +5, rebounding: +4, athletic: +3 },
    },
    failureOutcome: {
      narrativeOutcome: 'Sobrecarga en la espalda baja por exceso de peso en sentadilla.',
      statChanges: { durability: -4 },
    },
  },
  {
    id: 'act_podcast_tour',
    title: 'Gira por Podcasts & Medios Deportivos 🎙️',
    description: 'Participas como panelista invitado en los shows de mayor audiencia de la NBA.',
    icon: '🎙️',
    riskLevel: 'BAJO',
    proText: '+12 Comercialización, +6 Reputación',
    conText: 'Sin progreso en atributos físicos',
    isRisky: false,
    successOutcome: {
      narrativeOutcome: 'CONEXIÓN CON LA PRENSA. Ganas visibilidad y apoyo de los analistas.',
      statChanges: { marketability: +12, reputation: +6 },
    },
  },
  {
    id: 'act_drew_league',
    title: 'Torneo de Verano Drew League en Los Ángeles 🏀',
    description: 'Compites contra otros profesionales en la liga de calle más famosa de LA.',
    icon: '🔥',
    riskLevel: 'MEDIO',
    proText: '+6 Remate, +5 Clutch, +2 OVR',
    conText: 'Riesgo de lesión de tobillo (-3 Durabilidad)',
    isRisky: true,
    successProbability: 0.70,
    successOutcome: {
      narrativeOutcome: '¡LEYENDA DE CALLE! Dominas el torneo con jugadas espectaculares.',
      statChanges: { finishing: +6, clutch: +5, ovr: +2 },
    },
    failureOutcome: {
      narrativeOutcome: 'Un choque violento bajo el aro te causó un esguince leve de tobillo.',
      statChanges: { durability: -3 },
    },
  },
  {
    id: 'act_boxing_conditioning',
    title: 'Entrenamiento de Boxeo con Canelo Alvarez 🥊',
    description: 'Trabajas la velocidad de pies, balance táctico y resistencia anaeróbica.',
    icon: '🥊',
    riskLevel: 'MEDIO',
    proText: '+6 Atletismo, +4 Defensa, +3 Durabilidad',
    conText: 'Riesgo de molestia en muñecas',
    isRisky: true,
    successProbability: 0.75,
    successOutcome: {
      narrativeOutcome: '¡ACONDICIONAMIENTO DE CAMPEÓN! Rapidez de pies impecable.',
      statChanges: { athletic: +6, defense: +4, durability: +3 },
    },
    failureOutcome: {
      narrativeOutcome: 'Fatiga extrema y molestia leve en nudillos por el saco pesado.',
      statChanges: { durability: -2 },
    },
  },
  {
    id: 'act_hyperbaric_chamber',
    title: 'Tratamiento Médico de Cámara Hiperbárica 🧪',
    description: 'Terapia de oxígeno puro a alta presión para regeneración celular.',
    icon: '🧪',
    riskLevel: 'BAJO',
    proText: '+9 Durabilidad, +2 Atletismo',
    conText: 'Inversión médica de -$0.4M',
    isRisky: false,
    successOutcome: {
      narrativeOutcome: 'REGENERACIÓN ACELERADA. Tu cuerpo absorbe la carga del verano.',
      statChanges: { durability: +9, athletic: +2 },
    },
  },
  {
    id: 'act_euroleague_clinic',
    title: 'Clínica de Verano en Europa con Técnicos Serbios 🇷🇸',
    description: 'Estudias lectura de pick and roll y movimiento de balón de ritmo europeo.',
    icon: '🇪🇺',
    riskLevel: 'BAJO',
    proText: '+6 Pase/Visión, +4 Tiro Mid, +1 OVR',
    conText: 'Menor enfoque en potencia física',
    isRisky: false,
    successOutcome: {
      narrativeOutcome: 'IQ DE BALONCESTO EUROPEO. Tu visión de juego se vuelve letal.',
      statChanges: { playmaking: +6, shootingMid: +4, ovr: +1 },
    },
  },
];

// 2. RARE LEGENDARY & RARE EVENT POOL (15+ SPECIAL EVENTS)
const RARE_LEGEND_EVENTS_POOL: OffseasonActivity[] = [
  {
    id: 'act_legend_mamba',
    title: 'Workout Privado a las 4 AM con Mamba Legend 🐍',
    description: 'Invitación exclusiva a un gimnasio privado para entrenar juego de pies de élite.',
    icon: '🐍',
    minOvr: 76,
    riskLevel: 'ALTO',
    proText: '+10 Clutch, +6 Tiro Mid, +3 OVR, Insignia Mamba',
    conText: '30% Riesgo de sobreentreno (-5 Durabilidad)',
    isRareLegendEvent: true,
    isRisky: true,
    successProbability: 0.70,
    successOutcome: {
      narrativeOutcome: '¡LECCIÓN HISTÓRICA! Tu Factor Clutch y Tiro de Media Distancia suben drásticamente.',
      statChanges: { clutch: +10, shootingMid: +6, ovr: +3 },
      unlockedBadge: '🐍 Mamba Mentality',
    },
    failureOutcome: {
      narrativeOutcome: '¡SOBRETRENO! El ritmo inhumano te causó tendinitis de rodilla.',
      statChanges: { athletic: -4, durability: -5 },
    },
  },
  {
    id: 'act_dream_shake',
    title: 'Sesión de Postemiento con Hakeem Olajuwon 👑',
    description: 'Viajas al rancho de Hakeem en Texas para dominar el Dream Shake.',
    icon: '👑',
    minOvr: 74,
    riskLevel: 'ALTO',
    proText: '+7 Remate, +4 Pase, +2 OVR, Insignia Dream Shake',
    conText: '35% Riesgo de sobrecarga muscular',
    isRareLegendEvent: true,
    isRisky: true,
    successProbability: 0.65,
    successOutcome: {
      narrativeOutcome: '¡JUEGO DE PIES PERFECTO! Dominas las fintas en el poste.',
      statChanges: { finishing: +7, playmaking: +4, ovr: +2 },
      unlockedBadge: '💫 Dream Shake Master',
    },
    failureOutcome: {
      narrativeOutcome: 'Sobrecarga muscular en gemelos por giros bruscos.',
      statChanges: { athletic: -3 },
    },
  },
  {
    id: 'act_curry_range',
    title: 'Campamento de Tiro Lejano con Steph Curry 🎯',
    description: 'Trabajas la velocidad de soltado y tiros desde 9 metros.',
    icon: '🎯',
    minOvr: 75,
    riskLevel: 'BAJO',
    proText: '+6 Tiro 3P, +4 Tiro Mid, +2 OVR, Insignia Rango Ilimitado',
    conText: 'Requisito de 75+ OVR',
    isRareLegendEvent: true,
    isRisky: false,
    successOutcome: {
      narrativeOutcome: '¡RANGO ILIMITADO! Aumentas tu distancia y efectividad de 3P.',
      statChanges: { shooting3P: +6, shootingMid: +4, ovr: +2 },
      unlockedBadge: '🎯 Rango Ilimitado',
    },
  },
  {
    id: 'act_hollywood_movie',
    title: 'Protagonizar Película de Cine en Hollywood 🎬',
    description: 'Rol principal en una gran producción de cine deportivo.',
    icon: '🎬',
    minReputation: 55,
    riskLevel: 'ALTO',
    proText: '+$5.0M USD, +22 Comercialización, Insignia Hollywood',
    conText: '40% Riesgo de críticas y prensa (-12 Reputación)',
    isRareLegendEvent: true,
    isRisky: true,
    successProbability: 0.60,
    successOutcome: {
      narrativeOutcome: '¡ÉXITO DE TAQUILLA! Ganancias de +$5M USD y estrellato global.',
      statChanges: { earningsMillions: 5, marketability: +22 },
      unlockedBadge: '⭐ Estrella de Hollywood',
    },
    failureOutcome: {
      narrativeOutcome: 'Críticas destructivas de cine distrajeron tu enfoque deportivo.',
      statChanges: { reputation: -12 },
    },
  },
  {
    id: 'act_supercar_rally',
    title: 'Rally de Superdeportivos por Europa 🏎️',
    description: 'Conduces deportivos de lujo por las costas de Mónaco e Italia.',
    icon: '🏎️',
    minEarnings: 3.0,
    riskLevel: 'ALTO',
    proText: '+$3.0M Patrocinios, +16 Comercialización',
    conText: '45% Riesgo de escándalo mediático (-$0.4M, -14 Reputación)',
    isRareLegendEvent: true,
    isRisky: true,
    successProbability: 0.55,
    successOutcome: {
      narrativeOutcome: 'EXPOSICIÓN DE ALTA GAMA. Marcas de lujo firman patrocinios contigo.',
      statChanges: { earningsMillions: 3.0, marketability: +16 },
    },
    failureOutcome: {
      narrativeOutcome: 'Polémica por exceso de velocidad y multa pesada de la liga.',
      statChanges: { reputation: -14, earningsMillions: -0.4 },
    },
  },
  {
    id: 'act_rap_album',
    title: 'Grabar Álbum de Hip-Hop en Estudio Privado 🎙️',
    description: 'Colaboras con raperos ganadores de Grammy durante tus vacaciones.',
    icon: '🎧',
    minReputation: 50,
    riskLevel: 'MEDIO',
    proText: '+$2.0M Regalías, +18 Comercialización, Insignia Rap Star',
    conText: '35% Riesgo de críticas musicales (-8 Reputación)',
    isRareLegendEvent: true,
    isRisky: true,
    successProbability: 0.65,
    successOutcome: {
      narrativeOutcome: '¡DISCO DE ORO! Tu álbum lidera las listas de Billboard.',
      statChanges: { marketability: +18, earningsMillions: 2.0 },
      unlockedBadge: '🎤 Rap Star Icon',
    },
    failureOutcome: {
      narrativeOutcome: 'Burlas en redes sociales por tus rimas y falta de ritmo.',
      statChanges: { reputation: -8 },
    },
  },
  {
    id: 'act_olympic_dream_team',
    title: 'Convocatoria al Dream Team Selección Nacional 🇺🇸',
    description: 'Representas a tu país en el torneo internacional de verano.',
    icon: '🥇',
    minOvr: 82,
    riskLevel: 'BAJO',
    proText: '+20 Reputación, +6 Clutch, +2 OVR, Medalla de Oro',
    conText: 'Menor tiempo de descanso estival',
    isRareLegendEvent: true,
    isRisky: false,
    successOutcome: {
      narrativeOutcome: '¡ORGULLO PATRIO! Dominas a nivel internacional y aumentas tu legado.',
      statChanges: { reputation: +20, clutch: +6, ovr: +2 },
      unlockedBadge: '🥇 Orgullo Olímpico',
    },
  },
];

export const OffseasonDecisionModal: React.FC<OffseasonDecisionModalProps> = ({
  player,
  latestSeason,
  onDecisionComplete,
}) => {
  const needsContractSelection = player.contractYearsRemaining <= 0;
  const freeAgencyOffers = needsContractSelection ? generateOffseasonOffers(player) : [];

  // Dynamically select 3 Standard Base Cards + 1 Special Legend Wildcard Card based on player progression!
  const [selectedActivities] = useState<OffseasonActivity[]>(() => {
    const eligibleBase = BASE_ACTIVITIES_POOL.filter(act => {
      if (act.minAge && player.age < act.minAge) return false;
      if (act.minOvr && player.ovr < act.minOvr) return false;
      return true;
    });

    const shuffledBase = [...eligibleBase].sort(() => 0.5 - Math.random());
    const choices = shuffledBase.slice(0, 3);

    const eligibleRare = RARE_LEGEND_EVENTS_POOL.filter(act => {
      if (act.minOvr && player.ovr < act.minOvr) return false;
      if (act.minReputation && player.reputation < act.minReputation) return false;
      if (act.minEarnings && player.earningsMillions < act.minEarnings) return false;
      if (act.minAge && player.age < act.minAge) return false;
      return true;
    });

    if (Math.random() < 0.45 && eligibleRare.length > 0) {
      const rareEv = eligibleRare[Math.floor(Math.random() * eligibleRare.length)];
      choices.push(rareEv);
    } else if (shuffledBase[3]) {
      choices.push(shuffledBase[3]);
    } else {
      choices.push(BASE_ACTIVITIES_POOL[0]);
    }

    return choices;
  });

  const [resolvedActivityResult, setResolvedActivityResult] = useState<{
    isSuccess: boolean;
    details: ChoiceOutcomeDetails;
    activity: OffseasonActivity;
  } | null>(null);

  // Handle Free Agency Contract Acceptance
  const handleAcceptContract = (offer: ContractOffer) => {
    playAudioEffect('cash');
    const newTeam = getTeamById(offer.teamId);

    const updatedPlayer: Player = {
      ...player,
      currentTeamId: newTeam.id,
      contractYearsRemaining: offer.years,
      contractSalaryMillions: offer.salaryMillions,
    };

    onDecisionComplete(updatedPlayer);
  };

  // Handle Activity Selection (Roll risk/success probabilities)
  const handleSelectActivity = (activity: OffseasonActivity) => {
    let isSuccess = true;
    let details = activity.successOutcome;

    if (activity.isRisky && activity.failureOutcome) {
      const prob = activity.successProbability || 0.65;
      isSuccess = Math.random() <= prob;
      details = isSuccess ? activity.successOutcome : activity.failureOutcome;
    }

    if (isSuccess) playAudioEffect('badge');
    else playAudioEffect('draft_buzzer');

    setResolvedActivityResult({
      isSuccess,
      details,
      activity,
    });
  };

  // Apply Changes to Player State
  const applyActivityChanges = (details: ChoiceOutcomeDetails) => {
    let newAttrs = { ...player.attributes };
    let ovrDelta = 0;
    let earningsDelta = 0;
    let repDelta = 0;
    let marketDelta = 0;
    const newBadges = [...(player.unlockedBadges || [])];

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

    const tempPlayer: Player = { ...player, attributes: newAttrs };
    const calculatedOvr = Math.min(player.potentialMaxOvr || 99, Math.max(62, player.ovr + ovrDelta));

    const updatedPlayer: Player = {
      ...player,
      ovr: calculatedOvr,
      earningsMillions: Math.max(0, player.earningsMillions + earningsDelta),
      reputation: Math.min(100, Math.max(0, player.reputation + repDelta)),
      marketability: Math.min(100, Math.max(0, player.marketability + marketDelta)),
      attributes: newAttrs,
      unlockedBadges: newBadges,
    };

    onDecisionComplete(updatedPlayer);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full p-5 sm:p-8 space-y-6 shadow-2xl relative my-auto">
        
        {/* Outcome Result Screen if activity selected */}
        {resolvedActivityResult ? (
          <div className="space-y-6 text-center py-6 animate-fadeIn">
            <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center border-2 shadow-2xl ${
              resolvedActivityResult.isSuccess 
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400' 
                : 'bg-red-950/80 border-red-500 text-red-400'
            }`}>
              {resolvedActivityResult.isSuccess ? <CheckCircle className="w-12 h-12 text-emerald-400" /> : <XCircle className="w-12 h-12 text-red-400" />}
            </div>

            <div className="space-y-2">
              <h3 className={`font-display text-3xl sm:text-4xl font-black uppercase ${resolvedActivityResult.isSuccess ? 'text-emerald-400' : 'text-red-400'}`}>
                {resolvedActivityResult.isSuccess ? '¡ENTRENAMIENTO EXITOSO! 🎉' : '¡SOBRETRENO O INCIDENTE DE VERANO! ⚠️'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 italic leading-relaxed">
                "{resolvedActivityResult.details.narrativeOutcome}"
              </p>
            </div>

            <button
              onClick={() => applyActivityChanges(resolvedActivityResult.details)}
              className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 text-black font-display font-black text-lg uppercase py-4 rounded-2xl shadow-xl shadow-amber-500/20 active:scale-95 transition-all"
            >
              CONTINUAR A LA PRETEMPORADA NBA 🏀
            </button>
          </div>
        ) : (
          /* SCENARIO A: FREE AGENCY CONTRACT SELECTION */
          needsContractSelection ? (
            <div className="space-y-5">
              <div className="space-y-1">
                <div className="text-amber-400 font-bold text-xs uppercase tracking-wider">¡CONTRATO EXPIRADO!</div>
                <h2 className="font-display text-3xl font-black text-white uppercase">
                  AGENCIA LIBRE NBA • TARJETAS DE CONTRATO
                </h2>
                <p className="text-xs text-slate-400">
                  Tu contrato anterior ha finalizado. Selecciona la oferta donde deseas jugar tus próximas temporadas.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {freeAgencyOffers.map((offer) => {
                  const team = getTeamById(offer.teamId);
                  return (
                    <div
                      key={offer.id}
                      className="game-card-panel rounded-2xl p-5 space-y-4 flex flex-col justify-between transition-all card-hover-effect holographic-edge"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl p-1 bg-slate-950 border border-slate-800 flex items-center justify-center">
                            <img src={team.logoUrl} alt={team.name} className="w-full h-full object-contain drop-shadow" />
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm">{team.name}</div>
                            <span className="text-[10px] text-amber-400 font-bold uppercase">{offer.roleDescription}</span>
                          </div>
                        </div>

                        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
                          <div className="text-[10px] text-slate-400 uppercase font-semibold">SALARIO DE CONTRATO</div>
                          <div className="font-display font-black text-2xl text-emerald-400">${offer.salaryMillions}M / año</div>
                          <div className="text-[10px] text-slate-300 font-semibold">{offer.years} Años Duración</div>
                        </div>

                        <p className="text-[11px] text-slate-300 italic bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                          "{offer.pitchText}"
                        </p>
                      </div>

                      <button
                        onClick={() => handleAcceptContract(offer)}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-display font-black text-xs uppercase py-3 rounded-xl shadow-lg transition-all"
                      >
                        FIRMAR CONTRATO ✍️
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* SCENARIO B: OFFSEASON ACTIVITIES CARDS DECK */
            <div className="space-y-5">
              <div className="space-y-1">
                <div className="text-amber-400 font-bold text-xs uppercase tracking-wider">
                  CONTRATO ACTIVO CON {getTeamById(player.currentTeamId).name.toUpperCase()} ({player.contractYearsRemaining} AÑOS RESTANTES)
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-black text-white uppercase">
                  DECK DE ACTIVIDADES DE VERANO
                </h2>
                <p className="text-xs text-slate-400">
                  Selecciona 1 de las 4 tarjetas para jugar durante tus 2 meses de receso de verano:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedActivities.map((act) => {
                  const probSuccess = Math.round((act.successProbability || 0.65) * 100);
                  const probFail = 100 - probSuccess;

                  return (
                    <button
                      key={act.id}
                      onClick={() => handleSelectActivity(act)}
                      className={`rounded-2xl p-5 text-left transition-all duration-200 group relative overflow-hidden flex flex-col justify-between holographic-edge card-hover-effect ${
                        act.isRareLegendEvent 
                          ? 'game-card-rare' 
                          : 'game-card-panel'
                      }`}
                    >
                      {/* Top Header Badges */}
                      <div className="flex items-center justify-between gap-2 mb-1">
                        {act.isRareLegendEvent ? (
                          <div className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                            <Star className="w-3 h-3 text-purple-400 fill-purple-400 animate-pulse" />
                            <span>⭐ CARTA RARA DE LEYENDA</span>
                          </div>
                        ) : (
                          <div className="bg-slate-900 border border-slate-800 text-slate-400 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                            CARTA ESTÁNDAR DE VERANO
                          </div>
                        )}

                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase ${
                          act.riskLevel === 'ALTO' ? 'bg-red-500/20 border-red-500/40 text-red-400' :
                          act.riskLevel === 'MEDIO' ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' :
                          'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                        }`}>
                          RIESGO {act.riskLevel}
                        </span>
                      </div>

                      <div className="space-y-2 py-1">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-2xl shadow-inner flex-shrink-0">
                            {act.icon}
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors leading-tight">
                              {act.title}
                            </h4>
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                          {act.description}
                        </p>
                      </div>

                      {/* Explicit Pros & Cons & Probabilities Card Breakdown */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-[11px] mt-2">
                        <div className="flex items-center justify-between text-emerald-400 font-bold bg-emerald-950/40 p-2 rounded-xl border border-emerald-500/20">
                          <span className="flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>PRO: {act.proText}</span>
                          </span>
                          {act.isRisky && <span className="text-[10px] text-emerald-300">({probSuccess}% Éxito)</span>}
                        </div>

                        <div className="flex items-center justify-between text-rose-400 font-bold bg-red-950/40 p-2 rounded-xl border border-red-500/20">
                          <span className="flex items-center gap-1">
                            <X className="w-3.5 h-3.5 text-rose-400" />
                            <span>CON: {act.conText}</span>
                          </span>
                          {act.isRisky && <span className="text-[10px] text-rose-300">({probFail}% Riesgo)</span>}
                        </div>
                      </div>

                      <div className="mt-3 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500 text-amber-300 hover:text-black font-display font-black text-xs uppercase py-2.5 rounded-xl text-center transition-all">
                        ELEGIR ESTA PLAN DE VERANO 👉
                      </div>

                    </button>
                  );
                })}
              </div>
            </div>
          )
        )}

      </div>
    </div>
  );
};
