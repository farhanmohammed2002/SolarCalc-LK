import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { CalculatorPage } from './pages/CalculatorPage';
import { MapPage } from './pages/MapPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { SourcesPage } from './pages/SourcesPage';
import { AboutPage } from './pages/AboutPage';
import { FaqPage } from './pages/FaqPage';
import { ReportsPage } from './pages/ReportsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [calcDistrict, setCalcDistrict] = useState<string>('Colombo');

  const handleStartCalculator = () => {
    setActiveTab('calculator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDistrictForCalc = (districtName: string) => {
    setCalcDistrict(districtName);
    setActiveTab('calculator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'home' && (
          <HomePage
            onStartCalculator={handleStartCalculator}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'calculator' && (
          <CalculatorPage initialDistrictName={calcDistrict} />
        )}

        {activeTab === 'map' && (
          <MapPage onSelectDistrictForCalc={handleSelectDistrictForCalc} />
        )}

        {activeTab === 'methodology' && (
          <MethodologyPage />
        )}

        {activeTab === 'sources' && (
          <SourcesPage />
        )}

        {activeTab === 'about' && (
          <AboutPage />
        )}

        {activeTab === 'faq' && (
          <FaqPage />
        )}

        {activeTab === 'reports' && (
          <ReportsPage />
        )}

        {activeTab === 'privacy' && (
          <PrivacyPage />
        )}

        {activeTab === 'terms' && (
          <TermsPage />
        )}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
