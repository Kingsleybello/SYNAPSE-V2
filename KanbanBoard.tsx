// KanbanBoard.tsx
'use client';

import React from 'react';

interface Card {
  id: string;
  title: string;
  escrowAmount: string;
  status: 'in-progress' | 'under-review' | 'released' | 'todo' | 'rejected';
  submissionData: any;
}

interface KanbanBoardProps {
  card: Card;
  viewMode: 'builder' | 'investor';
  isTransitioning: boolean;
  onOpenSubmitModal: () => void;
  onOpenAuditPanel: () => void;
}

export default function KanbanBoard({
  card,
  viewMode,
  isTransitioning,
  onOpenSubmitModal,
  onOpenAuditPanel
}: KanbanBoardProps) {
  
  const columns = [
    { key: 'in-progress', title: 'Development: In Progress', border: 'border-slate-800' },
    { key: 'under-review', title: 'Escrow Pipeline: Under Review', border: 'border-slate-800' },
    { key: 'released', title: 'Programmatic Disbursed: Paid', border: 'border-emerald-900/50' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start">
      {columns.map((col) => {
        const hasCard = card.status === col.key;

        return (
          <div 
            key={col.key} 
            className={`bg-slate-900/50 border ${col.border} rounded-2xl p-4 flex flex-col min-h-[260px] transition-all duration-300 shadow-lg`}
          >
            {/* Column Label Track */}
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2.5">
              <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                {col.title}
              </span>
              <span className="text-xs bg-slate-950 border border-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded-md">
                {hasCard ? '1' : '0'}
              </span>
            </div>

            {/* Dynamic Card Ingestion Window */}
            <div className="flex-1 space-y-4">
              {hasCard && (
                <div 
                  className={`p-4 rounded-xl transition-all duration-300 ${
                    isTransitioning ? 'opacity-30 scale-95' : 'opacity-100 scale-100'
                  } ${
                    card.status === 'released'
                      ? 'bg-gradient-to-br from-slate-900 to-emerald-950/20 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                      : card.status === 'under-review'
                        ? 'bg-slate-900 border border-amber-500/30 animate-pulse'
                        : 'bg-slate-900 border border-slate-800/80 shadow-inner'
                  }`}
                >
                  <h4 className="text-sm font-semibold text-slate-100 leading-snug">
                    {card.title}
                  </h4>
                  
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-slate-400">Escrow Block Allocation:</span>
                      <span className="font-mono text-xs font-extrabold text-emerald-400 bg-slate-950/80 border border-slate-800 px-2 py-0.5 rounded">
                        {card.escrowAmount}
                      </span>
                    </div>

                    {/* Context Specific Operational Action Triggers */}
                    {card.status === 'in-progress' && viewMode === 'builder' && (
                      <button
                        onClick={onOpenSubmitModal}
                        className="w-full mt-1 py-2 bg-cyan-600/10 hover:bg-cyan-600 text-cyan-400 hover:text-white text-xs font-bold rounded-lg border border-cyan-500/30 transition-all active:scale-95 shadow-md"
                      >
                        🚀 Submit Proof of Work
                      </button>
                    )}

                    {card.status === 'under-review' && viewMode === 'investor' && (
                      <button
                        onClick={onOpenAuditPanel}
                        className="w-full mt-1 py-2 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white text-xs font-bold rounded-lg border border-emerald-500/30 transition-all active:scale-95 shadow-md"
                      >
                        ⚖️ Open Audit Console
                      </button>
                    )}

                    {card.status === 'released' && (
                      <div className="text-center bg-emerald-950/20 border border-emerald-900/40 text-emerald-400 text-[10px] font-mono font-bold tracking-wide uppercase py-1 rounded-md">
                        ✓ On-Chain Settlement Finalized
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
}
