import React, { useState } from 'react';
import { Zap, Receipt, ArrowRight, ArrowLeft, Info } from 'lucide-react';
import { calculateDomesticBillClient, estimateUnitsFromBillClient } from '../../utils/solarEngine';

interface StepConsumptionProps {
  monthlyUnits: number;
  setMonthlyUnits: (units: number) => void;
  monthlyBill: number | undefined;
  setMonthlyBill: (bill: number | undefined) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepConsumption: React.FC<StepConsumptionProps> = ({
  monthlyUnits,
  setMonthlyUnits,
  monthlyBill,
  setMonthlyBill,
  onNext,
  onBack
}) => {
  const [inputMode, setInputMode] = useState<'UNITS' | 'BILL'>('UNITS');

  const billCalc = calculateDomesticBillClient(monthlyUnits);

  const handleUnitsChange = (val: number) => {
    const u = Math.max(0, val);
    setMonthlyUnits(u);
    const b = calculateDomesticBillClient(u).totalBill;
    setMonthlyBill(b);
  };

  const handleBillChange = (val: number) => {
    const b = Math.max(0, val);
    setMonthlyBill(b);
    const u = estimateUnitsFromBillClient(b);
    setMonthlyUnits(u);
  };

  const quickPresets = [60, 120, 180, 250, 350, 500];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Step 2: Electricity Consumption & Current Utility Bill
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Billed under the official <b>PUCSL Final Decision Document on Electricity Tariff Revision (Effective January 18, 2025)</b>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Card */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          {/* Mode Switcher */}
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setInputMode('UNITS')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                inputMode === 'UNITS'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              I know my monthly units (kWh)
            </button>
            <button
              onClick={() => setInputMode('BILL')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                inputMode === 'BILL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Receipt className="w-3.5 h-3.5 text-amber-500" />
              I know my monthly bill (LKR)
            </button>
          </div>

          {inputMode === 'UNITS' ? (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                Average Monthly Consumption (Units / kWh)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max="5000"
                  value={monthlyUnits || ''}
                  onChange={e => handleUnitsChange(parseFloat(e.target.value) || 0)}
                  className="w-full text-2xl font-black text-slate-900 px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50"
                  placeholder="e.g. 250"
                />
                <span className="text-sm font-bold text-slate-500 shrink-0">kWh / month</span>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="30"
                max="800"
                step="10"
                value={monthlyUnits}
                onChange={e => handleUnitsChange(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                Average Monthly CEB / LECO Electricity Bill (LKR)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={monthlyBill || ''}
                  onChange={e => handleBillChange(parseFloat(e.target.value) || 0)}
                  className="w-full text-2xl font-black text-slate-900 px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50"
                  placeholder="e.g. 11900"
                />
                <span className="text-sm font-bold text-slate-500 shrink-0">LKR / month</span>
              </div>
              <p className="text-[11px] text-slate-500 italic">
                Solved using inverse PUCSL 2025 tariff formula: <b className="text-slate-900 font-mono">~{monthlyUnits} kWh</b>
              </p>
            </div>
          )}

          {/* Presets */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-2">Common Consumption Profiles:</span>
            <div className="flex flex-wrap gap-2">
              {quickPresets.map(preset => (
                <button
                  key={preset}
                  onClick={() => handleUnitsChange(preset)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    monthlyUnits === preset
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {preset} kWh ({calculateDomesticBillClient(preset).totalBill.toLocaleString()} LKR)
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live PUCSL Jan 2025 Bill Breakdown Card */}
        <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">PUCSL Jan 18, 2025 Schedule</span>
                <h3 className="text-xl font-black text-white mt-0.5">Estimated CEB Bill</h3>
              </div>
              <span className="text-xs font-semibold text-slate-400 font-mono">
                {monthlyUnits} Units
              </span>
            </div>

            <div className="my-5">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-amber-400">
                  LKR {billCalc.totalBill.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium block mt-1">
                Sub-category: <b className="text-slate-200">{billCalc.tier}</b>
              </span>
            </div>

            {/* Block Breakdown */}
            <div className="space-y-1.5 bg-slate-800/80 rounded-xl p-3 border border-slate-700 text-xs">
              <div className="flex justify-between text-[11px] text-slate-400 font-semibold pb-1 border-b border-slate-700/60">
                <span>Tariff Block</span>
                <span>Charge (LKR)</span>
              </div>
              {billCalc.breakdown.map((b, idx) => (
                <div key={idx} className="flex justify-between text-[11px]">
                  <span className="text-slate-300">{b.block} ({b.units}u @ {b.rate})</span>
                  <span className="font-mono text-slate-200">LKR {b.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between text-[11px] pt-1 border-t border-slate-700/60 font-semibold text-sky-400">
                <span>Fixed Monthly Utility Charge</span>
                <span className="font-mono">LKR {billCalc.fixedCharge.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-4 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                Units above 180 are charged at <b>52.00 LKR/kWh</b>. Installing rooftop solar eliminates these high-cost upper blocks first!
              </span>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              onClick={onBack}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={onNext}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 active:scale-95 transition-all"
            >
              Next: Roof Properties
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
