import React from 'react';
import { ShieldCheck, Lock, EyeOff, Server, HardDrive, CheckCircle2 } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>User Privacy & Data Policy</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Effective Date: January 18, 2025 • SolarCalc LK V1.0 Platform
        </p>
      </div>

      {/* Main Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Zero Data Collection</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            SolarCalc LK does not require account creation, logins, or personal identification. We do not store your name, phone number, address, or utility account numbers.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Stateless Execution</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Calculation parameters (monthly kWh, roof area, district) are processed transiently in memory. No persistent database records of your consumption history are retained.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">No Third-Party Trackers</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We do not sell advertising space or transmit analytical telemetry to commercial advertising brokers. Map tiles and data run purely for engineering display.
          </p>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            1. Information Processed During Calculations
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            When you interact with the SolarCalc LK planning engine, the application only receives the technical parameters you supply:
          </p>
          <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 space-y-1 mt-2">
            <li>Approximate geographical location (Sri Lankan administrative district or coordinates).</li>
            <li>Monthly electricity consumption in kilowatt-hours (kWh) or recent electricity bill (LKR).</li>
            <li>Roof physical attributes (material, approximate usable square meters, tilt, and azimuth).</li>
            <li>Preferred grid scheme (Net Metering, Net Accounting, Net Plus).</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            2. Local Storage and Client-Side Execution
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            SolarCalc LK includes an autonomous browser-side calculation engine. In scenarios where network access is degraded, calculations occur locally inside your web browser without sending data across the Internet.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            3. Downloadable PDF Proposals
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            When you request a PDF assessment download, the document is assembled instantaneously and streamed directly into your browser's memory. No copy of the generated PDF is permanently archived on our servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            4. Inquiries & Contact
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            For questions regarding privacy, security, or academic research usage, please contact the developer:
            <br />
            <b>Farhan Mohammad</b> (Faculty of Engineering, University of Jaffna)
            <br />
            Email: <a href="mailto:farhanugc@gmail.com" className="text-blue-600 underline">farhanugc@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  );
};
