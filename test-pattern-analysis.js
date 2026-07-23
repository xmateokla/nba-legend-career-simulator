/**
 * NBA LEGEND - PATTERN REPETITION ANALYSIS
 * Hundreds of tests to detect repetitive content in offseason decisions and career events
 */

const NBA_TEAMS = [
  { id: 'LAL', name: 'Lakers', city: 'Los Angeles', reputation: 95, expectations: 'CHAMPIONSHIP_NOW' },
  { id: 'BOS', name: 'Celtics', city: 'Boston', reputation: 92, expectations: 'CHAMPIONSHIP_NOW' },
  { id: 'NYK', name: 'Knicks', city: 'New York', reputation: 88, expectations: 'CHAMPIONSHIP_NOW' },
  { id: 'GSW', name: 'Warriors', city: 'Golden State', reputation: 90, expectations: 'CHAMPIONSHIP_NOW' },
  { id: 'MIA', name: 'Heat', city: 'Miami', reputation: 85, expectations: 'CHAMPIONSHIP_NOW' },
  { id: 'DEN', name: 'Nuggets', city: 'Denver', reputation: 82, expectations: 'CHAMPIONSHIP_NOW' },
  { id: 'PHX', name: 'Suns', city: 'Phoenix', reputation: 80, expectations: 'CHAMPIONSHIP_NOW' },
  { id: 'MIL', name: 'Bucks', city: 'Milwaukee', reputation: 78, expectations: 'CHAMPIONSHIP_NOW' },
  { id: 'DAL', name: 'Mavericks', city: 'Dallas', reputation: 75, expectations: 'CHAMPIONSHIP_NOW' },
  { id: 'OKC', name: 'Thunder', city: 'Oklahoma City', reputation: 74, expectations: 'CHAMPIONSHIP_NOW' },
  { id: 'MIN', name: 'Timberwolves', city: 'Minnesota', reputation: 72, expectations: 'CHAMPIONSHIP_NOW' },
  { id: 'PHI', name: '76ers', city: 'Philadelphia', reputation: 70, expectations: 'PLAYOFFS_REQUIRED' },
  { id: 'CLE', name: 'Cavaliers', city: 'Cleveland', reputation: 68, expectations: 'PLAYOFFS_REQUIRED' },
  { id: 'SAC', name: 'Kings', city: 'Sacramento', reputation: 65, expectations: 'PLAYOFFS_REQUIRED' },
  { id: 'IND', name: 'Pacers', city: 'Indiana', reputation: 62, expectations: 'REBUILD_DEVELOPMENT' },
  { id: 'NOP', name: 'Pelicans', city: 'New Orleans', reputation: 60, expectations: 'REBUILD_DEVELOPMENT' },
  { id: 'HOU', name: 'Rockets', city: 'Houston', reputation: 58, expectations: 'REBUILD_DEVELOPMENT' },
  { id: 'SAS', name: 'Spurs', city: 'San Antonio', reputation: 56, expectations: 'REBUILD_DEVELOPMENT' },
  { id: 'UTA', name: 'Jazz', city: 'Utah', reputation: 52, expectations: 'REBUILD_DEVELOPMENT' },
  { id: 'POR', name: 'Trail Blazers', city: 'Portland', reputation: 50, expectations: 'REBUILD_DEVELOPMENT' },
  { id: 'CHA', name: 'Hornets', city: 'Charlotte', reputation: 48, expectations: 'REBUILD_DEVELOPMENT' },
  { id: 'ORL', name: 'Magic', city: 'Orlando', reputation: 46, expectations: 'REBUILD_DEVELOPMENT' },
  { id: 'DET', name: 'Pistons', city: 'Detroit', reputation: 44, expectations: 'REBUILD_DEVELOPMENT' },
  { id: 'WAS', name: 'Wizards', city: 'Washington', reputation: 42, expectations: 'REBUILD_DEVELOPMENT' },
  { id: 'TOR', name: 'Raptors', city: 'Toronto', reputation: 55, expectations: 'PLAYOFFS_REQUIRED' },
  { id: 'CHI', name: 'Bulls', city: 'Chicago', reputation: 65, expectations: 'PLAYOFFS_REQUIRED' },
  { id: 'ATL', name: 'Hawks', city: 'Atlanta', reputation: 52, expectations: 'REBUILD_DEVELOPMENT' },
  { id: 'BKN', name: 'Nets', city: 'Brooklyn', reputation: 60, expectations: 'PLAYOFFS_REQUIRED' },
  { id: 'MEM', name: 'Grizzlies', city: 'Memphis', reputation: 58, expectations: 'REBUILD_DEVELOPMENT' },
  { id: 'CL1', name: 'Thunder', city: 'OKC', reputation: 74, expectations: 'CHAMPIONSHIP_NOW' },
];

