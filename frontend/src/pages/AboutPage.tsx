import React from 'react';
import { User, GraduationCap, MapPin, Mail, Zap, ExternalLink } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold mb-2">
          <User className="w-3.5 h-3.5 text-amber-600" />
          <span>Project Creator & Engineering Lead</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          About the Developer
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Academic credentials, engineering focus, and background behind the creation of SolarCalc LK V1.0.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-slate-100 pb-8">
          <img
            src="/images/farhan.jpeg"
            alt="Farhan Mohammad"
            className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl object-cover object-top border-4 border-amber-500/80 shadow-lg shrink-0"
          />
          <div className="space-y-4 text-center md:text-left flex-1">
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Farhan Mohammad</h2>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-800 border border-amber-300">
                  EEE Undergraduate
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-600 mt-1 flex items-center justify-center md:justify-start gap-1.5">
                <GraduationCap className="w-4 h-4 text-amber-600 shrink-0" />
                B.Sc. (Hons) in Electrical & Electronic Engineering (Undergraduate)
              </p>
              <p className="text-xs text-slate-500 flex items-center justify-center md:justify-start gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                Faculty of Engineering, University of Jaffna • E23 Batch (2024–2028)
              </p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
              Farhan Mohammad is an Electrical and Electronic Engineering undergraduate at the University of Jaffna. His technical focus spans <b>Power Systems Analysis</b>, <b>Renewable Energy Systems (Wind & Solar PV integration)</b>, <b>Embedded Systems</b>, and <b>Custom Hardware/Software Architectures</b>.
            </p>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <a
                href="https://linkedin.com/in/farhan-mohammad-417a772b9"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-all shadow-xs"
              >
                <svg className="w-3.5 h-3.5 fill-sky-400" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24Z" />
                </svg>
                LinkedIn Profile
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
              <a
                href="mailto:farhanugc@gmail.com"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 text-xs font-bold border border-slate-200 transition-all"
              >
                <Mail className="w-3.5 h-3.5 text-amber-600" />
                farhanugc@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Areas of Interest */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Technical Areas of Interest
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: 'Renewable Energy Integration & Smart Grids', desc: 'Solar PV grid penetration, power quality, and distributed generation control.' },
              { title: 'Power Systems Engineering & High-Voltage Analysis', desc: 'Transmission stability, fault analysis, and substation automation.' },
              { title: 'Custom PCB Design & Embedded Hardware', desc: 'Microcontroller firmware, sensor interfaces, and power electronics inverter circuits.' },
              { title: 'Applied AI in Power Networks', desc: 'Data-driven forecasting, load curve optimization, and renewable economic dispatch.' },
            ].map((area, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  {area.title}
                </span>
                <p className="text-[11px] text-slate-500 leading-relaxed pl-5">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Project Problem & Objective */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          <div className="space-y-2">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">The Problem Solved</span>
            <h4 className="text-sm font-bold text-slate-900">Overcoming Vendor Bias & Tariff Complexity</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Residential solar adopters in Sri Lanka often struggle with complex PUCSL/CEB electricity tariff structures, dynamic net-metering/net-accounting export schemes, and ambiguous vendor claims without an objective, transparent assessment tool.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">The Objective</span>
            <h4 className="text-sm font-bold text-slate-900">Data-Driven, Independent Sizing</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              SolarCalc LK V1.0 delivers an engineering-grounded preliminary assessment platform tailored specifically to the Sri Lankan residential sector. It translates utility tariffs, equipment specifications, and local solar-resource data into accurate sizing, yield estimation, and financial payback projections—completely independent of vendor bias.
            </p>
          </div>
        </div>

        {/* Official Contact Card */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Contact Card</span>
            <p className="text-xs font-bold text-slate-800">Faculty of Engineering, University of Jaffna</p>
            <p className="text-[11px] text-slate-500">Ariviyal Nagar, Kilinochchi, Sri Lanka</p>
          </div>
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-white p-1 shadow-xs">
            <img
              src="/images/contact-information.png"
              alt="Author Official Contact Details"
              className="h-20 object-contain"
            />
          </div>
        </div>

        {/* Public Attribution Note */}
        <div className="p-4 bg-slate-900 text-slate-300 rounded-2xl border border-slate-800 text-xs space-y-1">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Official Attribution</span>
          <p className="text-[11px] leading-relaxed italic text-slate-300">
            "SolarCalc LK V1.0 — Developed as an engineering planning project by Farhan Mohammad, B.Sc. (Hons) Electrical & Electronic Engineering Undergraduate, University of Jaffna."
          </p>
        </div>
      </div>
    </div>
  );
};
