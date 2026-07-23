import { Player, SeasonStats, TrophyCase, ContractOffer, PlayerInvestment } from '../types/game';
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
    marketabilityBonus: 5,
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
    marketabilityBonus: 3,
    reputationBonus: 4,
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
    marketabilityBonus: 6,
    icon: '🏎️',
    bought: false,
  },
  {
    id: 'inv_shooting_coach',
    name: 'Entrenador de Tiro Privado (Contrato 1 Año)',
    category: 'performance',
    tier: 1,
    level: 1,
    maxLevel: 1,
    costMillions: 0.5,
    annualIncomeMillions: 0,
    marketabilityBonus: 2,
    reputationBonus: 5,
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
    marketabilityBonus: 14,
    icon: '🏰',
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
    marketabilityBonus: 10,
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
    marketabilityBonus: 12,
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
    marketabilityBonus: 25,
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
    marketabilityBonus: 22,
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
  if (player.prospectTier === '5_STAR') tierBonus = 4;
  if (player.prospectTier === '4_STAR') tierBonus = 2;
  if (player.prospectTier === 'UNDERRATED') tierBonus = -2;
  if (player.prospectTier === 'OVERSEAS') tierBonus = 1;

  const finalOvr = Math.min(player.potentialMaxOvr || 99, Math.max(65, Math.round(ovr + tierBonus)));
  return finalOvr;
};

// Realist Hall of Fame Chance Calculator (Starts at 0% for rookies)
export const calculateHallOfFameChance = (trophies: TrophyCase, seasonsPlayed: number): number => {
  if (seasonsPlayed === 0) return 0;

  let points = 0;
  points += trophies.championships * 22;
  points += trophies.finalsMvp * 18;
  points += trophies.regularMvp * 25;
  points += trophies.allStarSelections * 6;
  points += trophies.allNbaFirstTeam * 8;
  points += trophies.olympicGoldMedals * 15;
  points += trophies.fibaWorldCups * 10;
  points += trophies.nbaCupTitles * 8;
  points += trophies.scoringTitles * 10;
  points += trophies.dpoy * 14;
  if (trophies.rookieOfTheYear) points += 5;

  // Stat Milestones
  if (trophies.totalPoints >= 30000) points += 25;
  else if (trophies.totalPoints >= 20000) points += 15;
  else if (trophies.totalPoints >= 10000) points += 8;

  return Math.min(100, Math.max(0, Math.round(points)));
};

