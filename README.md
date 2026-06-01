# 🧠 Synapse Network Core V2 | Web3 Venture Operations Protocol

> **Official Submission for the "Mind the Product: Everyone Ships Now" Hackathon (June 20, 2026)**  
> Deployed Interactive Funnel: [Live v0.dev Interactive Prototype Sandbox](https://v0.dev)

Synapse V2 is an intelligent decentralized venture operations network that unifies networking, pitch validation, milestones tracking, and smart contract token distribution into a single responsive platform. Built explicitly to eliminate fragmented Web2 tools (LinkedIn, Telegram, DocuSign, Jira) by connecting verified digital delivery directly to cryptographic capital release.

---

## 🛠️ Relational Repository & Architecture Mapping

*   **`app/page.tsx`**: Main entry application cockpit orchestrating real-time state switches, onboarding funnels, and component rendering streams.
*   **`lib/types.ts`**: Strict TypeScript data contracts enforcing layout parameters, tracking structures, and database keys.
*   **`SynapseEscrow.sol`**: Deployed Solidity smart contract managing secure IERC20 stablecoin asset lockups and index-bound milestone routing transfers.
*   **`Schema.sql`**: Core PostgreSQL database blueprint defining identity records, spam-locked connection abstractions, detailed pitch models, and milestone progress arrays.
*   **`DashboardHeader.tsx`**: Global navigation header utilizing Web3 custom AppKit account configurations and identity role trackers.
*   **`InvestorProfileGateway.tsx`**: The pre-pitch connection gateway enforcing the 280-character maximum abstract boundary constraint.
*   **`DealFlowInbox.tsx`**: The investor deal ingestion console queue tracking pending handshake connection abstracts.
*   **`CreatePitchForm.tsx`**: The builder proposal form capturing immutable structural pitch titles, descriptions, and funding targets.
*   **`SubmitMilestoneForm.tsx`**: The proof-of-work attestation form capturing live GitHub PR or ledger validation hashes.
*   **`InvestorReviewConsole.tsx`**: The investor audit command center enforcing the 50-character mandatory dispute text constraint.
*   **`ChatSandbox.tsx`**: Built-in collaborative chat workspace panel allowing side-by-side builder-investor negotiation tracking.
*   **`TelemetryMonitor.tsx`**: Live console ticker logging background analytical streams directly onto the client interface layout view.

---

## 🚀 Native Hackathon Instrumentation (Novus.ai Telemetry)

In compliance with tracking guidelines, Synapse V2 is fully instrumented to broadcast key user lifecycle events directly through the global **Novus.ai SDK**:
1.  `user_authenticated`: Fired automatically upon Web3 wallet cryptographic profile handshakes.
2.  `connection_requested`: Emitted when a developer pushes a 280-character handshake request.
3.  `connection_accepted` / `connection_declined`: Logs the investor's inbox validation routing decision.
4.  `pitch_created`: Broadcasted when a validated connection submits project budget metrics.
5.  `milestone_submitted`: Ingested when a developer uploads proof of work attestation URLs.
6.  `milestone_approved` / `milestone_rejected`: Tracks final audit console distribution decisions.

---

## 🧑‍💻 Local Production Installation Guide

```bash
# Clone the clean-slate V2 repository
git clone https://github.com

# Install packages
npm install

# Configure environment credentials (.env.local)
NEXT_PUBLIC_NOVUS_PROJECT_TOKEN=HACKATHON_MIND_THE_PRODUCT_2026
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=YOUR_REOWN_ID

# Run the local development instance
npm run dev
```
