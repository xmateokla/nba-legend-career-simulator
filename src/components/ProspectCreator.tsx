import React, { useState } from 'react';
import { Player, Position, ArchetypeId, ProspectTier, GameDifficulty } from '../types/game';
import { ARCHETYPES, COLLEGES_LIST, CollegeDefinition, PROSPECT_TIERS } from '../data/archetypes';
import { COUNTRIES_LIST, Country } from '../data/countries';
import { calculateOvr } from '../utils/simulator';
import { JerseyPreview } from './JerseyPreview';
import { User, Shield, Sparkles, Sliders, ArrowRight, Dna, HelpCircle, Globe, Ruler, Flame, Dumbbell, Search } from 'lucide-react';

interface ProspectCreatorProps {
  onComplete: (player: Player) => void;
}

export function ftInToCm(ft: number, inc: number): number {
  return Math.round((ft * 12 + inc) * 2.54);
}

export function cmToFtIn(cm: number): { feet: number; inches: number } {
  const totalInches = Math.round(cm / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return { feet: Math.min(7, Math.max(5, feet)), inches: Math.min(11, Math.max(0, inches)) };
}

export const ProspectCreator: React.FC<ProspectCreatorProps> = ({ onComplete }) => {
  // Start empty as requested by user
  const [name, setName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES_LIST[0]); // Colombia by default or USA
  const [selectedCollege, setSelectedCollege] = useState<CollegeDefinition>(COLLEGES_LIST[0]);
  const [jerseyNumber, setJerseyNumber] = useState(23);
  const [position, setPosition] = useState<Position>('PG');
  const [archetypeId, setArchetypeId] = useState<ArchetypeId>('playmaker');
  const [prospectTier, setProspectTier] = useState<ProspectTier>('4_STAR');
  const [difficulty, setDifficulty] = useState<GameDifficulty>('NORMAL');
  
  // Search state for country flag grid
  const [countrySearch, setCountrySearch] = useState('');

  // Height Unit State
  const [heightUnit, setHeightUnit] = useState<'ft' | 'cm'>('cm');
  const [heightFeet, setHeightFeet] = useState(6);
  const [heightInches, setHeightInches] = useState(3);
  const [heightCm, setHeightCm] = useState(191);

  const currentArchetype = ARCHETYPES[archetypeId];
  const currentTier = PROSPECT_TIERS[prospectTier];

  const filteredCountries = COUNTRIES_LIST.filter(c =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleCmChange = (cm: number) => {
    setHeightCm(cm);
    const converted = cmToFtIn(cm);
    setHeightFeet(converted.feet);
    setHeightInches(converted.inches);
  };

  const handleFtInChange = (ft: number, inc: number) => {
    setHeightFeet(ft);
    setHeightInches(inc);
    setHeightCm(ftInToCm(ft, inc));
  };

  // Helper to build full player draft object
  const tempPlayer: Player = {
    id: `player_${Date.now()}`,
    name: name.trim() || 'Prospecto Anónimo',
    country: `${selectedCountry.name} ${selectedCountry.code.toUpperCase()}`,
    position,
    archetype: archetypeId,
    prospectTier,
    difficulty,
    potentialMaxOvr: currentTier.potentialMaxOvr,
    heightFeet,
    heightInches,
    weightLbs: position === 'C' ? 250 : position === 'PF' ? 235 : position === 'SF' ? 215 : 195,
    wingspanInches: heightFeet * 12 + heightInches + 4,
    jerseyNumber,
    college: selectedCollege.name,
    age: 19,
    ovr: 72,
    reputation: 40,
    marketability: 50,
    earningsMillions: 0,
    passiveIncomeMillions: 0,
    attributes: { ...currentArchetype.baseAttributes },
    currentTeamId: null,
    draftPick: null,
    draftTeamId: null,
    contractYearsRemaining: 4,
    contractSalaryMillions: 8.5,
    shoeSponsor: null,
    hasSignatureShoe: false,
    injuriesHistory: [],
    unlockedBadges: [],
    completedEventIds: [],
    investments: [],
  };

  const calculatedOvr = calculateOvr(tempPlayer);
  tempPlayer.ovr = calculatedOvr;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onComplete(tempPlayer);
  };

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 my-2 sm:my-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 backdrop-blur-md shadow-2xl space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 sm:pb-6">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1">
              <Dna className="w-4 h-4" />
              <span>PASO 1: CREACIÓN DE PROSPECTO</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
              DISEÑA TU JUGADOR
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">Personaliza tu nombre, país con colores de playera oficial y universidad antes del Combine.</p>
          </div>

          {/* OVR Preview Mobile Card */}
          <div className="flex items-center justify-between sm:justify-start gap-3 bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/40 rounded-xl sm:rounded-2xl px-4 py-2.5 sm:py-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              <div>
                <div className="text-[10px] uppercase font-bold text-amber-300">MEDIA INICIAL</div>
                <div className="text-[10px] text-slate-400">Potencial: <span className="text-white font-bold">{currentTier.potentialMaxOvr} OVR</span></div>
              </div>
            </div>
            <div className="font-display font-black text-3xl text-amber-400 leading-none">{calculatedOvr}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          
          {/* TOP SECTION: LIVE NATIONAL JERSEY PREVIEW & NAME */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Live National Team Jersey Preview */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center space-y-2">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">PLAYERA SELECCIÓN DE {selectedCountry.name.toUpperCase()}</span>
              <JerseyPreview name={name} jerseyNumber={jerseyNumber} countryName={selectedCountry.name} size="md" />
              <div className="text-xs font-bold text-white mt-1">{name || 'TU NOMBRE'} #{jerseyNumber}</div>
            </div>

            {/* Basic Info Inputs */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Nombre Completo del Jugador</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-white font-medium text-sm outline-none"
                  placeholder="ESCRIBE TU NOMBRE O APELLIDO"
                />
              </div>

              {/* Jersey Number & Position */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Dorsal (#)</label>
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={jerseyNumber}
                    onChange={e => setJerseyNumber(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-white font-bold text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Posición Principal</label>
                  <select
                    value={position}
                    onChange={e => setPosition(e.target.value as Position)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-3 text-white font-bold text-sm outline-none"
                  >
                    <option value="PG">Base (PG)</option>
                    <option value="SG">Escolta (SG)</option>
                    <option value="SF">Alero (SF)</option>
                    <option value="PF">Ala-Pívot (PF)</option>
                    <option value="C">Pívot (C)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* VISUAL COUNTRY SELECTOR GRID WITH FLAGS */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Selecciona tu País de Origen ({COUNTRIES_LIST.length} Banderas Disponibles)
              </label>

              {/* Country Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar país..."
                  value={countrySearch}
                  onChange={e => setCountrySearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white outline-none"
                />
              </div>
            </div>

            {/* Flags Visual Card Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 max-h-52 overflow-y-auto pr-1">
              {filteredCountries.map(country => {
                const isSelected = selectedCountry.code === country.code;
                return (
                  <button
                    type="button"
                    key={country.code}
                    onClick={() => setSelectedCountry(country)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <img src={country.flagUrl} alt={country.name} className="w-6 h-4 object-cover rounded shadow flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-xs truncate text-white">{country.name}</div>
                      <div className="text-[9px] text-amber-400 uppercase font-semibold">{country.code.toUpperCase()}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* VISUAL COLLEGE / PRE-NBA SELECTOR GRID WITH REAL LOGOS */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Universidad o Programa Pre-NBA (Logos Oficiales HD)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {COLLEGES_LIST.map(col => {
                const isSelected = selectedCollege.id === col.id;
                return (
                  <button
                    type="button"
                    key={col.id}
                    onClick={() => setSelectedCollege(col)}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all text-left ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center p-1.5 flex-shrink-0">
                      <img src={col.logoUrl} alt={col.name} className="w-full h-full object-contain drop-shadow" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs truncate text-white">{col.name}</div>
                      <div className="text-[9px] text-slate-400 truncate">{col.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DIFFICULTY MODE SELECTOR */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Nivel de Exigencia & Dificultad de Carrera
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDifficulty('NORMAL')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  difficulty === 'NORMAL' ? 'bg-amber-500/20 border-amber-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-white text-sm mb-1 flex items-center justify-between">
                  <span>🟢 Modo Leyenda Equilibrado (Recomendado)</span>
                </div>
                <p className="text-xs text-slate-400">Progreso equilibrado. Diseñado para disfrutar de historias épicas y números de superestrella.</p>
              </button>

              <button
                type="button"
                onClick={() => setDifficulty('HARDCORE')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  difficulty === 'HARDCORE' ? 'bg-red-500/20 border-red-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-red-400 text-sm mb-1 flex items-center justify-between">
                  <span>🔴 Exigencia NBA Hardcore</span>
                </div>
                <p className="text-xs text-slate-400">Exigencia estricta según la franquicia. Menos minutos de inicio en candidatos al título y prensa crítica.</p>
              </button>
            </div>
          </div>

          {/* PROSPECT TIER SELECTION */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Nivel de Proyección Inicial
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.values(PROSPECT_TIERS).map(tier => {
                const isSelected = prospectTier === tier.id;
                return (
                  <button
                    type="button"
                    key={tier.id}
                    onClick={() => setProspectTier(tier.id)}
                    className={`text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-white">{tier.label}</span>
                      <span className="text-[10px] bg-slate-800 text-amber-300 px-2 py-0.5 rounded font-bold">
                        Potencial {tier.potentialMaxOvr} OVR
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{tier.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Height (CM / FT Toggle) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Altura</label>
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setHeightUnit('cm')}
                    className={`px-2 py-0.5 rounded ${heightUnit === 'cm' ? 'bg-amber-500 text-black' : 'text-slate-400'}`}
                  >
                    CM
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeightUnit('ft')}
                    className={`px-2 py-0.5 rounded ${heightUnit === 'ft' ? 'bg-amber-500 text-black' : 'text-slate-400'}`}
                  >
                    FT/IN
                  </button>
                </div>
              </div>

              {heightUnit === 'cm' ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={170}
                    max={225}
                    value={heightCm}
                    onChange={e => handleCmChange(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-3 text-white font-bold text-sm outline-none"
                  />
                  <span className="text-xs font-bold text-amber-400">cm ({heightFeet}'{heightInches}")</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <select
                    value={heightFeet}
                    onChange={e => handleFtInChange(Number(e.target.value), heightInches)}
                    className="flex-1 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-2 py-3 text-white font-medium text-sm outline-none"
                  >
                    <option value={6}>6'</option>
                    <option value={7}>7'</option>
                  </select>
                  <select
                    value={heightInches}
                    onChange={e => handleFtInChange(heightFeet, Number(e.target.value))}
                    className="flex-1 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-2 py-3 text-white font-medium text-sm outline-none"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i}>{i}"</option>
                    ))}
                  </select>
                  <span className="text-xs font-bold text-amber-400">{heightCm} cm</span>
                </div>
              )}
            </div>

            {/* Archetype Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Arquetipo Principal</label>
              <select
                value={archetypeId}
                onChange={e => setArchetypeId(e.target.value as ArchetypeId)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-3 text-white font-bold text-sm outline-none"
              >
                {Object.values(ARCHETYPES).map(arch => (
                  <option key={arch.id} value={arch.id}>
                    {arch.name} ({arch.badge})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 text-right">
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-display font-black text-xl uppercase tracking-wider px-8 py-4 rounded-xl sm:rounded-2xl shadow-xl shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-40"
            >
              <span>IR AL NBA COMBINE</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
