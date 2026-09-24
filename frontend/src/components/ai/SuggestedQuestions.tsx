import React from 'react';
import { Sparkles, HelpCircle } from 'lucide-react';

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void;
  hasCalculationContext?: boolean;
  compact?: boolean;
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({
  onSelectQuestion,
  hasCalculationContext = false,
  compact = false
}) => {
  // Base questions always applicable
  const generalQuestions = [
    'How does SolarCalc LK calculate my solar system size?',
    'What does kWp mean?',
    'What is the difference between Net Metering and Net Accounting?',
    'How is my annual solar generation calculated?',
    'What does the payback period mean?',
    'What does MPPT mean?',
    'What are my system losses?',
    'How can I download my technical report?'
  ];

  // Specific contextual questions when user has a calculation result
  const contextualQuestions = [
    'Explain my solar PV system',
    'Why was this inverter selected?',
    'Explain my payback period',
    'Explain my electricity bill savings',
    'How do I interpret the energy balance chart?'
  ];

  const questionsToDisplay = hasCalculationContext
    ? [...contextualQuestions, ...generalQuestions.slice(0, 4)]
    : generalQuestions;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
        <Sparkles className="w-3 h-3 text-amber-500" />
        <span>{hasCalculationContext ? 'Suggested Questions for Your System' : 'Frequently Asked Engineering Questions'}</span>
      </div>
      <div className={`flex flex-wrap gap-1.5 ${compact ? 'max-h-24 overflow-y-auto scrollbar-thin' : ''}`}>
        {questionsToDisplay.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSelectQuestion(q)}
            className="text-left text-[11px] sm:text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-300 text-slate-700 border border-slate-200/80 transition-all active:scale-98 cursor-pointer flex items-center gap-1.5"
          >
            <HelpCircle className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span className="truncate max-w-[280px] sm:max-w-none">{q}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
