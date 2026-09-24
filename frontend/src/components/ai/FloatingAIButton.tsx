import React, { useState } from 'react';
import { Maximize2, X, Sparkles, MessageSquare } from 'lucide-react';
import { SolarCalcAiIcon } from './AIIcon';
import { AIAssistant } from './AIAssistant';
import { CalculationResult } from '../../types/solar';

interface FloatingAIButtonProps {
  activePage: string;
  calculationResult: CalculationResult | null;
  onOpenFullAssistant: () => void;
}

export const FloatingAIButton: React.FC<FloatingAIButtonProps> = ({
  activePage,
  calculationResult,
  onOpenFullAssistant
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // If already on the dedicated AI assistant page, don't show the floating widget
  if (activePage === 'ai-assistant') {
    return null;
  }

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <aside aria-label="SolarCalc AI Assistant trigger" className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white rounded-2xl shadow-xl hover:shadow-2xl border border-emerald-500/30 hover:border-amber-400/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Open SolarCalc AI Assistant"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-sky-500 to-emerald-500 p-0.5 flex items-center justify-center shadow-md">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <SolarCalcAiIcon className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
                </div>
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
            </div>

            <div className="text-left hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-tight text-white">SolarCalc AI</span>
                <span className="px-1 py-0.2 bg-amber-500 text-slate-950 font-bold text-[9px] rounded">
                  v1.0
                </span>
              </div>
              <p className="text-[10px] text-slate-300 font-medium">Ask Engineering Question</p>
            </div>
          </button>
        </aside>
      )}

      {/* Compact Popover Chat Panel */}
      {isOpen && (
        <aside aria-label="SolarCalc AI Assistant dialog" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-[420px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header Controls */}
          <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center">
                <SolarCalcAiIcon className="w-4 h-4 text-slate-950" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  SolarCalc AI Assistant
                  {calculationResult && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400" title="System Context Attached" />
                  )}
                </h4>
                <p className="text-[10px] text-slate-400">Engineering Software Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenFullAssistant();
                }}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Open Full Assistant Page"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Compact Assistant Body */}
          <div className="p-2 sm:p-3 bg-slate-50 flex-1 overflow-hidden">
            <AIAssistant
              activePage={activePage}
              calculationResult={calculationResult}
              compact={true}
              onNavigatePage={onOpenFullAssistant}
            />
          </div>
        </aside>
      )}
    </>
  );
};
