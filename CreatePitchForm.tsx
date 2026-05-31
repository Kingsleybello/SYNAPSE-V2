// CreatePitchForm.tsx
'use client';

import React, { useState } from 'react';

interface CreatePitchFormProps {
  investorId: string;
  investorName: string;
  onPitchSubmitted: () => void;
}

export default function CreatePitchForm({ 
  investorId, 
  investorName, 
  onPitchSubmitted 
}: CreatePitchFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fundingGoal, setFundingGoal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !fundingGoal) return alert('Please complete all proposal criteria!');

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/pitches/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investorId,
          title,
          description,
          fundingGoal: parseFloat(fundingGoal)
        }),
      });

      if (!response.ok) throw new Error('Venture pitch transmission failed');

      if (typeof window !== 'undefined' && (window as any).novus) {
        (window as any).novus('track', 'pitch_created', { investorId, fundingGoal });
      }

      alert('Venture pitch successfully broadcasted to investor inbox!');
      setTitle('');
      setDescription('');
      setFundingGoal('');
      onPitchSubmitted();
    } catch (error) {
      console.error(error);
      alert('Error saving venture pitch variables.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-xl w-full space-y-4 shadow-2xl">
      <div>
        <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Phase 1: Deal Pitching</h3>
        <h2 className="text-lg font-bold text-slate-100 mt-1">Submit Proposal to {investorName}</h2>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-300">Project / Proposal Title</label>
        <input
          type="text"
          required
          placeholder="e.g., Synapse Multi-Chain Liquidity Vaults"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">Target Funding Goal (USDC)</label>
          <input
            type="number"
            required
            placeholder="50000"
            value={fundingGoal}
            onChange={(e) => setFundingGoal(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">Target L2 Chain Node</label>
          <div className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-400 font-mono">
            Arbitrum / Base Sepolia
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-300">Venture Thesis & Milestone Layout</label>
        <textarea
          required
          placeholder="Detail your value proposition, engineering timeline, and milestone budget allocations..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-lg"
      >
        {isSubmitting ? 'Broadcasting Proposal...' : 'Transmit Venture Pitch'}
      </button>
    </form>
  );
}
