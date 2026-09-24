import React from 'react';
import { ShieldCheck, Cpu, Zap, Compass, Calculator, BookOpen, Layers } from 'lucide-react';
import { SolarCalcAiIcon } from '../components/ai/AIIcon';
import { AIAssistant } from '../components/ai/AIAssistant';
import { CalculationResult } from '../types/solar';

interface AIAssistantPageProps {
  calculationResult: CalculationResult | null;
  onNavigateTab?: (tab: string) => void;
  initialPrompt?: string;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({
  calculationResult,
  onNavigateTab,
  initialPrompt
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Engineering Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-500/20 shadow-xl">
        {/* Subtle geometric background circuit lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 text-xs font-bold tracking-wide">
              <SolarCalcAiIcon className="w-4 h-4 text-emerald-400" />
              <span>Solar PV Engineering Assistant</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              SolarCalc AI Assistant
            </h1>
            <p className="text-amber-400 text-sm sm:text-base font-semibold">
              Your technical guide to SolarCalc LK
            </p>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Ask questions about solar PV planning, calculations, system sizing, tariffs, solar generation, economic analysis, and how to use SolarCalc LK.
            </p>
          </div>

          {/* Quick Context Summary Pill if user has results */}
          {calculationResult && (
            <div className="flex-shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-xs space-y-1.5 max-w-xs">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold uppercase tracking-wider text-[10px]">
                <Cpu className="w-3.5 h-3.5" />
                <span>Calculated System Loaded</span>
              </div>
              <div className="font-bold text-white text-sm">
                {calculationResult.system?.actual_capacity_kwp} kWp • {calculationResult.inputs?.district}
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                {calculationResult.system?.panel_count} × {calculationResult.system?.panel?.model} matched with {calculationResult.system?.inverter?.model}.
              </p>
            </div>
          )}
        </div>

        {/* Feature Badges */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="truncate">Grounded Calculations</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="truncate">PUCSL Jan 2025 Tariffs</span>
          </div>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-sky-400 flex-shrink-0" />
            <span className="truncate">Global Solar Atlas GIS</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span className="truncate">CEB RTSPV Schemes</span>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <AIAssistant
        activePage="/ai-assistant"
        calculationResult={calculationResult}
        initialPrompt={initialPrompt}
      />

      {/* Educational Grounding Reference Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
        <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
            <Calculator className="w-3.5 h-3.5 text-emerald-600" />
            <span>Target Sizing Engine</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Explains exact mathematical derivation from your average monthly kWh, local specific yield, and panel integer rounding.
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Electricity Tariffs</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Breaks down lifeline blocks (0-60) and standard domestic tiers, fixed charges, and Condition 3 net-metering billing rules.
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
            <BookOpen className="w-3.5 h-3.5 text-sky-600" />
            <span>Methodology & Sources</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Refers directly to World Bank Global Solar Atlas rasters, CEB 44.14 LKR/kWh gazettes, and manufacturer datasheets.
          </p>
        </div>
      </div>
    </div>
  );
};