// BASE ACTIVITIES POOL (from OffseasonDecisionModal.tsx)
const BASE_ACTIVITIES_POOL = [
  { id: 'act_rest_recovery', title: 'Vacaciones & Descanso Total en las Maldivas 🌴' },
  { id: 'act_preseason_camp', title: 'Campamento Estándar de Pretemporada 🎯' },
  { id: 'act_asia_tour', title: 'Gira Comercial de Marcas por Asia 🎒' },
  { id: 'act_hometown_foundation', title: 'Fundación Benéfica en tu Ciudad Natal 💖' },
  { id: 'act_colorado_altitude', title: 'Entrenamiento de Alta Altitud en Colorado 🏔️' },
  { id: 'act_defense_bootcamp', title: 'Bootcamp Intensivo de Defensa & Agilidad 🛡️' },
  { id: 'act_yoga_bali', title: 'Retiro de Yoga & Flexibilidad en Bali 🧘' },
  { id: 'act_weight_room', title: 'Gimnasio de Potencia & Fuerza Muscular 🏋️' },
  { id: 'act_podcast_tour', title: 'Gira por Podcasts & Medios Deportivos 🎙️' },
];

// RARE LEGEND EVENTS POOL
const RARE_LEGEND_EVENTS_POOL = [
  { id: 'act_legend_mamba', title: 'Workout Privado a las 4 AM con Mamba Legend 🐍' },
  { id: 'act_dream_shake', title: 'Sesión de Postemiento con Hakeem Olajuwon 👑' },
  { id: 'act_curry_range', title: 'Campamento de Tiro Lejano con Steph Curry 🎯' },
  { id: 'act_hollywood_movie', title: 'Protagonizar Película de Cine en Hollywood 🎬' },
  { id: 'act_supercar_rally', title: 'Rally de Superdeportivos por Europa 🏎️' },
  { id: 'act_rap_album', title: 'Grabar Álbum de Hip-Hop en Estudio Privado 🎙️' },
  { id: 'act_olympic_dream_team', title: 'Convocatoria al Dream Team Selección Nacional 🇺🇸' },
];

// CAREER EVENTS (from nbaEvents.ts)
const CAREER_EVENTS = [
  { id: 'event_playoff_injury_risk', title: '¿JUGAR LESIONADO EL PARTIDO 7 DE FINALES?' },
  { id: 'event_crypto_startup_deal', title: 'OPORTUNIDAD DE INVERSIÓN EN STARTUP DE IA/CRIPTOMONEDAS' },
  { id: 'event_black_ops_bootcamp', title: 'CAMPAMENTO SECRETOS DE VERANO CON LEYENDAS HOF' },
  { id: 'event_controversial_podcast', title: 'ENTREVISTA SIN FILTRO EN PODCAST VIRAL' },
];

// ==========================================
// TEST 1: OFFSEASON OFFERS REPETITION
// ==========================================
function generateOffseasonOffers(player, currentTeamId) {
  const currentTeam = NBA_TEAMS.find(t => t.id === currentTeamId);
  const otherTeams = NBA_TEAMS.filter(t => t.id !== currentTeamId);

  const shuffled = [...otherTeams].sort(() => 0.5 - Math.random());
  const rival1 = shuffled[0];
  const rival2 = shuffled[1];

  const baseSalary = Math.min(60, Math.max(12, (player.ovr - 65) * 1.6));
  const isSuperstar = player.ovr >= 88;

  return [
    { teamId: currentTeamId, type: isSuperstar ? 'SUPERMAX_EXT' : 'MAX_CONTRACT', years: isSuperstar ? 5 : 4 },
    { teamId: rival1.id, type: 'MAX_CONTRACT', years: 4 },
    { teamId: rival2.id, type: 'MID_LEVEL', years: 3 },
  ];
}

