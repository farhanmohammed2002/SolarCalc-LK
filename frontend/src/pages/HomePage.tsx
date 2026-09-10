import React from 'react';
import { Sun, Zap, ShieldCheck, TrendingUp, Calculator, Compass, ArrowRight, CheckCircle, FileText, BarChart3, TreePine } from 'lucide-react';

interface HomePageProps {
  onStartCalculator: () => void;
  setActiveTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStartCalculator, setActiveTab }) => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white p-6 sm:p-10 lg:p-12 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>PUCSL January 18, 2025 Tariff Revision & CEB RTSPV Compliant</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Sri Lanka's Data-Driven <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">Rooftop Solar PV</span> Planning Platform
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
              Eliminate installer guesswork. SolarCalc LK combines high-resolution <b>Global Solar Atlas 1-km GIS data</b>, 
              verified <b>PUCSL domestic electricity tariffs</b>, and authentic equipment datasheets to calculate 
              precise sizing, 12-month solar yields, net export cash flows, and payback breakeven.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onStartCalculator}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <Calculator className="w-4 h-4" />
                Start Free Solar Assessment
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('map')}
                className="px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-sky-400" />
                Explore Sri Lanka Solar Map
              </button>
            </div>

            {/* Key Facts Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80 text-xs text-slate-300">
              <div>
                <span className="text-slate-500 block text-[10px] font-semibold">CEB Feed-in Tariff</span>
                <span className="font-bold text-amber-400 font-mono">44.14 LKR / kWh</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-semibold">Avoided Peak Tariff</span>
                <span className="font-bold text-sky-400 font-mono">52.00 LKR / kWh</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-semibold">Average Payback</span>
                <span className="font-bold text-emerald-400 font-mono">3.0 - 4.2 Years</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-semibold">GSA Resolution</span>
                <span className="font-bold text-white font-mono">30-arc-sec (~1km)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Real-World Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl group">
              <img
                src="/images/mdern huse roof top.jpg"
                alt="Modern Sri Lankan Rooftop Solar PV Installation"
                className="w-full h-72 sm:h-84 object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                    Verified Field Architecture
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-slate-200 text-[10px] font-bold border border-slate-700">
                    Net Accounting / CEB
                  </span>
                </div>
                <p className="text-xs font-bold text-white leading-tight">
                  High-efficiency mono half-cell PV array on Sri Lankan residential pitched roof
                </p>
                <p className="text-[11px] text-slate-300">
                  Zero export wastage • Optimal 10° True South orientation
                </p>
              </div>
            </div>

            {/* Floating Mini Badge */}
            <div className="hidden sm:flex items-center gap-3 absolute -bottom-4 -left-4 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-3 shadow-xl text-xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <p className="font-bold text-white text-[11px]">Condition 3 Protection</p>
                <p className="text-[10px] text-slate-400">Fixed charges billed strictly on net units</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Highlights Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Engineered for Sri Lankan Electricity Realities
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Built from scratch to navigate the latest PUCSL regulatory decisions and CEB grid policies with transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">PUCSL Jan 2025 Tariff Model</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Implements the January 18, 2025 tariff revision. Calculates exact block savings across the 0-60 kWh lifeline bracket and the tiered &gt;60 kWh brackets. Crucially, implements <b>Condition 3</b> ensuring prosumer fixed charges are assessed on net imports.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Global Solar Atlas GIS Data</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No generic flat approximations. Queries actual 1-km World Bank satellite rasters covering all 25 Sri Lankan districts, accounting for microclimates from the dry northern plains (Jaffna 1580 kWh/kWp) to the central highlands (Kandy 1470 kWh/kWp).
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Tri-Scheme Settlement Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Compare <b>Net Accounting</b> (cash payouts for surplus generation at 44.14 LKR/kWh), <b>Net Metering</b> (1:1 kWh energy banking), and <b>Net Plus</b> (gross export) to maximize your long-term return on investment.
            </p>
          </div>
        </div>
      </section>

      {/* Visual Hardware & System Architecture Gallery */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold mb-2">
              <Sun className="w-3.5 h-3.5 text-amber-600" />
              <span>Real Equipment & Sri Lankan Installations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Rooftop Solar PV Hardware & System Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Field-proven components and verified electrical configurations modeled within SolarCalc LK V1.0.
            </p>
          </div>
          <button
            onClick={onStartCalculator}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
          >
            Design for Your Roof <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Residential Solar on Home */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between">
            <div className="relative h-48 overflow-hidden bg-slate-100">
              <img
                src="/images/Solar on Home.jpg"
                alt="Residential Rooftop Solar Installation in Sri Lanka"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                Residential Rooftop
              </span>
            </div>
            <div className="p-5 space-y-2 flex-1">
              <h3 className="font-bold text-sm text-slate-900">Residential Pitched Roof Array</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Standard single-phase 3 kW to 5 kW domestic installation engineered to offset 250 to 500 kWh/month under the <b>PUCSL Jan 2025</b> tariff schedule.
              </p>
            </div>
            <div className="px-5 pb-4 pt-0 border-t border-slate-100 mt-auto text-[11px] font-semibold text-amber-700 flex items-center justify-between">
              <span>Typical Capacity: 3.3 – 5.0 kWp</span>
              <span>Payback: ~3.5 Years</span>
            </div>
          </div>

          {/* Card 2: Commercial / Multi-Phase */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between">
            <div className="relative h-48 overflow-hidden bg-slate-100">
              <img
                src="/images/solar on shop top.jpg"
                alt="Commercial and Retail Rooftop Solar Installation"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                Commercial & Mixed-Use
              </span>
            </div>
            <div className="p-5 space-y-2 flex-1">
              <h3 className="font-bold text-sm text-slate-900">Commercial & Workshop Rooftop</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Higher density three-phase arrays utilizing 400W–480W commercial modules, feeding surplus generation to the grid under CEB Net Accounting (44.14 LKR/kWh).
              </p>
            </div>
            <div className="px-5 pb-4 pt-0 border-t border-slate-100 mt-auto text-[11px] font-semibold text-sky-700 flex items-center justify-between">
              <span>Typical Capacity: 10 – 20 kWp</span>
              <span>Three-Phase 400V</span>
            </div>
          </div>

          {/* Card 3: Inverter & Energy Meter */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between">
            <div className="relative h-48 overflow-hidden bg-slate-50 flex items-center justify-center p-2">
              <img
                src="/images/solar inverter+energy meter.png"
                alt="Grid-Tie Solar Inverter and CEB Bi-Directional Energy Meter"
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                Power Conversion & Metering
              </span>
            </div>
            <div className="p-5 space-y-2 flex-1">
              <h3 className="font-bold text-sm text-slate-900">Grid Inverter & Two-Way Meter</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dual MPPT string inverters with &gt;98% conversion efficiency linked directly with CEB/LECO bi-directional net meters recording import and export channels.
              </p>
            </div>
            <div className="px-5 pb-4 pt-0 border-t border-slate-100 mt-auto text-[11px] font-semibold text-emerald-700 flex items-center justify-between">
              <span>Euro Efficiency: 97.7%</span>
              <span>Dual MPPT Tracker</span>
            </div>
          </div>

          {/* Card 4: Precision Mounting Structure */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between">
            <div className="relative h-48 overflow-hidden bg-slate-50 flex items-center justify-center p-3">
              <img
                src="/images/panel mounting.png"
                alt="Solar PV Mounting Rails and Clamps for Sri Lankan Roofs"
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                Mounting Engineering
              </span>
            </div>
            <div className="p-5 space-y-2 flex-1">
              <h3 className="font-bold text-sm text-slate-900">Anodized Aluminum Mounting Rails</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Marine-grade AL6005-T5 extruded rails and SUS304 stainless fasteners tailored for coastal humidity, rust resistance, and high monsoon wind shear.
              </p>
            </div>
            <div className="px-5 pb-4 pt-0 border-t border-slate-100 mt-auto text-[11px] font-semibold text-slate-700 flex items-center justify-between">
              <span>Wind Load: Up to 140 km/h</span>
              <span>Corrosion Proof</span>
            </div>
          </div>

          {/* Card 5: Complete Electrical Schematic */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between">
            <div className="relative h-48 overflow-hidden bg-slate-50 flex items-center justify-center p-2">
              <img
                src="/images/schematic pv.jpg"
                alt="Grid-Connected Solar PV Single-Line Electrical Schematic"
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                Electrical Single-Line
              </span>
            </div>
            <div className="p-5 space-y-2 flex-1">
              <h3 className="font-bold text-sm text-slate-900">Grid Interconnection Architecture</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Standard single-line schematic featuring DC surge protection devices (SPD), DC circuit breakers, AC isolators, anti-islanding relays, and utility cutouts.
              </p>
            </div>
            <div className="px-5 pb-4 pt-0 border-t border-slate-100 mt-auto text-[11px] font-semibold text-purple-700 flex items-center justify-between">
              <span>SLSEA Standard</span>
              <span>Anti-Islanding Compliant</span>
            </div>
          </div>

          {/* Card 6: Battery Energy Storage Ready */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between">
            <div className="relative h-48 overflow-hidden bg-slate-50 flex items-center justify-center p-2">
              <img
                src="/images/battery for solar.png"
                alt="Lithium Iron Phosphate Battery Energy Storage for Hybrid Solar Systems"
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black uppercase">
                Future / Hybrid Ready
              </span>
            </div>
            <div className="p-5 space-y-2 flex-1">
              <h3 className="font-bold text-sm text-slate-900">Hybrid LiFePO4 Energy Storage</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Optional low-voltage or high-voltage lithium battery storage for nighttime self-consumption and resilient power continuity during national grid outages.
              </p>
            </div>
            <div className="px-5 pb-4 pt-0 border-t border-slate-100 mt-auto text-[11px] font-semibold text-amber-700 flex items-center justify-between">
              <span>Chemistry: LiFePO4</span>
              <span>6,000+ Cycles @ 90% DoD</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Step Architecture Flow */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="max-w-2xl">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">How SolarCalc LK Works</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight">
            A Transparent 5-Step Engineering Assessment
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Every step is documented, physically grounded, and fully traceable.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {[
            { step: '01', title: 'Location Lookup', desc: 'Queries 1-km GSA raster for local PVOUT, GHI, and optimum tilt.' },
            { step: '02', title: 'Consumption Audit', desc: 'Parses monthly units or inverse-calculates units from your CEB bill.' },
            { step: '03', title: 'Roof Verification', desc: 'Checks roof covering type, available area, orientation, and tilt derating.' },
            { step: '04', title: 'Component Sizing', desc: 'Selects integer panels, matches string inverter, and verifies MPPT window.' },
            { step: '05', title: 'Payback & Report', desc: 'Simulates 20-year cash flows, PUCSL bill savings, and exports PDF proposal.' },
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 space-y-2">
              <span className="text-amber-400 font-mono font-black text-xl">{item.step}</span>
              <h4 className="font-bold text-xs text-white">{item.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="pt-4 flex justify-center">
          <button
            onClick={onStartCalculator}
            className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-md transition-all active:scale-95"
          >
            Launch Calculator Now
          </button>
        </div>
      </section>

      {/* Academic Attribution Card */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs flex flex-col md:flex-row items-center gap-6">
        <img
          src="/images/farhan.jpeg"
          alt="Farhan Mohammad"
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover object-top border-2 border-amber-500 shadow-md shrink-0"
          onError={(e: any) => { e.target.style.display = 'none'; }}
        />
        <div className="space-y-2 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="font-black text-lg text-slate-900">Farhan Mohammad</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
              University of Jaffna • E23 Batch
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
            SolarCalc LK V1.0 was designed and developed by Farhan Mohammad, an Electrical & Electronic Engineering undergraduate at the Faculty of Engineering, University of Jaffna. The platform aims to bridge the information gap for Sri Lankan households seeking independent, data-driven rooftop solar planning.
          </p>
          <div className="pt-1">
            <button
              onClick={() => setActiveTab('about')}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1"
            >
              Read Full Developer Profile & Academic Background <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
