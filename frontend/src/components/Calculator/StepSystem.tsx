import React from 'react';
import { Cpu, CheckCircle2, ArrowRight, ArrowLeft, Sliders, DollarSign, Sparkles } from 'lucide-react';
import { VERIFIED_PANELS } from '../../utils/solarEngine';

interface StepSystemProps {
  scheme: 'NET_ACCOUNTING' | 'NET_METERING' | 'NET_PLUS';
  setScheme: (scheme: any) => void;
  targetOffsetPct: number;
  setTargetOffsetPct: (pct: number) => void;
  panelId: number;
  setPanelId: (id: number) => void;
  customCost: number | undefined;
  setCustomCost: (cost: number | undefined) => void;
  onCalculate: () => void;
  onBack: () => void;
}

export const StepSystem: React.FC<StepSystemProps> = ({
  scheme,
  setScheme,
  targetOffsetPct,
  setTargetOffsetPct,
  panelId,
  setPanelId,
  customCost,
  setCustomCost,
  onCalculate,
  onBack
}) => {
  const schemes = [
    {
      id: 'NET_ACCOUNTING',
      name: 'Net Accounting (Recommended)',
      tag: 'Most Popular',
      desc: 'Solar directly offsets your daytime consumption. If generation exceeds consumption in a billing month, CEB pays you 44.14 LKR/kWh in cash!',
      rate: 'CEB Feed-in: 44.14 LKR/kWh'
    },
    {
      id: 'NET_METERING',
      name: 'Net Metering',
      tag: 'Energy Banking',
      desc: 'Generation offsets consumption 1:1 on units (kWh). Surplus units roll over into future months as energy credits. No cash payouts.',
      rate: '1:1 kWh Energy Credits'
    },
    {
      id: 'NET_PLUS',
      name: 'Net Plus (Gross Export)',
      tag: 'Independent Export',
      desc: '100% of generated solar electricity is exported to the grid at 44.14 LKR/kWh. Total domestic household electricity is imported and billed separately.',
      rate: 'CEB Feed-in: 44.14 LKR/kWh'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Step 4: Solar Scheme & Equipment Preferences
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Choose your utility settlement arrangement under CEB regulations and select from verified tier-1 equipment models.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scheme Selection */}
        <div className="lg:col-span-7 space-y-4">
          <label className="text-xs font-bold text-slate-700 block">Select Rooftop Solar Scheme:</label>
          <div className="space-y-3">
            {schemes.map(s => {
              const isSelected = scheme === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setScheme(s.id)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{s.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                        {s.tag}
                      </span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{s.desc}</p>
                  <span className="inline-block mt-2 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {s.rate}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Target Energy Offset Slider */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-500" />
                Target Electricity Offset:
              </span>
              <span className="text-amber-600 font-mono text-sm">{targetOffsetPct}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              step="5"
              value={targetOffsetPct}
              onChange={e => setTargetOffsetPct(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>50% (Partial)</span>
              <span className="text-amber-600 font-bold">100% (Neutralize Bill)</span>
              <span>150% (Net Exporter)</span>
            </div>
          </div>
        </div>

        {/* Equipment Selection & Custom Cost */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Cpu className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">Verified PV Module Catalogue</h3>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Select PV Module Model:</label>
              <select
                value={panelId}
                onChange={e => setPanelId(parseInt(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-amber-500/50"
              >
                {VERIFIED_PANELS.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.manufacturer} {p.model} ({p.rated_power_w}W, {p.efficiency_pct}%)
                  </option>
                ))}
              </select>
            </div>

            {/* Hardware Photos Preview */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-center space-y-1">
                <img
                  src="/images/solar panel.jpg"
                  alt="Tier-1 Monocrystalline Solar Panel"
                  className="w-full h-20 object-contain mx-auto"
                />
                <span className="block text-[10px] font-bold text-slate-700">Tier-1 Half-Cell PV</span>
                <span className="block text-[9px] text-slate-500">21.2% Efficiency</span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-center space-y-1">
                <img
                  src="/images/inverter.png"
                  alt="On-Grid String Solar Inverter"
                  className="w-full h-20 object-contain mx-auto"
                />
                <span className="block text-[10px] font-bold text-slate-700">Grid-Tie String Inverter</span>
                <span className="block text-[9px] text-slate-500">98.4% Efficiency</span>
              </div>
            </div>

            {/* Custom Cost Input */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Installer Quoted Price (LKR)</span>
                <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="50000"
                  value={customCost || ''}
                  onChange={e => setCustomCost(parseFloat(e.target.value) || undefined)}
                  placeholder="Auto-calculated at ~LKR 285,000/kWp"
                  className="w-full px-3 py-2.5 pl-8 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-amber-500/50"
                />
                <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                If omitted, SolarCalc LK estimates turnkey cost using current Sri Lankan EPC benchmark rates (including tier-1 inverter, aluminum mounting, DC/AC switchgear, and CEB grid connection fees).
              </p>
            </div>

            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                All components are verified against official manufacturer datasheets and comply with <b>PUCSL RTSPV Utility Interconnection Guidelines Revision 1</b>.
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              onClick={onBack}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={onCalculate}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-md flex items-center gap-2 active:scale-95 transition-all"
            >
              <Cpu className="w-4 h-4" />
              Calculate My Solar System
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
