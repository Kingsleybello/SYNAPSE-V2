// app/page.tsx - PART 1
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import DashboardHeader from '../DashboardHeader';
import InvestorProfileGateway from '../InvestorProfileGateway';
import DealFlowInbox from '../DealFlowInbox';
import CreatePitchForm from '../CreatePitchForm'; 
import SubmitMilestoneForm from '../SubmitMilestoneForm'; 
import InvestorReviewConsole from '../InvestorReviewConsole'; 
import KanbanBoard from '../KanbanBoard';
import SlideOutModal from '../SlideOutModal';
import ChatSandbox from '../ChatSandbox';
import TelemetryMonitor from '../TelemetryMonitor';

interface Card {
  id: string;
  title: string;
  escrowAmount: string;
  status: 'in-progress' | 'under-review' | 'released' | 'todo' | 'rejected';
  submissionData: any;
}

interface TelemetryLog {
  id: string;
  timestamp: Date;
  message: string;
  type: 'init' | 'event' | 'error';
}

interface ChatMessage {
  id: string;
  timestamp: Date;
  sender: 'builder' | 'investor' | 'system';
  message: string;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export default function SynapseDashboard() {
  const { address, isConnected } = useAppKitAccount();
  const [userRole, setUserRole] = useState<'builder' | 'investor'>('builder');
  
  // V2 Core Sandbox State Engine Parameters
  const [agreementComplete, setAgreementComplete] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'pending' | 'connected'>('none');
  const [pitchStatus, setPitchStatus] = useState<'none' | 'review' | 'accepted'>('none');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [celebrationActive, setCelebrationActive] = useState(false);

  const [slideOutOpen, setSlideOutOpen] = useState(false);
  const [auditPanelOpen, setAuditPanelOpen] = useState(false);

  const [card, setCard] = useState<Card>({
    id: "m-902",
    title: "Phase 1 MVP: Complete Web3 Relational Handshake Onboarding Funnel",
    escrowAmount: "0.50 ETH",
    status: "in-progress",
    submissionData: null,
  });

  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryLog[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: generateId(), timestamp: new Date(Date.now() - 300000), sender: "builder", message: "Hey, I am starting work on the network onboarding gateway." },
    { id: generateId(), timestamp: new Date(Date.now() - 240000), sender: "investor", message: "Perfect. Make sure the 280-char abstract constraint is enforced cleanly." }
  ]);

  const addTelemetryLog = useCallback((message: string, type: TelemetryLog['type'] = 'event') => {
    setTelemetryLogs(prev => [...prev, { id: generateId(), timestamp: new Date(), message, type }]);
  }, []);

  const addChatMessage = useCallback((sender: ChatMessage['sender'], message: string) => {
    setChatMessages(prev => [...prev, { id: generateId(), timestamp: new Date(), sender, message }]);
  }, []);

  useEffect(() => {
    addTelemetryLog("[Novus Initialized]: HACKATHON_MIND_THE_PRODUCT_2026", "init");
  }, [addTelemetryLog]);

  useEffect(() => {
    if (isConnected && address) {
      addTelemetryLog(`[Novus Event]: user_authenticated { wallet: '${address.substring(0, 6)}...', role: '${userRole}' }`);
    }
  }, [isConnected, address, userRole, addTelemetryLog]);

  const animateCardTransition = useCallback((newStatus: Card['status'], callback?: () => void) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCard(prev => ({ ...prev, status: newStatus }));
      setIsTransitioning(false);
      callback?.();
    }, 400);
  }, []);

  const handleViewModeChange = (mode: 'builder' | 'investor') => {
    setUserRole(mode);
    addTelemetryLog(`[Novus Event]: role_switched { newRole: '${mode}' }`);
  };

  const handleMockConnectionApproved = () => {
    setConnectionStatus('connected');
    addTelemetryLog("[Novus Event]: connection_accepted { requestId: 'req-402' }");
    addChatMessage("system", "🤖 SYSTEM: Handshake connection request APPROVED by Vera Global Ventures.");
  };

  const handleMockPitchAccepted = () => {
    setPitchStatus('accepted');
    addTelemetryLog("[Novus Event]: pitch_accepted { fundingGoal: '50000 USDC' }");
    addChatMessage("system", "🤖 SYSTEM: Venture proposal ACCEPTED. Phase 0 agreement parameters initialized.");
    setAgreementComplete(true);
  };

  const handleSubmitProof = (data: any) => {
    setCard(prev => ({ ...prev, submissionData: data }));
    setSlideOutOpen(false);
    addTelemetryLog("[Novus Event]: milestone_submitted { id: 'm-902' }");
    animateCardTransition("under-review");
    addChatMessage("system", `🤖 SYSTEM: Builder submitted proof link: ${data.proofUrl}`);
  };

  const handleApproveMilestone = () => {
    setCelebrationActive(true);
    addTelemetryLog("[Novus Event]: milestone_approved { payout: '0.50 ETH' }");
    animateCardTransition("released", () => {
      setTimeout(() => setCelebrationActive(false), 2500);
    });
    setAuditPanelOpen(false);
    addChatMessage("system", "🎉 SYSTEM CONFIRMATION: Milestone APPROVED. 0.50 ETH programmatic payout disbursed successfully!");
  };

  function handleSendChatMessage(message: string) {
    addChatMessage(userRole, message);
    addTelemetryLog(`[Novus Event]: chat_message_sent { from: '${userRole}' }`);
  }

  // --- WORKSPACE RENDERING BOUNDARY LAYER ---
    return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-all duration-300 ${celebrationActive ? "ring-4 ring-emerald-500/50 ring-inset" : ""}`}>
      
      {/* Interactive Milestone Celebration Overlay */}
      {celebrationActive && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-emerald-500/5 animate-pulse backdrop-blur-sm" />
          <div className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl tracking-wide animate-bounce border border-emerald-400/40">
            ✓ Programmatic Payout Disbursed — 0.50 ETH Sent
          </div>
        </div>
      )}

      <DashboardHeader currentRole={userRole} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 space-y-6 lg:space-y-8 pb-32">
        
        {/* Top Control Controller Frame */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
          <div>
            <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
              Synapse Network Core V2
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Venture Operations Hub: End-to-end sandbox pipeline tracking live from your repository layout.
            </p>
          </div>

          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/80">
            <button
              type="button"
              onClick={() => handleViewModeChange('builder')}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${userRole === 'builder' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Builder Terminal
            </button>
            <button
              type="button"
              onClick={() => handleViewModeChange('investor')}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${userRole === 'investor' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Investor Console
            </button>
          </div>
        </div>

        {/* Dynamic Multi-Stage Onboarding Funnel Grid */}
        <div className="w-full flex flex-col items-center gap-6 lg:gap-8">
          
          {userRole === 'builder' ? (
            <div className="w-full flex flex-col items-center gap-6 lg:gap-8">
              
              {/* Step 1: Handshake Channel */}
              {connectionStatus === 'none' && (
                <InvestorProfileGateway
                  investorId="inv-77"
                  investorName="Vera Global Ventures"
                  investorWallet="0x3bF...89a1"
                  isInitialAccepting={true}
                  currentRole={userRole}
                  onConnectionSubmitted={() => {
                    setConnectionStatus('pending');
                    addTelemetryLog("[Novus Event]: connection_requested { investorId: 'inv-77' }");
                  }}
                />
              )}

              {connectionStatus === 'pending' && (
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center max-w-md w-full shadow-xl space-y-4">
                  <div className="h-2 w-2 bg-amber-400 rounded-full animate-ping mx-auto" />
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Handshake Request Pending</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Your 280-character profile abstract is sitting inside the deal stream inbox. Detailed pitching unlocks upon approval.
                  </p>
                  <button 
                    type="button"
                    onClick={handleMockConnectionApproved}
                    className="w-full py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-[10px] uppercase tracking-wide font-bold text-cyan-400 hover:bg-slate-800 transition-colors"
                  >
                    💡 Simulate Investor Approval
                  </button>
                </div>
              )}

              {/* Step 2: Venture Proposal Form */}
              {connectionStatus === 'connected' && pitchStatus === 'none' && (
                <CreatePitchForm
                  investorId="inv-77"
                  investorName="Vera Global Ventures"
                  onPitchSubmitted={() => setPitchStatus('review')}
                />
              )}

              {pitchStatus === 'review' && (
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center max-w-md w-full shadow-xl space-y-4">
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Venture Proposal Under Audit</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Your stablecoin budget requirements have been transmitted. Capital lock parameters unlock upon pitch acceptance.
                  </p>
                  <button 
                    type="button"
                    onClick={handleMockPitchAccepted}
                    className="w-full py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-[10px] uppercase tracking-wide font-bold text-emerald-400 hover:bg-slate-800 transition-colors"
                  >
                    💡 Simulate Pitch Acceptance
                  </button>
                </div>
              )}

              {/* Step 3: Active Milestone Workspace */}
              {pitchStatus === 'accepted' && (
                <KanbanBoard
                  card={card}
                  viewMode={userRole}
                  isTransitioning={isTransitioning}
                  onOpenSubmitModal={() => setSlideOutOpen(true)}
                  onOpenAuditPanel={() => {}}
                />
              )}

            </div>
          ) : (
            /* Investor Profile Control Flows */
            <div className="w-full flex flex-col items-center gap-6 lg:gap-8">
              {pitchStatus === 'accepted' && card.status === 'under-review' ? (
                <div className="w-full flex flex-col items-center gap-6">
                  <KanbanBoard
                    card={card}
                    viewMode={userRole}
                    isTransitioning={isTransitioning}
                    onOpenSubmitModal={() => {}}
                    onOpenAuditPanel={() => setAuditPanelOpen(true)}
                  />
                  {auditPanelOpen && (
                    <InvestorReviewConsole
                      milestone={{
                        id: card.id,
                        title: card.title,
                        proofUrl: card.submissionData?.proofUrl || 'https://github.com',
                        builderNotes: card.submissionData?.notes || 'Core network gateway files successfully structured inside the root layout.',
                        amountEscrowed: card.escrowAmount
                      }}
                      onReviewComplete={handleApproveMilestone}
                    />
                  )}
                </div>
              ) : pitchStatus === 'accepted' && card.status === 'released' ? (
                <KanbanBoard
                  card={card}
                  viewMode={userRole}
                  isTransitioning={isTransitioning}
                  onOpenSubmitModal={() => {}}
                  onOpenAuditPanel={() => {}}
                />
              ) : (
                /* Fallback Default Investor Intake Queue view */
                <div className="w-full flex flex-col items-center gap-6">
                  <DealFlowInbox
                    initialRequests={connectionStatus === 'none' ? mockIncomingRequests : []}
                    onActionProcessed={() => setConnectionStatus('connected')}
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
              )}
            </div>
          )}

          {/* Persistent Sandbox Operational Communication Feed & Telemetry Monitors */}
          <div className="grid grid-cols-1 w-full gap-6">
            <ChatSandbox 
              messages={chatMessages} 
              viewMode={userRole} 
              onSendMessage={(txt) => handleSendChatMessage(txt)} 
            />
            <TelemetryMonitor logs={telemetryLogs} />
          </div>

        </div>
      </main>

      {/* Slide-over Builder Drawer Element */}
      <SlideOutModal
        open={slideOutOpen}
        onClose={() => setSlideOutOpen(false)}
        onSubmit={handleSubmitProof}
      />
    </div>
  );
              }

