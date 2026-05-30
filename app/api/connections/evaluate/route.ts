// app/api/connections/evaluate/route.ts
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
    const investorWallet = session.user.email; // Assuming wallet mapping strategy inside email field
    const { data: investorProfile, error: profileError } = await supabase
      .from('users')
      .select('id, role')
      .eq('wallet_address', investorWallet?.toLowerCase())
      .single();

    if (profileError || !investorProfile || investorProfile.role !== 'investor') {
      return NextResponse.json({ error: 'Access Denied: Only verified investor profiles can evaluate connections' }, { status: 403 });
    }

    // 3. Extract the evaluation payload parameters
    const { requestId, action } = await request.json();
    if (!requestId || !action || !['accept', 'decline'].includes(action)) {
      return NextResponse.json({ error: 'Missing or invalid evaluation routing choice' }, { status: 400 });
    }

    const nextStatus = action === 'accept' ? 'connected' : 'declined';

    // 4. Update the row state inside the network_connections relational table
    const { data, error } = await supabase
      .from('network_connections')
      .update({ 
        status: nextStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .eq('investor_id', investorProfile.id) // Security Parameter: Confirms the evaluator owns this inbox row
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      message: `Handshake connection status effectively transitioned to ${nextStatus}`, 
      data 
    });

  } catch (error: any) {
    console.error('Handshake Evaluation Node Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
