import React from 'react';
import { Sun, ShieldAlert, ExternalLink, Mail } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs mt-20">
      {/* Official Engineering Disclaimer Banner */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-slate-300 font-semibold text-[13px]">
              Engineering Planning Disclaimer
            </p>
            <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">
              SolarCalc LK V1.0 provides preliminary solar PV sizing, yield projections, and financial assessments for informational and planning purposes only.
              Calculations are based on the <b>PUCSL Final Decision Document on Electricity Tariff Revision (Effective January 18, 2025)</b>, 
              CEB rooftop solar purchasing tariffs, and World Bank Global Solar Atlas v2.0 datasets. Results do not substitute for a physical site survey, 
              structural assessment, certified single-line electrical schematic, utility grid interconnection approval, or final installer quotation.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Attribution */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
                <Sun className="w-4 h-4 text-slate-950" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">SolarCalc LK V1.0</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[12px] max-w-md">
              Developed as an engineering planning initiative by <b>Farhan Mohammad</b>, 
              B.Sc. (Hons) in Electrical & Electronic Engineering Undergraduate, 
              Faculty of Engineering, University of Jaffna (E23 Batch).
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://linkedin.com/in/farhan-mohammad-417a772b9" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-sky-400" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24Z" />
                </svg>
                LinkedIn Profile
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
              <a 
                href="mailto:farhanugc@gmail.com" 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                farhanugc@gmail.com
              </a>
            </div>
          </div>

          {/* Col 2: Regulatory & Standards */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Regulatory Authorities</h4>
            <ul className="space-y-2 text-[12px]">
              <li>
                <a href="https://www.pucsl.gov.lk" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  PUCSL Sri Lanka <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                </a>
              </li>
              <li>
                <a href="https://www.ceb.lk" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  Ceylon Electricity Board (CEB) <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                </a>
              </li>
              <li>
                <a href="https://leco.lk" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  Lanka Electricity Company (LECO) <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                </a>
              </li>
              <li>
                <a href="https://globalsolaratlas.info" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  Global Solar Atlas v2.0 <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-[12px]">
              <li><button onClick={() => setActiveTab('calculator')} className="hover:text-amber-400 transition-colors">Solar PV Calculator</button></li>
              <li><button onClick={() => setActiveTab('map')} className="hover:text-amber-400 transition-colors">Sri Lanka Solar Map</button></li>
              <li><button onClick={() => setActiveTab('methodology')} className="hover:text-amber-400 transition-colors">Engineering Methodology</button></li>
              <li><button onClick={() => setActiveTab('sources')} className="hover:text-amber-400 transition-colors">Authoritative Sources</button></li>
              <li><button onClick={() => setActiveTab('faq')} className="hover:text-amber-400 transition-colors">FAQ & Solar Schemes</button></li>
              <li><button onClick={() => setActiveTab('reports')} className="hover:text-amber-400 transition-colors">Download Technical Reports</button></li>
              <li><button onClick={() => setActiveTab('privacy')} className="hover:text-amber-400 transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => setActiveTab('terms')} className="hover:text-amber-400 transition-colors">Terms of Use & Disclaimer</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} SolarCalc LK V1.0. All calculations strictly verified against official Sri Lankan regulatory frameworks.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveTab('privacy')} className="hover:text-slate-300 transition-colors underline-offset-2 hover:underline">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('terms')} className="hover:text-slate-300 transition-colors underline-offset-2 hover:underline">
              Terms & Disclaimer
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
