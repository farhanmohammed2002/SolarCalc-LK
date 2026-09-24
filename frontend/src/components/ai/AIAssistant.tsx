import React, { useState, useEffect, useRef } from 'react';
import { Trash2, ShieldCheck, Sparkles, AlertCircle, Info, RefreshCw } from 'lucide-react';
import { ChatMessage, ChatMessageData } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { SuggestedQuestions } from './SuggestedQuestions';
import { SolarCalcAiIcon } from './AIIcon';
import { CalculationResult } from '../../types/solar';

interface AIAssistantProps {
  initialPrompt?: string;
  activePage?: string;
  calculationResult?: CalculationResult | null;
  compact?: boolean;
  onNavigatePage?: (page: string) => void;
}

const INITIAL_WELCOME_MESSAGE: ChatMessageData = {
  id: 'welcome-msg',
  sender: 'assistant',
  text: `Hello! I'm **SolarCalc AI**.

I can help you understand **SolarCalc LK**, residential rooftop solar PV planning, system sizing, electricity tariffs, solar generation, economic analysis, and your calculation results.

What would you like to know?`,
  timestamp: 'Just now',
  source: 'SolarCalc LK Knowledge Base'
};

export const AIAssistant: React.FC<AIAssistantProps> = ({
  initialPrompt,
  activePage = '/ai-assistant',
  calculationResult = null,
  compact = false,
  onNavigatePage
}) => {
  const [messages, setMessages] = useState<ChatMessageData[]>(() => {
    const saved = sessionStorage.getItem('solarcalc_ai_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // fallback
      }
    }
    return [INITIAL_WELCOME_MESSAGE];
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Persist session history
  useEffect(() => {
    try {
      sessionStorage.setItem('solarcalc_ai_history', JSON.stringify(messages));
    } catch (e) {
      // ignore
    }
  }, [messages]);

  // Handle initial prompt if passed
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt.trim());
    }
  }, [initialPrompt]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleClearChat = () => {
    setMessages([INITIAL_WELCOME_MESSAGE]);
    sessionStorage.removeItem('solarcalc_ai_history');
    setErrorMessage(null);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setErrorMessage(null);
    const userMsg: ChatMessageData = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Build context object
    const contextPayload: any = {
      page: activePage
    };

    if (calculationResult) {
      contextPayload.calculation = {
        district: calculationResult.inputs?.district,
        monthly_consumption_kwh: calculationResult.inputs?.monthly_units_kwh,
        target_offset_pct: calculationResult.inputs?.target_offset_pct,
        roof_type: calculationResult.inputs?.roof_type,
        roof_area_sqm: calculationResult.inputs?.roof_area_sqm,
        tilt_deg: calculationResult.inputs?.tilt_deg,
        azimuth_deg: calculationResult.inputs?.azimuth_deg,
        scheme: calculationResult.inputs?.scheme || calculationResult.scheme?.scheme_details?.scheme_name,
        system_capacity_kwp: calculationResult.system?.actual_capacity_kwp,
        panel_quantity: calculationResult.system?.panel_count,
        panel_model: calculationResult.system?.panel?.model,
        inverter_model: calculationResult.system?.inverter?.model,
        annual_generation_kwh: calculationResult.generation?.annual_kwh,
        annual_savings_lkr: calculationResult.financials?.annual_net_benefit_lkr,
        estimated_system_cost_lkr: calculationResult.financials?.system_cost_lkr,
        payback_years: calculationResult.financials?.simple_payback_years,
        grid_export_kwh: calculationResult.scheme?.energy_flow?.grid_export_kwh,
        grid_import_kwh: calculationResult.scheme?.energy_flow?.grid_import_kwh
      };
    }

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          context: contextPayload
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const assistantMsg: ChatMessageData = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.answer || "I'm sorry, I couldn't process that question.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source || 'SolarCalc LK Knowledge Base',
        isContextAware: Boolean(calculationResult)
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.warn('Backend AI endpoint unavailable, using local client fallback:', err);
      // Client-side fallback if backend API is offline
      const clientFallbackText = generateClientFallback(text.trim(), contextPayload);
      const assistantMsg: ChatMessageData = {
        id: `ai-fallback-${Date.now()}`,
        sender: 'assistant',
        text: clientFallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'SolarCalc LK Knowledge Base (Offline Mode)',
        isContextAware: Boolean(calculationResult)
      };
      setMessages(prev => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Local client fallback function for offline resilience
  const generateClientFallback = (query: string, ctx: any): string => {
    const q = query.toLowerCase();
    const calc = ctx?.calculation;

    if (q.includes('kwp')) {
      return `**kWp** stands for **kilowatt-peak**.\n\nIt is the peak rated direct-current (DC) power output of solar PV modules under Standard Test Conditions (1,000 W/m², 25°C cell temperature, AM 1.5 spectrum).\n\nFor example, 6 × 415W panels = **2.49 kWp**.`;
    }
    if (q.includes('scheme') || q.includes('net metering') || q.includes('net accounting') || q.includes('net plus')) {
      return `### 🇱🇰 Sri Lankan CEB Rooftop Solar Schemes\n\n- **Net Metering**: 1:1 kWh energy credit offset. No cash payouts.\n- **Net Accounting**: Self-consumption offset; net export paid in cash by CEB at **LKR 44.14/kWh** (<=20kW).\n- **Net Plus**: 100% of gross generation exported at **LKR 44.14/kWh**; household consumption billed separately.`;
    }
    if (q.includes('payback') || q.includes('roi')) {
      if (calc?.payback_years) {
        return `Your calculated simple payback period is **${calc.payback_years} years** based on an estimated system cost of LKR ${calc.estimated_system_cost_lkr?.toLocaleString()} and annual net savings of LKR ${calc.annual_savings_lkr?.toLocaleString()}.`;
      }
      return `The **Simple Payback Period** is calculated as:\n\n$$\\text{Simple Payback} = \\frac{\\text{Turnkey System Cost (LKR)}}{\\text{Annual Net Benefit (LKR/year)}}$$\n\nIn Sri Lanka, residential payback ranges between **3.5 to 5.5 years**.`;
    }
    if (q.includes('inverter') && calc?.inverter_model) {
      return `### ⚡ Inverter Sizing for ${calc.system_capacity_kwp} kWp\n\nThe **${calc.inverter_model}** was matched based on:\n1. **DC/AC Ratio**: Sized between 1.10 and 1.35.\n2. **MPPT Voltage Window**: String Voc within maximum DC limits.\n3. **Phase Compatibility**: Single-phase <= 5 kWp, three-phase > 5 kWp.`;
    }
    if (q.includes('result') || q.includes('system')) {
      if (calc) {
        return `### 📊 Your System Results\n\n- **Capacity**: ${calc.system_capacity_kwp} kWp (${calc.panel_quantity} panels)\n- **Inverter**: ${calc.inverter_model}\n- **Annual Generation**: ${calc.annual_generation_kwh?.toLocaleString()} kWh\n- **Estimated Payback**: ${calc.payback_years} years\n- **Location**: ${calc.district}`;
      }
    }
    return `Hello! I am **SolarCalc AI**.\n\nI can explain your solar calculation results, PUCSL January 2025 tariffs, CEB rooftop solar schemes (Net Metering/Accounting/Plus), and system sizing parameters.\n\nPlease ask a specific question or select one of the suggested topics below!`;
  };

  return (
    <div className={`flex flex-col bg-slate-50/50 rounded-2xl border border-slate-200 overflow-hidden shadow-xs ${compact ? 'h-[480px]' : 'h-[680px]'}`}>
      {/* Engineering Header Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-sky-600 to-amber-500 text-white flex items-center justify-center shadow-sm">
            <SolarCalcAiIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-slate-900 leading-tight">SolarCalc AI</h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ONLINE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Solar PV Engineering & Tariff Assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {calculationResult && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{calculationResult.inputs?.district} ({calculationResult.system?.actual_capacity_kwp} kWp)</span>
            </div>
          )}

          <button
            onClick={handleClearChat}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Context Banner if Calculation Result Present */}
      {calculationResult && (
        <div className="bg-gradient-to-r from-emerald-50 via-sky-50 to-amber-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center gap-2 truncate">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold text-slate-800">Active Calculation Context:</span>
            <span className="truncate text-slate-600">
              {calculationResult.inputs?.district} • {calculationResult.system?.actual_capacity_kwp} kWp • {calculationResult.system?.panel_count} Panels • {calculationResult.inputs?.scheme || 'Net Accounting'}
            </span>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200 hidden md:inline">
            Grounded Mode
          </span>
        </div>
      )}

      {/* Scrollable Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start my-2">
            <div className="flex gap-3 max-w-[80%] items-center">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 via-sky-600 to-amber-500 text-white flex items-center justify-center shadow-xs">
                <SolarCalcAiIcon className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs flex items-center gap-2 text-xs text-slate-500 font-medium">
                <div className="flex gap-1 items-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
                </div>
                <span>SolarCalc AI is evaluating engineering formulas...</span>
              </div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Panel: Suggested Questions & Input */}
      <div className="bg-white border-t border-slate-200 p-3 sm:p-4 space-y-3">
        <SuggestedQuestions
          onSelectQuestion={handleSendMessage}
          hasCalculationContext={Boolean(calculationResult)}
          compact={compact}
        />
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};