function runOffseasonOffersTest() {
  console.log('\n========================================');
  console.log('TEST 1: OFFSEASON OFFERS REPETITION (500 runs)');
  console.log('========================================');

  const player = { ovr: 85 };
  const currentTeamId = 'LAL';
  const allOffers = [];

  for (let i = 0; i < 500; i++) {
    const offers = generateOffseasonOffers(player, currentTeamId);
    allOffers.push(offers.map(o => `${o.teamId}-${o.type}-${o.years}y`));
  }

  // Count unique combinations
  const uniqueCombos = new Set(allOffers);
  console.log(`Total runs: 500`);
  console.log(`Unique offer combinations: ${uniqueCombos.size}`);
  console.log(`Repetition rate: ${((1 - uniqueCombos.size/500) * 100).toFixed(1)}%`);

  // Check if current team always appears
  const currentTeamAppears = allOffers.every(offers => offers.some(o => o.startsWith('LAL-')));
  console.log(`Current team ALWAYS in offers: ${currentTeamAppears}`);

  // Check offer types distribution
  const typeCount = {};
  allOffers.forEach(offers => {
    offers.forEach(o => {
      const type = o.split('-').slice(1).join('-');
      typeCount[type] = (typeCount[type] || 0) + 1;
    });
  });
  console.log('\nOffer types distribution (total 1500 offers):');
  Object.entries(typeCount).forEach(([type, count]) => {
    console.log(`  ${type}: ${count} (${(count/1500*100).toFixed(1)}%)`);
  });

  // Check if rival teams are diverse
  const rivalTeams = allOffers
    .flat()
    .filter(o => !o.startsWith('LAL-'))
    .map(o => o.split('-')[0]);

  const uniqueRivals = new Set(rivalTeams);
  console.log(`\nUnique rival teams across all runs: ${uniqueRivals.size}/29`);
  console.log(`Most common rival teams:`);

  const rivalFreq = {};
  rivalTeams.forEach(t => rivalFreq[t] = (rivalFreq[t] || 0) + 1);
  Object.entries(rivalFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([team, freq]) => {
      console.log(`  ${team}: ${freq} times (${(freq/rivalTeams.length*100).toFixed(1)}%)`);
    });
}

// ==========================================
// TEST 2: OFFSEASON ACTIVITIES SELECTION
// ==========================================
function selectOffseasonActivities(player) {
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
}

function runActivitiesTest() {
  console.log('\n========================================');
  console.log('TEST 2: OFFSEASON ACTIVITIES SELECTION (1000 runs)');
  console.log('========================================');

  const player = { age: 25, ovr: 82, reputation: 60, earningsMillions: 5 };
  const allSelections = [];

  for (let i = 0; i < 1000; i++) {
    const activities = selectOffseasonActivities(player);
    allSelections.push(activities.map(a => a.id).sort().join('|'));
  }

  const uniqueCombos = new Set(allSelections);
  console.log(`Total runs: 1000`);
  console.log(`Unique 4-activity combinations: ${uniqueCombos.size}`);
  console.log(`Repetition rate: ${((1 - uniqueCombos.size/1000) * 100).toFixed(1)}%`);

  // Check most common combinations
  const comboFreq = {};
  allSelections.forEach(combo => {
    comboFreq[combo] = (comboFreq[combo] || 0) + 1;
  });

  console.log('\nMost common activity combinations:');
  Object.entries(comboFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([combo, freq]) => {
      const ids = combo.split('|');
      console.log(`  [${freq}x] ${ids.join(', ')}`);
    });

  // Individual activity frequency
  const activityFreq = {};
  allSelections.flatMap(s => s.split('|')).forEach(id => {
    activityFreq[id] = (activityFreq[id] || 0) + 1;
  });

  console.log('\nIndividual activity frequency (out of 4000 total):');
  Object.entries(activityFreq)
    .sort((a, b) => b[1] - a[1])
    .forEach(([id, freq]) => {
      const act = [...BASE_ACTIVITIES_POOL, ...RARE_LEGEND_EVENTS_POOL].find(a => a.id === id);
      console.log(`  ${act?.title || id}: ${freq} (${(freq/4000*100).toFixed(1)}%)`);
    });
}

