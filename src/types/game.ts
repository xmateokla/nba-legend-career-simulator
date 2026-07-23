export type Position = 'PG' | 'SG' | 'SF' | 'PF' | 'C';

export type ArchetypeId = 
  | 'playmaker' 
  | 'pure_shooter' 
  | 'slasher' 
  | 'defensive_anchor' 
  | 'stretch_big' 
  | 'post_master';

export type ProspectTier = '5_STAR' | '4_STAR' | 'UNDERRATED' | 'OVERSEAS';

export type GameDifficulty = 'NORMAL' | 'HARDCORE';

export interface PlayerAttributes {
  shooting3P: number;
  shootingMid: number;
  finishing: number;
  playmaking: number;
  defense: number;
  rebounding: number;
  athletic: number;
  clutch: number;
  durability: number;
}

export interface ContractOffer {
  id: string;
  teamId: string;
  salaryMillions: number;
  years: number;
  roleDescription: string;
  pitchText: string;
  offerType: 'MAX_CONTRACT' | 'SUPERMAX_EXT' | 'MID_LEVEL' | 'RING_CHASE' | 'EURO_WILD_CARD';
}

export interface PlayerInvestment {
  id: string;
  name: string;
  category: 'lifestyle' | 'business' | 'performance';
  tier: 1 | 2 | 3;
  level: number;
  maxLevel: number;
  costMillions: number;
  upgradeCostMillions?: number;
  annualIncomeMillions: number;
  marketabilityBonus: number;
  reputationBonus?: number;
  attributeBoosts?: Partial<PlayerAttributes>;
  isTemporaryOneYear?: boolean;
  icon: string;
  bought: boolean;
}

export interface Player {
  id: string;
  name: string;
  country: string;
  position: Position;
  archetype: ArchetypeId;
  prospectTier: ProspectTier;
  difficulty: GameDifficulty;
  potentialMaxOvr: number;
  heightFeet: number;
  heightInches: number;
  weightLbs: number;
  wingspanInches: number;
  jerseyNumber: number;
  college: string;
  age: number;
  ovr: number;
  reputation: number;
  marketability: number;
  earningsMillions: number;
  passiveIncomeMillions: number;
  attributes: PlayerAttributes;
  currentTeamId: string | null;
  draftPick: number | null;
  draftTeamId: string | null;
  contractYearsRemaining: number;
  contractSalaryMillions: number;
  shoeSponsor: string | null;
  hasSignatureShoe: boolean;
  injuriesHistory: string[];
  unlockedBadges: string[];
  completedEventIds: string[];
  investments: PlayerInvestment[];
}

export interface NBATeam {
  id: string;
  name: string;
  city: string;
  abbreviation: string;
  conference: 'East' | 'West';
  division: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl: string;
  reputation: number;
  marketSize: 'Big' | 'Medium' | 'Small';
  needsPosition: Position[];
  championshipsHistory: number;
  teamState: 'Rebuilding' | 'Developing' | 'Contender' | 'Dynasty';
  expectations: 'CHAMPIONSHIP_NOW' | 'PLAYOFFS_REQUIRED' | 'REBUILD_DEVELOPMENT';
  pressureLabel: string;
}

export interface ChoiceOutcomeDetails {
  narrativeOutcome: string;
  statChanges?: Partial<PlayerAttributes> & {
    ovr?: number;
    reputation?: number;
    marketability?: number;
    earningsMillions?: number;
  };
  unlockedBadge?: string;
  teamChangeId?: string;
}

export interface EventChoice {
  id: string;
  text: string;
  description: string;
  isRisky?: boolean;
  successProbability?: number; // e.g. 0.6 = 60% chance of success
  successOutcome?: ChoiceOutcomeDetails;
  failureOutcome?: ChoiceOutcomeDetails;
  statChanges?: Partial<PlayerAttributes> & {
    ovr?: number;
    reputation?: number;
    marketability?: number;
    earningsMillions?: number;
  };
  narrativeOutcome?: string;
  teamChangeId?: string;
  unlockedBadge?: string;
}

export interface CareerEvent {
  id: string;
  title: string;
  stage: 'college' | 'draft' | 'rookie' | 'prime' | 'veteran' | 'any';
  minOvr?: number;
  maxOvr?: number;
  minAge?: number;
  description: string;
  category: 'on_court' | 'contract' | 'media' | 'offseason' | 'rivalry' | 'injury' | 'lifestyle' | 'international' | 'off_court' | 'legacy' | 'business';
  choices: EventChoice[];
}

export interface SeasonStats {
  year: number;
  age: number;
  teamId: string;
  gamesPlayed: number;
  minutesPerGame: number;
  ppg: number;
  apg: number;
  rpg: number;
  spg: number;
  bpg: number;
  fgPct: number;
  threePct: number;
  ftPct: number;
  per: number;
  teamRecord: { wins: number; losses: number; seed: number };
  playoffResult: string;
  summaryBadge: string;
  wasTraded: boolean;
  tradeNarrative?: string;
  awardsWon: string[];
  developmentNarrative?: string;   // OVR growth/decline/injury narrative
  injuryOccurred?: boolean;        // True if a significant injury happened
  ovrAtEndOfSeason?: number;       // OVR after development this season
}


export interface TrophyCase {
  championships: number;
  finalsMvp: number;
  regularMvp: number;
  rookieOfTheYear: boolean;
  dpoy: number;
  allStarSelections: number;
  allNbaFirstTeam: number;
  scoringTitles: number;
  nbaCupTitles: number;
  nbaCupMvp: number;
  olympicGoldMedals: number;
  fibaWorldCups: number;
  dunkContestChampion: boolean;
  threePointChampion: boolean;
  totalPoints: number;
  totalAssists: number;
  totalRebounds: number;
  hallOfFameChance: number;
}

export type GamePhase = 
  | 'WELCOME' 
  | 'PROSPECT_CREATION' 
  | 'COMBINE_TESTS' 
  | 'DRAFT_NIGHT' 
  | 'SEASON_DASHBOARD' 
  | 'HALL_OF_FAME' 
  | 'QUICK_START'
  | 'QUICK_DRAFT';
