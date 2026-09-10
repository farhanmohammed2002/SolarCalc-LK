import React from 'react';
import { Sun, Zap, BatteryCharging, DollarSign, Clock, ShieldCheck, TreePine } from 'lucide-react';
import { CalculationResult } from '../../types/solar';

interface MetricCardsProps {
  result: CalculationResult;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ result }) => {
  const { system, generation, financials, scheme } = result;

  const cards = [
    {
      title: 'Recommended PV System',
      value: `${system.actual_capacity_kwp} kWp`,
      sub: `${system.panel_count} × ${system.panel.rated_power_w}W ${system.panel.manufacturer}`,
      badge: `${system.required_roof_area_sqm} m² Roof Area`,
      icon: Sun,
      color: 'amber'
    },
    {
      title: 'Estimated Annual Yield',
      value: `${generation.annual_kwh.toLocaleString()} kWh`,
      sub: `Avg ~${generation.average_monthly_kwh} kWh / month`,
      badge: `${result.solar_resource.annual_pvout_kwh_per_kwp} kWh/kWp/yr GSA`,
      icon: Zap,
      color: 'sky'
    },
    {
      title: 'Matched String Inverter',
      value: `${system.inverter.rated_ac_power_kw} kW AC`,
      sub: `${system.inverter.manufacturer} ${system.inverter.model}`,
      badge: `DC/AC Ratio: ${system.dc_ac_ratio} (${system.phase}-Phase)`,
      icon: BatteryCharging,
      color: 'indigo'
    },
    {
      title: 'Annual Net Economic Benefit',
      value: `LKR ${financials.annual_net_benefit_lkr.toLocaleString()}`,
      sub: `LKR ${scheme.net_monthly_benefit_lkr.toLocaleString()} / month`,
      badge: `${scheme.scheme_details.scheme_name}`,
      icon: DollarSign,
      color: 'emerald'
    },
    {
      title: 'Simple Payback Period',
      value: `${financials.simple_payback_years} Years`,
      sub: `Estimated Turnkey Cost: LKR ${financials.system_cost_lkr.toLocaleString()}`,
      badge: `${financials.roi_pct}% Lifetime ROI`,
      icon: Clock,
      color: 'purple'
    },
    {
      title: '20-Year Lifetime Net Return',
      value: `LKR ${(financials.twenty_year_savings_lkr / 1000000).toFixed(2)}M`,
      sub: `Net cash after 1% O&M & Yr-10 Inverter Reserve`,
      badge: `${financials.co2_avoided_tonnes_per_year} t CO2/yr (${financials.trees_planted_equivalent} Trees)`,
      icon: TreePine,
      color: 'teal'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {c.title}
                </span>
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {c.value}
              </div>
              <p className="text-xs text-slate-600 mt-1 font-medium line-clamp-1">
                {c.sub}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {c.badge}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
