import React, { useState } from 'react';
import { Player, PlayerInvestment, PlayerAttributes } from '../types/game';
import { INITIAL_INVESTMENTS, calculateOvr, playAudioEffect } from '../utils/simulator';
import { DollarSign, Sparkles, Building, Car, Award, ShieldCheck, ArrowUpRight, Clock, ChevronUp, Dumbbell, Zap, Heart, Target, Check, X, ShieldAlert, TrendingUp } from 'lucide-react';

interface LifestyleStoreModalProps {
  player: Player;
  onUpdatePlayer: (updated: Player) => void;
  onClose: () => void;
}

export const LifestyleStoreModal: React.FC<LifestyleStoreModalProps> = ({
  player,
  onUpdatePlayer,
  onClose,
}) => {
  const [selectedTier, setSelectedTier] = useState<1 | 2 | 3>(1);
  const currentInvestments = player.investments && player.investments.length > 0 ? player.investments : INITIAL_INVESTMENTS;

  const filteredInvestments = currentInvestments.filter(i => i.tier === selectedTier);

  const handleBuy = (item: PlayerInvestment) => {
    if (player.earningsMillions < item.costMillions) return;

    playAudioEffect('cash');

    let updatedAttrs = { ...player.attributes };
    if (item.attributeBoosts) {
      for (const k in item.attributeBoosts) {
        const key = k as keyof PlayerAttributes;
        const boost = item.attributeBoosts[key] || 0;
        updatedAttrs[key] = Math.min(99, (updatedAttrs[key] || 50) + boost);
      }
    }

    const updatedList = currentInvestments.map(i => i.id === item.id ? { ...i, bought: true, level: 1 } : i);
    
    // Calculate new OVR
    const tempPlayer: Player = { ...player, attributes: updatedAttrs };
    const newOvr = calculateOvr(tempPlayer);

    const updatedPlayer: Player = {
      ...player,
      ovr: newOvr,
      attributes: updatedAttrs,
      earningsMillions: player.earningsMillions - item.costMillions,
      marketability: Math.min(100, player.marketability + item.marketabilityBonus),
      reputation: Math.min(100, player.reputation + (item.reputationBonus || 0)),
      passiveIncomeMillions: player.passiveIncomeMillions + item.annualIncomeMillions,
      investments: updatedList,
    };

    onUpdatePlayer(updatedPlayer);
  };

  const handleUpgrade = (item: PlayerInvestment) => {
    const upgradeCost = item.upgradeCostMillions || 2.0;
    if (player.earningsMillions < upgradeCost) return;

    playAudioEffect('cash');

    let updatedAttrs = { ...player.attributes };
    if (item.attributeBoosts) {
      for (const k in item.attributeBoosts) {
        const key = k as keyof PlayerAttributes;
        const boost = Math.round((item.attributeBoosts[key] || 0) * 0.5);
        updatedAttrs[key] = Math.min(99, (updatedAttrs[key] || 50) + boost);
      }
    }

    const updatedList = currentInvestments.map(i =>
      i.id === item.id ? { ...i, level: Math.min(i.maxLevel, i.level + 1) } : i
    );

    const tempPlayer: Player = { ...player, attributes: updatedAttrs };
    const newOvr = calculateOvr(tempPlayer);

    const updatedPlayer: Player = {
      ...player,
      ovr: newOvr,
      attributes: updatedAttrs,
      earningsMillions: player.earningsMillions - upgradeCost,
      marketability: Math.min(100, player.marketability + (item.marketabilityBonus > 0 ? 8 : 0)),
      passiveIncomeMillions: player.passiveIncomeMillions + (item.annualIncomeMillions > 0 ? 1.5 : 0),
      investments: updatedList,
    };

    onUpdatePlayer(updatedPlayer);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full p-5 sm:p-8 space-y-6 shadow-2xl relative my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Building className="w-4 h-4" />
              <span>NEGOCIOS, LUJOS & INVERSIONES DE ALTO RENDIMIENTO</span>
            </div>
            <h2 className="font-display text-3xl font-black text-white uppercase">
              TIENDA PROGRESIVA DE ACTIVOS & CONSECUENCIAS
            </h2>
            <p className="text-xs text-slate-400">Cada compra tiene un impacto tangible directo en tus temporadas:</p>
          </div>

          <div className="bg-emerald-950 border border-emerald-500/40 rounded-2xl px-4 py-2 text-right flex-shrink-0">
            <div className="text-[10px] text-emerald-400 font-bold uppercase">FORTUNA DISPONIBLE</div>
            <div className="font-display font-black text-2xl text-emerald-400">${player.earningsMillions.toFixed(1)}M</div>
          </div>
        </div>

        {/* TIER TABS SELECTOR */}
        <div className="flex bg-slate-950 border border-slate-800 rounded-2xl p-1.5 text-xs font-bold">
          <button
            onClick={() => setSelectedTier(1)}
            className={`flex-1 py-2.5 rounded-xl transition-all ${selectedTier === 1 ? 'bg-amber-500 text-black shadow-lg font-black' : 'text-slate-400 hover:text-white'}`}
          >
            🌱 TIER 1: NOVATO ($0.3M - $1.5M)
          </button>
          <button
            onClick={() => setSelectedTier(2)}
            className={`flex-1 py-2.5 rounded-xl transition-all ${selectedTier === 2 ? 'bg-amber-500 text-black shadow-lg font-black' : 'text-slate-400 hover:text-white'}`}
          >
            👑 TIER 2: SUPERESTRELLA ($2.5M - $10M)
          </button>
          <button
            onClick={() => setSelectedTier(3)}
            className={`flex-1 py-2.5 rounded-xl transition-all ${selectedTier === 3 ? 'bg-amber-500 text-black shadow-lg font-black' : 'text-slate-400 hover:text-white'}`}
          >
            🏛️ TIER 3: MAGNATE ($15M+)
          </button>
        </div>

        {/* Investment Cards Grid with Pros, Cons, and Annual Perks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[28rem] overflow-y-auto pr-1">
          {filteredInvestments.map(item => {
            const canAfford = player.earningsMillions >= item.costMillions;
            const canAffordUpgrade = item.upgradeCostMillions ? player.earningsMillions >= item.upgradeCostMillions : false;

            return (
              <div
                key={item.id}
                className={`game-card-panel rounded-2xl p-5 space-y-4 flex flex-col justify-between transition-all holographic-edge ${
                  item.bought ? 'border-amber-500/50 bg-slate-950/90' : 'border-slate-800'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl shadow-inner flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{item.name}</h4>
                        <span className="text-[10px] text-amber-400 font-bold uppercase">{item.category.toUpperCase()}</span>
                      </div>
                    </div>

                    {item.bought && (
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-black px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>ADQUIRIDO (NVL {item.level})</span>
                      </span>
                    )}
                  </div>

                  {/* Impact Breakdown Cards (PROS, CONS, & PERKS) */}
                  <div className="space-y-1.5 text-[11px] bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between text-emerald-400 font-bold">
                      <span className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>PRO: {item.marketabilityBonus > 0 ? `+${item.marketabilityBonus} Comercialización` : 'Mejora de Rendimiento'}</span>
                      </span>
                      {item.annualIncomeMillions > 0 && (
                        <span className="text-emerald-300 font-black">+${item.annualIncomeMillions}M/año</span>
                      )}
                    </div>

                    {item.category === 'performance' && (
                      <div className="flex items-center gap-1 text-cyan-300 font-bold text-[10px]">
                        <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                        <span>EFECTO ACTIVO: Escudo de Lesiones (-60% Riesgo) & +3 Durabilidad Anual</span>
                      </div>
                    )}

                    {item.category === 'lifestyle' && (
                      <div className="flex items-center justify-between text-rose-300 font-semibold text-[10px]">
                        <span className="flex items-center gap-1">
                          <X className="w-3.5 h-3.5 text-rose-400" />
                          <span>CON: Mantenimiento anual estival</span>
                        </span>
                        <span className="text-rose-400 font-bold">-$0.3M/año</span>
                      </div>
                    )}

                    {item.category === 'business' && (
                      <div className="flex items-center gap-1 text-amber-300 font-bold text-[10px]">
                        <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                        <span>EFECTO ACTIVO: Pagos anuales de dividendos al final de cada temporada</span>
                      </div>
                    )}
                  </div>

                </div>

                {/* Buy / Upgrade Action Controls */}
                <div>
                  {!item.bought ? (
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={!canAfford}
                      className={`w-full font-display font-black text-xs uppercase py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
                        canAfford 
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-black shadow-emerald-500/20 active:scale-95' 
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      }`}
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>COMPRAR POR ${item.costMillions}M USD</span>
                    </button>
                  ) : item.level < item.maxLevel ? (
                    <button
                      onClick={() => handleUpgrade(item)}
                      disabled={!canAffordUpgrade}
                      className={`w-full font-display font-black text-xs uppercase py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
                        canAffordUpgrade 
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black active:scale-95' 
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      }`}
                    >
                      <ChevronUp className="w-4 h-4" />
                      <span>MEJORAR A NIVEL {item.level + 1} (${item.upgradeCostMillions}M)</span>
                    </button>
                  ) : (
                    <div className="w-full bg-slate-900 border border-slate-800 text-slate-400 font-bold text-[10px] uppercase py-2.5 rounded-xl text-center">
                      NIVEL MÁXIMO ALCANZADO ✅
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="pt-2 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase px-6 py-3 rounded-xl transition-all"
          >
            VOLVER AL PANEL DE CARRERA 🏀
          </button>
        </div>

      </div>
    </div>
  );
};
