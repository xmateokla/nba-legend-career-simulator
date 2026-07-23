import React from 'react';

export const ChampionshipRingIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ringGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#CA8A04" />
      </linearGradient>
      <linearGradient id="diamondGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#BAE6FD" />
      </linearGradient>
    </defs>
    {/* Ring Band */}
    <ellipse cx="32" cy="42" rx="20" ry="12" stroke="url(#ringGold)" strokeWidth="8" fill="none" />
    {/* Ring Face Plate */}
    <path d="M16 26 C16 16, 48 16, 48 26 C48 36, 16 36, 16 26 Z" fill="url(#ringGold)" stroke="#A16207" strokeWidth="2" />
    {/* Center Diamond Jewel */}
    <polygon points="32,18 39,26 32,34 25,26" fill="url(#diamondGlow)" stroke="#0284C7" strokeWidth="1.5" />
    {/* Side Accent Jewels */}
    <circle cx="20" cy="26" r="2.5" fill="url(#diamondGlow)" />
    <circle cx="44" cy="26" r="2.5" fill="url(#diamondGlow)" />
    <circle cx="32" cy="14" r="2" fill="#FFFFFF" />
  </svg>
);

export const LarryOBrienTrophyIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="trophyGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="30%" stopColor="#FACC15" />
        <stop offset="70%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#854D0E" />
      </linearGradient>
    </defs>
    {/* Pedestal Base */}
    <rect x="18" y="52" width="28" height="8" rx="2" fill="#451A03" stroke="url(#trophyGold)" strokeWidth="1.5" />
    <rect x="22" y="46" width="20" height="6" fill="url(#trophyGold)" />
    {/* Net & Stem */}
    <path d="M26 46 L32 28 L38 46 Z" fill="url(#trophyGold)" opacity="0.8" />
    <path d="M28 46 L32 28 L36 46" stroke="#78350F" strokeWidth="1" />
    {/* Basketball Sphere */}
    <circle cx="32" cy="22" r="14" fill="url(#trophyGold)" stroke="#78350F" strokeWidth="1.5" />
    {/* Seams on ball */}
    <path d="M18 22 C24 22, 40 22, 46 22" stroke="#78350F" strokeWidth="1.2" />
    <path d="M32 8 C32 16, 32 28, 32 36" stroke="#78350F" strokeWidth="1.2" />
    <path d="M22 13 C27 18, 27 26, 22 31" stroke="#78350F" strokeWidth="1" />
    <path d="M42 13 C37 18, 37 26, 42 31" stroke="#78350F" strokeWidth="1" />
  </svg>
);

export const NbaCupTrophyIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cupGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="50%" stopColor="#CA8A04" />
        <stop offset="100%" stopColor="#1E293B" />
      </linearGradient>
    </defs>
    {/* Black Base */}
    <rect x="20" y="50" width="24" height="10" rx="2" fill="#0F172A" stroke="#EAB308" strokeWidth="2" />
    {/* Modern Cup Body */}
    <path d="M16 16 L24 48 L40 48 L48 16 Z" fill="url(#cupGold)" stroke="#FACC15" strokeWidth="2" />
    {/* Cup Handles */}
    <path d="M16 20 C8 20, 8 36, 20 40" stroke="#EAB308" strokeWidth="3" fill="none" />
    <path d="M48 20 C56 20, 56 36, 44 40" stroke="#EAB308" strokeWidth="3" fill="none" />
    {/* Crown Top Rim */}
    <ellipse cx="32" cy="16" rx="16" ry="5" fill="#FDE047" stroke="#854D0E" strokeWidth="1.5" />
  </svg>
);

export const OlympicGoldMedalIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="goldMedal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#A16207" />
      </linearGradient>
    </defs>
    {/* Blue/Red Ribbon */}
    <path d="M22 4 L32 24 L26 24 L16 4 Z" fill="#2563EB" />
    <path d="M42 4 L32 24 L38 24 L48 4 Z" fill="#DC2626" />
    {/* Gold Ring Connector */}
    <rect x="28" y="22" width="8" height="5" rx="1" fill="#CA8A04" />
    {/* Gold Medal Disc */}
    <circle cx="32" cy="42" r="18" fill="url(#goldMedal)" stroke="#FEF08A" strokeWidth="2" />
    {/* Inner Star Design */}
    <polygon points="32,32 35,39 42,39 36,43 38,50 32,46 26,50 28,43 22,39 29,39" fill="#FFFFFF" opacity="0.9" />
  </svg>
);

export const FibaWorldCupIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fibaGlobe" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0369A1" />
      </linearGradient>
      <linearGradient id="fibaGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#CA8A04" />
      </linearGradient>
    </defs>
    {/* Base */}
    <rect x="20" y="52" width="24" height="8" rx="2" fill="#0F172A" stroke="url(#fibaGold)" strokeWidth="1.5" />
    {/* Pillar Support */}
    <path d="M24 52 L28 34 L36 34 L40 52 Z" fill="url(#fibaGold)" />
    {/* World Globe on Top */}
    <circle cx="32" cy="22" r="14" fill="url(#fibaGlobe)" stroke="url(#fibaGold)" strokeWidth="2" />
    {/* Globe Meridians */}
    <ellipse cx="32" cy="22" rx="14" ry="6" stroke="#E0F2FE" strokeWidth="1" fill="none" />
    <ellipse cx="32" cy="22" rx="6" ry="14" stroke="#E0F2FE" strokeWidth="1" fill="none" />
  </svg>
);

export const MvpTrophyIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="mvpGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
    </defs>
    {/* Marble Base */}
    <rect x="16" y="48" width="32" height="12" rx="2" fill="#1E293B" stroke="url(#mvpGold)" strokeWidth="2" />
    {/* Player Silhouette */}
    <path d="M32 12 C34 12, 36 10, 36 8 C36 6, 34 4, 32 4 C30 4, 28 6, 28 8 C28 10, 30 12, 32 12 Z" fill="url(#mvpGold)" />
    <path d="M26 18 L32 14 L38 18 L35 30 L38 48 L33 48 L32 36 L31 48 L26 48 L29 30 Z" fill="url(#mvpGold)" />
    {/* Basketball in Hand */}
    <circle cx="40" cy="14" r="3.5" fill="#F97316" stroke="#FFF" strokeWidth="0.8" />
  </svg>
);

export const AllStarKobeIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="starGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="40%" stopColor="#FACC15" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <polygon points="32,4 39,22 58,22 43,34 49,52 32,41 15,52 21,34 6,22 25,22" fill="url(#starGold)" stroke="#FFF" strokeWidth="1.5" />
    <circle cx="32" cy="30" r="5" fill="#1E1B4B" />
    <polygon points="32,27 34,31 30,31" fill="#FACC15" />
  </svg>
);
