import React, { useState } from 'react';
import { Home, Compass, Layers, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface StepPropertyProps {
  roofType: 'ASBESTOS' | 'CLAY_TILE' | 'CORRUGATED_ZINC' | 'CONCRETE_SLAB';
  setRoofType: (type: any) => void;
  roofAreaSqm: number | undefined;
  setRoofAreaSqm: (area: number | undefined) => void;
  azimuthDeg: number;
  setAzimuthDeg: (deg: number) => void;
  tiltDeg: number;
  setTiltDeg: (deg: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepProperty: React.FC<StepPropertyProps> = ({
  roofType,
  setRoofType,
  roofAreaSqm,
  setRoofAreaSqm,
  azimuthDeg,
  setAzimuthDeg,
  tiltDeg,
  setTiltDeg,
  onNext,
  onBack
}) => {
  const [areaUnit, setAreaUnit] = useState<'SQM' | 'SQFT'>('SQM');

  const roofTypes = [
    {
      id: 'ASBESTOS',
      name: 'Asbestos Corrugated Sheet',
      desc: 'Extremely widespread in Sri Lanka. Uses hanger bolts directly into timber/steel purlins.',
      derate: '1.00 (Standard)'
    },
    {
      id: 'CLAY_TILE',
      name: 'Clay Tile (Calicut / Sinhala)',
      desc: 'Traditional Sri Lankan tiled roof. Requires stainless steel tile hooks under rafters.',
      derate: '1.00 (Standard)'
    },
    {
      id: 'CORRUGATED_ZINC',
      name: 'Zinc-Alum / Metal Sheet',
      desc: 'Modern trapezoidal or standing seam sheet. Fast clamp mounting without roof penetration.',
      derate: '1.00 (Standard)'
    },
    {
      id: 'CONCRETE_SLAB',
      name: 'Flat Concrete Slab',
      desc: 'Rooftop slab. Requires aluminum A-frame or ballasted concrete blocks angled at 10° South.',
      derate: '1.00 (Adjustable)'
    }
  ];

  const handleAreaChange = (val: number) => {
    if (areaUnit === 'SQFT') {
      // Convert sqft to sqm
      setRoofAreaSqm(val > 0 ? Math.round(val * 0.092903 * 10) / 10 : undefined);
    } else {
      setRoofAreaSqm(val > 0 ? val : undefined);
    }
  };

  const displayedArea = areaUnit === 'SQFT' && roofAreaSqm
    ? Math.round(roofAreaSqm / 0.092903)
    : roofAreaSqm || '';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Step 3: Property & Rooftop Characteristics
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Provide structural parameters to evaluate physical mounting feasibility and tilt orientation derate factors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Roof Type Selection */}
        <div className="lg:col-span-7 space-y-4">
          <label className="text-xs font-bold text-slate-700 block">Select Roof Covering Type:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {roofTypes.map(rt => {
              const isSelected = roofType === rt.id;
              return (
                <button
                  key={rt.id}
                  onClick={() => setRoofType(rt.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{rt.name}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{rt.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Roof Area (Optional) */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2 mt-4 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Available Roof Area <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="flex rounded-md bg-slate-100 p-0.5 text-[10px] font-bold">
                <button
                  onClick={() => setAreaUnit('SQM')}
                  className={`px-2 py-0.5 rounded ${areaUnit === 'SQM' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                >
                  m²
                </button>
                <button
                  onClick={() => setAreaUnit('SQFT')}
                  className={`px-2 py-0.5 rounded ${areaUnit === 'SQFT' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                >
                  sq.ft
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                value={displayedArea}
                onChange={e => handleAreaChange(parseFloat(e.target.value) || 0)}
                placeholder={areaUnit === 'SQM' ? 'e.g. 45 m²' : 'e.g. 480 sq.ft'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500/50"
              />
              <span className="text-xs font-semibold text-slate-500 shrink-0">
                {areaUnit === 'SQM' ? 'm²' : 'sq.ft'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Leave blank if unsure. A typical 3 kWp residential system requires approximately 16–20 m² of unobstructed roof.
            </p>
          </div>

          {/* Visual Reference Diagrams */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-500" />
                Sri Lankan Roof Cladding & Mounting Reference
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">Technical Guide</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                <img
                  src="/images/roof type.png"
                  alt="Sri Lankan Roof Types (Tile, Asbestos, Zinc-Alum, Slab)"
                  className="w-full h-32 object-contain p-1"
                />
                <p className="text-[10px] text-center text-slate-500 py-1 border-t border-slate-100 bg-white font-medium">
                  Roof Cladding Materials
                </p>
              </div>
              <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                <img
                  src="/images/panel mounting.png"
                  alt="Aluminum Rail and Clamp Mounting Detail"
                  className="w-full h-32 object-contain p-1"
                />
                <p className="text-[10px] text-center text-slate-500 py-1 border-t border-slate-100 bg-white font-medium">
                  Aluminum Rail Structural Anchorage
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Orientation & Tilt Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Compass className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">Array Orientation & Roof Pitch</h3>
            </div>

            {/* Azimuth */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Azimuth Orientation:</span>
                <span className="font-mono text-amber-600 font-bold">
                  {azimuthDeg}° {azimuthDeg === 180 ? '(True South - Optimal)' : azimuthDeg === 90 ? '(East)' : azimuthDeg === 270 ? '(West)' : azimuthDeg === 0 ? '(North)' : ''}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="15"
                value={azimuthDeg}
                onChange={e => setAzimuthDeg(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>North (0°)</span>
                <span>East (90°)</span>
                <span className="text-amber-600 font-bold">South (180°)</span>
                <span>West (270°)</span>
                <span>North (360°)</span>
              </div>
            </div>

            {/* Tilt */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Roof Pitch / Tilt Angle:</span>
                <span className="font-mono text-amber-600 font-bold">{tiltDeg}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="45"
                step="1"
                value={tiltDeg}
                onChange={e => setTiltDeg(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>Flat (0°)</span>
                <span className="text-amber-600 font-bold">Sri Lanka Optimal (~9° - 10°)</span>
                <span>Steep (45°)</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 leading-relaxed">
              💡 <b>Engineer's Note:</b> Sri Lanka sits near the equator (6°N–10°N). While 10° South gives optimal self-cleaning and maximum annual irradiation, East/West roofs still capture over 92% of peak generation.
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
              onClick={onNext}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 active:scale-95 transition-all"
            >
              Next: Solar System & Scheme
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
