import React from 'react';
import { Database, ExternalLink, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

export const SourcesPage: React.FC = () => {
  const sources = [
    {
      category: 'Electricity Tariffs',
      title: 'Final Decision Document on Electricity Tariff Revision January 2025',
      authority: 'Public Utilities Commission of Sri Lanka (PUCSL)',
      effectiveDate: 'January 18, 2025',
      url: 'https://www.pucsl.gov.lk',
      docFile: 'Final-Decision-Document-Electricity-Tariff-Revision-January-2025.pdf',
      notes: 'Authoritative tariff schedule defining domestic consumption brackets (0-30, 31-60, 61-90, 91-120, 121-180, >180), energy rates, fixed charges, and Condition 3 protecting solar prosumers.'
    },
    {
      category: 'Rooftop Solar Tariffs',
      title: 'Tariff Announcement for Rooftop Solar PV Systems (RTSPV)',
      authority: 'Ceylon Electricity Board (CEB)',
      effectiveDate: 'October 1, 2023 (Cabinet Ref 02-05-2023)',
      url: 'https://www.ceb.lk',
      docFile: 'terrif announcemnts for solar.pdf',
      notes: 'Gazetted variable and flat feed-in purchasing tariffs for rooftop solar plants: 44.14 LKR/kWh for <=20 kW, 43.02 LKR/kWh for 20-100 kW under Net Accounting, Net Plus, and Net Plus Plus.'
    },
    {
      category: 'Solar Resource (GIS)',
      title: 'Global Solar Atlas (GSA) v2.0 Sri Lanka Dataset',
      authority: 'World Bank Group / ESMAP / Solargis',
      effectiveDate: '2020 Release (v2.8)',
      url: 'https://globalsolaratlas.info',
      docFile: 'PVOUT.asc, GHI.asc, OPTA.asc (AAIGRID)',
      notes: 'High-resolution 30-arc-second (~1 km) spatial raster grids providing annual and monthly PVOUT specific yields, daily GHI, and optimum module tilt across Sri Lanka.'
    },
    {
      category: 'Interconnection Guidelines',
      title: 'Guidelines on Rooftop Solar PV Installation for Solar Service Providers (Revision 1)',
      authority: 'Public Utilities Commission of Sri Lanka (PUCSL)',
      effectiveDate: 'September 2022',
      url: 'https://www.pucsl.gov.lk',
      docFile: 'Guideline-for-Solar-PV-System-Installation-for-Solar-Providers_May-2022.pdf',
      notes: 'Technical requirements for low-voltage utility interconnection, DC string isolation, overvoltage protection (SPDs), inverter safety certification, and CEB meter interconnection.'
    },
    {
      category: 'Secondary Solar Reference',
      title: 'NASA POWER Agroclimatology & Solar API',
      authority: 'NASA Langley Research Center',
      effectiveDate: '2024 Release',
      url: 'https://power.larc.nasa.gov',
      docFile: 'Online API / Meteorological Validation',
      notes: 'Secondary solar and ambient temperature reference used to cross-verify Global Solar Atlas multi-year monthly insolation profiles.'
    },
    {
      category: 'PV Module Datasheets',
      title: 'Manufacturer Engineering Datasheets (EGing, SunPower, Qcells, BiMAX)',
      authority: 'PV Module Manufacturers',
      effectiveDate: '2021 - 2024 Models',
      url: 'https://www.egingpv.com / https://sunpower.maxeon.com',
      docFile: '415W-EGing-Datasheet.pdf, Sunpower-415W-Maxeon-5.pdf, etc.',
      notes: 'Authentic electrical specifications at Standard Test Conditions (Pmp, Voc, Isc, Vmp, Imp, temperature coefficients, module dimensions, and linear degradation warranties).'
    },
    {
      category: 'String Inverter Datasheets',
      title: 'Grid-Tied Inverter Engineering Datasheets (Sungrow, GoodWe, SOFAR, Solis)',
      authority: 'Inverter Manufacturers',
      effectiveDate: '2020 - 2024 Models',
      url: 'https://en.sungrowpower.com / https://en.goodwe.com',
      docFile: 'SG3K-D_SG5K-D-Datasheet_EN-Premium.pdf, Goodwe-10kW-GW10KL-DT.pdf, etc.',
      notes: 'Verified single-phase and three-phase technical parameters: rated AC power, MPPT voltage ranges (Vmin–Vmax), maximum DC current, efficiency curves, and phase configurations.'
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold mb-2">
          <Database className="w-3.5 h-3.5 text-amber-600" />
          <span>Complete Source Register</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Authoritative Data Sources & Regulatory Citations
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          In accordance with Section 29 of the master engineering specification, all datasets, official tariff gazettes, solar GIS rasters, and manufacturer datasheets are fully registered below.
        </p>
      </div>

      <div className="space-y-4">
        {sources.map((s, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider">
                  {s.category}
                </span>
                <span className="text-xs text-slate-400 font-medium">Effective: {s.effectiveDate}</span>
              </div>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1"
              >
                Visit Official Portal <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
              <p className="text-xs font-semibold text-slate-500">Issuing Authority: <span className="text-slate-800">{s.authority}</span></p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{s.notes}</p>

            <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-500 font-mono bg-slate-50 p-2 rounded-lg border border-slate-100">
              <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Embedded Document: <b>{s.docFile}</b></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
