import React from 'react';
import { Cpu, CheckCircle2, AlertTriangle, ArrowUpRight, Maximize2, ShieldCheck } from 'lucide-react';
import { CalculationResult } from '../../types/solar';

interface ElectricalSpecsCardProps {
  result: CalculationResult;
}

export const ElectricalSpecsCard: React.FC<ElectricalSpecsCardProps> = ({ result }) => {
  const { system, inputs } = result;
  const isVerified = system.electrical_check.status === 'VERIFIED';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-900">Electrical & Physical Engineering Specifications</h3>
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
          isVerified ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
        }`}>
          {isVerified ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
          <span>{system.electrical_check.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[10px] text-slate-500 font-semibold block">DC / AC Sizing Ratio</span>
          <span className="text-base font-black text-slate-900 font-mono mt-0.5 block">{system.dc_ac_ratio}</span>
          <span className="text-[10px] text-slate-500">Design Range: 1.10 - 1.35</span>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[10px] text-slate-500 font-semibold block">String Layout</span>
          <span className="text-base font-black text-slate-900 font-mono mt-0.5 block">
            {system.num_strings} String × {system.panels_per_string} Panels
          </span>
          <span className="text-[10px] text-slate-500">{system.panel_count} Total Modules</span>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[10px] text-slate-500 font-semibold block">Max Cold String Voc (15°C)</span>
          <span className="text-base font-black text-slate-900 font-mono mt-0.5 block">{system.string_voc_max_v} V</span>
          <span className="text-[10px] text-slate-500">Limit: ≤ {system.inverter.mppt_voltage_max_v} V</span>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[10px] text-slate-500 font-semibold block">Min Hot String Vmp (65°C)</span>
          <span className="text-base font-black text-slate-900 font-mono mt-0.5 block">{system.string_vmp_min_v} V</span>
          <span className="text-[10px] text-slate-500">Limit: ≥ {system.inverter.mppt_voltage_min_v} V</span>
        </div>
      </div>

      {/* Roof Area Check */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <Maximize2 className="w-5 h-5 text-slate-600 shrink-0" />
          <div>
            <span className="font-bold text-slate-900 block">Required Rooftop Footprint: {system.required_roof_area_sqm} m² (~{(system.required_roof_area_sqm * 10.764).toFixed(0)} sq.ft)</span>
            <span className="text-[11px] text-slate-500">
              Includes 15% structural spacing for clamps, inter-row clearance, and walkways.
            </span>
          </div>
        </div>
        {inputs.roof_area_sqm && (
          <div className="text-right shrink-0">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              system.fits_roof ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {system.fits_roof ? `Fits Roof (${system.roof_utilization_pct}% Utilized)` : 'Exceeds Available Area'}
            </span>
          </div>
        )}
      </div>

      {/* Selected Hardware Visual Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-3">
          <img
            src="/images/solar panel.jpg"
            alt="Selected Solar Panel"
            className="w-14 h-14 object-contain rounded-lg bg-white p-1 border border-slate-100 shrink-0"
          />
          <div className="text-xs overflow-hidden">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Specified Module</span>
            <span className="font-bold text-slate-900 truncate block">{system.panel.manufacturer}</span>
            <span className="text-slate-600 text-[11px] block">{system.panel.rated_power_w}W • {system.panel.efficiency_pct}% eff</span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-3">
          <img
            src="/images/inverter 2.png"
            alt="Selected Solar Inverter"
            className="w-14 h-14 object-contain rounded-lg bg-white p-1 border border-slate-100 shrink-0"
          />
          <div className="text-xs overflow-hidden">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Matched Inverter</span>
            <span className="font-bold text-slate-900 truncate block">{system.inverter.manufacturer} {system.inverter.rated_ac_power_kw}kW</span>
            <span className="text-slate-600 text-[11px] block">{system.inverter.phase}-Phase • {system.inverter.max_efficiency_pct}% eff</span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-3">
          <img
            src="/images/solar inverter+energy meter.png"
            alt="Bi-Directional Meter & Switchgear"
            className="w-14 h-14 object-contain rounded-lg bg-white p-1 border border-slate-100 shrink-0"
          />
          <div className="text-xs overflow-hidden">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">CEB Net Metering</span>
            <span className="font-bold text-slate-900 truncate block">Bi-Directional Meter</span>
            <span className="text-slate-600 text-[11px] block">Import / Export Dual Reg.</span>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-slate-500 italic leading-relaxed">
        {system.electrical_check.details}
      </p>
    </div>
  );
};
