// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAppKitAccount } from '@reown/appkit/react';
import DashboardHeader from '../DashboardHeader'; // Path Fixed
import InvestorProfileGateway from '../InvestorProfileGateway'; // Path Fixed
import DealFlowInbox from '../DealFlowInbox'; // Path Fixed
import CreatePitchForm from './components/CreatePitchForm';
import SubmitMilestoneForm from './components/SubmitMilestoneForm';
import InvestorReviewConsole from './components/InvestorReviewConsole';

export default function Page() {
  const { address, isConnected } = useAppKitAccount();
  const [userRole, setUserRole] = useState<'builder' | 'investor'>('builder');
  
  // V2 Core Handshake & Onboarding State Machine
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'pending' | 'connected'>('none');
  const [pitchStatus, setPitchStatus] = useState<'none' | 'review' | 'accepted'>('none');
  const [milestoneStatus, setMilestoneStatus] = useState<'in_progress' | 'under_review' | 'released'>('in_progress');

  // Simulated Inbound Handshake Queue data for the Investor Dashboard view
  const mockIncomingRequests = [
    {
      id: 'req-402',
      builderWallet: '0x71C...7f2d',
      requestAbstract: 'Building decentralized high-speed liquidity vaults on Arbitrum Sepolia. Solving cross-chain capital inefficiencies via programmatic milestone escrow routers.',
      createdAt: new Date().toISOString()
    }
  ];

  // Automated Identity & Metric Syncing Hooks
  useEffect(() => {
    if (isConnected && address) {
      if (typeof window !== 'undefined' && (window as any).novus) {
        (window as any).novus('track', 'user_authenticated', { wallet: address.toLowerCase(), role: userRole });
      }
    }
  }, [isConnected, address, userRole]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100 antialiased">
      <DashboardHeader currentRole={userRole} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8 pb-24">
        
        {/* Unified Platform Controller Panel */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
              Synapse Network Core V2
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Venture Operations Hub: From verified network connections to automated smart contract distributions.
            </p>
          </div>

          {/* Persona Switcher Toggle Button Track */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setUserRole('builder')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${userRole === 'builder' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Builder Terminal
            </button>
            <button
              onClick={() => setUserRole('investor')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${userRole === 'investor' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Investor Console
            </button>
          </div>
        </div>

        {/* Dynamic Funnel Flow Routing Node */}
        <div className="flex justify-center items-start w-full">
          {userRole === 'builder' ? (
            <div className="w-full flex flex-col items-center gap-8 animate-fade-in">
              {/* Sequence 1: Gated Handshake Channel */}
              {connectionStatus === 'none' && (
                <InvestorProfileGateway
                  investorId="inv-77"
                  investorName="Vera Global Ventures"
                  investorWallet="0x3bF...89a1"
                  isInitialAccepting={true}
                  currentRole={userRole}
                  onConnectionSubmitted={() => setConnectionStatus('pending')}
                />
              )}

              {connectionStatus === 'pending' && (
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center max-w-md w-full shadow-lg">
                  <div className="h-2 w-2 bg-amber-400 rounded-full animate-ping mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-200">Handshake Connection Pending</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Your 280-character abstract payload is sitting securely inside the investor deal stream box. Phase 2 pitching unlocks instantly upon approval.
                  </p>
                  <button 
                    onClick={() => setConnectionStatus('connected')} 
                    className="mt-4 px-4 py-1.5 bg-slate-800 text-slate-300 text-[10px] uppercase font-bold rounded-lg hover:bg-slate-700 border border-slate-700"
                  >
                    Simulate Investor Approval
                  </button>
                </div>
              )}

              {/* Sequence 2: Detailed Venture Pitch Form Allocation */}
              {connectionStatus === 'connected' && pitchStatus === 'none' && (
                <CreatePitchForm
                  investorId="inv-77"
                  investorName="Vera Global Ventures"
                  onPitchSubmitted={() => setPitchStatus('review')}
                />
              )}

              {/* Sequence 3: Milestone Development Workspace */}
              {pitchStatus === 'review' && (
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center max-w-md w-full shadow-lg">
                  <h3 className="text-base font-bold text-slate-200">Proposal Under Review</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Your venture thesis and timeline allocations have been broadcasted. Capital escrow parameters initialization unlocks upon acceptance.
                  </p>
                  <button 
                    onClick={() => setPitchStatus('accepted')} 
                    className="mt-4 px-4 py-1.5 bg-slate-800 text-slate-300 text-[10px] uppercase font-bold rounded-lg hover:bg-slate-700 border border-slate-700"
                  >
                    Simulate Pitch Acceptance
                  </button>
                </div>
              )}

              {pitchStatus === 'accepted' && (
                <div className="w-full flex justify-center">
                  {milestoneStatus === 'in_progress' ? (
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center max-w-md w-full shadow-lg">
                      <h3 className="text-base font-bold text-slate-200">Milestone Contract Deployed</h3>
                      <p className="text-xs text-slate-400 mt-1.5">Development pipeline is fully unlocked. Escrow capital is secured on-chain.</p>
                    </div>
                  ) : (
                    <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center max-w-md w-full">
                      <p className="text-cyan-400 text-3xl mb-2">✓</p>
                      <h3 className="text-base font-bold text-slate-200">Milestone Complete</h3>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Investor Control Panel Execution Stream */
            <div className="w-full flex flex-col items-center gap-8 animate-fade-in">
              <div className="w-full flex flex-col items-center gap-6">
                <DealFlowInbox
                  initialRequests={mockIncomingRequests}
                  onActionProcessed={() => alert('Deal stream queue updated.')}
                />
                <InvestorProfileGateway
                  investorId="inv-77"
                  investorName="Vera Global Ventures"
                  investorWallet="0x3bF...89a1"
                  isInitialAccepting={true}
                  currentRole={userRole}
                  onConnectionSubmitted={() => {}}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
