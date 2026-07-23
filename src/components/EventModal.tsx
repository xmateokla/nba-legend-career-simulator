import React, { useState } from 'react';
import { CareerEvent, EventChoice, ChoiceOutcomeDetails } from '../types/game';
import { Sparkles, AlertTriangle, ShieldCheck, TrendingUp, Flame, CheckCircle, XCircle, Dice5, Check, X, Star } from 'lucide-react';
import { playAudioEffect } from '../utils/simulator';

interface EventModalProps {
  event: CareerEvent;
  onChoiceSelect: (choice: EventChoice, resolvedOutcome?: ChoiceOutcomeDetails) => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, onChoiceSelect }) => {
  const [resolvedOutcome, setResolvedOutcome] = useState<{
    isSuccess: boolean;
    details: ChoiceOutcomeDetails;
    chosenChoice: EventChoice;
  } | null>(null);

  const handleSelect = (choice: EventChoice) => {
    if (choice.isRisky && choice.successOutcome && choice.failureOutcome) {
      const prob = choice.successProbability || 0.5;
      const isSuccess = Math.random() < prob;
      const details = isSuccess ? choice.successOutcome : choice.failureOutcome;

      if (isSuccess) playAudioEffect('cheer');
      else playAudioEffect('draft_buzzer');

      setResolvedOutcome({
        isSuccess,
        details,
        chosenChoice: choice,
      });
    } else {
      playAudioEffect('badge');
      onChoiceSelect(choice);
    }
  };

  const handleConfirmResolvedOutcome = () => {
    if (!resolvedOutcome) return;
    onChoiceSelect(resolvedOutcome.chosenChoice, resolvedOutcome.details);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="bg-slate-950 border border-slate-700/80 rounded-3xl max-w-xl w-full p-5 sm:p-8 space-y-6 shadow-2xl relative my-auto">
        
        {/* Event Category Badge */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="inline-flex items-center gap-2 bg-purple-500/15 border border-purple-500/40 text-purple-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>EVENTO DE CARRERA ({event.category.toUpperCase()})</span>
          </div>
        </div>

        {/* PROBABILISTIC OUTCOME RESOLUTION SCREEN */}
        {resolvedOutcome ? (
          <div className="space-y-6 text-center animate-fadeIn">
            <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-2xl border-2 ${
              resolvedOutcome.isSuccess ? 'bg-emerald-950 border-emerald-500/80 text-emerald-400 emerald-glow' : 'bg-red-950 border-red-500/80 text-red-400'
            }`}>
              {resolvedOutcome.isSuccess ? <CheckCircle className="w-12 h-12 text-emerald-400" /> : <XCircle className="w-12 h-12 text-red-400" />}
            </div>

            <div className="space-y-2">
              <h3 className={`font-display text-3xl font-black uppercase ${resolvedOutcome.isSuccess ? 'text-emerald-400' : 'text-red-400'}`}>
                {resolvedOutcome.isSuccess ? '¡RESULTADO EXITOSO! 🎉' : '¡RIESGO FALLIDO! ⚠️'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 italic leading-relaxed">
                "{resolvedOutcome.details.narrativeOutcome}"
              </p>
            </div>

            <button
              onClick={handleConfirmResolvedOutcome}
              className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 text-black font-display font-black text-base uppercase py-3.5 rounded-xl shadow-lg transition-all"
            >
              CONTINUAR CARRERA 🏀
            </button>
          </div>
        ) : (
          /* REGULAR CHOICE CARDS DECK SELECTION */
          <>
            <div className="space-y-2">
              <h2 className="font-display text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
                {event.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/90 p-4 rounded-2xl border border-slate-800/80">
                {event.description}
              </p>
            </div>

            {/* Decision Cards List */}
            <div className="space-y-3">
              {event.choices.map((choice) => {
                const probSuccess = Math.round((choice.successProbability || 0.5) * 100);
                const probFail = 100 - probSuccess;

                return (
                  <button
                    key={choice.id}
                    onClick={() => handleSelect(choice)}
                    className="w-full text-left game-card-panel hover:border-amber-500/70 rounded-2xl p-4 transition-all duration-200 group space-y-3 relative overflow-hidden holographic-edge card-hover-effect"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors flex items-center gap-2">
                        <span>{choice.text}</span>
                      </h4>
                      {choice.isRisky && (
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                          <Dice5 className="w-3 h-3 text-amber-400" />
                          <span>DECISIÓN DE RIESGO</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {choice.description}
                    </p>

                    {/* Detailed Risk/Reward breakdown showing both outcomes! */}
                    {choice.isRisky && choice.successOutcome && choice.failureOutcome && (
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2 text-emerald-300 space-y-0.5">
                          <div className="font-bold flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>🟢 ÉXITO ({probSuccess}%):</span>
                          </div>
                          <div className="text-[10px] text-slate-300 truncate">
                            {choice.successOutcome.unlockedBadge ? `Insignia ${choice.successOutcome.unlockedBadge}` : 'Bonificación Máxima'}
                          </div>
                        </div>

                        <div className="bg-red-950/40 border border-red-500/30 rounded-xl p-2 text-red-300 space-y-0.5">
                          <div className="font-bold flex items-center gap-1">
                            <X className="w-3 h-3 text-red-400" />
                            <span>🔴 FRACASO ({probFail}%):</span>
                          </div>
                          <div className="text-[10px] text-slate-300 truncate">
                            Pérdida de stats / Lesión
                          </div>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}

      </div>
    </div>
  );
};
