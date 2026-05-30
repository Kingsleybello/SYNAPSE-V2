// components/DealFlowInbox.tsx
'use client';

import React, { useState } from 'react';

interface HandshakeRequest {
  id: string;
  builderWallet: string;
  requestAbstract: string;
  createdAt: string;
}

interface DealFlowInboxProps {
  initialRequests: HandshakeRequest[];
  onActionProcessed: () => void;
}

export default function DealFlowInbox({ 
  initialRequests, 
  onActionProcessed 
}: DealFlowInboxProps) {
  const [requests, setRequests] = useState<HandshakeRequest[]>(initialRequests);
  const [isProcessingId, setIsProcessingId] = useState<string | null>(null);

  const handleConnectionAction = async (requestId: string, action: 'accept' | 'decline') => {
    setIsProcessingId(requestId);
    try {
      const response = await fetch('/api/connections/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action }),
      });

      if (!response.ok) throw new Error(`Failed to process connection ${action} event`);

      // Trigger mandatory hackathon tracking via Novus.ai SDK
      if (typeof window !== 'undefined' && (window as any).novus) {
        (window as any).novus('track', `connection_${action}ed`, { requestId });
      }

      // Optimistically clean up the visual inbox queue layout
      setRequests(prev => prev.filter(req => req.id !== requestId));
      alert(`Handshake connection request successfully ${action}ed!`);
      onActionProcessed();
    } catch (error) {
      console.error(error);
      alert('Error saving handshake evaluation.');
    } finally {
      setIsProcessingId(null);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-2xl w-full space-y-6">
      {/* Inbox Subheader Block */}
      <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
        <div>
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Deal Flow Funnel</h3>
          <h2 className="text-xl font-bold text-slate-100 mt-1">Connection Requests Intake</h2>
        </div>
        <span className="bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs px-2.5 py-1 rounded-lg">
          Queue: {requests.length} Pending
        </span>
      </div>

      {/* Dynamic Inbox Content Node */}
      {requests.length === 0 ? (
        <div className="bg-slate-950/40 border border-dashed border-slate-800 rounded-xl p-8 text-center">
          <p className="text-slate-500 text-sm font-mono">📭 Your deal flow intake stream is completely optimized.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
          {requests.map((request) => (
            <div 
              key={request.id} 
              className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl space-y-3 transition-colors hover:border-slate-700"
            >
              {/* Card Meta Metadata Header */}
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono font-bold text-slate-400 truncate max-w-[200px]">
                  From: <span className="text-cyan-400">{request.builderWallet}</span>
                </span>
                <span className="text-slate-500 font-mono">
                  {new Date(request.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Gated Abstract Content Window */}
              <p className="text-sm text-slate-200 bg-slate-900/60 p-3 rounded-lg border border-slate-800/40 whitespace-pre-wrap leading-relaxed">
                {request.requestAbstract}
              </p>

              {/* Strategic Evaluation Choices Panel */}
              <div className="flex gap-2 justify-end pt-2 border-t border-slate-900">
                <button
                  disabled={isProcessingId !== null}
                  onClick={() => handleConnectionAction(request.id, 'decline')}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-rose-950/30 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-900/60 text-xs font-semibold rounded-lg transition-all"
                >
                  Decline
                </button>
                <button
                  disabled={isProcessingId !== null}
                  onClick={() => handleConnectionAction(request.id, 'accept')}
                  className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-lg shadow-md shadow-cyan-950/40 transition-all"
                >
                  {isProcessingId === request.id ? 'Syncing...' : '✓ Accept Connection'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
