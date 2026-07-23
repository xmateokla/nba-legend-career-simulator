import { Player, SeasonStats, TrophyCase, ContractOffer, PlayerInvestment, PlayerAttributes, CareerEvent } from '../types/game';
import { getTeamById, NBA_TEAMS } from '../data/nbaTeams';

export const INITIAL_INVESTMENTS: PlayerInvestment[] = [
  // TIER 1: ROOKIE & EARLY CAREER ($0.2M - $1.5M)
  {
    id: 'inv_rookie_condo',
    name: 'Departamento de Novato de Lujo',
    category: 'lifestyle',
    tier: 1,
    level: 1,
    maxLevel: 2,
    costMillions: 0.8,
    upgradeCostMillions: 1.2,
    annualIncomeMillions: 0,
    marketabilityBonus: 8,
    reputationBonus: 4,
    icon: '🏢',
    bought: false,
  },
  {
    id: 'inv_personal_chef',
    name: 'Chef Nutricionista Personal (Contrato 1 Año)',
    category: 'performance',
    tier: 1,
    level: 1,
    maxLevel: 1,
    costMillions: 0.3,
    annualIncomeMillions: 0,
    marketabilityBonus: 0,
    reputationBonus: 2,
    attributeBoosts: {
      durability: 6,
      athletic: 4,
    },
    isTemporaryOneYear: true,
    icon: '🍳',
    bought: false,
  },
  {
    id: 'inv_sports_car',
    name: 'Auto Deportivo de Novato (Porsche 911)',
    category: 'lifestyle',
    tier: 1,
    level: 1,
    maxLevel: 2,
    costMillions: 0.4,
    upgradeCostMillions: 0.8,
    annualIncomeMillions: 0,
    marketabilityBonus: 10,
    icon: '🏎️',
    bought: false,
  },
  {
    id: 'inv_shooting_coach',
    name: 'Entrenador Privado de Tiro (Contrato 1 Año)',
    category: 'performance',
    tier: 1,
    level: 1,
    maxLevel: 1,
    costMillions: 0.5,
    annualIncomeMillions: 0,
    marketabilityBonus: 0,
    reputationBonus: 3,
    attributeBoosts: {
      shooting3P: 5,
      shootingMid: 4,
    },
    isTemporaryOneYear: true,
    icon: '🎯',
    bought: false,
  },

  // TIER 2: PRIME SUPERSTAR ($2.5M - $10M)
  {
    id: 'inv_mansion_v1',
    name: 'Residencia Privada en las Colinas',
    category: 'lifestyle',
    tier: 2,
    level: 1,
    maxLevel: 2,
    costMillions: 6.5,
    upgradeCostMillions: 8.0,
    annualIncomeMillions: 0,
    marketabilityBonus: 18,
    reputationBonus: 10,
    icon: '🏰',
    bought: false,
  },
  {
    id: 'inv_physio_recovery',
    name: 'Centro Personal de Fisioterapia & Crioterapia',
    category: 'performance',
    tier: 2,
    level: 1,
    maxLevel: 2,
    costMillions: 3.5,
    upgradeCostMillions: 5.0,
    annualIncomeMillions: 0,
    marketabilityBonus: 0,
    attributeBoosts: {
      durability: 8,
      athletic: 4,
    },
    icon: '🩺',
    bought: false,
  },
  {
    id: 'inv_tech_startup',
    name: 'Fondo de Inversión Tech en Silicon Valley',
    category: 'business',
    tier: 2,
    level: 1,
    maxLevel: 2,
    costMillions: 4.5,
    upgradeCostMillions: 6.0,
    annualIncomeMillions: 1.4,
    marketabilityBonus: 12,
    icon: '🚀',
    bought: false,
  },
  {
    id: 'inv_luxury_watches',
    name: 'Colección de Alta Horlogerie & Joyas',
    category: 'lifestyle',
    tier: 2,
    level: 1,
    maxLevel: 2,
    costMillions: 2.5,
    upgradeCostMillions: 4.0,
    annualIncomeMillions: 0,
    marketabilityBonus: 14,
    icon: '💎',
    bought: false,
  },

  // TIER 3: MOGUL / LEGEND ($12M - $45M)
  {
    id: 'inv_sneaker_brand',
    name: 'Marca Propia de Calzado Deportivo',
    category: 'business',
    tier: 3,
    level: 1,
    maxLevel: 2,
    costMillions: 15.0,
    upgradeCostMillions: 20.0,
    annualIncomeMillions: 4.8,
    marketabilityBonus: 28,
    icon: '👟',
    bought: false,
  },
  {
    id: 'inv_private_jet',
    name: 'Jet Privado Gulfstream G650',
    category: 'lifestyle',
    tier: 3,
    level: 1,
    maxLevel: 1,
    costMillions: 28.0,
    annualIncomeMillions: 0,
    marketabilityBonus: 25,
    icon: '✈️',
    bought: false,
  },
  {
    id: 'inv_nba_stake',
    name: 'Propietario Minoritario Franquicia WNBA/NBA',
    category: 'business',
    tier: 3,
    level: 1,
    maxLevel: 1,
    costMillions: 45.0,
    annualIncomeMillions: 8.5,
    marketabilityBonus: 35,
    icon: '🏟️',
    bought: false,
  },
];

// Calculate Overall Rating (OVR)
export const calculateOvr = (player: Player): number => {
  const attrs = player.attributes;
  const weights: Record<string, number> = {
    shooting3P: 0.16,
    shootingMid: 0.12,
    finishing: 0.16,
    playmaking: 0.16,
    defense: 0.14,
    rebounding: 0.10,
    athletic: 0.10,
    clutch: 0.03,
    durability: 0.03,
  };

  let ovr = 0;
  for (const key in weights) {
    ovr += (attrs[key as keyof typeof attrs] || 50) * weights[key];
  }

  // Tier base adjustment
  let tierBonus = 0;
  if (player.prospectTier === '5_STAR') tierBonus = 3;
  if (player.prospectTier === '4_STAR') tierBonus = 1;
  if (player.prospectTier === 'UNDERRATED') tierBonus = -2;
  if (player.prospectTier === 'OVERSEAS') tierBonus = 1;

  const finalOvr = Math.min(player.potentialMaxOvr || 99, Math.max(65, Math.round(ovr + tierBonus)));
  return finalOvr;
};

