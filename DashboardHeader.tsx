// components/DashboardHeader.tsx
'use client';

import React from 'react';

interface DashboardHeaderProps {
  currentRole: 'builder' | 'investor';
}

export default function DashboardHeader({ currentRole }: DashboardHeaderProps) {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur px-6 py-4 flex justify-between items-center z-40">
      
      {/* Premium Web3 CSS Geometric Brand Icon Layout */}
      <div className="flex items-center gap-3">
        <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-lg flex items-center justify-center shadow-inner">
          <div className="h-2.5 w-2.5 bg-cyan-400 rotate-45 animate-pulse rounded-sm shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
        </div>
        <div className="flex items-baseline font-mono tracking-wider text-lg">
          <span className="font-extrabold text-slate-100">SYN</span>
          <span className="font-light text-cyan-400">APSE</span>
          <span className="text-[10px] text-slate-500 font-bold ml-1.5 px-1 bg-slate-900 rounded border border-slate-800">V2</span>
        </div>
      </div>
      
      {/* Active System Mode Indicators & Connected Web3 Wallet Context */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 bg-slate-900/60 border border-slate-800/80 px-3 py-1.5 rounded-xl text-xs font-mono">
          <span className="text-slate-500">Node:</span>
          <span className={currentRole === 'builder' ? 'text-cyan-400 font-bold' : 'text-emerald-400 font-bold'}>
            {currentRole.toUpperCase()}
          </span>
        </div>

        {/* Global WalletConnect AppKit Button Layer */}
        <appkit-button balance="show" />
      </div>

    </header>
  );
}
