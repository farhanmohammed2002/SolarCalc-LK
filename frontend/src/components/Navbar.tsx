import React from 'react';
import { Sun, Compass, BookOpen, Database, User, HelpCircle, FileText, Calculator } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Sun },
    { id: 'calculator', label: 'Solar Calculator', icon: Calculator },
    { id: 'map', label: 'Solar Map', icon: Compass },
    { id: 'methodology', label: 'Methodology', icon: BookOpen },
    { id: 'sources', label: 'Sources', icon: Database },
    { id: 'about', label: 'About Developer', icon: User },
    { id: 'faq', label: 'FAQ & Guidance', icon: HelpCircle },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Sun className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900">SolarCalc</span>
                <span className="px-1.5 py-0.5 text-xs font-bold bg-amber-500 text-slate-950 rounded-md">LK</span>
                <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full border border-slate-200">v1.0</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Sri Lanka Solar PV Planning & Tariff Engine</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('calculator')}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Calculator className="w-3.5 h-3.5" />
              Calculate My Solar
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Scrollable */}
      <div className="md:hidden overflow-x-auto border-t border-slate-100 px-4 py-2 bg-slate-50 flex gap-2 scrollbar-none">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
                isActive ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              <Icon className="w-3 h-3" />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
