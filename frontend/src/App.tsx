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
import { AIAssistantPage } from './pages/AIAssistantPage';
import { FloatingAIButton } from './components/ai/FloatingAIButton';
import { CalculationResult } from './types/solar';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [calcDistrict, setCalcDistrict] = useState<string>('Colombo');
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(() => {
    const saved = sessionStorage.getItem('solarcalc_latest_result');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | undefined>(undefined);

  const handleCalculationComplete = (res: CalculationResult) => {
    setCalculationResult(res);
    try {
      sessionStorage.setItem('solarcalc_latest_result', JSON.stringify(res));
    } catch (e) {}
  };

  const handleAskAi = (prompt?: string) => {
    setAiInitialPrompt(prompt);
    setActiveTab('ai-assistant');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
          <CalculatorPage
            initialDistrictName={calcDistrict}
            onAskAi={handleAskAi}
            onCalculationComplete={handleCalculationComplete}
          />
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

        {activeTab === 'ai-assistant' && (
          <AIAssistantPage
            calculationResult={calculationResult}
            onNavigateTab={setActiveTab}
            initialPrompt={aiInitialPrompt}
          />
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

      {/* Floating SolarCalc AI Assistant */}
      <FloatingAIButton
        activePage={activeTab}
        calculationResult={calculationResult}
        onOpenFullAssistant={() => {
          setAiInitialPrompt(undefined);
          setActiveTab('ai-assistant');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

export default App;
