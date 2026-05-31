// ChatSandbox.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  id: string;
  timestamp: Date;
  sender: 'builder' | 'investor' | 'system';
  message: string;
}

interface ChatSandboxProps {
  messages: ChatMessage[];
  viewMode: 'builder' | 'investor';
  onSendMessage: (text: string) => void;
}

export default function ChatSandbox({ 
  messages, 
  viewMode, 
  onSendMessage 
}: ChatSandboxProps) {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Smooth scroll helper to keep late-night messaging panels focused
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full p-5 flex flex-col h-[400px] shadow-xl">
      
      {/* Sandbox Component Header */}
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center mb-4">
        <div>
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Communication Layer</span>
          <h3 className="text-base font-bold text-slate-100 mt-0.5">Workspace Negotiation Sandbox</h3>
        </div>
        <div className="flex items-center gap-2 text-xs bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-400 font-mono">
          <span>Active Feed:</span>
          <span className="text-emerald-400 animate-pulse">● SECURE</span>
        </div>
      </div>

      {/* Chat Message Stream Box */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1 scrollbar-thin">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col max-w-[85%] ${
              msg.sender === 'system' 
                ? 'mx-auto w-full max-w-full text-center my-2' 
                : msg.sender === viewMode 
                  ? 'ml-auto items-end' 
                  : 'mr-auto items-start'
            }`}
          >
            {/* Sender Metadata Badge */}
            {msg.sender !== 'system' && (
              <span className="text-[10px] uppercase font-bold text-slate-500 mb-1 px-1">
                {msg.sender} {msg.sender === viewMode && '(You)'}
              </span>
            )}

            {/* Bubble Rendering Blocks */}
            <div 
              className={`p-3 text-sm rounded-xl border ${
                msg.sender === 'system'
                  ? 'bg-slate-950/40 border-slate-800 text-amber-400/90 font-mono text-xs inline-block mx-auto'
                  : msg.sender === 'builder'
                    ? 'bg-cyan-950/20 border-cyan-900/40 text-cyan-100'
                    : 'bg-emerald-950/20 border-emerald-900/40 text-emerald-100'
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
            </div>
            
            <span className="text-[9px] font-mono text-slate-600 mt-0.5 px-1">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Message Typing Input Form */}
      <form onSubmit={handleSend} className="flex gap-2 pt-3 border-t border-slate-800">
        <input
          type="text"
          placeholder={`Type a negotiation message as ${viewMode.toUpperCase()}...`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-300 text-sm font-bold rounded-xl border border-slate-700 hover:border-cyan-500 transition-all active:scale-95 shadow-md"
        >
          Send
        </button>
      </form>

    </div>
  );
}
