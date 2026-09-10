import React from 'react';
import { BookOpen, Calculator, ShieldCheck, Zap, Compass, Cpu, DollarSign, Layers, Award } from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  const sections = [
    {
      num: '01',
      title: 'Solar Resource Assessment & Spatial Yield',
      icon: Compass,
      formula: 'Y_PV = GIS_Query(GSA_Raster, lat, lon) [kWh/kWp/year]',
      content: (
        <>
          <p className="text-slate-600 text-xs leading-relaxed">
            SolarCalc LK avoids using crude nationwide averages. Instead, it queries the World Bank / ESMAP <b>Global Solar Atlas v2.0</b> 30-arc-second (~1 km) ASCII grid rasters (<code>PVOUT.asc</code>, <code>GHI.asc</code>, and <code>OPTA.asc</code>). This accounts for distinct Sri Lankan microclimatic variations, ranging from ~1350 kWh/kWp/yr in the misty central hills of Nuwara Eliya to ~1650 kWh/kWp/yr along the arid coastal belt of Mannar and Hambantota.
          </p>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mt-2 font-mono text-[11px] text-slate-800">
            Yield range across Sri Lanka: <b>1,410 to 1,650 kWh/kWp/year</b> | Optimum Tilt: <b>7° to 10° True South</b>
          </div>
        </>
      )
    },
    {
      num: '02',
      title: 'Target Capacity & Photovoltaic Sizing',
      icon: Calculator,
      formula: 'P_req = (E_load_month * 12 * f_offset) / (Y_PV * eta_site) [kWp]',
      content: (
        <>
          <p className="text-slate-600 text-xs leading-relaxed">
            The target energy capacity is calculated by multiplying average monthly household consumption by 12 and the user's targeted offset ratio (e.g. 100% to fully neutralize net annual import), divided by the local specific annual PV yield and orientation correction factor eta_site.
          </p>
          <p className="text-slate-600 text-xs leading-relaxed mt-1">
            eta_site models the cosine deviation from optimal True South azimuth (180°) and local optimum tilt (OPTA).
          </p>
        </>
      )
    },
    {
      num: '03',
      title: 'Discrete PV Module Selection & Array Footprint',
      icon: Cpu,
      formula: 'N_panels = ceil((P_req * 1000) / P_panel_STC), P_actual = (N_panels * P_panel_STC) / 1000',
      content: (
        <>
          <p className="text-slate-600 text-xs leading-relaxed">
            Theoretical fractional capacities cannot be installed. SolarCalc LK rounds up to the nearest integer count of commercial tier-1 modules (e.g., EGing 415W, SunPower 415W, BiMAX 430W). Required roof footprint is computed from exact module datasheet dimensions with a 15% structural spacing multiplier for clamps, inter-row clearance, and walkways.
          </p>
        </>
      )
    },
    {
      num: '04',
      title: 'Inverter Matching & String Voltage Compatibility',
      icon: Layers,
      formula: '1.10 <= (P_DC / P_AC) <= 1.35, Voc(15°C) <= Vmax_inv, Vmp(65°C) >= Vmin_inv',
      content: (
        <>
          <p className="text-slate-600 text-xs leading-relaxed">
            Inverters (Sungrow, GoodWe, SOFAR, Solis) are matched to ensure optimal DC-to-AC oversizing (1.10 to 1.35), preventing excessive clipping while maximizing low-irradiance morning/evening energy capture. Single-phase inverters are selected for systems &lt;= 5 kWp; three-phase inverters for larger systems.
          </p>
          <p className="text-slate-600 text-xs leading-relaxed mt-1">
            String voltage safety is evaluated under temperature extremes: cold morning open-circuit voltage Voc at 15°C must not exceed the maximum inverter input voltage, and hot roof maximum power point voltage Vmp at 65°C must stay comfortably above the lower MPPT tracking boundary.
          </p>
        </>
      )
    },
    {
      num: '05',
      title: 'Balance of System (BOS) Losses Derating',
      icon: ShieldCheck,
      formula: 'Performance Ratio (PR) ~ 82% to 85%',
      content: (
        <>
          <p className="text-slate-600 text-xs leading-relaxed">
            The calculation explicitly accounts for real tropical loss mechanisms without arbitrary inflation:
          </p>
          <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 mt-1 pl-2">
            <li><b>Inverter Euro-efficiency:</b> 97.5% - 98.4% based on datasheet curves.</li>
            <li><b>DC Ohmic Losses:</b> 1.5% (standard 4 mm² / 6 mm² solar cable sizing under PUCSL guidelines).</li>
            <li><b>AC Wiring Losses:</b> 1.0% between inverter and utility bidirectional distribution meter.</li>
            <li><b>Module Mismatch:</b> 1.5% across series strings.</li>
            <li><b>Soiling & Monsoon Wash:</b> 2.5% annual average (self-cleaning during South-West and North-East monsoons).</li>
          </ul>
        </>
      )
    },
    {
      num: '06',
      title: 'PUCSL January 18, 2025 Domestic Tariff Engine',
      icon: Zap,
      formula: 'Total Bill = Energy Charge + Fixed Charge(Net Units)',
      content: (
        <>
          <p className="text-slate-600 text-xs leading-relaxed">
            Adheres strictly to the PUCSL Final Decision Document on Electricity Tariff Revision effective January 18, 2025:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 block text-[11px]">Lifeline Tier (&lt;= 60 kWh/mo):</span>
              <span className="text-[11px] text-slate-600 block mt-1">
                • 0–30 kWh: <b>4.00 LKR/kWh</b> (Fixed: 75 LKR)<br/>
                • 31–60 kWh: <b>6.00 LKR/kWh</b> (Fixed: 200 LKR)
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 block text-[11px]">General Tier (&gt; 60 kWh/mo):</span>
              <span className="text-[11px] text-slate-600 block mt-1">
                • 0–60 kWh: <b>11.00 LKR</b> | 61–90 kWh: <b>14.00 LKR</b><br/>
                • 91–120 kWh: <b>20.00 LKR</b> | 121–180 kWh: <b>33.00 LKR</b><br/>
                • &gt;180 kWh: <b>52.00 LKR</b> (Fixed: up to 2,000 LKR)
              </span>
            </div>
          </div>
          <div className="mt-2 p-2 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900">
            <b>PUCSL Annex 2, Condition 3:</b> Fixed charges for solar prosumers are calculated based on net monthly imported units, protecting solar owners from high fixed charges when generating their own electricity.
          </div>
        </>
      )
    },
    {
      num: '07',
      title: 'CEB Rooftop Solar Schemes & Feed-In Settlement',
      icon: Award,
      formula: 'Export Rate: 44.14 LKR/kWh for <= 20 kW, 43.02 LKR/kWh for 20-100 kW',
      content: (
        <>
          <p className="text-slate-600 text-xs leading-relaxed">
            The model incorporates all 3 active CEB / LECO arrangements:
          </p>
          <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 mt-1 pl-2">
            <li><b>Net Accounting:</b> Solar offsets retail bill. Surplus generation in any billing month is purchased by CEB in cash at <b>44.14 LKR/kWh</b>.</li>
            <li><b>Net Metering:</b> Energy banking on a 1:1 kWh basis. Surplus units roll over into future months as kilowatt-hour credits (no cash payment).</li>
            <li><b>Net Plus:</b> 100% gross generation exported and paid at 44.14 LKR/kWh, while total household consumption is billed separately.</li>
          </ul>
        </>
      )
    },
    {
      num: '08',
      title: '20-Year Economic Life-Cycle & Simple Payback',
      icon: DollarSign,
      formula: 'Payback = Initial Turnkey CAPEX (LKR) / Year 1 Net Economic Benefit (LKR/yr)',
      content: (
        <>
          <p className="text-slate-600 text-xs leading-relaxed">
            Evaluates turnkey capital expenditures based on current Q1 2025 Sri Lankan EPC benchmarks (~260,000 to 320,000 LKR/kWp installed). The 20-year cumulative cash flow accounts for:
          </p>
          <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 mt-1 pl-2">
            <li><b>Module Degradation:</b> 0.55% linear capacity reduction per year (guaranteed 84.8%–87.4% retained output at Year 25).</li>
            <li><b>Annual O&M:</b> 1.0% of initial CAPEX for periodic panel washing and electrical inspection.</li>
            <li><b>Inverter Replacement Reserve:</b> 20% of initial CAPEX allocated at Year 10.</li>
          </ul>
        </>
      )
    },
    {
      num: '09',
      title: 'Decarbonization & Grid Emission Offsets',
      icon: BookOpen,
      formula: 'CO2 Avoided = (Annual kWh * 0.62 kg CO2/kWh) / 1000 [tonnes/year]',
      content: (
        <>
          <p className="text-slate-600 text-xs leading-relaxed">
            Quantifies environmental impact using the official CEB Sri Lanka Grid Emission Factor of <b>0.62 kg CO2 per kWh</b> of displaced thermal generation. Equivalent mature tree absorption is estimated at ~21.8 kg CO2 per urban tree per year.
          </p>
        </>
      )
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold mb-2">
          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
          <span>Engineering Transparency</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Calculation Methodology & Technical Formulations
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          A comprehensive breakdown of the physical equations, regulatory algorithms, loss models, and financial life-cycle mechanisms powering SolarCalc LK V1.0.
        </p>
      </div>

      {/* Primary Engineering Schematic Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-500" />
              Complete Grid-Connected Rooftop PV Architecture
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified electrical flow: Solar Modules → DC Disconnect → String Inverter → AC Breaker → CEB Net Meter → Utility Grid
            </p>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 self-start sm:self-auto">
            SLSEA Technical Standard
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-2 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-2 flex items-center justify-center">
            <img
              src="/images/solar pv diagram.jpg"
              alt="Grid-Connected Solar PV Single-Line System Architecture"
              className="w-full max-h-72 object-contain"
            />
          </div>
          <div className="space-y-3 text-xs text-slate-600">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="font-bold text-slate-900 block text-[11px]">1. Photovoltaic Array</span>
              <p className="text-[11px] text-slate-500">Tier-1 monocrystalline half-cell modules wired in series strings to achieve optimal MPPT voltage.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="font-bold text-slate-900 block text-[11px]">2. Grid-Tie Inverter</span>
              <p className="text-[11px] text-slate-500">Pure sine wave DC to AC power conversion with automatic anti-islanding protection under IEC 62116.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="font-bold text-slate-900 block text-[11px]">3. Bi-Directional Net Meter</span>
              <p className="text-[11px] text-slate-500">Dual-channel CEB meter recording daytime export units and nighttime grid import units.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {sections.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.num} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 font-mono font-black text-sm flex items-center justify-center">
                    {s.num}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
                </div>
                <Icon className="w-5 h-5 text-slate-400" />
              </div>

              {/* Mathematical Formula Card */}
              <div className="bg-slate-900 text-amber-300 p-3.5 rounded-xl font-mono text-xs sm:text-sm text-center shadow-inner overflow-x-auto">
                {s.formula}
              </div>

              <div className="space-y-2">
                {s.content}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