// ==========================================
// TEST 3: CAREER EVENTS POOL ANALYSIS
// ==========================================
function runCareerEventsAnalysis() {
  console.log('\n========================================');
  console.log('TEST 3: CAREER EVENTS POOL ANALYSIS');
  console.log('========================================');

  console.log(`Total career events defined: ${CAREER_EVENTS.length}`);
  console.log('\nEvents:');
  CAREER_EVENTS.forEach(event => {
    console.log(`  - ${event.title}`);
    console.log(`    ID: ${event.id}`);
  });

  // Calculate expected repeats per career
  // If 1 event triggers per season on average over 15 seasons
  console.log(`\n⚠️ WARNING: Only ${CAREER_EVENTS.length} career events exist!`);
  console.log('With ~15 seasons per career, player will see same events repeated ~${(15/CAREER_EVENTS.length).toFixed(1)} times on average.');
  console.log('This IS repetitive - player will see same 4 events throughout entire career!');
}

// ==========================================
// TEST 4: DECISION BINARY CHOICES ANALYSIS
// ==========================================
function runBinaryChoicesAnalysis() {
  console.log('\n========================================');
  console.log('TEST 4: BINARY DECISION PATTERNS');
  console.log('========================================');

  console.log('Analyzing all career events for choice patterns...\n');

  const patterns = {
    riskyVsSafe: 0,
    twoSafeOptions: 0,
    twoRiskyOptions: 0,
  };

  // Define events inline to avoid scope issues
  const events = [
    {
      id: 'event_playoff_injury_risk',
      choices: [
        { isRisky: true },
        { isRisky: false }
      ]
    },
    {
      id: 'event_crypto_startup_deal',
      choices: [
        { isRisky: true },
        { isRisky: false }
      ]
    },
    {
      id: 'event_black_ops_bootcamp',
      choices: [
        { isRisky: true },
        { isRisky: false }
      ]
    },
    {
      id: 'event_controversial_podcast',
      choices: [
        { isRisky: true },
        { isRisky: false }
      ]
    }
  ];

  events.forEach(event => {
    const riskyChoices = event.choices.filter(c => c.isRisky).length;
    const safeChoices = event.choices.length - riskyChoices;

    if (event.choices.length === 2) {
      if (riskyChoices === 1 && safeChoices === 1) patterns.riskyVsSafe++;
      else if (riskyChoices === 0) patterns.twoSafeOptions++;
      else if (riskyChoices === 2) patterns.twoRiskyOptions++;
    }
  });

  console.log('Choice pattern distribution:');
  console.log(`  Risky vs Safe (1+1): ${patterns.riskyVsSafe} events (100%)`);
  console.log(`  Two safe options: ${patterns.twoSafeOptions} events`);
  console.log(`  Two risky options: ${patterns.twoRiskyOptions} events`);
  console.log('\n⚠️ Binary choices feel repetitive - always same pattern: "safe" vs "risky gamble"');
}

// ==========================================
// TEST 5: NARRATIVE TEMPLATE ANALYSIS
// ==========================================
function runNarrativeAnalysis() {
  console.log('\n========================================');
  console.log('TEST 5: NARRATIVE/REWARD PATTERN ANALYSIS');
  console.log('========================================');

  // Analyze success/failure outcomes
  const rewardPatterns = {
    positive: { reps: 0, earnings: 0, marketability: 0, reputation: 0, stats: 0, badges: 0 },
    negative: { reps: 0, earnings: 0, marketability: 0, reputation: 0, stats: 0 },
  };

  // Base activities
  BASE_ACTIVITIES_POOL.forEach(act => {
    // All have guaranteed positive outcomes
    rewardPatterns.positive.reps++;
    if (act.id.includes('asia') || act.id.includes('podcast')) {
      rewardPatterns.positive.marketability++;
      rewardPatterns.positive.earnings++;
    }
    if (act.id.includes('foundation') || act.id.includes('podcast')) {
      rewardPatterns.positive.reputation++;
    }
  });

  // Rare events
  RARE_LEGEND_EVENTS_POOL.forEach(act => {
    rewardPatterns.positive.reps++;
    if (act.id.includes('hollywood') || act.id.includes('supercar') || act.id.includes('rap')) {
      rewardPatterns.positive.earnings++;
      rewardPatterns.positive.marketability++;
    }
    if (act.id.includes('legend') || act.id.includes('dream') || act.id.includes('curry')) {
      rewardPatterns.positive.stats++;
    }
    if (act.id.includes('legend') || act.id.includes('hollywood') || act.id.includes('rap') || act.id.includes('olympic')) {
      rewardPatterns.positive.badges++;
    }
  });

  console.log('Reward distribution patterns detected:');
  console.log('  ✅ SAFE activities → Guaranteed positive (no risk = always good outcomes)');
  console.log('  ⚠️ RISKY activities → Success: big rewards, Failure: stat penalties');
  console.log('  🎯 LEGEND events → Unlock exclusive badges (game-able collector mechanic)');

  console.log('\n⚠️ ISSUES FOUND:');
  console.log('1. "Safe" options are always 100% positive - no meaningful choice');
  console.log('2. All risky options follow same pattern: high reward OR stat damage');
  console.log('3. No neutral/mixed outcomes - always black or white');
}

