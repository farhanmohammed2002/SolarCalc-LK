import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  placeholder = 'Ask questions about solar PV planning, system sizing, tariffs, or calculations...',
  autoFocus = false
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto resize height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="relative flex items-end gap-2 bg-white rounded-xl border border-slate-300 p-2 shadow-sm focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/20 transition-all">
      <textarea
        ref={textareaRef}
        rows={1}
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading}
        className="flex-1 max-h-28 py-1.5 px-2.5 text-xs sm:text-sm bg-transparent resize-none border-none outline-none text-slate-800 placeholder:text-slate-400 font-medium leading-relaxed scrollbar-none"
      />
      <button
        onClick={handleSend}
        disabled={!input.trim() || isLoading}
        className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${
          input.trim() && !isLoading
            ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:scale-105 active:scale-95'
            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
        }`}
        title="Send question (Enter)"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};