// HALL OF FAME CALCULATOR
export const calculateHallOfFameChance = (trophies: TrophyCase, seasonsPlayed: number): number => {
  if (seasonsPlayed === 0) return 0;

  let points = 0;

  // Tier-1 Hardware
  points += trophies.championships * 15;
  points += trophies.finalsMvp * 14;
  points += trophies.regularMvp * 20;
  points += trophies.dpoy * 10;
  points += trophies.scoringTitles * 8;
  points += trophies.olympicGoldMedals * 5;
  points += trophies.fibaWorldCups * 4;

  // Tier-2 Hardware
  points += trophies.allStarSelections * 1.5;
  points += trophies.allNbaFirstTeam * 4;
  points += trophies.nbaCupTitles * 2;
  if (trophies.rookieOfTheYear) points += 2;

  // Stat Milestones
  if (trophies.totalPoints >= 30000) points += 18;
  else if (trophies.totalPoints >= 25000) points += 12;
  else if (trophies.totalPoints >= 20000) points += 6;

  // Hard cap for borderline candidates
  const hasEliteHardware = trophies.championships >= 1 || trophies.regularMvp >= 1 ||
    trophies.dpoy >= 2 || trophies.allNbaFirstTeam >= 4 || trophies.scoringTitles >= 3;
  if (!hasEliteHardware) {
    points = Math.min(points, 58);
  }

  if (seasonsPlayed < 10) points = Math.min(points, 35);

  return Math.min(99, Math.max(0, Math.round(points)));
};

