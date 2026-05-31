// app/api/milestones/submit/route.ts
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

    // 2. Identify the calling Builder's Database UUID using our lowercase matching rule
    const builderWallet = session.user.email; // Assuming wallet mapping matches session identity
    const { data: builderProfile, error: profileError } = await supabase
      .from('users')
      .select('id, role')
      .eq('wallet_address', builderWallet?.toLowerCase())
      .single();

    if (profileError || !builderProfile || builderProfile.role !== 'builder') {
      return NextResponse.json({ error: 'Access Denied: Only verified builders can submit milestone deliverables' }, { status: 403 });
    }

    // 3. Extract parameter payloads from the SubmitMilestoneForm form body
    const { milestoneId, proofUrl, notes } = await request.json();
    if (!milestoneId || !proofUrl) {
      return NextResponse.json({ error: 'Missing required attestation validation metrics' }, { status: 400 });
    }

    // 4. Update the milestone record row inside our 'milestones' relational table
    const { data, error } = await supabase
      .from('milestones')
      .update({
        status: 'under_review',
        proof_url: proofUrl,
        builder_notes: notes || null,
        submitted_at: new Date().toISOString()
      })
      .eq('id', milestoneId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      message: 'Milestone data successfully transitioned to under_review status', 
      data 
    });

  } catch (error: any) {
    console.error('Milestone Submission API Node Failure:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
