import React, { useState } from 'react';
import { FileText, Download, Archive, CheckCircle2, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (type: 'PDF' | 'DOCX' | 'ZIP') => {
    setDownloading(type);
    let endpoint = '/api/download-technical-report';
    let filename = 'SolarCalc_LK_V1.0_Technical_Report.pdf';

    if (type === 'DOCX') {
      endpoint = '/api/download-technical-report-docx';
      filename = 'SolarCalc_LK_V1.0_Technical_Report.docx';
    } else if (type === 'ZIP') {
      endpoint = '/api/download-data-package';
      filename = 'SolarCalc_LK_V1.0_Data_Package.zip';
    }

    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        alert(`File ${filename} is available in the project root directory.`);
      }
    } catch (err) {
      alert(`Download request failed. You can access ${filename} directly from the project root.`);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold mb-2">
          <FileText className="w-3.5 h-3.5 text-amber-600" />
          <span>Documentation Deliverables</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Downloadable Technical Reports & Data Package
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Access the complete academic engineering report and structured dataset packages generated in accordance with Section 50–52 of the master specification.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PDF Technical Report */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Technical Report (PDF)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Comprehensive 25-section engineering and validation report covering PUCSL 2025 tariff analysis, Global Solar Atlas spatial methodology, equipment stringing, and 12 test validation cases.
            </p>
            <div className="text-[11px] text-slate-400 font-mono">
              Format: Portable Document Format (.pdf)<br/>
              Author: Farhan Mohammad (Univ. of Jaffna)
            </div>
          </div>
          <button
            onClick={() => handleDownload('PDF')}
            disabled={downloading === 'PDF'}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            {downloading === 'PDF' ? 'Downloading...' : 'Download Technical PDF'}
          </button>
        </div>

        {/* DOCX Technical Report */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Technical Report (DOCX)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Full Microsoft Word document formatted for academic submission, engineering portfolio review, and university project documentation.
            </p>
            <div className="text-[11px] text-slate-400 font-mono">
              Format: Microsoft Word (.docx)<br/>
              Standard academic font & table formatting
            </div>
          </div>
          <button
            onClick={() => handleDownload('DOCX')}
            disabled={downloading === 'DOCX'}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            {downloading === 'DOCX' ? 'Downloading...' : 'Download Report (.docx)'}
          </button>
        </div>

        {/* Complete Data Package ZIP */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Archive className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Data Package (ZIP)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete archive containing <code>DOCUMENT_INVENTORY.xlsx</code>, <code>DATA_SOURCES.xlsx</code>, <code>VALIDATION_CASES.xlsx</code>, database schemas, and all technical documentation registers.
            </p>
            <div className="text-[11px] text-slate-400 font-mono">
              Format: Compressed Archive (.zip)<br/>
              Includes all 8 engineering registers
            </div>
          </div>
          <button
            onClick={() => handleDownload('ZIP')}
            disabled={downloading === 'ZIP'}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            {downloading === 'ZIP' ? 'Downloading...' : 'Download Data Package (.zip)'}
          </button>
        </div>
      </div>

      {/* Package Contents Audit Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">Verified Project Registers Included in Package</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {[
            { name: 'DOCUMENT_INVENTORY.xlsx & .md', desc: 'Complete 496-row file audit across all project folders with sources and usage status.' },
            { name: 'DATA_SOURCES.xlsx & .md', desc: 'Exhaustive source register of PUCSL, CEB, Global Solar Atlas, and manufacturer portals.' },
            { name: 'SOLARCALC_ASSUMPTIONS.md', desc: 'Physical deratings, tropical soiling, cable ohmics, degradation, and financial rates.' },
            { name: 'CALCULATION_METHODOLOGY.md', desc: 'Mathematical formulations for PV sizing, string voltage checks, and PUCSL block billing.' },
            { name: 'VALIDATION_CASES.xlsx & .md', desc: '12 test cases covering zero units, lifeline tier, high brackets, and 3-phase systems.' },
            { name: 'DATABASE_SCHEMA.md & API_SPEC.md', desc: 'Normalized SQLite/PostgreSQL tables and REST API endpoint specifications.' },
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 font-mono block">{item.name}</span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
