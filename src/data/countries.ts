export interface Country {
  code: string;
  name: string;
  flagUrl: string;
  primaryColor: string;
  secondaryColor: string;
}

export const COUNTRIES_LIST: Country[] = [
  // LATAM & AMERICAS
  { code: 'co', name: 'Colombia', flagUrl: 'https://flagcdn.com/w40/co.png', primaryColor: '#FCD116', secondaryColor: '#003893' },
  { code: 'ar', name: 'Argentina', flagUrl: 'https://flagcdn.com/w40/ar.png', primaryColor: '#74ACDF', secondaryColor: '#FFFFFF' },
  { code: 'es', name: 'España', flagUrl: 'https://flagcdn.com/w40/es.png', primaryColor: '#AA152B', secondaryColor: '#F1BF00' },
  { code: 'us', name: 'Estados Unidos', flagUrl: 'https://flagcdn.com/w40/us.png', primaryColor: '#0A1C2A', secondaryColor: '#C8102E' },
  { code: 'fr', name: 'Francia', flagUrl: 'https://flagcdn.com/w40/fr.png', primaryColor: '#002395', secondaryColor: '#ED2939' },
  { code: 'rs', name: 'Serbia', flagUrl: 'https://flagcdn.com/w40/rs.png', primaryColor: '#C6363C', secondaryColor: '#0C4076' },
  { code: 'gr', name: 'Grecia', flagUrl: 'https://flagcdn.com/w40/gr.png', primaryColor: '#0D69AB', secondaryColor: '#FFFFFF' },
  { code: 'ca', name: 'Canadá', flagUrl: 'https://flagcdn.com/w40/ca.png', primaryColor: '#FF0000', secondaryColor: '#FFFFFF' },
  { code: 'si', name: 'Eslovenia', flagUrl: 'https://flagcdn.com/w40/si.png', primaryColor: '#005DA4', secondaryColor: '#78BE20' },
  { code: 'au', name: 'Australia', flagUrl: 'https://flagcdn.com/w40/au.png', primaryColor: '#00843D', secondaryColor: '#FFCD00' },
  { code: 'cm', name: 'Camerún', flagUrl: 'https://flagcdn.com/w40/cm.png', primaryColor: '#007A5E', secondaryColor: '#CE1126' },
  { code: 'do', name: 'República Dominicana', flagUrl: 'https://flagcdn.com/w40/do.png', primaryColor: '#002D62', secondaryColor: '#CE1126' },
  { code: 'br', name: 'Brasil', flagUrl: 'https://flagcdn.com/w40/br.png', primaryColor: '#FEDF00', secondaryColor: '#009B3A' },
  { code: 'pr', name: 'Puerto Rico', flagUrl: 'https://flagcdn.com/w40/pr.png', primaryColor: '#ED1C24', secondaryColor: '#00205B' },
  { code: 'mx', name: 'México', flagUrl: 'https://flagcdn.com/w40/mx.png', primaryColor: '#006847', secondaryColor: '#CE1126' },
  { code: 'cl', name: 'Chile', flagUrl: 'https://flagcdn.com/w40/cl.png', primaryColor: '#D52B1E', secondaryColor: '#0039A6' },
  { code: 'uy', name: 'Uruguay', flagUrl: 'https://flagcdn.com/w40/uy.png', primaryColor: '#0038A8', secondaryColor: '#FFFFFF' },
  { code: 'pe', name: 'Perú', flagUrl: 'https://flagcdn.com/w40/pe.png', primaryColor: '#D91023', secondaryColor: '#FFFFFF' },
  { code: 've', name: 'Venezuela', flagUrl: 'https://flagcdn.com/w40/ve.png', primaryColor: '#FFCC00', secondaryColor: '#00247D' },
  { code: 'ec', name: 'Ecuador', flagUrl: 'https://flagcdn.com/w40/ec.png', primaryColor: '#FFDD00', secondaryColor: '#034EA2' },
  { code: 'cr', name: 'Costa Rica', flagUrl: 'https://flagcdn.com/w40/cr.png', primaryColor: '#002B7F', secondaryColor: '#CE1126' },
  { code: 'pa', name: 'Panamá', flagUrl: 'https://flagcdn.com/w40/pa.png', primaryColor: '#00529B', secondaryColor: '#D21034' },
  { code: 'jm', name: 'Jamaica', flagUrl: 'https://flagcdn.com/w40/jm.png', primaryColor: '#007749', secondaryColor: '#FFB81C' },
  { code: 'bs', name: 'Bahamas', flagUrl: 'https://flagcdn.com/w40/bs.png', primaryColor: '#00778B', secondaryColor: '#FFC72C' },
  
  // EUROPE
  { code: 'de', name: 'Alemania', flagUrl: 'https://flagcdn.com/w40/de.png', primaryColor: '#000000', secondaryColor: '#DD0000' },
  { code: 'it', name: 'Italia', flagUrl: 'https://flagcdn.com/w40/it.png', primaryColor: '#008C45', secondaryColor: '#CD212A' },
  { code: 'lt', name: 'Lituania', flagUrl: 'https://flagcdn.com/w40/lt.png', primaryColor: '#046A38', secondaryColor: '#FDB913' },
  { code: 'hr', name: 'Croacia', flagUrl: 'https://flagcdn.com/w40/hr.png', primaryColor: '#FF0000', secondaryColor: '#FFFFFF' },
  { code: 'tr', name: 'Turquía', flagUrl: 'https://flagcdn.com/w40/tr.png', primaryColor: '#E30A17', secondaryColor: '#FFFFFF' },
  { code: 'lv', name: 'Letonia', flagUrl: 'https://flagcdn.com/w40/lv.png', primaryColor: '#9E3039', secondaryColor: '#FFFFFF' },
  { code: 'fi', name: 'Finlandia', flagUrl: 'https://flagcdn.com/w40/fi.png', primaryColor: '#003580', secondaryColor: '#FFFFFF' },
  { code: 'gb', name: 'Reino Unido', flagUrl: 'https://flagcdn.com/w40/gb.png', primaryColor: '#012169', secondaryColor: '#C8102E' },
  { code: 'ba', name: 'Bosnia y Herzegovina', flagUrl: 'https://flagcdn.com/w40/ba.png', primaryColor: '#002395', secondaryColor: '#FECB00' },
  { code: 'me', name: 'Montenegro', flagUrl: 'https://flagcdn.com/w40/me.png', primaryColor: '#C8102E', secondaryColor: '#D4AF37' },
  { code: 'ch', name: 'Suiza', flagUrl: 'https://flagcdn.com/w40/ch.png', primaryColor: '#DA291C', secondaryColor: '#FFFFFF' },
  { code: 'at', name: 'Austria', flagUrl: 'https://flagcdn.com/w40/at.png', primaryColor: '#ED2939', secondaryColor: '#FFFFFF' },
  { code: 'se', name: 'Suecia', flagUrl: 'https://flagcdn.com/w40/se.png', primaryColor: '#006AA7', secondaryColor: '#FECC00' },
  { code: 'be', name: 'Bélgica', flagUrl: 'https://flagcdn.com/w40/be.png', primaryColor: '#000000', secondaryColor: '#FDDA24' },
  { code: 'pl', name: 'Polonia', flagUrl: 'https://flagcdn.com/w40/pl.png', primaryColor: '#DC143C', secondaryColor: '#FFFFFF' },
  { code: 'cz', name: 'República Checa', flagUrl: 'https://flagcdn.com/w40/cz.png', primaryColor: '#11457E', secondaryColor: '#D7141A' },
  { code: 'ge', name: 'Georgia', flagUrl: 'https://flagcdn.com/w40/ge.png', primaryColor: '#FF0000', secondaryColor: '#FFFFFF' },
  { code: 'pt', name: 'Portugal', flagUrl: 'https://flagcdn.com/w40/pt.png', primaryColor: '#046A38', secondaryColor: '#DA291C' },
  { code: 'nl', name: 'Países Bajos', flagUrl: 'https://flagcdn.com/w40/nl.png', primaryColor: '#AE1C28', secondaryColor: '#21468B' },
  { code: 'ie', name: 'Irlanda', flagUrl: 'https://flagcdn.com/w40/ie.png', primaryColor: '#169B62', secondaryColor: '#FF883E' },

  // ASIA, MIDDLE EAST & OCEANIA
  { code: 'jp', name: 'Japón', flagUrl: 'https://flagcdn.com/w40/jp.png', primaryColor: '#BC002D', secondaryColor: '#FFFFFF' },
  { code: 'cn', name: 'China', flagUrl: 'https://flagcdn.com/w40/cn.png', primaryColor: '#DE2910', secondaryColor: '#FFDE00' },
  { code: 'ph', name: 'Filipinas', flagUrl: 'https://flagcdn.com/w40/ph.png', primaryColor: '#0038A8', secondaryColor: '#CE1126' },
  { code: 'il', name: 'Israel', flagUrl: 'https://flagcdn.com/w40/il.png', primaryColor: '#0038B8', secondaryColor: '#FFFFFF' },
  { code: 'nz', name: 'Nueva Zelanda', flagUrl: 'https://flagcdn.com/w40/nz.png', primaryColor: '#00247D', secondaryColor: '#CC142B' },
  { code: 'kr', name: 'Corea del Sur', flagUrl: 'https://flagcdn.com/w40/kr.png', primaryColor: '#0047A0', secondaryColor: '#CD2E3A' },
  { code: 'in', name: 'India', flagUrl: 'https://flagcdn.com/w40/in.png', primaryColor: '#FF9933', secondaryColor: '#138808' },
  { code: 'lb', name: 'Líbano', flagUrl: 'https://flagcdn.com/w40/lb.png', primaryColor: '#ED1C24', secondaryColor: '#00A859' },

  // AFRICA
  { code: 'ng', name: 'Nigeria', flagUrl: 'https://flagcdn.com/w40/ng.png', primaryColor: '#008751', secondaryColor: '#FFFFFF' },
  { code: 'sn', name: 'Senegal', flagUrl: 'https://flagcdn.com/w40/sn.png', primaryColor: '#00853F', secondaryColor: '#FDEF42' },
  { code: 'ao', name: 'Angola', flagUrl: 'https://flagcdn.com/w40/ao.png', primaryColor: '#CC092F', secondaryColor: '#000000' },
  { code: 'eg', name: 'Egipto', flagUrl: 'https://flagcdn.com/w40/eg.png', primaryColor: '#C8102E', secondaryColor: '#000000' },
  { code: 'ci', name: 'Costa de Marfil', flagUrl: 'https://flagcdn.com/w40/ci.png', primaryColor: '#F77F00', secondaryColor: '#009E60' },
  { code: 'ss', name: 'Sudán del Sur', flagUrl: 'https://flagcdn.com/w40/ss.png', primaryColor: '#000000', secondaryColor: '#007A3D' },
  { code: 'tn', name: 'Túnez', flagUrl: 'https://flagcdn.com/w40/tn.png', primaryColor: '#E70013', secondaryColor: '#FFFFFF' },
  { code: 'ma', name: 'Marruecos', flagUrl: 'https://flagcdn.com/w40/ma.png', primaryColor: '#C1272D', secondaryColor: '#006233' },
];

export function getCountryByName(name: string): Country {
  return COUNTRIES_LIST.find(c => name.includes(c.name)) || COUNTRIES_LIST[0];
}
