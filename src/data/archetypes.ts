import { ArchetypeId, Position, PlayerAttributes, ProspectTier } from '../types/game';

export interface ArchetypeDefinition {
  id: ArchetypeId;
  name: string;
  description: string;
  allowedPositions: Position[];
  badge: string;
  baseAttributes: PlayerAttributes;
}

export interface ProspectTierDefinition {
  id: ProspectTier;
  name: string;
  label: string;
  description: string;
  baseBonusOvr: number;
  potentialMaxOvr: number;
}

export interface CollegeDefinition {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  primaryColor: string;
}

export const COLLEGES_LIST: CollegeDefinition[] = [
  { id: 'duke', name: 'Duke Blue Devils', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/150.png', description: 'Programa de élite NCAA', primaryColor: '#003087' },
  { id: 'kentucky', name: 'Kentucky Wildcats', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/96.png', description: 'Fábrica de pros Top 5', primaryColor: '#0033A0' },
  { id: 'unc', name: 'UNC Tar Heels', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/153.png', description: 'Tradición de Michael Jordan', primaryColor: '#7BAFD4' },
  { id: 'kansas', name: 'Kansas Jayhawks', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2305.png', description: 'Campeones nacionales NCAA', primaryColor: '#0051BA' },
  { id: 'ucla', name: 'UCLA Bruins', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/26.png', description: 'Leyenda del baloncesto', primaryColor: '#2774AE' },
  { id: 'gonzaga', name: 'Gonzaga Bulldogs', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2250.png', description: 'Potencia ofensiva costa oeste', primaryColor: '#041E42' },
  { id: 'villanova', name: 'Villanova Wildcats', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/222.png', description: 'Disciplina y tiro de 3', primaryColor: '#00205B' },
  { id: 'michigan_state', name: 'Michigan State Spartans', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/127.png', description: 'Defensa y dureza física con Izzo', primaryColor: '#18453B' },
  { id: 'ignite', name: 'NBA G-League Ignite', logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/gleague.png', description: 'Vía profesional pre-Draft', primaryColor: '#F59E0B' },
  { id: 'realmadrid', name: 'Real Madrid Baloncesto', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png', description: 'Cantera de superestrellas europeas', primaryColor: '#1B365D' },
  { id: 'barcelona', name: 'FC Barcelona Basket', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1200px-FC_Barcelona_%28crest%29.svg.png', description: 'Potencia de la Euroliga', primaryColor: '#004D98' },
  { id: 'metropolitans', name: 'Metropolitans 92 (Francia)', logoUrl: 'https://upload.wikimedia.org/wikipedia/fr/4/44/Metropolitans_92_logo.png', description: 'Liga profesional europea (Wembanyama)', primaryColor: '#002395' },
  { id: 'partizan', name: 'Partizan Belgrade (Serbia)', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/KK_Partizan_logo.svg/1200px-KK_Partizan_logo.svg.png', description: 'Ambiente volcánico de Euroliga', primaryColor: '#000000' },
  { id: 'oteba', name: 'Oteba Academy Latam', logoUrl: 'https://flagcdn.com/w40/co.png', description: 'Academia de talento latinoamericano', primaryColor: '#059669' },
  { id: 'overtime', name: 'Overtime Elite (OTE)', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Overtime_logo.svg/1200px-Overtime_logo.svg.png', description: 'Liga juvenil innovadora', primaryColor: '#E11D48' },
];

export const PROSPECT_TIERS: Record<ProspectTier, ProspectTierDefinition> = {
  '5_STAR': {
    id: '5_STAR',
    name: 'Prodigio Top 1 (#1 Recruit)',
    label: '⭐️⭐️⭐️⭐️⭐️ 5 Estrellas',
    description: 'Generacional. Todo el país habla de tu talento y se proyecta Pick Top 3 asegurado.',
    baseBonusOvr: 4,
    potentialMaxOvr: 99,
  },
  '4_STAR': {
    id: '4_STAR',
    name: 'Prospecto All-American',
    label: '⭐️⭐️⭐️⭐️ 4 Estrellas',
    description: 'Titular indiscutible universitario con alto potencial de desarrollo profesional.',
    baseBonusOvr: 2,
    potentialMaxOvr: 95,
  },
  'UNDERRATED': {
    id: 'UNDERRATED',
    name: 'Joya Oculta (Diamond in the Rough)',
    label: '⭐️⭐️⭐️ 3 Estrellas',
    description: 'Ignorado por los grandes medios. Tendrás que ganarte el respeto desde abajo.',
    baseBonusOvr: -2,
    potentialMaxOvr: 92,
  },
  'OVERSEAS': {
    id: 'OVERSEAS',
    name: 'Misterio Internacional 🌍',
    label: '🌍 Fenómeno de Europa / Latam',
    description: 'Venido de ligas profesionales europeas con IQ elevado y atributos impredecibles.',
    baseBonusOvr: 1,
    potentialMaxOvr: 97,
  },
};

export const ARCHETYPES: Record<ArchetypeId, ArchetypeDefinition> = {
  playmaker: {
    id: 'playmaker',
    name: 'Playmaker Visionario',
    description: 'Pase magistral, control de ritmo e inteligencia táctica para elevar a todo el equipo.',
    allowedPositions: ['PG', 'SG'],
    badge: '🧠 Magic Vision',
    baseAttributes: {
      shooting3P: 74,
      shootingMid: 78,
      finishing: 76,
      playmaking: 88,
      defense: 70,
      rebounding: 55,
      athletic: 80,
      clutch: 75,
      durability: 82,
    },
  },
  pure_shooter: {
    id: 'pure_shooter',
    name: 'Francotirador 3&D',
    description: 'Rango de tiro ilimitado desde cualquier zona de la cancha y defensa perimetral feroz.',
    allowedPositions: ['SG', 'SF', 'PG'],
    badge: '🎯 Rango Ilimitado',
    baseAttributes: {
      shooting3P: 90,
      shootingMid: 84,
      finishing: 68,
      playmaking: 66,
      defense: 78,
      rebounding: 52,
      athletic: 74,
      clutch: 82,
      durability: 85,
    },
  },
  slasher: {
    id: 'slasher',
    name: 'Atleta Volador (Slasher)',
    description: 'Potencia física devastadora atacando la pintura, clavadas espectaculares y primer paso imparable.',
    allowedPositions: ['PG', 'SG', 'SF'],
    badge: '⚡ Posterizer High-Flyer',
    baseAttributes: {
      shooting3P: 65,
      shootingMid: 72,
      finishing: 88,
      playmaking: 72,
      defense: 74,
      rebounding: 65,
      athletic: 92,
      clutch: 78,
      durability: 88,
    },
  },
  defensive_anchor: {
    id: 'defensive_anchor',
    name: 'Ancla Defensiva / DPOY',
    description: 'Protector del aro, intimidación, tapas espectaculares y dominio del rebote defensivo.',
    allowedPositions: ['PF', 'C', 'SF'],
    badge: '🛡️ Aro Inexpugnable',
    baseAttributes: {
      shooting3P: 50,
      shootingMid: 60,
      finishing: 78,
      playmaking: 55,
      defense: 92,
      rebounding: 90,
      athletic: 82,
      clutch: 70,
      durability: 86,
    },
  },
  stretch_big: {
    id: 'stretch_big',
    name: 'Pívot Tirador (Stretch 5)',
    description: 'Pívot moderno que abre la cancha encestando triples mientras protege la zona pintada.',
    allowedPositions: ['PF', 'C'],
    badge: '🔥 Stretch Sniper',
    baseAttributes: {
      shooting3P: 84,
      shootingMid: 80,
      finishing: 74,
      playmaking: 60,
      defense: 76,
      rebounding: 78,
      athletic: 70,
      clutch: 76,
      durability: 80,
    },
  },
  post_master: {
    id: 'post_master',
    name: 'Maestro del Poste Bajo',
    description: 'Juego de pies quirúrgico, ganchos de leyenda y dominio físico debajo del tablero.',
    allowedPositions: ['PF', 'C'],
    badge: '👑 Rey del Poste',
    baseAttributes: {
      shooting3P: 52,
      shootingMid: 76,
      finishing: 90,
      playmaking: 68,
      defense: 80,
      rebounding: 88,
      athletic: 75,
      clutch: 80,
      durability: 84,
    },
  },
};
