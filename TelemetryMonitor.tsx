// TelemetryMonitor.tsx
'use client';

import React from 'react';

interface TelemetryLog {
  id: string;
  timestamp: Date;
  message: string;
  type: 'init' | 'event' | 'error';
}

interface TelemetryMonitorProps {
  logs: TelemetryLog[];
}

export default function TelemetryMonitor({ logs }: TelemetryMonitorProps) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 w-full font-mono text-[11px] shadow-2xl relative overflow-hidden">
      
      {/* Terminal Bar Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-slate-400 font-bold tracking-wide uppercase text-[10px]">
            Novus.ai SDK Compliance Monitor
          </span>
        </div>
        <div className="text-slate-500 text-[10px] uppercase font-bold">
          Logs: {logs.length}
        </div>
      </div>

      {/* Terminal Log Output Stream */}
      <div className="h-24 max-h-24 overflow-y-auto space-y-1.5 pr-1 leading-normal selection:bg-cyan-500/20">
        {logs.length === 0 ? (
          <p className="text-slate-600 italic">SYSTEM LISTENER STANDING BY FOR WEB3 ACTIVITY PAYLOADS...</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 break-all">
              <span className="text-slate-600 select-none">
                [{new Date(log.timestamp).toLocaleTimeString()}]
              </span>
              <span 
                className={`${
                  log.type === 'init' 
                    ? 'text-purple-400 font-bold' 
                    : log.type === 'error' 
                      ? 'text-rose-400' 
                      : 'text-emerald-400'
                }`}
              >
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>

    </div>
  );
                }
