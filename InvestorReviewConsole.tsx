// InvestorReviewConsole.tsx
'use client';

import React, { useState } from 'react';

interface MilestoneData {
  id: string;
  title: string;
  proofUrl: string;
  builderNotes?: string;
  amountEscrowed: string;
}

interface InvestorReviewConsoleProps {
  milestone: MilestoneData;
  onReviewComplete: () => void;
}

export default function InvestorReviewConsole({ 
  milestone, 
  onReviewComplete 
}: InvestorReviewConsoleProps) {
  const [isRejecting, setIsRejecting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MIN_FEEDBACK_LENGTH = 50;
  const isFeedbackValid = feedback.trim().length >= MIN_FEEDBACK_LENGTH;

  const handleReview = async (action: 'approve' | 'reject') => {
    if (action === 'reject' && !isFeedbackValid) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/milestones/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          milestoneId: milestone.id,
          action,
          feedback: action === 'reject' ? feedback : undefined
        }),
      });

      if (!response.ok) throw new Error('Review processing failure');

      if (typeof window !== 'undefined' && (window as any).novus) {
        (window as any).novus('track', `milestone_${action}d`, { milestoneId: milestone.id });
      }

      alert(`Milestone successfully ${action}ed!`);
      setIsRejecting(false);
      setFeedback('');
      onReviewComplete();
    } catch (error) {
      console.error(error);
      alert('Error broadcasting evaluation state.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-2xl w-full space-y-6 shadow-2xl">
      <div className="border-b border-slate-800 pb-4 flex justify-between items-start">
        <div>
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Audit Console</h3>
          <h2 className="text-xl font-bold text-slate-100 mt-1">{milestone.title}</h2>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Escrow Share</span>
          <p className="text-lg font-mono font-bold text-emerald-400">{milestone.amountEscrowed} ETH</p>
        </div>
      </div>

      <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800/60">
        <div>
          <h4 className="text-xs font-semibold text-slate-400">Attestation Deliverable</h4>
          <a href={milestone.proofUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:underline break-all block mt-0.5">
            {milestone.proofUrl}
          </a>
        </div>
        {milestone.builderNotes && (
          <div>
            <h4 className="text-xs font-semibold text-slate-400">Builder Context</h4>
            <p className="text-sm text-slate-300 mt-0.5 whitespace-pre-wrap">{milestone.builderNotes}</p>
          </div>
        )}
      </div>

      {!isRejecting ? (
        <div className="flex gap-4">
          <button
            onClick={() => handleReview('approve')}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all"
          >
            {isSubmitting ? 'Signing Approval...' : '✓ Approve & Release Funds'}
          </button>
          <button
            onClick={() => setIsRejecting(true)}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-slate-800 hover:bg-rose-950/40 hover:text-rose-400 border border-slate-700 hover:border-rose-900 disabled:opacity-50 text-slate-300 font-medium rounded-xl text-sm transition-all"
          >
            Dispute Deliverable
          </button>
        </div>
      ) : (
        <div className="space-y-4 pt-2 border-t border-slate-800/80">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-rose-400 uppercase tracking-wide">Mandatory Dispute Context</label>
            <span className={`text-xs font-mono ${isFeedbackValid ? 'text-emerald-400' : 'text-slate-500'}`}>
              {feedback.length}/{MIN_FEEDBACK_LENGTH} chars min
            </span>
          </div>
          <textarea
            placeholder="Explain exactly what verification parameters failed or what elements require updates..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500 resize-none"
          />
          <div className="flex gap-3">
            <button
              onClick={() => handleReview('reject')}
              disabled={!isFeedbackValid || isSubmitting}
              className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-30 text-white font-semibold text-sm rounded-xl transition-all"
            >
              {isSubmitting ? 'Syncing Dispute...' : 'Confirm Rejection Flow'}
            </button>
            <button onClick={() => { setIsRejecting(false); setFeedback(''); }} disabled={isSubmitting} className="px-4 py-2.5 bg-slate-800 text-slate-300 text-sm rounded-xl">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
