import React, { useState } from 'react';
import { Compass, Sun, Filter, ArrowUpDown, Sparkles, MapPin, Info } from 'lucide-react';
import { SRI_LANKA_DISTRICTS } from '../utils/solarEngine';
import { DistrictLocation } from '../types/solar';

interface MapPageProps {
  onSelectDistrictForCalc?: (districtName: string) => void;
}

export const MapPage: React.FC<MapPageProps> = ({ onSelectDistrictForCalc }) => {
  const [selectedProvince, setSelectedProvince] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'PVOUT' | 'GHI' | 'NAME'>('PVOUT');
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictLocation>(SRI_LANKA_DISTRICTS[0]);

  const provinces = ['ALL', 'Western', 'Central', 'Southern', 'Northern', 'Eastern', 'North Western', 'North Central', 'Uva', 'Sabaragamuwa'];

  let districts = SRI_LANKA_DISTRICTS.filter((d: DistrictLocation) => 
    selectedProvince === 'ALL' || d.province === selectedProvince
  );

  if (sortBy === 'PVOUT') {
    districts = [...districts].sort((a, b) => b.pvout - a.pvout);
  } else if (sortBy === 'GHI') {
    districts = [...districts].sort((a, b) => b.ghi - a.ghi);
  } else {
    districts = [...districts].sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold mb-2">
          <Compass className="w-3.5 h-3.5 text-amber-600" />
          <span>World Bank / ESMAP Global Solar Atlas v2.0 Dataset</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Sri Lanka Solar Resource & Photovoltaic Potential Map
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
          Explore annual specific PV electricity yield (Y_PV in kWh/kWp/year), daily Global Horizontal Irradiation (GHI), and optimal tilt angles across all 25 Sri Lankan administrative districts derived from 30-arc-second (~1 km) satellite raster models.
        </p>
      </div>

      {/* Grid Layout: Visual Map & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Province & Solar Zones Card */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-slate-900">Sri Lanka Solar Radiation Zones</h3>
            {/* Province Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedProvince}
                onChange={e => setSelectedProvince(e.target.value)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700"
              >
                {provinces.map(p => (
                  <option key={p} value={p}>{p === 'ALL' ? 'All Provinces' : `${p} Province`}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Interactive District Cards Cloud */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
            {districts.map((d: DistrictLocation) => {
              const isSelected = d.id === selectedDistrict.id;
              // Color badge based on PVOUT
              let zoneColor = 'text-amber-600 bg-amber-50 border-amber-200';
              if (d.pvout >= 1600) zoneColor = 'text-rose-600 bg-rose-50 border-rose-200';
              else if (d.pvout < 1450) zoneColor = 'text-sky-600 bg-sky-50 border-sky-200';

              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDistrict(d)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-amber-400'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{d.name}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${isSelected ? 'bg-slate-800 text-amber-300 border-slate-700' : zoneColor}`}>
                      {d.pvout}
                    </span>
                  </div>
                  <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                    {d.province} Prov.
                  </span>
                  <div className="mt-2 text-[10px] flex items-center justify-between font-mono">
                    <span className={isSelected ? 'text-slate-300' : 'text-slate-500'}>OPTA: {d.opta}°</span>
                    <span className={isSelected ? 'text-amber-400' : 'text-amber-600'}>{d.ghi} GHI</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-slate-800 text-[11px] block">Solar Potential Classification:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
                <span><b>High Dry Zone (≥1600):</b> Mannar, Hambantota, Batticaloa</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                <span><b>Coastal Plains (1500–1590):</b> Colombo, Jaffna, Galle</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-sky-500 shrink-0" />
                <span><b>Central Highlands (&lt;1500):</b> Kandy, Nuwara Eliya, Matale</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected District Deep-Dive Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Spatial Detail</span>
                <h2 className="text-2xl font-black text-white mt-0.5">{selectedDistrict.name} District</h2>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-semibold">
                {selectedDistrict.province} Province
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 my-5">
              <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 font-semibold block">Specific PV Yield (Y_PV)</span>
                <span className="text-2xl font-black text-amber-400 mt-1 block font-mono">{selectedDistrict.pvout}</span>
                <span className="text-[10px] text-slate-400">kWh/kWp/year</span>
              </div>

              <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 font-semibold block">Optimum Module Tilt</span>
                <span className="text-2xl font-black text-sky-400 mt-1 block font-mono">{selectedDistrict.opta}°</span>
                <span className="text-[10px] text-slate-400">Facing True South</span>
              </div>

              <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 font-semibold block">Daily Solar Radiation</span>
                <span className="text-xl font-black text-white mt-1 block font-mono">{selectedDistrict.ghi}</span>
                <span className="text-[10px] text-slate-400">kWh/m²/day GHI</span>
              </div>

              <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 font-semibold block">District Coordinates</span>
                <span className="text-xs font-mono font-bold text-slate-200 mt-1.5 block">
                  {selectedDistrict.lat.toFixed(4)}°N<br/>
                  {selectedDistrict.lon.toFixed(4)}°E
                </span>
              </div>
            </div>

            {/* Monthly Profile Mini-Table */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-300 block">Monthly Yield Distribution (kWh/kWp):</span>
              <div className="grid grid-cols-6 gap-1.5 text-center text-[10px]">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, idx) => (
                  <div key={m} className="bg-slate-800 p-1.5 rounded border border-slate-700/60">
                    <span className="text-slate-400 block">{m}</span>
                    <span className="font-mono font-bold text-amber-300">{selectedDistrict.monthly_pvout[idx]}</span>
                  </div>
                ))}
                {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, idx) => (
                  <div key={m} className="bg-slate-800 p-1.5 rounded border border-slate-700/60">
                    <span className="text-slate-400 block">{m}</span>
                    <span className="font-mono font-bold text-amber-300">{selectedDistrict.monthly_pvout[idx + 6]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => onSelectDistrictForCalc && onSelectDistrictForCalc(selectedDistrict.name)}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Sun className="w-4 h-4" />
              Size Solar System for {selectedDistrict.name}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
