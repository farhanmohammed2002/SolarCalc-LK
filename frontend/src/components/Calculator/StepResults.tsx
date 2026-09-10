import React, { useState } from 'react';
import { Download, ArrowLeft, RefreshCw, Printer, FileText, CheckCircle2, ShieldCheck, Share2 } from 'lucide-react';
import { CalculationResult } from '../../types/solar';
import { MetricCards } from '../Dashboard/MetricCards';
import { MonthlyGenerationChart } from '../Dashboard/MonthlyGenerationChart';
import { CashFlowChart } from '../Dashboard/CashFlowChart';
import { ElectricalSpecsCard } from '../Dashboard/ElectricalSpecsCard';
import { TariffBreakdownTable } from '../Dashboard/TariffBreakdownTable';

interface StepResultsProps {
  result: CalculationResult;
  onModify: () => void;
}

export const StepResults: React.FC<StepResultsProps> = ({ result, onModify }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const response = await fetch('/api/download-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          district: result.inputs.district,
          latitude: result.inputs.latitude,
          longitude: result.inputs.longitude,
          monthly_units_kwh: result.inputs.monthly_units_kwh,
          target_offset_pct: result.inputs.target_offset_pct,
          scheme: result.inputs.scheme,
          roof_type: result.inputs.roof_type,
          roof_area_sqm: result.inputs.roof_area_sqm,
          azimuth_deg: result.inputs.azimuth_deg,
          tilt_deg: result.inputs.tilt_deg,
          panel_id: result.system.panel.id,
          custom_system_cost_lkr: result.financials.system_cost_lkr
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SolarCalc_LK_Proposal_${result.inputs.district}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        // Fallback to browser print
        window.print();
      }
    } catch (err) {
      console.warn('Backend unavailable, opening browser print dialog...');
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
              {result.inputs.district} Property Assessment
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Generated: {new Date().toLocaleDateString()}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Recommended Solar System: {result.system.actual_capacity_kwp} kWp
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Optimized for {result.inputs.monthly_units_kwh} kWh/mo consumption under PUCSL Jan 18, 2025 tariffs & {result.scheme.scheme_details.scheme_name}.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onModify}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Modify Specs
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm shadow-md flex items-center gap-2 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            {downloading ? 'Generating PDF...' : 'Download PDF Proposal'}
          </button>
        </div>
      </div>

      {/* 1. Executive Metric Cards */}
      <MetricCards result={result} />

      {/* 2. Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyGenerationChart
          monthlyGeneration={result.generation.monthly_kwh}
          monthlyLoad={result.inputs.monthly_units_kwh}
        />
        <CashFlowChart
          trajectory={result.financials.cash_flow_trajectory}
          paybackYears={result.financials.simple_payback_years}
        />
      </div>

      {/* 3. Electrical Specifications & Roof Check */}
      <ElectricalSpecsCard result={result} />

      {/* 4. Tariff Breakdown Table */}
      <TariffBreakdownTable result={result} />

      {/* 5. System Energy Flow & Grid Interconnection Architecture */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              Solar Energy Flow & Utility Interconnection Architecture
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Physical energy balance conforming to PUCSL {result.scheme.scheme_details.scheme_name} and CEB Net Metering standards.
            </p>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 self-start sm:self-auto">
            CEB RTSPV Standard
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Energy Flow Diagram */}
          <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 space-y-2">
            <span className="text-xs font-bold text-slate-800 block">
              1. Solar & Grid Energy Flow Balance
            </span>
            <div className="rounded-lg overflow-hidden bg-white border border-slate-200 p-2 flex items-center justify-center">
              <img
                src="/images/enegrgy flow diageram.png"
                alt="Solar Energy Flow Diagram"
                className="max-h-56 object-contain"
              />
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Solar electricity generated during daytime directly powers active home appliances. 
              Surplus units export through the bidirectional meter to CEB ({result.scheme.scheme_details.scheme_name === 'Net Accounting' ? '44.14 LKR/kWh credit' : '1:1 unit credit'}). 
              Nighttime deficit is supplied seamlessly from the utility grid.
            </p>
          </div>

          {/* Electrical Schematic */}
          <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 space-y-2">
            <span className="text-xs font-bold text-slate-800 block">
              2. Single-Line Electrical Protection Schematic
            </span>
            <div className="rounded-lg overflow-hidden bg-white border border-slate-200 p-2 flex items-center justify-center">
              <img
                src="/images/schematic pv.jpg"
                alt="Solar PV Electrical Single-Line Diagram"
                className="max-h-56 object-contain"
              />
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Includes DC surge arrestors (Type II SPD), DC isolation switches, string inverter with auto-islanding cutoff (&lt;2 seconds on grid failure), 
              AC circuit breaker, and CEB-calibrated bi-directional distribution meter.
            </p>
          </div>
        </div>
      </div>

      {/* 6. Traceability & Engineering Footnote */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-xs text-slate-600 space-y-2">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Full Technical Traceability Register:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px]">
          <div>
            <span className="text-slate-400 block font-medium">Electricity Tariff:</span>
            <span className="font-semibold text-slate-800">{result.traceability.tariff_document}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Solar Resource Dataset:</span>
            <span className="font-semibold text-slate-800">{result.traceability.solar_dataset}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">CEB Feed-In Tariff:</span>
            <span className="font-semibold text-slate-800">{result.traceability.solar_export_tariff}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Engineering Lead:</span>
            <span className="font-semibold text-slate-800">{result.traceability.developer}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
