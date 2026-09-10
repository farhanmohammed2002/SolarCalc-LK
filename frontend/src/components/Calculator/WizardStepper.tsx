import React from 'react';
import { MapPin, Zap, Home, Cpu, BarChart3, Check } from 'lucide-react';

interface WizardStepperProps {
  currentStep: number;
  setStep: (step: number) => void;
  maxReachedStep: number;
}

export const WizardStepper: React.FC<WizardStepperProps> = ({ currentStep, setStep, maxReachedStep }) => {
  const steps = [
    { num: 1, title: 'Location', desc: 'District & Coordinates', icon: MapPin },
    { num: 2, title: 'Consumption', desc: 'kWh or Bill (LKR)', icon: Zap },
    { num: 3, title: 'Roof Specs', desc: 'Type, Tilt & Area', icon: Home },
    { num: 4, title: 'Solar System', desc: 'Scheme & Panels', icon: Cpu },
    { num: 5, title: 'Results', desc: 'Yield & Financials', icon: BarChart3 },
  ];

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs mb-8">
      <div className="grid grid-cols-5 gap-2 sm:gap-4 relative">
        {steps.map((s, idx) => {
          const isCurrent = currentStep === s.num;
          const isPassed = currentStep > s.num;
          const canClick = s.num <= maxReachedStep;
          const Icon = s.icon;

          return (
            <button
              key={s.num}
              onClick={() => canClick && setStep(s.num)}
              disabled={!canClick}
              className={`flex flex-col items-center text-center transition-all p-2 rounded-xl group ${
                canClick ? 'cursor-pointer hover:bg-slate-50' : 'cursor-not-allowed opacity-50'
              }`}
            >
              <div
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm mb-2 transition-all ${
                  isCurrent
                    ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 shadow-md'
                    : isPassed
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                {isPassed ? <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
              </div>
              <span className={`text-[11px] sm:text-xs font-bold leading-tight ${isCurrent ? 'text-slate-900' : 'text-slate-600'}`}>
                {s.title}
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 font-medium mt-0.5">
                {s.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