// EXPANDED CAREER EVENTS POOL (25+ events across all career stages)
export const EXPANDED_CAREER_EVENTS: CareerEvent[] = [
  // ===== ON-COURT EVENTS =====
  {
    id: 'event_playoff_injury_risk',
    title: '¿JUGAR LESIONADO EL PARTIDO 7?',
    stage: 'prime',
    category: 'on_court',
    description: 'Sufriste una torcedura de tobillo de grado 2 en el Partido 6. El cuerpo médico te sugiere no jugar, pero la serie está 3-3.',
    choices: [
      {
        id: 'choice_infiltrated',
        text: '💉 Infiltrarse y jugar con dolor',
        description: 'Te infiltras analgésicos para salir a darlo todo.',
        isRisky: true,
        successProbability: 0.65,
        successOutcome: {
          narrativeOutcome: '¡ACTUACIÓN HEROICA! Anotaste 34 puntos y ganaste el Anillo. Te coronas MVP de las Finales.',
          statChanges: { clutch: 10, reputation: 20, marketability: 25 },
          unlockedBadge: '🔥 Leyenda Infiltrada',
        },
        failureOutcome: {
          narrativeOutcome: '¡RECAÍDA GRAVE! El tobillo cedió. Perdiste el título y pierdes velocidad.',
          statChanges: { athletic: -6, durability: -8, reputation: -5 },
        },
      },
      {
        id: 'choice_rest_protect',
        text: '🩺 Proteger tu cuerpo y no jugar',
        description: 'Priorizas tu carrera a largo plazo.',
        narrativeOutcome: 'Tu equipo cayó en el Partido 7. La prensa cuestionó tu falta de entrega, pero tu físico quedó intacto.',
        statChanges: { reputation: -8, durability: 4 },
      },
    ],
  },
  {
    id: 'event_dunk_contest_invite',
    title: 'INVITACIÓN AL DUNK CONTEST 🏆',
    stage: 'rookie',
    category: 'on_court',
    description: 'Eres novato y la NBA te invita al Slam Dunk Contest del All-Star Weekend. Tu第一次 oportunidad de brillar en el escenario más grande.',
    choices: [
      {
        id: 'choice_accept_dunk',
        text: '🏆 Aceptar la invitación',
        description: 'Demuestra tu explosividad y gana el concurso.',
        isRisky: true,
        successProbability: 0.50,
        successOutcome: {
          narrativeOutcome: '¡CAMPEÓN DEL DUNK CONTEST! Tus clavadas se viralizaron en redes sociales.',
          statChanges: { reputation: 15, marketability: 12, athletic: 3 },
          unlockedBadge: '🦘 Slam Dunk Champion',
        },
        failureOutcome: {
          narrativeOutcome: 'No lograste completar tus mejores clavadas. El público se quedó con ganas de más.',
          statChanges: { reputation: -3 },
        },
      },
      {
        id: 'choice_decline_dunk',
        text: '⏭️ Rechazar y descansar',
        description: 'Te enfocas en la temporada en lugar del espectáculo.',
        narrativeOutcome: 'Decidiste descansar y prepararte para la segunda mitad de temporada.',
        statChanges: { durability: 2 },
      },
    ],
  },
  {
    id: 'event_3pt_contest_invite',
    title: 'INVITACIÓN AL 3-POINT CONTEST 🎯',
    stage: 'prime',
    category: 'on_court',
    description: 'Tu tiro de tres puntos es legendario. La NBA te invita al Three-Point Contest del All-Star Weekend.',
    choices: [
      {
        id: 'choice_accept_3pt',
        text: '🎯 Aceptar la invitación',
        description: 'Demuestra que eres el mejor tirador del mundo.',
        isRisky: true,
        successProbability: 0.55,
        successOutcome: {
          narrativeOutcome: '¡CAMPEÓN DEL 3-POINT CONTEST! Tu tiro es imparable.',
          statChanges: { shooting3P: 5, reputation: 12, marketability: 10 },
          unlockedBadge: '🎯 three Point King',
        },
        failureOutcome: {
          narrativeOutcome: 'La presión del escenario afectó tu tiro. No fue tu noche.',
          statChanges: { reputation: -2 },
        },
      },
      {
        id: 'choice_decline_3pt',
        text: '⏭️ Rechazar y prepararte',
        description: 'Te enfocas en ganar juegos, no concursos.',
        narrativeOutcome: 'Priorizaste el éxito en temporada sobre el espectáculo.',
        statChanges: { durability: 1 },
      },
    ],
  },

  // ===== CONTRACT & FREE AGENCY EVENTS =====
  {
    id: 'event_ring_chase',
    title: 'OPORTUNIDAD DE ANILLO VS DINERO 💍',
    stage: 'prime',
    category: 'contract',
    description: 'Un equipo candidato al título te ofrece un contrato por menos dinero pero con la mejor oportunidad de ganar un anillo.',
    choices: [
      {
        id: 'choice_ring_chase',
        text: '💍 Aceptar el "Ring Chase"',
        description: 'Menos dinero, pero mejor equipo.',
        isRisky: false,
        successOutcome: {
          narrativeOutcome: 'Te unes a un equipo candidato. La búsqueda del anillo comienza.',
          statChanges: { reputation: 8, clutch: 3 },
        },
      },
      {
        id: 'choice_take_money',
        text: '💰 Tomar el máximo contrato',
        description: 'Maximiza tus ganancias ahora.',
        isRisky: false,
        successOutcome: {
          narrativeOutcome: 'Firmaste el contrato máximo. Tu cuenta bancaria crece.',
          statChanges: { earningsMillions: 15, marketability: 5 },
        },
      },
    ],
  },
  {
    id: 'event_hometown_discount',
    title: 'OFERTA DE TU CIUDAD NATAL 🏠',
    stage: 'veteran',
    category: 'contract',
    description: 'Tu equipo original te ofrece un contrato con "descuento" para que la gerencia pueda fir更强的 equipo a tu alrededor.',
    choices: [
      {
        id: 'choice_hometown_discount',
        text: '❤️ Aceptar el descuento',
        description: 'Ayudas a tu equipo a mejorar el roster.',
        isRisky: false,
        successOutcome: {
          narrativeOutcome: 'Tu lealtad al equipo se gana el respeto de los fanáticos. La gerencia firma un estrella.',
          statChanges: { reputation: 12, marketability: 8 },
        },
      },
      {
        id: 'choice_no_discount',
        text: '💵 No aceptar menos dinero',
        description: 'Te mereces el máximo.',
        isRisky: false,
        successOutcome: {
          narrativeOutcome: 'Firmaste tu contrato completo. La gerencia tendrá que hacer ajustes.',
          statChanges: { earningsMillions: 8 },
        },
      },
    ],
  },

  // ===== BUSINESS & LIFESTYLE EVENTS =====
  {
    id: 'event_crypto_startup_deal',
    title: 'OPORTUNIDAD DE INVERSIÓN EN STARTUP',
    stage: 'any',
    category: 'lifestyle',
    description: 'Te proponen invertir $2M USD en una startup tech. Si despega, cuadruplicas tu fortuna.',
    choices: [
      {
        id: 'choice_invest_risky',
        text: '🚀 Invertir $2M USD',
        description: 'Apuesta de alto riesgo, alta recompensa.',
        isRisky: true,
        successProbability: 0.50,
        successOutcome: {
          narrativeOutcome: '¡ÉXITO ROTUNDO! La startup salió a bolsa. Obtienes +$8M USD.',
          statChanges: { earningsMillions: 8, marketability: 18 },
          unlockedBadge: '🚀 Magnate de Silicon Valley',
        },
        failureOutcome: {
          narrativeOutcome: '¡FRACASO Y ESTAFA! La startup se declaró en quiebra.',
          statChanges: { earningsMillions: -2, reputation: -10 },
        },
      },
      {
        id: 'choice_decline_tech',
        text: '🛡️ Rechazar y mantener seguro',
        description: 'Prefieres no arriesgar.',
        narrativeOutcome: 'Decidiste mantener tus fondos seguros.',
        statChanges: { reputation: 2 },
      },
    ],
  },
  {
    id: 'event_supercar_rally',
    title: 'RALLY DE SUPERDEPORTIVOS POR EUROPA 🏎️',
    stage: 'any',
    category: 'lifestyle',
    description: 'Conducir superdeportivos por Mónaco e Italia. Perfecto para tu imagen de estrella.',
    choices: [
      {
        id: 'choice_supercar',
        text: '🏎️ Unirte al rally',
        description: 'Exposición global y patrocinios potenciales.',
        isRisky: true,
        successProbability: 0.55,
        successOutcome: {
          narrativeOutcome: 'EXPOSICIÓN DE ALTA GAMA. Marcas de lujo firman contigo.',
          statChanges: { earningsMillions: 3.0, marketability: 16 },
        },
        failureOutcome: {
          narrativeOutcome: 'Polémica por exceso de velocidad y multa de la liga.',
          statChanges: { reputation: -14, earningsMillions: -0.4 },
        },
      },
      {
        id: 'choice_no_supercar',
        text: '🏠 Quedarte a entrenar',
        description: 'Enfoque en el juego.',
        narrativeOutcome: 'Te quedaste trabajando en tu juego. Los compañeros respetan tu dedicación.',
        statChanges: { athletic: 2 },
      },
    ],
  },

  // ===== MEDIA & PUBLICITY EVENTS =====
  {
    id: 'event_controversial_podcast',
    title: 'ENTREVISTA VIRAL EN PODCAST 🎙️',
    stage: 'any',
    category: 'media',
    description: 'Un podcast famoso te invita a hablar sin filtro sobre tu equipo y la liga.',
    choices: [
      {
        id: 'choice_speak_raw_truth',
        text: '🔥 Hablar sin filtro',
        description: 'Dices exactamente lo que piensas.',
        isRisky: true,
        successProbability: 0.45,
        successOutcome: {
          narrativeOutcome: '¡VIRAL EN REDES! El público aplaudió tu honestidad. Forzaste traspasos.',
          statChanges: { marketability: 20, reputation: 12 },
          unlockedBadge: '🎤 Portavoz de los Fans',
        },
        failureOutcome: {
          narrativeOutcome: '¡MULTA Y VESTUARIO ROTO! La gerencia te multó con $250k.',
          statChanges: { reputation: -18, earningsMillions: -0.25 },
        },
      },
      {
        id: 'choice_politically_correct',
        text: '🤐 Responder diplomáticamente',
        description: 'Proteges la química del equipo.',
        narrativeOutcome: 'Mantuviste el profesionalismo perfecto.',
        statChanges: { reputation: 6 },
      },
    ],
  },
  {
    id: 'event_hollywood_movie',
    title: 'PROTAGONIZAR PELÍCULA EN HOLLYWOOD 🎬',
    stage: 'prime',
    category: 'media',
    description: 'Una gran producción deportiva quiere que tengas el rol protagónico.',
    choices: [
      {
        id: 'choice_hollywood',
        text: '🎬 Aceptar el papel',
        description: 'Estrellato global garantizado.',
        isRisky: true,
        successProbability: 0.60,
        successOutcome: {
          narrativeOutcome: '¡ÉXITO DE TAQUILLA! Ganancias de +$5M USD y fama mundial.',
          statChanges: { earningsMillions: 5, marketability: 22 },
          unlockedBadge: '⭐ Estrella de Hollywood',
        },
        failureOutcome: {
          narrativeOutcome: 'Críticas destructivas distrajeron tu enfoque deportivo.',
          statChanges: { reputation: -12 },
        },
      },
      {
        id: 'choice_no_hollywood',
        text: '🏀 Enfocarte en el juego',
        description: 'Elbasketball es tu prioridad.',
        narrativeOutcome: 'Decidiste no arriesgar tu carrera por Hollywood.',
        statChanges: { reputation: 3 },
      },
    ],
  },
  {
    id: 'event_rap_album',
    title: 'GRABAR ÁLBUM DE HIP-HOP 🎙️',
    stage: 'any',
    category: 'media',
    description: 'Colaboras con raperos ganadores de Grammy en un álbum.',
    choices: [
      {
        id: 'choice_rap',
        text: '🎤 Grabar el álbum',
        description: 'Diversión y exposición musical.',
        isRisky: true,
        successProbability: 0.65,
        successOutcome: {
          narrativeOutcome: '¡DISCO DE ORO! Tu álbum lidera Billboard.',
          statChanges: { marketability: 18, earningsMillions: 2.0 },
          unlockedBadge: '🎤 Rap Star Icon',
        },
        failureOutcome: {
          narrativeOutcome: 'Burlas en redes por tus rimas.',
          statChanges: { reputation: -8 },
        },
      },
      {
        id: 'choice_no_rap',
        text: '🎧 No es tu camino',
        description: 'Te enfocas en lo que sabes hacer.',
        narrativeOutcome: 'Te mantuviste enfocado en tu carrera.',
        statChanges: { durability: 2 },
      },
    ],
  },

  // ===== TRAINING & DEVELOPMENT EVENTS =====
  {
    id: 'event_legend_training',
    title: 'ENTRENAMIENTO CON UNA LEYENDA 🐍',
    stage: 'any',
    category: 'offseason',
    description: 'Una leyenda de la NBA te invita a entrenar en su gimnasio privado.',
    choices: [
      {
        id: 'choice_intense_training',
        text: '🏋️ Entrenar a máxima intensidad',
        description: '6 horas diarias de trabajo.',
        isRisky: true,
        successProbability: 0.70,
        successOutcome: {
          narrativeOutcome: '¡EVOLUCIÓN TÁCTICA! Tu juego mejoró drásticamente.',
          statChanges: { shooting3P: 6, shootingMid: 5, clutch: 4 },
          unlockedBadge: '🎯 Tirador Frío',
        },
        failureOutcome: {
          narrativeOutcome: '¡SOBRETRENO! Sufriste fascitis plantar.',
          statChanges: { athletic: -4, durability: -5 },
        },
      },
      {
        id: 'choice_normal_offseason',
        text: '🏖️ Vacaciones y descanso',
        description: 'Descansas para la pretemporada.',
        narrativeOutcome: 'Tu cuerpo descansó completamente.',
        statChanges: { durability: 3 },
      },
    ],
  },
  {
    id: 'event_olympic_call_up',
    title: '¡CONVOCATORIA AL EQUIPO NACIONAL! 🇺🇸',
    stage: 'prime',
    category: 'international',
    description: '¡Has sido seleccionado para representar a tu país en el torneo internacional!',
    choices: [
      {
        id: 'choice_accept_olympic',
        text: '🇺🇸 Aceptar la convocatoria',
        description: 'Honor máximo representar a tu país.',
        isRisky: false,
        successOutcome: {
          narrativeOutcome: '¡ORGULLO PATRIO! Dominaste a nivel internacional.',
          statChanges: { reputation: 20, clutch: 6, ovr: 2 },
          unlockedBadge: '🥇 Orgullo Olímpico',
        },
      },
    ],
  },
  {
    id: 'event_fiba_call_up',
    title: '¡CONVOCATORIA AL MUNDIAL FIBA! 🌍',
    stage: 'prime',
    category: 'international',
    description: 'Tu país te necesita para el Mundial de Baloncesto FIBA.',
    choices: [
      {
        id: 'choice_accept_fiba',
        text: '🌍 Aceptar la convocatoria',
        description: 'Competir por el título mundial.',
        isRisky: false,
        successOutcome: {
          narrativeOutcome: '¡CAMPEÓN DEL MUNDO! Tu país celebra el triunfo.',
          statChanges: { reputation: 18, clutch: 5, ovr: 2 },
          unlockedBadge: '🌍 Campeón del Mundo',
        },
      },
    ],
  },
  {
    id: 'event_all_star_nomination',
    title: '¡NOMINADO AL ALL-STAR GAME! ⭐',
    stage: 'prime',
    category: 'on_court',
    description: '¡Has sido seleccionado para el All-Star Game! El mundo entero te reconoce.',
    choices: [
      {
        id: 'choice_all_star',
        text: '⭐ Aceptar con humildad',
        description: 'Un reconocimiento merecido.',
        isRisky: false,
        successOutcome: {
          narrativeOutcome: 'BRILLANTE ALL-STAR! Jugaste junto a los mejores del mundo.',
          statChanges: { reputation: 15, marketability: 10 },
          unlockedBadge: '⭐ All-Star Selection',
        },
      },
    ],
  },

  // ===== TEAM RELATIONSHIP EVENTS =====
  {
    id: 'event_teammate_conflict',
    title: 'CONFLICTO CON COMPAÑERO DE EQUIPO 🔥',
    stage: 'any',
    category: 'off_court',
    description: 'Un compañero de equipo te criticar públicamente en redes sociales.',
    choices: [
      {
        id: 'choice_confront',
        text: '🔥 Enfrentarlo directamente',
        description: 'Resolver el problema cara a cara.',
        isRisky: true,
        successProbability: 0.60,
        successOutcome: {
          narrativeOutcome: 'La confrontación fortaleció su relación. Ahora son mejores aliados.',
          statChanges: { reputation: 8, clutch: 3 },
        },
        failureOutcome: {
          narrativeOutcome: 'El conflicto escalar. El vestuario quedó dividido.',
          statChanges: { reputation: -10 },
        },
      },
      {
        id: 'choice_ignore',
        text: '🧘 Ignorar y mantener calma',
        description: 'No darle importancia.',
        isRisky: false,
        successOutcome: {
          narrativeOutcome: 'Tu madurez impresionó a todos. Los compañeros te respetaron más.',
          statChanges: { reputation: 5 },
        },
      },
    ],
  },
  {
    id: 'event_loyalty_test',
    title: 'TU FIDELIDAD ES PUESTA A PRUEBA 💔',
    stage: 'veteran',
    category: 'off_court',
    description: 'Un equipo rival te ofrece un contrato legendario. Dejas tu equipo actual después de años.',
    choices: [
      {
        id: 'choice_loyalty',
        text: '💔 Irte a buscar el anillo',
        description: 'Nuevos horizontes, nueva oportunidad.',
        isRisky: false,
        successOutcome: {
          narrativeOutcome: 'Emprendiste un nuevo viaje. Los fanáticos quedaron decepcionados pero respetaron tu decisión.',
          statChanges: { reputation: -5, marketability: 8 },
        },
      },
      {
        id: 'choice_stay_loyal',
        text: '❤️ Quedarte con tu equipo',
        description: 'La lealtad vale más que el dinero.',
        isRisky: false,
        successOutcome: {
          narrativeOutcome: 'Te quedaste. Los fanáticos te aman por siempre. Tu jersey nunca se dejará de vender.',
          statChanges: { reputation: 15, marketability: 10 },
          unlockedBadge: '💜 Loyalty Legend',
        },
      },
    ],
  },

  // ===== INJURY & RECOVERY EVENTS =====
  {
    id: 'event_career_injury',
    title: 'LESIÓN GRAVE QUE AMENAZA TU CARRERA 🏥',
    stage: 'any',
    category: 'injury',
    description: 'Sufriste una lesión que podría terminar tu carrera. Los médicos no están seguros.',
    choices: [
      {
        id: 'choice_aggressive_rehab',
        text: '💪 Rehab agresivo y cirugía experimental',
        description: 'Riesgo alto pero recuperación más rápida.',
        isRisky: true,
        successProbability: 0.55,
        successOutcome: {
          narrativeOutcome: '¡VUELVES MÁS FUERTE! Tu determinación inspiró al mundo.',
          statChanges: { athletic: 5, durability: 8, clutch: 5 },
          unlockedBadge: '💪 Comeback King',
        },
        failureOutcome: {
          narrativeOutcome: 'La cirugía no funcionó como se esperaba. Tu OVR disminuyó permanentemente.',
          statChanges: { athletic: -10, durability: -8, ovr: -5 },
        },
      },
      {
        id: 'choice_conservative_rehab',
        text: '🩺 Rehab conservador',
        description: 'Recuperación lenta pero segura.',
        isRisky: false,
        successOutcome: {
          narrativeOutcome: 'Te recuperaste completamente. Tu cuerpo te lo agradece.',
          statChanges: { durability: 3 },
        },
      },
    ],
  },

  // ===== RETIREMENT PLANNING =====
  {
    id: 'event_retirement_consideration',
    title: '¿ES HORA DE RETIRARSE? 🏆',
    stage: 'veteran',
    category: 'legacy',
    description: 'A tus 37 años, el cuerpo ya no responde igual. La gerencia pregunta sobre tu futuro.',
    choices: [
      {
        id: 'choice_one_more_year',
        text: '🔥 ¡Una temporada más!',
        description: 'El fuego aún arde dentro de ti.',
        isRisky: false,
        successOutcome: {
          narrativeOutcome: '¡UNA TEMPORADA MÁS! Demostraste que la edad es solo un número.',
          statChanges: { reputation: 8, clutch: 3 },
        },
      },
      {
        id: 'choice_start_planning',
        text: '📋 Planificar el retiro',
        description: 'Es hora de pensar en el futuro.',
        isRisky: false,
        successOutcome: {
          narrativeOutcome: 'Comenzaste a planificar tu vida post-basketball. Inversiones y negocios te esperan.',
          statChanges: { marketability: 5, earningsMillions: 5 },
        },
      },
    ],
  },

  // ===== SOCIAL IMPACT EVENTS =====
  {
    id: 'event_charity_foundation',
    title: 'FUNDACIÓN BENÉFICA EN TU CIUDAD NATAL 💖',
    stage: 'any',
    category: 'lifestyle',
    description: 'Financiar la remodelación de canchas comunitarias y becas educativas.',
    choices: [
      {
        id: 'choice_charity',
        text: '💖 Crear la fundación',
        description: 'Devolver a la comunidad.',
        isRisky: false,
        successOutcome: {
          narrativeOutcome: '¡HÉROE DE LA COMUNIDAD! Los niños de tu ciudad te adoran.',
          statChanges: { reputation: 15, marketability: 6 },
          unlockedBadge: '💖 Community Hero',
        },
      },
    ],
  },
  {
    id: 'event_sneaker_brand_deal',
    title: 'ACUERDO DE ZAPATILLAS CON MARCA LIDER 👟',
    stage: 'prime',
    category: 'business',
    description: 'Nike/Adidas quiere hacerte el rostro de su línea de baloncesto.',
    choices: [
      {
        id: 'choice_sneaker_deal',
        text: '👟 Aceptar el acuerdo',
        description: 'Convertirte en ícono de una marca.',
        isRisky: false,
        successOutcome: {
          narrativeOutcome: '¡TU PROPIA LÍNEA DE ZAPATILLAS! Las ventas rompieron récords.',
          statChanges: { marketability: 25, earningsMillions: 12 },
          unlockedBadge: '👟 Signature Shoe Legend',
        },
      },
    ],
  },

  // ===== MORE ON-COURT EVENTS =====
  {
    id: 'event_rookie_record',
    title: '¡RÉCORD DE NOVATO! 📊',
    stage: 'rookie',
    category: 'on_court',
    description: 'Estás cerca de romper el récord de puntos de un novato en tu equipo.',
    choices: [
      {
        id: 'choice_chase_record',
        text: '🏀 Ir por el récord',
        description: 'Escribir tu nombre en la historia.',
        isRisky: false,
        successOutcome: {
          narrativeOutcome: '¡RÉCORD ROTO! Tu nombre es eterno en la historia del equipo.',
          statChanges: { reputation: 15, clutch: 5, marketability: 10 },
          unlockedBadge: '📊 Rookie Record Breaker',
        },
      },
    ],
  },
  {
    id: 'event_defensive_player_of_year',
    title: '¡CANDIDATO A DPOY! 🛡️',
    stage: 'prime',
    category: 'on_court',
    description: 'Tu defensa ha sido dominante toda la temporada. Eres serio candidato al Defensive Player of the Year.',
    choices: [
      {
        id: 'choice_dpoy',
        text: '🛡️ Seguir dominando defensivamente',
        description: 'Ganarte el premio más difícil.',
        isRisky: false,
        successOutcome: {
          narrativeOutcome: '¡DPOY! Tu defensa es legendaria. Los base都不敢面对你.',
          statChanges: { defense: 5, reputation: 12 },
          unlockedBadge: '🛡️ Defensive Player of Year',
        },
      },
    ],
  },
];

