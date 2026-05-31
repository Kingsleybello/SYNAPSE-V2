// app/api/milestones/review/route.ts
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

    // 2. Identify the calling Investor's Database UUID using our lowercase matching rule
    const investorWallet = session.user.email; // Assuming wallet mapping strategy inside identity block
    const { data: investorProfile, error: profileError } = await supabase
      .from('users')
      .select('id, role')
      .eq('wallet_address', investorWallet?.toLowerCase())
      .single();

    if (profileError || !investorProfile || investorProfile.role !== 'investor') {
      return NextResponse.json({ error: 'Access Denied: Only verified investors can audit deliverables' }, { status: 403 });
    }

    // 3. Extract the evaluation payloads from the interface body
    const { milestoneId, action, feedback } = await request.json();
    if (!milestoneId || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Missing or corrupted audit criteria parameters' }, { status: 400 });
    }

    let nextStatus: 'released' | 'rejected';
    const currentTimestamp = new Date().toISOString();

    if (action === 'approve') {
      nextStatus = 'released';
    } else {
      // PRD Mandate Check: Strict 50 character server-side feedback length constraint
      if (!feedback || feedback.trim().length < 50) {
        return NextResponse.json({ error: 'Rule Breach: Rejections require a minimum 50-character constructive context statement' }, { status: 400 });
      }
      nextStatus = 'rejected';
    }

    // 4. Update off-chain tracking records inside our 'milestones' relational table
    const { data, error } = await supabase
      .from('milestones')
      .update({
        status: nextStatus,
        investor_feedback: action === 'reject' ? feedback : null,
        reviewed_at: currentTimestamp
      })
      .eq('id', milestoneId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      message: `Milestone audit complete. Status transitioned to ${nextStatus}`, 
      data 
    });

  } catch (error: any) {
    console.error('Milestone Evaluation API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
