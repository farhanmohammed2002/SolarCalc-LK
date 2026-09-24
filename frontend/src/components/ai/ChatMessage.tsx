import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, User } from 'lucide-react';
import { SolarCalcAiIcon } from './AIIcon';

export interface ChatMessageData {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
  isContextAware?: boolean;
}

interface ChatMessageProps {
  message: ChatMessageData;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.sender === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to render formatted text with bold, bullet points, headers, tables, and notes
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inTable = false;
    let tableRows: string[][] = [];

    const flushTable = () => {
      if (tableRows.length > 0) {
        const header = tableRows[0];
        const body = tableRows.slice(1);
        elements.push(
          <div key={`table-${elements.length}`} className="my-3 overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold">
                <tr>
                  {header.map((col, idx) => (
                    <th key={idx} className="px-3 py-2 text-left font-semibold">
                      {col.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {body.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3 py-2 text-slate-700 font-medium">
                        {renderInlineFormatting(cell.trim())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Table line detection
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        inTable = true;
        // Ignore separator row like | :--- | :--- |
        if (!trimmed.includes('---')) {
          const cells = trimmed.slice(1, -1).split('|');
          tableRows.push(cells);
        }
        return;
      } else if (inTable) {
        flushTable();
      }

      // Headings
      if (trimmed.startsWith('### ')) {
        elements.push(
          <h4 key={index} className="text-sm font-bold text-slate-900 mt-3 mb-1.5 flex items-center gap-1.5">
            {renderInlineFormatting(trimmed.replace('### ', ''))}
          </h4>
        );
        return;
      }
      if (trimmed.startsWith('## ')) {
        elements.push(
          <h3 key={index} className="text-base font-extrabold text-slate-900 mt-3.5 mb-2">
            {renderInlineFormatting(trimmed.replace('## ', ''))}
          </h3>
        );
        return;
      }

      // Alerts / Notes
      if (trimmed.startsWith('> [!NOTE]') || trimmed.startsWith('> [!IMPORTANT]')) {
        const isImportant = trimmed.startsWith('> [!IMPORTANT]');
        elements.push(
          <div
            key={index}
            className={`my-2 p-2.5 rounded-lg border text-xs font-medium ${
              isImportant
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}
          >
            <div className="font-bold text-[11px] uppercase tracking-wider mb-0.5">
              {isImportant ? '⚠️ Important Engineering Note' : 'ℹ️ Calculation Context'}
            </div>
            {renderInlineFormatting(trimmed.replace(/^> \[[^\]]+\]\s*/, ''))}
          </div>
        );
        return;
      }
      if (trimmed.startsWith('> ')) {
        elements.push(
          <blockquote key={index} className="pl-3 border-l-2 border-emerald-500 my-1 text-slate-600 text-xs italic">
            {renderInlineFormatting(trimmed.replace('> ', ''))}
          </blockquote>
        );
        return;
      }

      // Bullet points
      if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        elements.push(
          <div key={index} className="flex items-start gap-2 my-1 text-xs text-slate-700 leading-relaxed pl-1">
            <span className="text-amber-500 font-bold mt-0.5">•</span>
            <div>{renderInlineFormatting(trimmed.replace(/^[-•]\s*/, ''))}</div>
          </div>
        );
        return;
      }

      // Numbered lists
      const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (numberedMatch) {
        elements.push(
          <div key={index} className="flex items-start gap-2 my-1 text-xs text-slate-700 leading-relaxed pl-1">
            <span className="text-emerald-600 font-bold min-w-4 text-right">{numberedMatch[1]}.</span>
            <div>{renderInlineFormatting(numberedMatch[2])}</div>
          </div>
        );
        return;
      }

      // Empty line
      if (!trimmed) {
        elements.push(<div key={index} className="h-1.5" />);
        return;
      }

      // Standard paragraph
      elements.push(
        <p key={index} className="text-xs text-slate-700 leading-relaxed my-1">
          {renderInlineFormatting(line)}
        </p>
      );
    });

    if (inTable) {
      flushTable();
    }

    return elements;
  };

  // Helper for inline markdown: bold, math/formulas, inline code
  const renderInlineFormatting = (text: string): React.ReactNode => {
    // Math formulas formatted with $$...$$ or $...$
    const parts = text.split(/(\$\$[^\$]+\$\$|\$[^\$]+\$|\*\*[^\*]+\*\*|`[^`]+`)/g);

    return parts.map((part, i) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const formula = part.slice(2, -2);
        return (
          <div key={i} className="my-2 p-2 bg-slate-900 text-amber-300 font-mono text-[11px] rounded-lg text-center overflow-x-auto shadow-inner">
            {formula}
          </div>
        );
      }
      if (part.startsWith('$') && part.endsWith('$')) {
        const formula = part.slice(1, -1);
        return (
          <code key={i} className="px-1.5 py-0.5 mx-0.5 bg-slate-100 text-emerald-800 font-mono text-[11px] rounded border border-slate-200">
            {formula}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 bg-slate-100 text-slate-800 font-mono text-[11px] rounded border border-slate-200">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className={`flex w-full my-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-3 max-w-[92%] sm:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className="flex-shrink-0 mt-0.5">
          {isUser ? (
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-xs">
              <User className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 via-sky-600 to-amber-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <SolarCalcAiIcon className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Message Bubble / Card */}
        <div
          className={`relative rounded-2xl px-4 py-3.5 shadow-xs transition-all ${
            isUser
              ? 'bg-slate-900 text-white rounded-tr-xs'
              : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs hover:border-slate-300'
          }`}
        >
          {/* Header Info for AI Response */}
          {!isUser && (
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900">SolarCalc AI</span>
                <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 font-semibold rounded text-[10px]">
                  Technical Assistant
                </span>
                {message.isContextAware && (
                  <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 font-semibold rounded text-[10px] hidden sm:inline">
                    System Context Active
                  </span>
                )}
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[10px] hover:text-slate-900 cursor-pointer p-1 rounded hover:bg-slate-100 transition-colors"
                title="Copy response"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          )}

          {/* Message Content */}
          <div className="space-y-1">
            {isUser ? (
              <p className="text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-wrap">{message.text}</p>
            ) : (
              <div>{renderFormattedContent(message.text)}</div>
            )}
          </div>

          {/* Footer Metadata */}
          <div className={`mt-2.5 pt-1.5 flex items-center justify-between gap-3 text-[10px] ${isUser ? 'text-slate-400' : 'text-slate-400 border-t border-slate-50'}`}>
            <span>{message.timestamp}</span>
            {!isUser && message.source && (
              <span className="flex items-center gap-1 text-slate-500 font-medium">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                {message.source}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