// ============================================================
// SIMULATE SEASON - MAIN ENGINE
// ============================================================
export const simulateSeason = (
  player: Player,
  seasonYear: number,
  currentTrophies: TrophyCase
): {
  stats: SeasonStats;
  updatedTrophyCase: TrophyCase;
  wasTraded: boolean;
  newTeamId?: string;
  earnedIncomeMillions: number;
  newOvr: number;
  updatedAttributes?: PlayerAttributes;
  developmentNarrative?: string;
  injuryOccurred: boolean;
  seasonMilestones: string[];
  triggeredEvents: CareerEvent[];
} => {
  const ovr = player.ovr;
  const age = player.age;
  const currentTeam = getTeamById(player.currentTeamId);
  const seasonMilestones: string[] = [];
  const triggeredEvents: CareerEvent[] = [];

  // ============================================================
  // OVR PROGRESSION ENGINE
  // ============================================================
  let ovrDelta = 0;
  let developmentNarrative: string | undefined = undefined;
  let injuryOccurred = false;

  // INJURY RISK
  const durability = player.attributes?.durability ?? 75;
  const injuryRoll = Math.random();
  const injuryThreshold = durability < 65 ? 0.20 : durability < 80 ? 0.08 : 0.03;

  if (injuryRoll < injuryThreshold) {
    injuryOccurred = true;
    ovrDelta = -(Math.floor(Math.random() * 3) + 1);
    const injuries = ['desgarro de ligamentos cruzados', 'fractura de tobillo', 'lesión de hombro grave', 'hernia discal', 'fractura de muñeca'];
    const injury = injuries[Math.floor(Math.random() * injuries.length)];
    developmentNarrative = `⚕️ LESIÓN: Sufriste un ${injury}. (-${Math.abs(ovrDelta)} OVR permanente)`;
  } else {
    // DEVELOPMENT CURVE
    if (age < 20) {
      const roll = Math.random();
      if (roll < 0.15) { ovrDelta = -1; developmentNarrative = '📉 Año de adaptación duro.'; }
      else if (roll < 0.50) { ovrDelta = 1; }
      else { ovrDelta = 2; }
    } else if (age < 24) {
      const bustRisk = player.prospectTier === 'UNDERRATED' ? 0.20 : player.prospectTier === '4_STAR' ? 0.10 : player.prospectTier === 'OVERSEAS' ? 0.12 : 0.06;
      const roll = Math.random();
      if (roll < bustRisk) {
        ovrDelta = -(Math.floor(Math.random() * 2) + 1);
        developmentNarrative = `📉 REGRESIÓN: Mala actitud o cambios en el sistema te afectaron.`;
      } else if (roll < bustRisk + 0.30) {
        ovrDelta = 3;
        developmentNarrative = '📈 ¡AÑO DE RUPTURA! Mejora notable en tus fundamentos.';
        seasonMilestones.push('🎉 ¡AÑO DE RUPTURA!');
      } else if (roll < bustRisk + 0.65) {
        ovrDelta = 2;
      } else {
        ovrDelta = 1;
      }
    } else if (age < 28) {
      const roll = Math.random();
      if (roll < 0.10) { ovrDelta = 2; developmentNarrative = '🔥 Prime absoluto — temporada de ensueño.'; }
      else if (roll < 0.60) { ovrDelta = 1; }
      else if (roll < 0.85) { ovrDelta = 0; }
      else { ovrDelta = -1; developmentNarrative = '📉 Año irregular.'; }
    } else if (age < 32) {
      const roll = Math.random();
      if (roll < 0.20) { ovrDelta = 0; }
      else if (roll < 0.60) { ovrDelta = -1; }
      else { ovrDelta = -2; developmentNarrative = '📉 El declive natural comienza.'; }
    } else {
      const roll = Math.random();
      if (roll < 0.15) { ovrDelta = 0; developmentNarrative = '💪 A pesar de la edad, te mantienes notable.'; }
      else if (roll < 0.60) { ovrDelta = -1; }
      else if (roll < 0.85) { ovrDelta = -2; }
      else { ovrDelta = -3; developmentNarrative = '🏁 El declive es evidente.'; }
    }
  }

  const newOvr = Math.min(
    player.potentialMaxOvr ?? 99,
    Math.max(62, ovr + ovrDelta)
  );

  const effectiveOvr = newOvr;

  // STATS CALCULATION
  const basePpg = (effectiveOvr - 52) * 0.65 + (Math.random() * 5 - 2.5);
  const ppgMultiplier = injuryOccurred ? 0.75 : 1.0;
  const ppg = parseFloat(Math.min(38.5, Math.max(6.5, basePpg * ppgMultiplier)).toFixed(1));

  const isGuard = player.position === 'PG' || player.position === 'SG';
  const isBig = player.position === 'PF' || player.position === 'C';

  const baseApg = isGuard 
    ? (player.attributes.playmaking - 55) * 0.12 + (player.position === 'PG' ? 4.5 : 2.0) + Math.random() * 2
    : Math.random() * 2.5 + 1.2;
  const apg = parseFloat(Math.min(12.0, Math.max(1.0, baseApg * (injuryOccurred ? 0.75 : 1.0))).toFixed(1));

  const baseRpg = isBig 
    ? (player.attributes.rebounding - 55) * 0.12 + (player.position === 'C' ? 5.5 : 3.5) + Math.random() * 2.5
    : Math.random() * 3.0 + 2.5;
  const rpg = parseFloat(Math.min(14.0, Math.max(2.0, baseRpg)).toFixed(1));

  const spg = parseFloat((Math.random() * 1.5 + 0.6).toFixed(1));
  const bpg = parseFloat((isBig ? Math.random() * 2.2 + 0.8 : Math.random() * 0.8 + 0.2).toFixed(1));

  const fgPct = parseFloat((44 + (player.attributes.finishing * 0.11) + Math.random() * 4).toFixed(1));
  const threePct = parseFloat((33 + (player.attributes.shooting3P * 0.13) + Math.random() * 4).toFixed(1));
  const ftPct = parseFloat((74 + (player.attributes.shootingMid * 0.16) + Math.random() * 3).toFixed(1));
  const per = parseFloat((14 + (effectiveOvr - 70) * 0.45 + Math.random() * 2).toFixed(1));

  // TEAM WIN RECORD
  const teamQualityBonus = currentTeam.reputation * 3;
  const playerCarryBonus = (effectiveOvr - 70) * 0.45;
  const injuryWinPenalty = injuryOccurred ? -8 : 0;
  const wins = Math.min(68, Math.max(18, Math.round(30 + teamQualityBonus + playerCarryBonus + injuryWinPenalty + (Math.random() * 12 - 6))));
  const losses = 82 - wins;
  
  let seed = 12;
  if (wins >= 58) seed = 1;
  else if (wins >= 52) seed = 2;
  else if (wins >= 48) seed = 3;
  else if (wins >= 44) seed = 5;
  else if (wins >= 40) seed = 8;
  else if (wins >= 35) seed = 10;

  // AWARDS LOGIC
  const awardsWon: string[] = [];
  const updatedTrophies = { ...currentTrophies };

  // SCORING TITLE
  if (ppg >= 29.5 && Math.random() < 0.70) {
    awardsWon.push('Líder Anotador NBA (Scoring Title) 🏆');
    updatedTrophies.scoringTitles += 1;
    seasonMilestones.push('🏆 ¡LÍDER ANOTADOR!');
  }

  // ROOKIE OF THE YEAR
  if (player.age <= 20 && !updatedTrophies.rookieOfTheYear && ppg >= 16) {
    awardsWon.push('Rookie of the Year (ROY) 🏆');
    updatedTrophies.rookieOfTheYear = true;
    seasonMilestones.push('🏆 ¡ROOKIE OF THE YEAR!');
  }

  // ALL-STAR SELECTION (IMPROVED!)
  if ((ppg >= 21.5 && effectiveOvr >= 82) || effectiveOvr >= 86) {
    awardsWon.push('All-Star NBA 🌟');
    updatedTrophies.allStarSelections += 1;
    seasonMilestones.push('⭐ ¡ALL-STAR!');
    
    // Trigger All-Star event!
    const allStarEvent = EXPANDED_CAREER_EVENTS.find(e => e.id === 'event_all_star_nomination');
    if (allStarEvent) triggeredEvents.push(allStarEvent);
  }

  // MVP
  if (wins >= 52 && ppg >= 26.5 && effectiveOvr >= 88 && Math.random() < 0.55) {
    awardsWon.push('Most Valuable Player (MVP) 🏆');
    updatedTrophies.regularMvp += 1;
    seasonMilestones.push('🏆 ¡MVP DE LA TEMPORADA!');
  }

  // ALL-NBA 1ST TEAM
  if (ppg >= 25.0 || (apg >= 9.5 && ppg >= 20.0)) {
    awardsWon.push('All-NBA 1st Team 🏅');
    updatedTrophies.allNbaFirstTeam += 1;
  }

  // NBA CUP
  if (wins >= 44 && Math.random() < 0.35) {
    awardsWon.push('Campeón de la NBA Cup 🏆');
    updatedTrophies.nbaCupTitles += 1;
    seasonMilestones.push('🏆 ¡NBA CUP!');
  }

  // OLYMPICS - WITH NOTIFICATION
  if (seasonYear % 4 === 0 && effectiveOvr >= 82) {
    if (Math.random() < 0.70) {
      awardsWon.push('Medalla de Oro Olímpica 🥇');
      updatedTrophies.olympicGoldMedals += 1;
      seasonMilestones.push('🥇 ¡ORO OLÍMPICO!');
      
      // Trigger Olympic event
      const olympicEvent = EXPANDED_CAREER_EVENTS.find(e => e.id === 'event_olympic_call_up');
      if (olympicEvent) triggeredEvents.push(olympicEvent);
    }
  }

  // FIBA WORLD CUP - WITH NOTIFICATION
  if (seasonYear % 4 === 2 && effectiveOvr >= 80) {
    if (Math.random() < 0.60) {
      awardsWon.push('Campeón del Mundial FIBA 🌍');
      updatedTrophies.fibaWorldCups += 1;
      seasonMilestones.push('🌍 ¡CAMPEÓN DEL MUNDO!');
      
      // Trigger FIBA event
      const fibaEvent = EXPANDED_CAREER_EVENTS.find(e => e.id === 'event_fiba_call_up');
      if (fibaEvent) triggeredEvents.push(fibaEvent);
    }
  }

  // DUNK CONTEST - GUARDS ONLY
  if ((player.position === 'PG' || player.position === 'SG' || player.position === 'SF') && 
      player.attributes?.athletic && player.attributes.athletic >= 80 &&
      age <= 28 && !updatedTrophies.dunkContestChampion && Math.random() < 0.25) {
    // Auto-qualify for dunk contest if athletic >= 85
    if (player.attributes.athletic >= 85 && Math.random() < 0.60) {
      updatedTrophies.dunkContestChampion = true;
      awardsWon.push('Slam Dunk Contest Champion 🏆');
      seasonMilestones.push('🏆 ¡DUNK CONTEST!');
    }
  }

  // 3-POINT CONTEST - GOOD SHOOTERS
  if (player.attributes?.shooting3P && player.attributes.shooting3P >= 82 &&
      age <= 35 && !updatedTrophies.threePointChampion && Math.random() < 0.20) {
    // Auto-qualify for 3PT contest if shooting >= 88
    if (player.attributes.shooting3P >= 88 && Math.random() < 0.55) {
      updatedTrophies.threePointChampion = true;
      awardsWon.push('3-Point Contest Champion 🏆');
      seasonMilestones.push('🏆 ¡3-POINT CONTEST!');
    }
  }

  // PLAYOFF RESULTS - EASIER CHAMPIONSHIP (was too hard)
  const playoffOpponents = ['BOS', 'MIL', 'DEN', 'PHX', 'GSW', 'MIA', 'NYK', 'OKC', 'MIN', 'DAL'];
  const randOpp = playoffOpponents[Math.floor(Math.random() * playoffOpponents.length)];
  const randOpp2 = playoffOpponents[Math.floor(Math.random() * playoffOpponents.length)];
  const finalsScores = ['4-2', '4-3', '4-1', '4-0'];
  const randScore = finalsScores[Math.floor(Math.random() * finalsScores.length)];

  let playoffResult = 'Sin Playoffs (Fuera)';

  // First Finals ever?
  if (wins >= 46 && currentTrophies.finalsMvp === 0 && currentTrophies.championships === 0) {
    seasonMilestones.push('🏀 ¡PRIMERAS FINALS DE TU CARRERA!');
  }

  if (wins >= 46) {
    // Championship: MUCH EASIER! 40% base chance for good teams
    // Dynasty teams get 55%
    const teamChampionships = currentTeam.championshipsHistory;
    let champChance = teamChampionships >= 5 ? 0.55 : 0.40;
    
    // Add momentum: if you made Finals last year, better chance this year
    if (careerHistoryIncludesFinals(currentTrophies)) {
      champChance += 0.15;
    }
    
    // OVR bonus: elite players have better chances
    if (effectiveOvr >= 85) champChance += 0.10;
    
    if (wins >= 50 && effectiveOvr >= 78 && Math.random() < champChance) {
      playoffResult = `💍 CAMPEÓN NBA (${randScore} vs ${randOpp})`;
      awardsWon.push('Campeón de la NBA 💍');
      updatedTrophies.championships += 1;
      seasonMilestones.push('💍 ¡PRIMER ANILLO!');
      
      if (ppg >= 22) {
        awardsWon.push('Finals MVP 🏆');
        updatedTrophies.finalsMvp += 1;
      }
    } else if (wins >= 48 && effectiveOvr >= 80 && Math.random() < 0.45) {
      playoffResult = `Finales de la NBA (2-4 vs ${randOpp})`;
      seasonMilestones.push('🏀 ¡FINALS NBA!');
    } else if (wins >= 45 && Math.random() < 0.55) {
      playoffResult = `Finales de Conferencia (3-4 vs ${randOpp2})`;
      seasonMilestones.push('🏀 ¡FINALS DE CONFERENCIA!');
    } else {
      playoffResult = `Semifinales de Conferencia (2-4 vs ${randOpp2})`;
    }
  } else if (wins >= 38) {
    playoffResult = `1ª Ronda de Playoffs (${Math.random() < 0.4 ? '4-2' : '2-4'} vs ${randOpp})`;
  } else if (wins >= 34) {
    playoffResult = 'Eliminado en Play-In';
  }

  // GAMES PLAYED
  const gamesPlayed = injuryOccurred 
    ? Math.round(30 + Math.random() * 25)
    : Math.min(82, Math.max(68, Math.round(76 + (Math.random() * 6 - 3))));
  updatedTrophies.totalPoints += Math.round(ppg * gamesPlayed);
  updatedTrophies.totalAssists += Math.round(apg * gamesPlayed);
  updatedTrophies.totalRebounds += Math.round(rpg * gamesPlayed);

  // HALL OF FAME
  const totalSeasons = (currentTrophies.totalPoints > 0 ? 1 : 0) + 1;
  updatedTrophies.hallOfFameChance = calculateHallOfFameChance(updatedTrophies, totalSeasons);

  // TRADED CHECK
  let wasTraded = false;
  let newTeamId: string | undefined = undefined;
  let tradeNarrative: string | undefined = undefined;

  if (wins < 32 && Math.random() < 0.25) {
    wasTraded = true;
    const rivalTeams = NBA_TEAMS.filter(t => t.id !== player.currentTeamId);
    newTeamId = rivalTeams[Math.floor(Math.random() * rivalTeams.length)].id;
    const targetTeam = getTeamById(newTeamId);
    tradeNarrative = `¡Traspasado a los ${targetTeam.city} ${targetTeam.name}! La gerencia decidió reconstruir.`;
    seasonMilestones.push('🔄 ¡TRASPASADO!');
  }

  // SALARY
  const salaryBase = effectiveOvr >= 93 ? 44.0 : effectiveOvr >= 88 ? 34.0 : effectiveOvr >= 83 ? 24.0 : effectiveOvr >= 78 ? 14.0 : 6.5;
  const salaryVariance = (Math.random() * 8 - 4);
  const dynamicSalary = parseFloat(Math.max(4.0, salaryBase + salaryVariance).toFixed(1));
  const earnedIncomeMillions = dynamicSalary + (player.passiveIncomeMillions || 0);

  let summaryBadge = 'Temporada Sólida';
  if (awardsWon.some(a => a === 'Campeón de la NBA 💍')) summaryBadge = '💍 Campeón NBA';
  else if (awardsWon.some(a => a.includes('MVP'))) summaryBadge = '👑 MVP';
  else if (awardsWon.some(a => a.includes('FIBA'))) summaryBadge = '🌍 Campeón FIBA';
  else if (awardsWon.some(a => a.includes('NBA Cup'))) summaryBadge = '🏆 NBA Cup';
  else if (ppg >= 28) summaryBadge = '🔥 Explosión Anotadora';

  const stats: SeasonStats = {
    year: seasonYear,
    age: player.age,
    teamId: activeTeamId(player.currentTeamId, wasTraded, newTeamId),
    gamesPlayed,
    minutesPerGame: parseFloat(Math.min(38.5, Math.max(18.0, (ppg * 0.85) + 12.0)).toFixed(1)),
    ppg,
    apg,
    rpg,
    spg,
    bpg,
    fgPct,
    threePct,
    ftPct,
    per,
    teamRecord: { wins, losses, seed },
    playoffResult,
    summaryBadge,
    wasTraded,
    tradeNarrative,
    awardsWon,
    developmentNarrative,
    injuryOccurred,
    ovrAtEndOfSeason: newOvr,
  };

  // SCALED ATTRIBUTES
  const updatedAttributes = { ...player.attributes };
  if (ovr > 0 && newOvr !== ovr) {
    const scaleFactor = newOvr / ovr;
    (Object.keys(updatedAttributes) as (keyof typeof updatedAttributes)[]).forEach(key => {
      updatedAttributes[key] = Math.max(40, Math.min(99, Math.round((updatedAttributes[key] || 50) * scaleFactor)));
    });
  }

  return {
    stats,
    updatedTrophyCase: updatedTrophies,
    wasTraded,
    newTeamId,
    earnedIncomeMillions,
    newOvr,
    updatedAttributes,
    developmentNarrative,
    injuryOccurred,
    seasonMilestones,
    triggeredEvents,
  };
};