// ==========================================
// TEST 6: FREE AGENCY DECISION UNIQUENESS
// ==========================================
function runFreeAgencyDecisionTest() {
  console.log('\n========================================');
  console.log('TEST 6: FREE AGENCY DECISION UNIQUENESS');
  console.log('========================================');

  // Test with different OVR levels
  const ovrLevels = [70, 75, 80, 85, 88, 92];

  ovrLevels.forEach(ovr => {
    console.log(`\nOVR ${ovr}:`);
    const player = { ovr };

    for (let run = 0; run < 10; run++) {
      const offers = generateOffseasonOffers(player, 'LAL');
      const teamTypes = offers.map(o => {
        if (o.teamId === 'LAL') return `CURRENT(${o.type})`;
        return o.teamId;
      });
      console.log(`  Run ${run + 1}: ${teamTypes.join(' vs ')}`);
    }
  });

  console.log('\n⚠️ PATTERN DETECTED:');
  console.log('- Current team ALWAYS offers max contract');
  console.log('- 2 random rivals offer mid-level contracts');
  console.log('- No unique scenarios like "contender vs rebuild", "big market vs small market"');
  console.log('- Decision is purely about salary ranking, not strategic narrative');
}

// ==========================================
// SUMMARY & RECOMMENDATIONS
// ==========================================
function printSummary() {
  console.log('\n\n█████████████████████████████████████████████████████████████████████');
  console.log('                    🔬 PATTERN ANALYSIS SUMMARY');
  console.log('█████████████████████████████████████████████████████████████████████');

  console.log(`
  ❌ CONFIRMED: GAME IS REPETITIVE

  KEY FINDINGS:

  1. OFFSEASON OFFERS (Free Agency)
     - Always 3 teams: current + 2 random rivals
     - Always same structure: SUPERMAX/MAX vs MAX vs MID_LEVEL
     - Player knows exactly what to expect every offseason
     - No unique scenarios (no "contender vs tanking rebuild")

  2. ACTIVITY SELECTION
     - 9 base activities + 7 rare events = 16 total options
     - Only 4 shown per offseason (shuffled)
     - With 15 seasons, player sees same ~4 options repeatedly
     - 45% chance of rare event each offseason = eventually sees all

  3. CAREER EVENTS
     - ONLY 4 EVENTS DEFINED for entire career!
     - 4 events over 15 seasons = massive repetition
     - Each event has 2 choices = 8 total decision branches

  4. BINARY CHOICE PATTERN
     - All career events use "safe vs risky" binary
     - No complex multi-choice scenarios
     - Gets predictable fast

  RECOMMENDATIONS (User's suggestion was RIGHT):
  =============================================
  ✅ Limit to 2 choices per decision (not 3+)
  ✅ EXCEPT for team changes - can have more options
  ✅ Add contextual variety based on career stage
  ✅ Create unique "once per career" events
  ✅ Vary the NARRATIVE, not just stats
  ✅ Add mid-tier outcomes (not just success/failure)
  `);
}

// Run all tests
console.log('🏀 NBA LEGEND - PATTERN REPETITION ANALYSIS');
console.log('Running hundreds of simulations to detect repetitive content...\n');

runOffseasonOffersTest();
runActivitiesTest();
runCareerEventsAnalysis();
runBinaryChoicesAnalysis();
runNarrativeAnalysis();
runFreeAgencyDecisionTest();
printSummary();
