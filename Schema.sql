-- Schema.sql: Synapse-V2 Production Relational Database Layout

-- 1. Core User Identities & Web3 Permission States
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address VARCHAR(42) UNIQUE NOT NULL, -- Standard lowercase execution address string
    role VARCHAR(20) CHECK (role IN ('builder', 'investor')) NOT NULL,
    is_accepting_pitches BOOLEAN DEFAULT TRUE, -- Global investor visibility flag
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Pre-Pitch Web3 Relational Handshake Tracker
CREATE TABLE network_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    builder_id UUID REFERENCES users(id) ON DELETE CASCADE,
    investor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) CHECK (status IN ('pending', 'connected', 'declined')) DEFAULT 'pending',
    request_abstract VARCHAR(280) NOT NULL, -- Strict 280 character constraint limit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(builder_id, investor_id) -- Prevents duplicate connection spamming at database tier
);

-- 3. Detailed Venture Proposals & Deal Flow Funnel
CREATE TABLE pitches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    builder_id UUID REFERENCES users(id) ON DELETE CASCADE,
    investor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    funding_goal NUMERIC NOT NULL,
    status VARCHAR(20) CHECK (status IN ('review', 'accepted', 'rejected')) DEFAULT 'review',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Phase 0 Cryptographic Venture Agreements
CREATE TABLE agreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pitch_id UUID REFERENCES pitches(id) ON DELETE CASCADE,
    agreement_text TEXT NOT NULL,
    total_funding_amount NUMERIC NOT NULL,
    investor_signature VARCHAR(132), -- Cryptographic hash from investor wallet signature
    builder_signature VARCHAR(132),  -- Cryptographic hash from builder wallet signature
    is_fully_executed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    executed_at TIMESTAMP WITH TIME ZONE
);

-- 5. Milestone Delivery & Smart Contract Payout Trackers
CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agreement_id UUID REFERENCES agreements(id) ON DELETE CASCADE,
    blockchain_index INT NOT NULL, -- Maps directly to SynapseEscrow.sol array indexes
    title VARCHAR(255) NOT NULL,
    amount_escrowed NUMERIC NOT NULL,
    status VARCHAR(20) CHECK (status IN ('locked', 'in_progress', 'under_review', 'rejected', 'released')) DEFAULT 'locked',
    proof_url TEXT,
    builder_notes TEXT,
    investor_feedback TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE,
    reviewed_at TIMESTAMP WITH TIME ZONE
);