// Simulate a full 82-game NBA season
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
} => {
  const ovr = player.ovr;
  const currentTeam = getTeamById(player.currentTeamId);

  // Base stat calculations with randomized variance
  const basePpg = (ovr - 55) * 0.48 + (Math.random() * 5 - 2.5);
  const ppg = parseFloat(Math.min(38.5, Math.max(8.0, basePpg)).toFixed(1));

  const isGuard = player.position === 'PG' || player.position === 'SG';
  const isBig = player.position === 'PF' || player.position === 'C';

  const baseApg = isGuard ? (player.attributes.playmaking - 45) * 0.18 + Math.random() * 2 : Math.random() * 3 + 1.5;
  const apg = parseFloat(Math.min(14.5, Math.max(1.0, baseApg)).toFixed(1));

  const baseRpg = isBig ? (player.attributes.rebounding - 45) * 0.22 + Math.random() * 3 : Math.random() * 4 + 2.0;
  const rpg = parseFloat(Math.min(16.0, Math.max(1.5, baseRpg)).toFixed(1));

  const spg = parseFloat((Math.random() * 1.5 + 0.6).toFixed(1));
  const bpg = parseFloat((isBig ? Math.random() * 2.0 + 0.8 : Math.random() * 0.8 + 0.2).toFixed(1));

  const fgPct = parseFloat((42 + (player.attributes.finishing * 0.12) + Math.random() * 4).toFixed(1));
  const threePct = parseFloat((32 + (player.attributes.shooting3P * 0.14) + Math.random() * 4).toFixed(1));
  const ftPct = parseFloat((72 + (player.attributes.shootingMid * 0.18) + Math.random() * 3).toFixed(1));
  const per = parseFloat((12 + (ovr - 70) * 0.4 + Math.random() * 2).toFixed(1));

  // Team Win Record & Seed Position (1 to 15 in Conference)
  const teamQualityBonus = currentTeam.reputation * 3;
  const playerCarryBonus = (ovr - 70) * 0.4;
  const wins = Math.min(68, Math.max(18, Math.round(30 + teamQualityBonus + playerCarryBonus + (Math.random() * 12 - 6))));
  const losses = 82 - wins;
  
  let seed = 12;
  if (wins >= 58) seed = 1;
  else if (wins >= 52) seed = 2;
  else if (wins >= 48) seed = 3;
  else if (wins >= 44) seed = 5;
  else if (wins >= 40) seed = 8;
  else if (wins >= 35) seed = 10;

  // Awards Logic
  const awardsWon: string[] = [];
  const updatedTrophies = { ...currentTrophies };

  // Rookie of the Year
  if (player.age <= 20 && !updatedTrophies.rookieOfTheYear && ppg >= 16) {
    awardsWon.push('Rookie of the Year (ROY) 🏆');
    updatedTrophies.rookieOfTheYear = true;
  }

  // All-Star
  if (ppg >= 22 || ovr >= 82) {
    awardsWon.push('All-Star NBA 🌟');
    updatedTrophies.allStarSelections += 1;
  }

  // MVP
  if (wins >= 50 && ppg >= 27.5 && ovr >= 88 && Math.random() < 0.6) {
    awardsWon.push('Most Valuable Player (MVP) 🏆');
    updatedTrophies.regularMvp += 1;
  }

  // All-NBA 1st Team
  if (ppg >= 25.0 || (apg >= 9.5 && ppg >= 20.0)) {
    awardsWon.push('All-NBA 1st Team 🏅');
    updatedTrophies.allNbaFirstTeam += 1;
  }

  // In-Season NBA Cup Tournament
  if (wins >= 44 && Math.random() < 0.35) {
    awardsWon.push('Campeón de la NBA Cup 🏆');
    updatedTrophies.nbaCupTitles += 1;
  }

  // Olympic Gold or FIBA World Cup (Every 4 years)
  if (seasonYear % 4 === 0 && ovr >= 82 && Math.random() < 0.7) {
    awardsWon.push('Medalla de Oro Olímpica 🥇');
    updatedTrophies.olympicGoldMedals += 1;
  } else if (seasonYear % 4 === 2 && ovr >= 80 && Math.random() < 0.6) {
    awardsWon.push('Campeón del Mundial FIBA 🌍');
    updatedTrophies.fibaWorldCups += 1;
  }

  // Playoff Result Details
  let playoffResult = 'Sin Playoffs (Fuera)';
  if (wins >= 48) {
    if (wins >= 58 && ovr >= 86 && Math.random() < 0.65) {
      playoffResult = '💍 CAMPEÓN NBA (4-2 vs BOS)';
      awardsWon.push('Campeón de la NBA 💍');
      updatedTrophies.championships += 1;
      if (ppg >= 24) {
        awardsWon.push('Finals MVP 🏆');
        updatedTrophies.finalsMvp += 1;
      }
    } else if (wins >= 52) {
      playoffResult = 'Finales de la NBA (2-4 vs BOS)';
    } else {
      playoffResult = 'Finales de Conferencia (3-4 vs DEN)';
    }
  } else if (wins >= 40) {
    playoffResult = '1ª Ronda de Playoffs (2-4 vs PHX)';
  } else if (wins >= 36) {
    playoffResult = 'Eliminado en Play-In';
  }

  // Cumulative Totals
  const gamesPlayed = Math.min(82, Math.max(68, Math.round(76 + (Math.random() * 6 - 3))));
  updatedTrophies.totalPoints += Math.round(ppg * gamesPlayed);
  updatedTrophies.totalAssists += Math.round(apg * gamesPlayed);
  updatedTrophies.totalRebounds += Math.round(rpg * gamesPlayed);

  // Recalculate Hall of Fame Chance
  const totalSeasons = (currentTrophies.totalPoints > 0 ? 1 : 0) + 1;
  updatedTrophies.hallOfFameChance = calculateHallOfFameChance(updatedTrophies, totalSeasons);

  // Traded Check
  let wasTraded = false;
  let newTeamId: string | undefined = undefined;
  let tradeNarrative: string | undefined = undefined;

  if (wins < 32 && Math.random() < 0.28) {
    wasTraded = true;
    const rivalTeams = NBA_TEAMS.filter(t => t.id !== player.currentTeamId);
    newTeamId = rivalTeams[Math.floor(Math.random() * rivalTeams.length)].id;
    const targetTeam = getTeamById(newTeamId);
    tradeNarrative = `¡Traspasado a los ${targetTeam.city} ${targetTeam.name}! La gerencia decidió reconstruir el equipo.`;
  }

  // Financial Income calculation
  const earnedIncomeMillions = player.contractSalaryMillions + player.passiveIncomeMillions;

  let summaryBadge = 'Temporada Solida';
  if (awardsWon.some(a => a.includes('Campeón'))) summaryBadge = '💍 Campeón NBA';
  else if (awardsWon.some(a => a.includes('MVP'))) summaryBadge = '👑 Temporada MVP';
  else if (ppg >= 28) summaryBadge = 'Explosión Anotadora';

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
  };

  return {
    stats,
    updatedTrophyCase: updatedTrophies,
    wasTraded,
    newTeamId,
    earnedIncomeMillions,
  };
};

function activeTeamId(current: string | null, traded: boolean, newId?: string): string {
  if (traded && newId) return newId;
  return current || 'LAL';
}

// Generate DYNAMIC Randomized Offseason Free Agency Offers
export const generateOffseasonOffers = (player: Player): ContractOffer[] => {
  const currentTeam = getTeamById(player.currentTeamId);
  const otherTeams = NBA_TEAMS.filter(t => t.id !== player.currentTeamId);
  
  // Shuffle available rival teams randomly
  const shuffled = [...otherTeams].sort(() => 0.5 - Math.random());
  const rival1 = shuffled[0];
  const rival2 = shuffled[1];

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
    {
      id: 'offer_rival1',
      teamId: rival1.id,
      salaryMillions: parseFloat((baseSalary * 1.10).toFixed(1)),
      years: 4,
      roleDescription: `${rival1.expectations === 'CHAMPIONSHIP_NOW' ? 'Pilar Candidato al Título' : 'Líder del Proyecto'}`,
      pitchText: `Ven a ${rival1.city} a competir al más alto nivel con los ${rival1.name}.`,
      offerType: 'MAX_CONTRACT',
    },
    {
      id: 'offer_rival2',
      teamId: rival2.id,
      salaryMillions: parseFloat((baseSalary * 1.25).toFixed(1)),
      years: 3,
      roleDescription: 'Oferta de Mercado Abierto',
      pitchText: `Los ${rival2.name} te otorgan libertad ofensiva absoluta y control de vestuario.`,
      offerType: 'MID_LEVEL',
    },
  ];

  return offers;
};

export const playAudioEffect = (type: 'cash' | 'badge' | 'cheer' | 'draft_buzzer') => {
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
