// components/InvestorProfileGateway.tsx
'use client';

import React, { useState } from 'react';

interface InvestorProfileProps {
  investorId: string;
  investorName: string;
  investorWallet: string;
  isInitialAccepting: boolean;
  currentRole: 'builder' | 'investor';
  onConnectionSubmitted: () => void;
}

export default function InvestorProfileGateway({
  investorId,
  investorName,
  investorWallet,
  isInitialAccepting,
  currentRole,
  onConnectionSubmitted
}: InvestorProfileProps) {
  const [isAccepting, setIsAccepting] = useState(isInitialAccepting);
  const [abstractText, setAbstractText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const MAX_CHARS = 280;
  const isAbstractValid = abstractText.trim().length > 0 && abstractText.length <= MAX_CHARS;

  // Investor Action: Toggle onboarding status pipeline
  const handleToggleStatus = async () => {
    if (currentRole !== 'investor') return;
    const nextState = !isAccepting;
    setIsAccepting(nextState);

    try {
      await fetch('/api/investor/toggle-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ investorId, isAccepting: nextState }),
      });
      if (typeof window !== 'undefined' && (window as any).novus) {
        (window as any).novus('track', 'investor_visibility_toggled', { investorId, isAccepting: nextState });
      }
    } catch (err) {
      console.error("Failed to sync visibility parameters:", err);
    }
  };

  // Builder Action: Submit structural handshake request
  const handleRequestConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAbstractValid || currentRole !== 'builder') return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/connections/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ investorId, requestAbstract: abstractText }),
      });

      if (!response.ok) throw new Error("Network connection request failed");

      if (typeof window !== 'undefined' && (window as any).novus) {
        (window as any).novus('track', 'connection_requested', { investorId });
      }

      alert('Handshake request successfully transmitted to investor inbox!');
      setAbstractText('');
      onConnectionSubmitted();
    } catch (err) {
      console.error(err);
      alert('Error broadcasting connection request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-xl w-full space-y-6">
      
      {/* Profile Identity Details Card */}
      <div className="flex justify-between items-start border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Fund Allocator Profile</span>
          <h2 className="text-xl font-bold text-slate-100 mt-1">{investorName}</h2>
          <p className="text-xs font-mono text-slate-400 mt-1 truncate max-w-[280px]">{investorWallet}</p>
        </div>
        
        {/* Toggle Switch Component: Managed exclusively in Investor mode */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase font-bold text-slate-500 mb-1.5">Ingestion Status</span>
          {currentRole === 'investor' ? (
            <button
              onClick={handleToggleStatus}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isAccepting ? 'bg-emerald-600' : 'bg-slate-800'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAccepting ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          ) : (
            <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${isAccepting ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-400' : 'bg-rose-950/20 border-rose-900/40 text-rose-400'}`}>
              {isAccepting ? '● OPEN FOR PITCHES' : '○ INBOX LOCKED'}
            </span>
          )}
        </div>
      </div>

      {/* Dynamic Interaction Panel */}
      {currentRole === 'builder' && (
        <form onSubmit={handleRequestConnection} className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Request Handshake Abstract</label>
            <span className={`text-xs font-mono ${abstractText.length > MAX_CHARS ? 'text-rose-400' : 'text-slate-500'}`}>
              {abstractText.length}/{MAX_CHARS} chars
            </span>
          </div>
          
          <textarea
            disabled={!isAccepting || isSubmitting}
            placeholder={isAccepting ? "Summarize your value proposition and development thesis within 280 characters..." : "This fund manager is currently optimization-focused and not accepting cold pitches."}
            value={abstractText}
            onChange={(e) => setAbstractText(e.target.value)}
            rows={4}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed resize-none"
          />

          <button
            type="submit"
            disabled={!isAccepting || !isAbstractValid || isSubmitting}
            className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-40 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-cyan-950/30"
          >
            {isSubmitting ? 'Transmitting Abstract payload...' : 'Request Handshake Connection'}
          </button>
        </form>
      )}

      {currentRole === 'investor' && (
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-center text-xs text-slate-400 font-mono">
          ⚙️ You are viewing your public configuration hub. Use the switch above to open or close your automated pitch intake boundaries.
        </div>
      )}
    </div>
  );
          }
