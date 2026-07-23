import React from 'react';
import { getTeamById } from '../data/nbaTeams';
import { getCountryByName } from '../data/countries';

interface JerseyPreviewProps {
  name: string;
  jerseyNumber: number;
  teamId?: string | null;
  countryName?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const JerseyPreview: React.FC<JerseyPreviewProps> = ({
  name,
  jerseyNumber,
  teamId,
  countryName,
  size = 'md',
}) => {
  const team = teamId ? getTeamById(teamId) : null;
  const country = countryName ? getCountryByName(countryName) : null;

  let primaryColor = '#1E293B';
  let secondaryColor = '#F59E0B';

  if (team) {
    primaryColor = team.primaryColor;
    secondaryColor = team.secondaryColor;
  } else if (country) {
    primaryColor = country.primaryColor;
    secondaryColor = country.secondaryColor;
  }

  const lastName = name.trim() ? (name.trim().split(' ').pop()?.toUpperCase() || 'PLAYER') : 'TU NOMBRE';

  // Size dimensions
  let widthClass = 'w-36 h-44';
  let nameFontSize = 'text-xs';
  let numberFontSize = 'text-5xl';
  if (size === 'sm') {
    widthClass = 'w-24 h-32';
    nameFontSize = 'text-[9px]';
    numberFontSize = 'text-3xl';
  } else if (size === 'lg') {
    widthClass = 'w-48 h-60';
    nameFontSize = 'text-sm';
    numberFontSize = 'text-7xl';
  }

  return (
    <div className={`relative ${widthClass} mx-auto flex flex-col items-center justify-between p-3 rounded-t-3xl rounded-b-xl shadow-2xl border-2 border-slate-700/60 overflow-hidden select-none transition-all duration-300 transform hover:scale-105`}
      style={{
        backgroundColor: primaryColor,
        backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(0,0,0,0.35) 100%)`,
      }}
    >
      {/* Shoulder Cutouts & Neck Trim */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-slate-950/40 border-b border-white/20 flex items-center justify-center">
        <div className="w-8 h-3 bg-[#0B0F19] rounded-b-full border-b border-amber-400/60"></div>
      </div>

      {/* Armhole Cutouts Styling */}
      <div className="absolute top-2 left-0 w-3 h-8 rounded-r-full bg-[#0B0F19]"></div>
      <div className="absolute top-2 right-0 w-3 h-8 rounded-l-full bg-[#0B0F19]"></div>

      {/* Player Last Name Curved */}
      <div className="mt-4 text-center z-10 w-full px-1">
        <div
          className={`font-display font-black tracking-widest ${nameFontSize} drop-shadow-md truncate`}
          style={{ color: secondaryColor }}
        >
          {lastName}
        </div>
      </div>

      {/* Giant Jersey Number */}
      <div className="my-auto text-center z-10 leading-none">
        <div
          className={`font-display font-black ${numberFontSize} tracking-tighter drop-shadow-lg`}
          style={{ 
            color: secondaryColor,
            textShadow: '0 2px 8px rgba(0,0,0,0.8), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
          }}
        >
          {jerseyNumber}
        </div>
      </div>

      {/* Team or Country Flag Badge at Bottom Hem */}
      <div className="z-10 flex items-center justify-between w-full border-t border-white/10 pt-1 text-[9px] font-bold text-white/90">
        <span className="truncate">{country ? country.name : 'NBA LEGEND'}</span>
        {team ? <span>{team.abbreviation}</span> : country ? <img src={country.flagUrl} alt="" className="w-3.5 h-2.5 object-cover rounded" /> : null}
      </div>
    </div>
  );
};
