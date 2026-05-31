// app/api/agreements/sign/route.ts
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    // 1. Enforce Web3 Active Wallet Session Validation
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized profile session' }, { status: 401 });
    }

    // 2. Resolve the calling user's lowercase address string
    const userWallet = session.user.email; // Assuming wallet address is mapped to session identity
    const { data: callerProfile, error: profileError } = await supabase
      .from('users')
      .select('id, role')
      .eq('wallet_address', userWallet?.toLowerCase())
      .single();

    if (profileError || !callerProfile) {
      return NextResponse.json({ error: 'Access Denied: Verified user profile required to execute agreements' }, { status: 403 });
    }

    // 3. Extract parameter payloads from the AgreementSigner interface
    const { projectId, role, signature } = await request.json();
    if (!projectId || !role || !signature || !['investor', 'builder'].includes(role)) {
      return NextResponse.json({ error: 'Missing or corrupted signature metrics' }, { status: 400 });
    }

    // Enforce role consistency: A user cannot sign an agreement utilizing a role they do not own
    if (callerProfile.role !== role) {
      return NextResponse.json({ error: 'Identity Mismatch: Cannot authorize signature with unauthorized system permissions' }, { status: 403 });
    }

    // 4. Resolve update parameter map based on caller role profile
    const updatePayload: any = {};
    if (role === 'investor') {
      updatePayload.investor_signature = signature;
    } else {
      updatePayload.builder_signature = signature;
    }

    // Fetch historical signature state metrics to calculate execution completeness parameters
    const { data: currentAgreement } = await supabase
      .from('agreements')
      .select('investor_signature, builder_signature')
      .eq('project_id', projectId)
      .single();

    if (!currentAgreement) {
      return NextResponse.json({ error: 'Data Gap: Target agreement structure not initialized' }, { status: 404 });
    }

    // Check if the current signing action completes the multi-party contract contract requirements
    const willBeFullyExecuted = 
      (role === 'investor' && currentAgreement.builder_signature) || 
      (role === 'builder' && currentAgreement.investor_signature);

    if (willBeFullyExecuted) {
      updatePayload.is_fully_executed = true;
      updatePayload.executed_at = new Date().toISOString();
    }

    // 5. Execute rows mutation inside the 'agreements' relational table
    const { data, error } = await supabase
      .from('agreements')
      .update(updatePayload)
      .eq('project_id', projectId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      message: willBeFullyExecuted ? 'Contract fully signed and active' : 'Signature logged in escrow queue queue', 
      data 
    });

  } catch (error: any) {
    console.error('Agreement Signature Node Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
