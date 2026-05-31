// app/api/investor/toggle-status/route.ts
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

    // 2. Identify and verify that the calling profile is an authorized investor
    const userWallet = session.user.email; // Assuming wallet mapping matches session identity
    const { data: callerProfile, error: profileError } = await supabase
      .from('users')
      .select('id, role')
      .eq('wallet_address', userWallet?.toLowerCase())
      .single();

    if (profileError || !callerProfile || callerProfile.role !== 'investor') {
      return NextResponse.json({ error: 'Access Denied: Only verified investor accounts can alter ingestion parameters' }, { status: 403 });
    }

    // 3. Extract the incoming parameters from the form request body
    const { investorId, isAccepting } = await request.json();
    if (investorId === undefined || isAccepting === undefined) {
      return NextResponse.json({ error: 'Missing required configuration status variables' }, { status: 400 });
    }

    // Security Parameter: Investors can only modify their own profile rows
    if (callerProfile.id !== investorId) {
      return NextResponse.json({ error: 'Data Breach: You cannot modify availability tokens for another fund allocator' }, { status: 403 });
    }

    // 4. Execute mutation inside the 'users' relational database table
    const { data, error } = await supabase
      .from('users')
      .update({ is_accepting_pitches: isAccepting })
      .eq('id', investorId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      message: `Global pitch intake status successfully updated to ${isAccepting ? 'OPEN' : 'LOCKED'}`, 
      data 
    });

  } catch (error: any) {
    console.error('Investor Toggle API Node Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