// Helper to check if player made Finals in previous season
function careerHistoryIncludesFinals(trophies: TrophyCase): boolean {
  // If they already have championships or Finals MVPs, they made Finals
  return trophies.championships > 0 || trophies.finalsMvp > 0;
}

function activeTeamId(current: string | null, traded: boolean, newId?: string): string {
  if (traded && newId) return newId;
  return current || 'LAL';
}

// GENERATE OFFSEASON OFFERS - IMPROVED VARIETY
export const generateOffseasonOffers = (player: Player): ContractOffer[] => {
  const currentTeam = getTeamById(player.currentTeamId);
  const otherTeams = NBA_TEAMS.filter(t => t.id !== player.currentTeamId);
  
  // Sort teams by relevance
  const contenders = otherTeams.filter(t => t.expectations === 'CHAMPIONSHIP_NOW' || t.teamState === 'Dynasty');
  const rebuilding = otherTeams.filter(t => t.expectations === 'REBUILD_DEVELOPMENT');
  const others = otherTeams.filter(t => t.expectations === 'PLAYOFFS_REQUIRED');

  const shuffledContenders = [...contenders].sort(() => 0.5 - Math.random());
  const shuffledRebuilding = [...rebuilding].sort(() => 0.5 - Math.random());
  const shuffledOthers = [...others].sort(() => 0.5 - Math.random());

  const baseSalary = Math.min(60, Math.max(12, (player.ovr - 65) * 1.6));
  const isSuperstar = player.ovr >= 88;

  const offers: ContractOffer[] = [
    {
      id: 'offer_current',
      teamId: currentTeam.id,
      salaryMillions: parseFloat((isSuperstar ? baseSalary * 1.35 : baseSalary * 1.15).toFixed(1)),
      years: isSuperstar ? 5 : 4,
      roleDescription: isSuperstar ? 'Supermax Extension & Leyenda de Franquicia' : 'Superestrella de la Franquicia',
      pitchText: `Los ${currentTeam.name} te ofrecen el contrato ${isSuperstar ? 'SUPERMAX' : 'máximo'} para asegurar tu legado aquí.`,
      offerType: isSuperstar ? 'SUPERMAX_EXT' : 'MAX_CONTRACT',
    },
  ];

  // Ring chase option: contender with less money
  if (shuffledContenders.length > 0) {
    const ringChaseTeam = shuffledContenders[0];
    offers.push({
      id: 'offer_rival_contender',
      teamId: ringChaseTeam.id,
      salaryMillions: parseFloat((baseSalary * 0.85).toFixed(1)), // Less money
      years: 3,
      roleDescription: 'Candidato al Título Inmediato',
      pitchText: `Los ${ringChaseTeam.city} ${ringChaseTeam.name} te ofrecen competir por el anillo ahora.`,
      offerType: 'RING_CHASE',
    });
  }

  // Regular max offer from another team
  if (shuffledOthers.length > 0) {
    const maxOfferTeam = shuffledOthers[0];
    offers.push({
      id: 'offer_rival_max',
      teamId: maxOfferTeam.id,
      salaryMillions: parseFloat((baseSalary * 1.10).toFixed(1)),
      years: 4,
      roleDescription: `${maxOfferTeam.city} te quiere como pilar del proyecto.`,
      pitchText: `Ven a ${maxOfferTeam.city} a liderar ${maxOfferTeam.name}.`,
      offerType: 'MAX_CONTRACT',
    });
  }

  return offers;
};

export const playAudioEffect = (type: 'cash' | 'badge' | 'cheer' | 'draft_buzzer' | 'championship' | 'allstar') => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'draft_buzzer') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } else if (type === 'cash') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'championship') {
      // Triumphant fanfare
      osc.type = 'square';
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.15);
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.30);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } else if (type === 'allstar') {
      // Cheerful all-star sound
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    }
  } catch (_) {}
};
