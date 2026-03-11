import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, CheckCircle2, AlertCircle, BarChart3, FileText, RefreshCw, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from '../types';
import { getChatResponse } from '../services/gemini';
import { cn } from '../lib/utils';

interface ChatWidgetProps {
  onAction: (actionType: string, data?: any) => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ onAction }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome to the SAP Intelligent Finance Workspace. I am your AI assistant for S/4HANA operations. How can I assist with your financial closing or accounts payable today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({ role: m.role, content: m.content }));
    const responseText = await getChatResponse(input, history);

    const assistantMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseText,
      timestamp: new Date(),
    };

    // Detect actions in response
    const actionMap: Record<string, string> = {
      'RECONCILE_BANK': 'RECONCILE_BANK',
      'POST_INVOICE': 'POST_INVOICE',
      'GET_REPORT': 'GET_REPORT',
      'VALIDATE_DATA': 'VALIDATE_DATA',
      'FORECAST_CASH': 'FORECAST_CASH',
      'DETECT_RISK': 'DETECT_RISK'
    };

    Object.keys(actionMap).forEach(key => {
      if (responseText.includes(`[ACTION:${key}]`)) onAction(actionMap[key]);
    });

    setMessages(prev => [...prev, assistantMsg]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#151619] border border-[#2A2D32] rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-6 py-4 bg-[#1C1F24] border-bottom border-[#2A2D32] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">SAP Finance Copilot</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-medium">Multi-Agent System Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center",
                msg.role === 'user' ? "bg-indigo-500/20" : "bg-emerald-500/20"
              )}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-indigo-400" /> : <Bot className="w-4 h-4 text-emerald-400" />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed",
                msg.role === 'user' 
                  ? "bg-indigo-500/10 text-indigo-100 border border-indigo-500/20" 
                  : "bg-zinc-800/50 text-zinc-200 border border-zinc-700/50"
              )}>
                {msg.content.replace(/\[ACTION:.*\]/g, '')}
                <div className="mt-2 text-[10px] opacity-40 font-mono">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
            </div>
            <div className="bg-zinc-800/50 border border-zinc-700/50 p-4 rounded-2xl">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-[#1C1F24] border-t border-[#2A2D32]">
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for cash flow predictions, risk alerts, or drill-downs..."
              className="w-full bg-[#151619] border border-[#2A2D32] rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-all"
            />
            <button
              onClick={toggleVoice}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all",
                isListening ? "bg-red-500 text-white animate-pulse" : "text-zinc-500 hover:text-white"
              )}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-400 disabled:opacity-50 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
