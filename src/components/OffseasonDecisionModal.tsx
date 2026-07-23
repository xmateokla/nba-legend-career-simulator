import React, { useState } from 'react';
import { Player, SeasonStats, ContractOffer, ChoiceOutcomeDetails } from '../types/game';
import { getTeamById } from '../data/nbaTeams';
import { generateOffseasonOffers, playAudioEffect } from '../utils/simulator';
import { Sparkles, DollarSign, Award, Flame, Building, ArrowRight, ShieldCheck, Dice5, CheckCircle, XCircle } from 'lucide-react';

interface OffseasonDecisionModalProps {
  player: Player;
  latestSeason: SeasonStats;
  onDecisionComplete: (updatedPlayer: Player) => void;
}

interface OffseasonActivity {
  id: string;
  title: string;
  description: string;
  icon: string;
  isRisky?: boolean;
  successProbability?: number; // e.g. 0.65 = 65% chance of success
  successOutcome: ChoiceOutcomeDetails;
  failureOutcome?: ChoiceOutcomeDetails;
}

// Pool of 16+ Dynamic Offseason Activities
const OFFSEASON_ACTIVITIES_POOL: OffseasonActivity[] = [
  // 1. LEGEND WORKOUT (KOBE / JORDAN / LEBRON)
  {
    id: 'act_legend_mamba',
    title: 'Workout Privado con Leyenda Retirada (Mamba Camp)',
    description: 'Una leyenda de la NBA te invita a su gimnasio privado a las 4 AM para entrenar juego de pies y mentalidad clutch.',
    icon: '🐍',
    isRisky: true,
    successProbability: 0.70,
    successOutcome: {
      narrativeOutcome: '¡LECCIÓN DE VIDA! Absorbiste el juego de pies de leyenda. Tu Factor Clutch y Tiro de Media Distancia suben drásticamente.',
      statChanges: { clutch: 10, shootingMid: 6, ovr: 3 },
      unlockedBadge: '🐍 Mamba Mentality',
    },
    failureOutcome: {
      narrativeOutcome: '¡SOBRETRENO EXTREMO! El ritmo inhumano del entrenamiento te causó tendinitis en la rodilla.',
      statChanges: { athletic: -4, durability: -5 },
    },
  },

  // 2. HAKEEM OLAJUWON DREAM SHAKE WORKOUT
  {
    id: 'act_dream_shake',
    title: 'Sesión de Postemiento con Hakeem Olajuwon',
    description: 'Viajas al rancho de Hakeem en Texas para dominar el Dream Shake y movimientos al poste bajo.',
    icon: '👑',
    isRisky: true,
    successProbability: 0.65,
    successOutcome: {
      narrativeOutcome: '¡JUEGO DE PIES PERFECTO! Dominas las fintas en el poste y aumentas tu efectividad bajo el aro.',
      statChanges: { finishing: 7, playmaking: 4, ovr: 2 },
      unlockedBadge: '💫 Dream Shake Master',
    },
    failureOutcome: {
      narrativeOutcome: 'No lograste adaptarte al ritmo de juego de pies y sufriste una sobrecarga en los gemelos.',
      statChanges: { athletic: -3 },
    },
  },

  // 3. HOLLYWOOD MOVIE / DOCUMENTARY
  {
    id: 'act_hollywood_movie',
    title: 'Protagonizar Película/Documental en Hollywood',
    description: 'Un importante estudio de cine te ofrece el rol principal en una súper producción de baloncesto.',
    icon: '🎬',
    isRisky: true,
    successProbability: 0.60,
    successOutcome: {
      narrativeOutcome: '¡ÉXITO DE TAQUILLA! La película recaudó $150M. Obtienes +$5M USD personales y te conviertes en una celebridad global.',
      statChanges: { earningsMillions: 5, marketability: 22 },
      unlockedBadge: '⭐ Estrella de Hollywood',
    },
    failureOutcome: {
      narrativeOutcome: '¡FRACASO EN CRÍTICAS! La película fue destruida por los críticos y distrajo tu enfoque deportivo.',
      statChanges: { reputation: -12 },
    },
  },

  // 4. MMA / BOXING CROSS-TRAINING
  {
    id: 'act_mma_boxing',
    title: 'Entrenamiento Cruzado de Boxeo y MMA',
    description: 'Entrenas fuerza funcional y resistencia cardiovascular en un gimnasio de peleadores de UFC.',
    icon: '🥊',
    isRisky: true,
    successProbability: 0.65,
    successOutcome: {
      narrativeOutcome: '¡POTENCIA FÍSICA INTACTA! Tu equilibrio, salto vertical y resistencia al contacto mejoraron enormemente.',
      statChanges: { finishing: 6, athletic: 6, durability: 4 },
      unlockedBadge: '🥊 Enforcer Físico',
    },
    failureOutcome: {
      narrativeOutcome: 'Un golpe mal bloqueado en el ring te causó un esguince de muñeca en tu mano dominante.',
      statChanges: { shooting3P: -5, shootingMid: -4 },
    },
  },

  // 5. EUROPEAN SUPERCAR RALLY
  {
    id: 'act_supercar_rally',
    title: 'Gira de Superdeportivos por Europa',
    description: 'Te invitan a un exclusivo rally de lujo conduciendo Ferrari y Bugatti por las costas europeas.',
    icon: '🏎️',
    isRisky: true,
    successProbability: 0.50,
    successOutcome: {
      narrativeOutcome: '¡EXPOSICIÓN GLOBAL DE LUJO! Marcas de alta gama firman contratos contigo (+2.5M USD).',
      statChanges: { earningsMillions: 2.5, marketability: 15 },
    },
    failureOutcome: {
      narrativeOutcome: '¡POLÉMICA DE VELOCIDAD! La policía te multó por exceso de velocidad y la prensa destrozó tu imagen.',
      statChanges: { reputation: -14, earningsMillions: -0.3 },
    },
  },

  // 6. STEPH CURRY RANGE CAMP
  {
    id: 'act_curry_range',
    title: 'Campamento de Tiro Lejano con Steph Curry',
    description: 'Trabajas en la velocidad de soltado de balón y tiro de 3 puntos desde 9 metros.',
    icon: '🎯',
    isRisky: false,
    successOutcome: {
      narrativeOutcome: '¡MEJORÍA TÁCTICA! Aumentas tu rango de tiro y efectividad desde la larga distancia.',
      statChanges: { shooting3P: 5, shootingMid: 3, ovr: 2 },
      unlockedBadge: '🎯 Rango Ilimitado',
    },
  },

  // 7. REST & FULL PHYSIO RECOVERY
  {
    id: 'act_rest_recovery',
    title: 'Vacaciones de Lujo & Recuperación Física 🌴',
    description: '2 meses de descanso total en las Maldivas con fisioterapia de crioterapia diaria.',
    icon: '🌴',
    isRisky: false,
    successOutcome: {
      narrativeOutcome: 'REGENERACIÓN MUSCULAR COMPLETA. Llegas a la pretemporada con salud perfecta.',
      statChanges: { durability: +8, athletic: +2 },
    },
  },

  // 8. ASIA COMMERCIAL TOUR
  {
    id: 'act_asia_tour',
    title: 'Gira Comercial de Marcas por Asia 🎒',
    description: 'Visitas Tokio, Shanghai y Manila en eventos con miles de fanáticos vistiendo tu camiseta.',
    icon: '🎒',
    isRisky: false,
    successOutcome: {
      narrativeOutcome: '¡ÍDOLO GLOBAL! Tu camiseta es la más vendida en Asia. Obtienes ganancias e imagen de marca.',
      statChanges: { earningsMillions: 4.0, marketability: 18, reputation: +10 },
    },
  },

  // 9. NATIONAL HOMETOWN FOUNDATION
  {
    id: 'act_hometown_foundation',
    title: 'Fundación Benéfica & Construcción de canchas 💖',
    description: 'Financias la remodelación de canchas comunitarias y becas escolares en tu ciudad natal.',
    icon: '💖',
    isRisky: false,
    successOutcome: {
      narrativeOutcome: '¡HÉROE DE LA COMUNIDAD! Ganas el respeto de toda la liga y fanáticos del país.',
      statChanges: { reputation: +16, marketability: +8 },
    },
  },

  // 10. HIGH ALTITUDE COLORADO CAMP
  {
    id: 'act_colorado_altitude',
    title: 'Entrenamiento de Alta Altitud en Colorado 🏔️',
    description: 'Entrenas la capacidad pulmonar a más de 3,000 metros de altura sobre el nivel del mar.',
    icon: '🏔️',
    isRisky: true,
    successProbability: 0.75,
    successOutcome: {
      narrativeOutcome: '¡RESISTENCIA INAGOTABLE! Podrás jugar más de 38 minutos por partido sin fatiga.',
      statChanges: { athletic: 7, durability: 5 },
    },
    failureOutcome: {
      narrativeOutcome: 'Mal de altura y deshidratación severa afectaron tu rendimiento inicial.',
      statChanges: { durability: -3 },
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

  // Randomly select 4 UNIQUE activities from the pool of 10+ activities each year
  const [selectedActivities] = useState<OffseasonActivity[]>(() => {
    const shuffled = [...OFFSEASON_ACTIVITIES_POOL].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
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
      reputation: Math.min(100, player.reputation + 5),
    };

    onDecisionComplete(updatedPlayer);
  };

  // Handle Offseason Activity Selection
  const handleSelectActivity = (activity: OffseasonActivity) => {
    if (activity.isRisky) {
      const prob = activity.successProbability || 0.6;
      const isSuccess = Math.random() < prob;
      const details = isSuccess ? activity.successOutcome : (activity.failureOutcome || activity.successOutcome);

      if (isSuccess) playAudioEffect('cheer');
      else playAudioEffect('draft_buzzer');

      setResolvedActivityResult({ isSuccess, details, activity });
    } else {
      playAudioEffect('badge');
      applyActivityChanges(activity.successOutcome);
    }
  };

  const applyActivityChanges = (details: ChoiceOutcomeDetails) => {
    let newAttributes = { ...player.attributes };
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

      newAttributes = { ...newAttributes, ...attrs };
    }

    const updatedPlayer: Player = {
      ...player,
      ovr: Math.min(player.potentialMaxOvr || 99, Math.max(65, player.ovr + ovrDelta)),
      earningsMillions: Math.max(0, player.earningsMillions + earningsDelta),
      reputation: Math.min(100, Math.max(0, player.reputation + repDelta)),
      marketability: Math.min(100, Math.max(0, player.marketability + marketDelta)),
      attributes: newAttributes,
      unlockedBadges: newBadges,
      contractYearsRemaining: Math.max(0, player.contractYearsRemaining - 1),
    };

    onDecisionComplete(updatedPlayer);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-5 sm:p-8 space-y-6 shadow-2xl relative my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>DECISIÓN OBLIGATORIA DE RECESO DE VERANO</span>
          </div>
          <span className="text-slate-400 text-xs font-semibold">AÑO {latestSeason.year}</span>
        </div>

        {/* PROBABILISTIC RESOLUTION SCREEN FOR OFFSEASON ACTIVITIES */}
        {resolvedActivityResult ? (
          <div className="space-y-6 text-center animate-fadeIn py-4">
            <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-xl border-2 ${
              resolvedActivityResult.isSuccess ? 'bg-emerald-950 border-emerald-500/80 text-emerald-400' : 'bg-red-950 border-red-500/80 text-red-400'
            }`}>
              {resolvedActivityResult.isSuccess ? <CheckCircle className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
            </div>

            <div className="space-y-2">
              <h3 className={`font-display text-3xl font-black uppercase ${resolvedActivityResult.isSuccess ? 'text-emerald-400' : 'text-red-400'}`}>
                {resolvedActivityResult.isSuccess ? '¡ENTRENAMIENTO / ACTIVIDAD EXITOSA! 🎉' : '¡SOBRETRENO O INCIDENTE DE VERANO! ⚠️'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 bg-slate-950 p-4 rounded-2xl border border-slate-800 italic leading-relaxed">
                "{resolvedActivityResult.details.narrativeOutcome}"
              </p>
            </div>

            <button
              onClick={() => applyActivityChanges(resolvedActivityResult.details)}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-display font-black text-base uppercase py-3.5 rounded-xl shadow-lg transition-all"
            >
              CONTINUAR A LA PRETEMPORADA NBA 🏀
            </button>
          </div>
        ) : (
          /* SCENARIO A: FREE AGENCY CONTRACT SELECTION (When contract expired) */
          needsContractSelection ? (
            <div className="space-y-5">
              <div className="space-y-1">
                <div className="text-amber-400 font-bold text-xs uppercase tracking-wider">¡CONTRATO EXPIRADO!</div>
                <h2 className="font-display text-3xl font-black text-white uppercase">
                  AGENCIA LIBRE NBA • OFERTAS RECIBIDAS
                </h2>
                <p className="text-xs text-slate-400">
                  Tu contrato anterior ha finalizado. Elige la franquicia donde deseas jugar tus próximas temporadas.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {freeAgencyOffers.map((offer) => {
                  const team = getTeamById(offer.teamId);
                  return (
                    <div
                      key={offer.id}
                      className="bg-slate-950 border border-slate-800 hover:border-amber-500/80 rounded-2xl p-4 space-y-3 flex flex-col justify-between transition-all"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <img src={team.logoUrl} alt={team.name} className="w-8 h-8 object-contain" />
                          <div>
                            <div className="font-bold text-white text-sm">{team.name}</div>
                            <span className="text-[10px] text-amber-400 font-bold uppercase">{offer.roleDescription}</span>
                          </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-center">
                          <div className="text-[10px] text-slate-400 uppercase font-semibold">SALARIO DE CONTRATO</div>
                          <div className="font-display font-black text-xl text-emerald-400">${offer.salaryMillions}M / año</div>
                          <div className="text-[10px] text-slate-300 font-semibold">{offer.years} Años Duración</div>
                        </div>

                        <p className="text-[11px] text-slate-400 italic">
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
            /* SCENARIO B: DYNAMIC RANDOMIZED OFFSEASON ACTIVITIES (4 Unique Cards Selected Each Year!) */
            <div className="space-y-5">
              <div className="space-y-1">
                <div className="text-amber-400 font-bold text-xs uppercase tracking-wider">
                  CONTRATO ACTIVO CON {getTeamById(player.currentTeamId).name.toUpperCase()} ({player.contractYearsRemaining} AÑOS RESTANTES)
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-black text-white uppercase">
                  ACTIVIDAD DEL RECESO DE VERANO
                </h2>
                <p className="text-xs text-slate-400">
                  Selecciona cómo deseas invertir tus 2 meses de vacaciones en la NBA:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedActivities.map((act) => (
                  <button
                    key={act.id}
                    onClick={() => handleSelectActivity(act)}
                    className="bg-slate-950 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/60 rounded-2xl p-4 text-left space-y-2 transition-all group relative overflow-hidden flex flex-col justify-between"
                  >
                    {act.isRisky && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-red-500 text-black text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                        <Dice5 className="w-3 h-3" />
                        <span>{Math.round((act.successProbability || 0.6) * 100)}% PROB. ÉXITO</span>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{act.icon}</span>
                        <h4 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                          {act.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {act.description}
                      </p>
                    </div>

                    <div className="text-[10px] text-amber-300 font-bold pt-2 border-t border-slate-900">
                      SELECCIONAR ACTIVIDAD ➔
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )
        )}

      </div>
    </div>
  );
};
