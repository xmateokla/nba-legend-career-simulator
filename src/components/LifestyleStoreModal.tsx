import React, { useState } from 'react';
import { Player, PlayerInvestment } from '../types/game';
import { INITIAL_INVESTMENTS, playAudioEffect } from '../utils/simulator';
import { DollarSign, Sparkles, Building, Car, Award, ShieldCheck, ArrowUpRight, Clock, ChevronUp } from 'lucide-react';

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

    const updatedList = currentInvestments.map(i => i.id === item.id ? { ...i, bought: true, level: 1 } : i);
    const updatedPlayer: Player = {
      ...player,
      earningsMillions: player.earningsMillions - item.costMillions,
      marketability: Math.min(100, player.marketability + item.marketabilityBonus),
      passiveIncomeMillions: player.passiveIncomeMillions + item.annualIncomeMillions,
      investments: updatedList,
    };

    onUpdatePlayer(updatedPlayer);
  };

  const handleUpgrade = (item: PlayerInvestment) => {
    const upgradeCost = item.upgradeCostMillions || 2.0;
    if (player.earningsMillions < upgradeCost) return;

    playAudioEffect('cash');

    const updatedList = currentInvestments.map(i =>
      i.id === item.id ? { ...i, level: Math.min(i.maxLevel, i.level + 1), marketabilityBonus: i.marketabilityBonus + 8 } : i
    );

    const updatedPlayer: Player = {
      ...player,
      earningsMillions: player.earningsMillions - upgradeCost,
      marketability: Math.min(100, player.marketability + 8),
      passiveIncomeMillions: player.passiveIncomeMillions + (item.annualIncomeMillions > 0 ? 1.5 : 0),
      investments: updatedList,
    };

    onUpdatePlayer(updatedPlayer);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-5 sm:p-8 space-y-6 shadow-2xl relative my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Building className="w-4 h-4" />
              <span>NEGOCIOS, LUJOS & RENDIMIENTO DE ATLETA</span>
            </div>
            <h2 className="font-display text-3xl font-black text-white uppercase">
              TIENDA PROGRESIVA DE INVERSIONES
            </h2>
          </div>

          <div className="bg-emerald-950 border border-emerald-500/40 rounded-2xl px-4 py-2 text-right">
            <div className="text-[10px] text-emerald-400 font-bold uppercase">FORTUNA DISPONIBLE</div>
            <div className="font-display font-black text-2xl text-emerald-400">${player.earningsMillions.toFixed(1)}M</div>
          </div>
        </div>

        {/* TIER TABS SELECTOR (Tier 1: Novato, Tier 2: Superestrella, Tier 3: Inmortal) */}
        <div className="flex bg-slate-950 border border-slate-800 rounded-2xl p-1.5 text-xs font-bold">
          <button
            onClick={() => setSelectedTier(1)}
            className={`flex-1 py-2.5 rounded-xl transition-all ${selectedTier === 1 ? 'bg-amber-500 text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            🌱 TIER 1: NOVATO ($0.3M - $1.5M)
          </button>
          <button
            onClick={() => setSelectedTier(2)}
            className={`flex-1 py-2.5 rounded-xl transition-all ${selectedTier === 2 ? 'bg-amber-500 text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            👑 TIER 2: SUPERESTRELLA ($2.5M - $10M)
          </button>
          <button
            onClick={() => setSelectedTier(3)}
            className={`flex-1 py-2.5 rounded-xl transition-all ${selectedTier === 3 ? 'bg-amber-500 text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            🏛️ TIER 3: MAGNATE ($15M+)
          </button>
        </div>

        {/* Investment Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-1">
          {filteredInvestments.map(item => {
            const canAfford = player.earningsMillions >= item.costMillions;
            const canAffordUpgrade = item.upgradeCostMillions ? player.earningsMillions >= item.upgradeCostMillions : false;

            return (
              <div
                key={item.id}
                className={`bg-slate-950 border rounded-2xl p-4 space-y-3 transition-all flex flex-col justify-between ${
                  item.bought ? 'border-emerald-500/60 bg-emerald-950/20' : 'border-slate-800'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <h4 className="font-bold text-white text-sm">{item.name} {item.bought && item.maxLevel > 1 && `(v${item.level})`}</h4>
                        <span className="text-[10px] text-amber-400 font-bold">
                          {item.isTemporaryOneYear ? '⏱️ Contrato 1 Año' : item.category.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Precio Inicial:</span>
                      <span className="font-bold text-white">${item.costMillions}M USD</span>
                    </div>
                    {item.annualIncomeMillions > 0 && (
                      <div className="flex justify-between text-emerald-400 font-bold">
                        <span>Ingreso Pasivo:</span>
                        <span>+${item.annualIncomeMillions}M / año</span>
                      </div>
                    )}
                    <div className="flex justify-between text-amber-300 font-semibold">
                      <span>Comercialización:</span>
                      <span>+{item.marketabilityBonus}%</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {!item.bought ? (
                  <button
                    disabled={!canAfford}
                    onClick={() => handleBuy(item)}
                    className="w-full font-display font-black text-xs uppercase tracking-wider py-3 rounded-xl shadow-lg transition-all bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black disabled:opacity-40"
                  >
                    {canAfford ? `ADQUIRIR POR $${item.costMillions}M` : 'FORTUNA INSUFICIENTE'}
                  </button>
                ) : item.level < item.maxLevel && item.upgradeCostMillions ? (
                  <button
                    disabled={!canAffordUpgrade}
                    onClick={() => handleUpgrade(item)}
                    className="w-full inline-flex items-center justify-center gap-1 font-display font-black text-xs uppercase py-3 rounded-xl shadow-lg transition-all bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40"
                  >
                    <ChevronUp className="w-4 h-4" />
                    <span>MEJORAR A V2 POR ${item.upgradeCostMillions}M</span>
                  </button>
                ) : (
                  <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-center text-xs py-2.5 rounded-xl">
                    ✓ PROPIEDAD ADQUIRIDA (NIVEL MÁXIMO)
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all"
          >
            VOLVER AL PANEL DE CARRERA 🏀
          </button>
        </div>

      </div>
    </div>
  );
};
