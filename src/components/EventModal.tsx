import React, { useState } from 'react';
import { CareerEvent, EventChoice, ChoiceOutcomeDetails } from '../types/game';
import { Sparkles, AlertTriangle, ShieldCheck, TrendingUp, Flame, CheckCircle, XCircle, Dice5 } from 'lucide-react';
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
    // If the choice has probabilistic risk
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
      // Standard direct choice
      playAudioEffect('badge');
      onChoiceSelect(choice);
    }
  };

  const handleConfirmResolvedOutcome = () => {
    if (!resolvedOutcome) return;
    onChoiceSelect(resolvedOutcome.chosenChoice, resolvedOutcome.details);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-5 sm:p-8 space-y-6 shadow-2xl relative my-auto">
        
        {/* Event Category Badge */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>DECISIÓN CLAVE DE CARRERA ({event.category.toUpperCase()})</span>
          </div>
        </div>

        {/* PROBABILISTIC OUTCOME RESOLUTION SCREEN */}
        {resolvedOutcome ? (
          <div className="space-y-6 text-center animate-fadeIn">
            <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-xl border-2 ${
              resolvedOutcome.isSuccess ? 'bg-emerald-950 border-emerald-500/80 text-emerald-400' : 'bg-red-950 border-red-500/80 text-red-400'
            }`}>
              {resolvedOutcome.isSuccess ? <CheckCircle className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
            </div>

            <div className="space-y-2">
              <h3 className={`font-display text-3xl font-black uppercase ${resolvedOutcome.isSuccess ? 'text-emerald-400' : 'text-red-400'}`}>
                {resolvedOutcome.isSuccess ? '¡RESULTADO EXITOSO! 🎉' : '¡RIESGO FALLIDO! ⚠️'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 bg-slate-950 p-4 rounded-2xl border border-slate-800 italic leading-relaxed">
                "{resolvedOutcome.details.narrativeOutcome}"
              </p>
            </div>

            <button
              onClick={handleConfirmResolvedOutcome}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-display font-black text-base uppercase py-3.5 rounded-xl shadow-lg transition-all"
            >
              CONTINUAR CARRERA 🏀
            </button>
          </div>
        ) : (
          /* REGULAR CHOICE OPTIONS SELECTION */
          <>
            <div className="space-y-2">
              <h2 className="font-display text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
                {event.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                {event.description}
              </p>
            </div>

            {/* Decision Cards List */}
            <div className="space-y-3">
              {event.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleSelect(choice)}
                  className="w-full text-left bg-slate-950 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/60 rounded-2xl p-4 transition-all duration-200 group space-y-2 relative overflow-hidden"
                >
                  {choice.isRisky && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-red-500 text-black text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                      <Dice5 className="w-3 h-3" />
                      <span>{Math.round((choice.successProbability || 0.5) * 100)}% PROBABILIDAD DE ÉXITO</span>
                    </div>
                  )}

                  <h4 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors flex items-center gap-2">
                    <span>{choice.text}</span>
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {choice.description}
                  </p>
                </button>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
};
