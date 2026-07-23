import React, { useState } from 'react';
import { Player, Position, ArchetypeId, ProspectTier, GameDifficulty, PlayerAttributes } from '../types/game';
import { ARCHETYPES, ArchetypeDefinition } from '../data/archetypes';
import { COUNTRIES_LIST, Country } from '../data/countries';
import { JerseyPreview } from './JerseyPreview';
import { Sparkles, User, Flag, Scale, Ruler, Award, ArrowRight, ShieldCheck, ChevronRight, Dna, Check, GraduationCap, Zap, Activity, Sliders, AlertCircle } from 'lucide-react';
import { calculateOvr } from '../utils/simulator';

interface ProspectCreatorProps {
  onComplete: (player: Player) => void;
}

export interface CollegeInfo {
  id: string;
  name: string;
  badge: string;
  logoUrl: string;
  description: string;
  primaryColor: string;
  scoutBonus: string;
}

export const DETAILED_COLLEGES: CollegeInfo[] = [
  { id: 'duke', name: 'Duke Blue Devils', badge: '🔵 NCAA', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/150.png', description: 'Programa de élite NCAA. Fábrica de prospectos Top 5.', primaryColor: '#003087', scoutBonus: '+2 Tiro & IQ' },
  { id: 'kentucky', name: 'Kentucky Wildcats', badge: '🐱 NCAA', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/96.png', description: 'Fábrica de pros explosivos dirigidos a la NBA.', primaryColor: '#0033A0', scoutBonus: '+3 Atletismo' },
  { id: 'unc', name: 'UNC Tar Heels', badge: '🐏 NCAA', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/153.png', description: 'Tradición legendaria de Michael Jordan.', primaryColor: '#7BAFD4', scoutBonus: '+2 Clutch & Mentalidad' },
  { id: 'kansas', name: 'Kansas Jayhawks', badge: '🦅 NCAA', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2305.png', description: 'Campeones nacionales con sistema táctico estricto.', primaryColor: '#0051BA', scoutBonus: '+2 Defensa & Posición' },
  { id: 'ucla', name: 'UCLA Bruins', badge: '🐻 NCAA', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/26.png', description: 'Cuna de leyendas y baloncesto de la Costa Oeste.', primaryColor: '#2774AE', scoutBonus: '+2 Pase & Visión' },
  { id: 'gonzaga', name: 'Gonzaga Bulldogs', badge: '🐶 NCAA', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2250.png', description: 'Potencia ofensiva de ritmo acelerado.', primaryColor: '#041E42', scoutBonus: '+2 Efectividad 3P' },
  { id: 'villanova', name: 'Villanova Wildcats', badge: '✌️ NCAA', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/222.png', description: 'Disciplina, tiro de 3 puntos y defensa perimetral.', primaryColor: '#00205B', scoutBonus: '+2 Durabilidad' },
  { id: 'michigan_state', name: 'Michigan State Spartans', badge: '🟢 NCAA', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/127.png', description: 'Dureza física, rebote e intensidad bajo Tom Izzo.', primaryColor: '#18453B', scoutBonus: '+3 Rebote & Fuerza' },
  { id: 'ignite', name: 'NBA G League Ignite', badge: '⚡ G-LEAGUE', logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/gleague.png', description: 'Vía profesional paga pre-Draft contra hombres adultos.', primaryColor: '#F59E0B', scoutBonus: '+3 Adaptación NBA' },
  { id: 'realmadrid', name: 'Real Madrid Baloncesto', badge: '👑 EUROLIGA', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png', description: 'Cantera de superestrellas europeas (Luka Dončić).', primaryColor: '#1B365D', scoutBonus: '+3 IQ Baloncesto' },
  { id: 'barcelona', name: 'FC Barcelona Basket', badge: '🇪🇸 EUROLIGA', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1200px-FC_Barcelona_%28crest%29.svg.png', description: 'Potencia europea de primer nivel profesional.', primaryColor: '#004D98', scoutBonus: '+2 Pase & Técnica' },
  { id: 'metropolitans', name: 'Metropolitans 92 (Francia)', badge: '🇫🇷 EUROPA', logoUrl: 'https://upload.wikimedia.org/wikipedia/fr/4/44/Metropolitans_92_logo.png', description: 'Liga profesional francesa (Wembanyama).', primaryColor: '#002395', scoutBonus: '+3 Envergadura/Defensa' },
  { id: 'overtime', name: 'Overtime Elite (OTE)', badge: '💥 OTE', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Overtime_logo.svg/1200px-Overtime_logo.svg.png', description: 'Liga juvenil innovadora de alta frecuencia mediática.', primaryColor: '#E11D48', scoutBonus: '+10 Comercialización' },
];

export const FULL_POSITIONS_MAP: { id: Position; code: string; fullName: string; roleDesc: string; icon: string }[] = [
  { id: 'PG', code: 'PG', fullName: 'PG • Base / Armador', roleDesc: 'Manejo de balón, visión táctica y ritmo', icon: '🧠' },
  { id: 'SG', code: 'SG', fullName: 'SG • Escolta', roleDesc: 'Tiro perimetral, anotación y agilidad', icon: '🎯' },
  { id: 'SF', code: 'SF', fullName: 'SF • Alero', roleDesc: 'Versatilidad atlética en ambas zonas', icon: '⚡' },
  { id: 'PF', code: 'PF', fullName: 'PF • Ala-Pívot', roleDesc: 'Potencia física, poste y tiro de media', icon: '🏋️' },
  { id: 'C',  code: 'C',  fullName: 'C • Pívot / Centro', roleDesc: 'Protección de pintura, rebotes y tapas', icon: '🛡️' },
];

export const ProspectCreator: React.FC<ProspectCreatorProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2>(1);

  // Form State: EMPTY DEFAULT NAME (no pre-filled default!)
  const [name, setName] = useState('');
  const [position, setPosition] = useState<Position>('PG');
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES_LIST[0]);
  const [archetypeId, setArchetypeId] = useState<ArchetypeId>('playmaker');
  const [prospectTier, setProspectTier] = useState<ProspectTier>('5_STAR');
  const [difficulty, setDifficulty] = useState<GameDifficulty>('NORMAL');
  
  // Physical Metrics
  const [heightFeet, setHeightFeet] = useState(6);
  const [heightInches, setHeightInches] = useState(6);
  const [weightLbs, setWeightLbs] = useState(215);
  const [wingspanInches, setWingspanInches] = useState(82);
  const [jerseyNumber, setJerseyNumber] = useState(7);
  const [selectedCollege, setSelectedCollege] = useState<CollegeInfo>(DETAILED_COLLEGES[0]);

  // Dynamic Custom Attributes Allocation State!
  const [customAttributes, setCustomAttributes] = useState<PlayerAttributes>(() => {
    return { ...ARCHETYPES.playmaker.baseAttributes };
  });

  // FILTER ARCHETYPES THAT BELONG TO THE SELECTED POSITION!
  const availableArchetypes = Object.values(ARCHETYPES).filter(arch => 
    arch.allowedPositions.includes(position)
  );

  // Handle Position Change: Auto-select valid archetype for that position if current archetype is invalid!
  const handlePositionSelect = (pos: Position) => {
    setPosition(pos);
    const validArchetypes = Object.values(ARCHETYPES).filter(arch => 
      arch.allowedPositions.includes(pos)
    );

    if (validArchetypes.length > 0 && !validArchetypes.some(a => a.id === archetypeId)) {
      const defaultArch = validArchetypes[0];
      setArchetypeId(defaultArch.id);
      setCustomAttributes({ ...defaultArch.baseAttributes });
    }
  };

  // Height helper in Meters/CM
  const totalInches = heightFeet * 12 + heightInches;
  const heightCm = Math.round(totalInches * 2.54);
  const weightKg = Math.round(weightLbs * 0.453592);
  const wingspanCm = Math.round(wingspanInches * 2.54);

  // Handle Archetype Switch
  const handleArchetypeSelect = (archId: ArchetypeId) => {
    setArchetypeId(archId);
    const arch = ARCHETYPES[archId] || ARCHETYPES.playmaker;
    setCustomAttributes({ ...arch.baseAttributes });
  };

  // Handle Attribute Slider Adjustments
  const handleAttributeChange = (key: keyof PlayerAttributes, val: number) => {
    setCustomAttributes(prev => ({
      ...prev,
      [key]: val,
    }));
  };

  // REALISTIC ROOKIE CEILING CALCULATION (Enforces realistic starting OVR cap based on prospect tier!)
  const calculateRealisticRookieOvr = () => {
    const rawCalculated = calculateOvr({ attributes: customAttributes, prospectTier } as any);
    
    // Ceiling caps for 19-year-old rookies:
    // 5_STAR: 79 OVR max
    // 4_STAR: 75 OVR max
    // UNDERRATED: 71 OVR max
    // OVERSEAS: 76 OVR max
    const maxRookieCap = prospectTier === '5_STAR' ? 79 : 
                         prospectTier === '4_STAR' ? 75 : 
                         prospectTier === 'OVERSEAS' ? 76 : 71;

    return Math.min(maxRookieCap, rawCalculated);
  };

  const liveOvr = calculateRealisticRookieOvr();

  const handleCreate = () => {
    let finalAttrs = { ...customAttributes };

    if (totalInches >= 82) { // 6'10"+
      finalAttrs.rebounding = Math.min(84, finalAttrs.rebounding + 4);
      finalAttrs.finishing = Math.min(84, finalAttrs.finishing + 3);
    } else if (totalInches <= 75) { // 6'3"-
      finalAttrs.playmaking = Math.min(84, finalAttrs.playmaking + 4);
      finalAttrs.athletic = Math.min(84, finalAttrs.athletic + 3);
    }

    if (wingspanInches > totalInches + 4) {
      finalAttrs.defense = Math.min(84, finalAttrs.defense + 4);
    }

    const rookieOvrCap = prospectTier === '5_STAR' ? 79 : prospectTier === '4_STAR' ? 75 : prospectTier === 'OVERSEAS' ? 76 : 71;
    const rawCalculatedOvr = calculateOvr({ attributes: finalAttrs, prospectTier } as any);

    if (rawCalculatedOvr > rookieOvrCap) {
      const ratio = (rookieOvrCap - 4) / (rawCalculatedOvr - 4);
      for (const k in finalAttrs) {
        const key = k as keyof PlayerAttributes;
        finalAttrs[key] = Math.max(42, Math.min(82, Math.round(finalAttrs[key] * ratio)));
      }
    }

    const rookieOvr = Math.min(rookieOvrCap, calculateOvr({ attributes: finalAttrs, prospectTier } as any));

    const newPlayer: Player = {
      id: `player_${Date.now()}`,
      name: name.trim() || 'Prospecto NBA',
      country: selectedCountry.name,
      position,
      archetype: archetypeId,
      prospectTier,
      difficulty,
      potentialMaxOvr: prospectTier === '5_STAR' ? 98 : prospectTier === '4_STAR' ? 94 : prospectTier === 'OVERSEAS' ? 95 : 88,
      heightFeet,
      heightInches,
      weightLbs,
      wingspanInches,
      jerseyNumber,
      college: selectedCollege.name,
      age: 19,
      ovr: rookieOvr,
      reputation: 50,
      marketability: selectedCollege.id === 'overtime' ? 65 : 50,
      earningsMillions: 0,
      passiveIncomeMillions: 0,
      attributes: finalAttrs,
      currentTeamId: null,
      draftPick: null,
      draftTeamId: null,
      contractYearsRemaining: 3,
      contractSalaryMillions: 4.5,
      shoeSponsor: null,
      hasSignatureShoe: false,
      injuriesHistory: [],
      completedEventIds: [],
      unlockedBadges: [ARCHETYPES[archetypeId]?.badge || '⚡ Novato Prometedor'],
      investments: [],
    };

    onComplete(newPlayer);
  };

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 my-2 sm:my-6">
      <div className="game-card-panel border border-slate-700/80 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 holographic-edge">
        
        {/* Header & Step Wizard Bar (Clean 2-Step Creator) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>PASO {step} DE 2 • GAMER MyPLAYER CREATOR</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              {step === 1 && '1. IDENTIDAD, BIOMETRÍA & NIVEL DE PROSPECTO'}
              {step === 2 && '2. POSICIÓN, ARQUETIPO & ATRIBUTOS ROOKIE'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="game-card-gold px-4 py-2 rounded-2xl text-center gold-glow">
              <div className="text-[9px] text-amber-400 font-black uppercase">OVR ROOKIE EN VIVO</div>
              <div className="font-display font-black text-3xl gold-gradient-text leading-none">{liveOvr}</div>
            </div>
          </div>
        </div>

        {/* STEP 1: IDENTITY, BIOMETRICS, COLLEGE & PROSPECT TIER */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Form Column */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* Full Name Input WITH EMPTY DEFAULT PLACEHOLDER */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
                    <User className="w-4 h-4 text-amber-400" />
                    <span>NOMBRE Y APELLIDO DEL JUGADOR</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Escribe el nombre de tu jugador (ej. Michael Jordan)..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white font-bold focus:border-amber-400 outline-none transition-all placeholder:text-slate-600"
                  />
                </div>

                {/* Country Dropdown Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
                    <Flag className="w-4 h-4 text-amber-400" />
                    <span>PAÍS DE ORIGEN / NACIONALIDAD</span>
                  </label>
                  <select
                    value={selectedCountry.code}
                    onChange={e => {
                      const found = COUNTRIES_LIST.find(c => c.code === e.target.value);
                      if (found) setSelectedCountry(found);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white font-bold focus:border-amber-400 outline-none"
                  >
                    {COUNTRIES_LIST.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Biometrics (Height, Weight, Wingspan) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-300 uppercase">ESTATURA ({heightCm} CM)</label>
                    <div className="flex gap-2">
                      <select
                        value={heightFeet}
                        onChange={e => setHeightFeet(parseInt(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2.5 text-white font-bold text-xs"
                      >
                        <option value={5}>5'</option>
                        <option value={6}>6'</option>
                        <option value={7}>7'</option>
                      </select>
                      <select
                        value={heightInches}
                        onChange={e => setHeightInches(parseInt(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2.5 text-white font-bold text-xs"
                      >
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(inc => (
                          <option key={inc} value={inc}>{inc}"</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-300 uppercase">PESO ({weightKg} KG)</label>
                    <input
                      type="number"
                      min="160"
                      max="320"
                      value={weightLbs}
                      onChange={e => setWeightLbs(parseInt(e.target.value) || 200)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold text-xs focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-[11px] font-bold text-slate-300 uppercase">ENVERGADURA ({wingspanCm} CM)</label>
                    <input
                      type="number"
                      min="70"
                      max="98"
                      value={wingspanInches}
                      onChange={e => setWingspanInches(parseInt(e.target.value) || 80)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold text-xs focus:border-amber-400 outline-none"
                    />
                  </div>
                </div>

                {/* Jersey Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase">DORSAL (#)</label>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={jerseyNumber}
                    onChange={e => setJerseyNumber(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white font-bold focus:border-amber-400 outline-none"
                  />
                </div>

              </div>

              {/* Right Column: Live Jersey Preview Card */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center game-card-panel rounded-3xl p-6 border border-slate-800">
                <JerseyPreview name={name || 'TU JUGADOR'} jerseyNumber={jerseyNumber} countryName={selectedCountry.name} size="md" />
              </div>

            </div>

            {/* PROSPECT TIER CARDS INTEGRATED INTO STEP 1 */}
            <div className="space-y-2 pt-3 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-300 uppercase">NIVEL DE PROSPECTO PRE-DRAFT (TIER DE SALIDA)</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setProspectTier('5_STAR')}
                  className={`game-card-panel rounded-2xl p-3.5 text-left space-y-1 transition-all holographic-edge card-hover-effect ${
                    prospectTier === '5_STAR' ? 'border-amber-400 game-card-gold gold-glow' : 'border-slate-800'
                  }`}
                >
                  <div className="font-bold text-amber-400 text-xs">⭐️ 5 Estrellas (Top 1)</div>
                  <div className="font-bold text-white text-sm">79 OVR Inicial</div>
                  <p className="text-[10px] text-slate-400">Pick Top 3 proyectado.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setProspectTier('4_STAR')}
                  className={`game-card-panel rounded-2xl p-3.5 text-left space-y-1 transition-all holographic-edge card-hover-effect ${
                    prospectTier === '4_STAR' ? 'border-amber-400 game-card-gold gold-glow' : 'border-slate-800'
                  }`}
                >
                  <div className="font-bold text-blue-400 text-xs">⭐️ 4 Estrellas</div>
                  <div className="font-bold text-white text-sm">75 OVR Inicial</div>
                  <p className="text-[10px] text-slate-400">Titular universitario.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setProspectTier('UNDERRATED')}
                  className={`game-card-panel rounded-2xl p-3.5 text-left space-y-1 transition-all holographic-edge card-hover-effect ${
                    prospectTier === 'UNDERRATED' ? 'border-amber-400 game-card-gold gold-glow' : 'border-slate-800'
                  }`}
                >
                  <div className="font-bold text-emerald-400 text-xs">⭐️ 3 Estrellas (Joya)</div>
                  <div className="font-bold text-white text-sm">71 OVR Inicial</div>
                  <p className="text-[10px] text-slate-400">Ignorado por medios.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setProspectTier('OVERSEAS')}
                  className={`game-card-panel rounded-2xl p-3.5 text-left space-y-1 transition-all holographic-edge card-hover-effect ${
                    prospectTier === 'OVERSEAS' ? 'border-amber-400 game-card-gold gold-glow' : 'border-slate-800'
                  }`}
                >
                  <div className="font-bold text-purple-400 text-xs">🌍 Europa / Latam</div>
                  <div className="font-bold text-white text-sm">76 OVR Inicial</div>
                  <p className="text-[10px] text-slate-400">Profesional europeo.</p>
                </button>
              </div>
            </div>

            {/* FULL WIDTH COLLEGE / ACADEMY SELECTION WITH LOGOS */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>CANTERA UNIVERSITARIA / RUTA PRE-DRAFT (LOGOS OFICIALES)</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                {DETAILED_COLLEGES.map(col => {
                  const isSelected = selectedCollege.id === col.id;
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => setSelectedCollege(col)}
                      className={`game-card-panel rounded-2xl p-3.5 text-left transition-all holographic-edge card-hover-effect flex items-start gap-3 ${
                        isSelected ? 'border-amber-400 game-card-gold gold-glow' : 'border-slate-800'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl p-1 bg-slate-950 border border-slate-800 flex items-center justify-center flex-shrink-0">
                        <img src={col.logoUrl} alt={col.name} className="w-full h-full object-contain" />
                      </div>
                      
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-bold text-white text-xs truncate">{col.name}</h4>
                          <span className="text-[9px] font-black bg-slate-900 text-amber-400 px-1.5 py-0.5 rounded border border-slate-800">{col.badge}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">{col.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* STEP 2: GAMER ATTRIBUTE ALLOCATOR & POSITION SPECIFIC ARCHETYPES */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Full Position Selector Cards with Complete Names */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase">POSICIÓN OFICIAL EN LA CANCHA</label>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center">
                {FULL_POSITIONS_MAP.map(pos => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => handlePositionSelect(pos.id)}
                    className={`py-3 px-2 rounded-2xl border transition-all holographic-edge card-hover-effect text-left flex flex-col justify-between ${
                      position === pos.id
                        ? 'border-amber-400 bg-amber-500/20 text-amber-300 gold-glow'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    <div>
                      <div className="font-display font-black text-base text-white">{pos.fullName}</div>
                      <div className="text-[10px] text-slate-400 line-clamp-2 font-normal leading-tight mt-0.5">{pos.roleDesc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Archetype Cards Grid FILTERED BY POSITION REALISM! */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase">
                  ARQUETIPOS COMPATIBLES PARA {FULL_POSITIONS_MAP.find(p => p.id === position)?.fullName.toUpperCase()}
                </label>
                <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  {availableArchetypes.length} Arquetipos Disponibles
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {availableArchetypes.map(arch => (
                  <button
                    key={arch.id}
                    type="button"
                    onClick={() => handleArchetypeSelect(arch.id)}
                    className={`game-card-panel rounded-2xl p-4 text-left space-y-2 transition-all holographic-edge card-hover-effect ${
                      archetypeId === arch.id ? 'border-amber-400 game-card-gold gold-glow' : 'border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">🏀</span>
                      <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        {arch.badge}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-sm">{arch.name}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{arch.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* LIVE GAMER ATTRIBUTE SLIDERS (REALISTIC ROOKIE CEILING ENFORCED!) */}
            <div className="game-card-panel rounded-3xl p-6 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <span>ASIGNADOR DE ATRIBUTOS MyPLAYER (ESCALA ROOKIE NBA)</span>
                  </span>
                  <p className="text-[11px] text-slate-400">Atributos tope iniciales calibrados al estándar de novatos de la NBA.</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-right flex-shrink-0">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">OVR NOVATO EN VIVO</span>
                  <span className="font-display font-black text-2xl text-emerald-400 leading-none">{liveOvr}</span>
                </div>
              </div>

              {/* Realistic Sliders (Range 40 to 84 max for rookies!) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                
                {/* Shooting 3P */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">🎯 Tiro de 3P:</span>
                    <span className="text-amber-400 font-display text-lg">{customAttributes.shooting3P}</span>
                  </div>
                  <input
                    type="range" min="40" max="84" value={Math.min(84, customAttributes.shooting3P)}
                    onChange={e => handleAttributeChange('shooting3P', parseInt(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>

                {/* Shooting Mid */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">🏀 Tiro Media Distancia:</span>
                    <span className="text-amber-400 font-display text-lg">{customAttributes.shootingMid}</span>
                  </div>
                  <input
                    type="range" min="40" max="84" value={Math.min(84, customAttributes.shootingMid)}
                    onChange={e => handleAttributeChange('shootingMid', parseInt(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>

                {/* Finishing */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">⚡ Finalización en Pintura:</span>
                    <span className="text-amber-400 font-display text-lg">{customAttributes.finishing}</span>
                  </div>
                  <input
                    type="range" min="40" max="84" value={Math.min(84, customAttributes.finishing)}
                    onChange={e => handleAttributeChange('finishing', parseInt(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>

                {/* Playmaking */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">🧠 Pase & Visión:</span>
                    <span className="text-amber-400 font-display text-lg">{customAttributes.playmaking}</span>
                  </div>
                  <input
                    type="range" min="40" max="84" value={Math.min(84, customAttributes.playmaking)}
                    onChange={e => handleAttributeChange('playmaking', parseInt(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>

                {/* Defense */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">🛡️ Defensa & Robos:</span>
                    <span className="text-amber-400 font-display text-lg">{customAttributes.defense}</span>
                  </div>
                  <input
                    type="range" min="40" max="84" value={Math.min(84, customAttributes.defense)}
                    onChange={e => handleAttributeChange('defense', parseInt(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>

                {/* Athleticism */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">🏋️ Atletismo & Salto:</span>
                    <span className="text-amber-400 font-display text-lg">{customAttributes.athletic}</span>
                  </div>
                  <input
                    type="range" min="40" max="84" value={Math.min(84, customAttributes.athletic)}
                    onChange={e => handleAttributeChange('athletic', parseInt(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>

              </div>
            </div>

          </div>
        )}

        {/* Wizard Footer Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-bold text-xs uppercase px-5 py-3 rounded-2xl transition-all"
            >
              ← REGRESAR AL PASO 1
            </button>
          ) : <div />}

          {step === 1 ? (
            <button
              type="button"
              onClick={() => setStep(2)}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-display font-black text-sm uppercase px-8 py-3.5 rounded-2xl shadow-lg transition-all inline-flex items-center gap-2"
            >
              <span>IR A POSICIÓN & ATRIBUTOS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCreate}
              className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600 hover:from-emerald-400 text-black font-display font-black text-base uppercase px-8 py-4 rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <span>CONFIRMAR PROSPECTO E IR AL COMBINE 🏀</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
