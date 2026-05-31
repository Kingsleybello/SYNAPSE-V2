// SlideOutModal.tsx
'use client';

import React, { useState } from 'react';

interface SlideOutModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { proofUrl: string; notes: string }) => void;
}

export default function SlideOutModal({ 
  open, 
  onClose, 
  onSubmit 
}: SlideOutModalProps) {
  const [proofUrl, setProofUrl] = useState('');
  const [notes, setNotes] = useState('');

  if (!open) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofUrl.trim()) return alert('Please input an verification link!');
    
    onSubmit({
      proofUrl: proofUrl.trim(),
      notes: notes.trim(),
    });
    
    // Clear localized state variables post ingestion
    setProofUrl('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      
      {/* Darkened Screen Blur Shield Layer */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" 
      />

      {/* Floating Panel Box Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative z-10 scale-up">
        
        {/* Header Control Track */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Verification Gateway</span>
            <h3 className="text-base font-bold text-slate-100 mt-0.5">Submit Project Proof</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-500 hover:text-slate-300 font-mono text-sm px-1.5 py-0.5 bg-slate-950 border border-slate-800 rounded-md"
          >
            ✕
          </button>
        </div>

        {/* Entry Forms Body */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300 uppercase tracking-wide text-[10px]">
              Proof of Work Link (GitHub PR / Live URL)
            </label>
            <input
              type="url"
              required
              placeholder="https://github.com... or https://testnet.app"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300 uppercase tracking-wide text-[10px]">
              Notes / Technical Context
            </label>
            <textarea
              placeholder="Detail branch variables, contract addresses, deployment notes, or environment hashes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
            />
          </div>

          {/* Action Trigger Panels */}
          <div className="flex gap-2 justify-end pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-950 text-slate-400 text-xs font-semibold rounded-xl border border-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
            >
              Submit Deliverables
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
