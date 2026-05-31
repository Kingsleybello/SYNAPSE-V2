// lib/types.ts

// 1. Web3 Permissions & UI Interface Layout Toggles
export type ViewMode = 'builder' | 'investor';

// 2. Relational Pre-Pitch Connection Handshake States
export type ConnectionStatus = 'pending' | 'connected' | 'declined';

// 3. Complete Venture Proposal Pitch States
export type PitchStatus = 'review' | 'accepted' | 'rejected';

// 4. Milestone Task Execution Workflow Positions
export type CardStatus = 'todo' | 'in-progress' | 'under-review' | 'rejected' | 'released';

// 5. Structure for Main Kanban Core Content Units
export interface Card {
  id: string;
  title: string;
  escrowAmount: string;
  status: CardStatus;
  submissionData: SubmissionData | null;
}

// 6. Data Matrix for Builder Attestation Links
export interface SubmissionData {
  proofUrl: string;
  notes?: string;
}

// 7. Data Structure for In-App Live Collaboration Feeds
export interface ChatMessage {
  id: string;
  timestamp: Date;
  sender: 'builder' | 'investor' | 'system';
  message: string;
}

// 8. Strict Data Interface for Mandatory Novus.ai Telemetry Records
export interface TelemetryLog {
  id: string;
  timestamp: Date;
  message: string;
  type: 'init' | 'event' | 'error';
}
