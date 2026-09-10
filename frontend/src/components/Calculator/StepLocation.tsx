import React, { useState } from 'react';
import { MapPin, Sun, Compass, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { SRI_LANKA_DISTRICTS } from '../../utils/solarEngine';
import { DistrictLocation } from '../../types/solar';

interface StepLocationProps {
  selectedDistrict: string;
  onSelectDistrict: (district: DistrictLocation) => void;
  onNext: () => void;
}

export const StepLocation: React.FC<StepLocationProps> = ({
  selectedDistrict,
  onSelectDistrict,
  onNext
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const current = SRI_LANKA_DISTRICTS.find(d => d.name.toLowerCase() === selectedDistrict.toLowerCase()) || SRI_LANKA_DISTRICTS[0];

  const filtered = SRI_LANKA_DISTRICTS.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.province.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Step 1: Select Your Property Location
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          SolarCalc LK queries the official <b>Global Solar Atlas v2.0</b> 1-km raster grid to retrieve the precise specific yield and optimal tilt angle for your district.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* District Selector & List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by district name or province (e.g., Colombo, Kandy, Jaffna, Southern)..."
              className="w-full px-4 py-3 pl-10 rounded-xl bg-white border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 shadow-xs"
            />
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto pr-1">
            {filtered.map(d => {
              const isSelected = d.name.toLowerCase() === current.name.toLowerCase();
              return (
                <button
                  key={d.id}
                  onClick={() => onSelectDistrict(d)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{d.name}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{d.province} Prov.</span>
                  <div className="mt-2 text-[10px] font-semibold text-slate-600 flex items-center gap-1">
                    <Sun className="w-3 h-3 text-amber-500" />
                    <span>{d.pvout} kWh/kWp</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Location Card & Solar Resource Summary */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Active Location Data</span>
                <h3 className="text-xl font-black text-white mt-0.5">{current.name} District</h3>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800 border border-slate-700 text-slate-300">
                {current.province} Province
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 my-5">
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] font-semibold text-slate-400 block">Annual Specific Yield</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-amber-400">{current.pvout}</span>
                  <span className="text-[10px] text-slate-400 font-medium">kWh/kWp/yr</span>
                </div>
                <span className="text-[9px] text-emerald-400 flex items-center gap-1 mt-1">
                  <Sparkles className="w-2.5 h-2.5" /> High Tropical Potential
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] font-semibold text-slate-400 block">Optimal Roof Tilt</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-sky-400">{current.opta}°</span>
                  <span className="text-[10px] text-slate-400 font-medium">True South</span>
                </div>
                <span className="text-[9px] text-slate-400 flex items-center gap-1 mt-1">
                  <Compass className="w-2.5 h-2.5 text-sky-400" /> 180° Azimuth
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] font-semibold text-slate-400 block">Daily Global Horizontal (GHI)</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl font-black text-white">{current.ghi}</span>
                  <span className="text-[10px] text-slate-400 font-medium">kWh/m²/day</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] font-semibold text-slate-400 block">Coordinates</span>
                <div className="text-xs font-mono font-bold text-slate-300 mt-2">
                  {current.lat.toFixed(4)}°N<br/>
                  {current.lon.toFixed(4)}°E
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed italic">
              Verified from World Bank / ESMAP Global Solar Atlas v2.0 raster files embedded in SolarCalc LK.
            </p>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-800 flex justify-end">
            <button
              onClick={onNext}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              Continue to Consumption
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
