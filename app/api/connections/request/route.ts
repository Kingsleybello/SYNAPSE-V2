// app/api/connections/request/route.ts
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
    const builderWallet = session.user.email; // Assuming wallet mapping strategy inside email field
    const { data: builderProfile, error: profileError } = await supabase
      .from('users')
      .select('id, role')
      .eq('wallet_address', builderWallet?.toLowerCase())
      .single();

    if (profileError || !builderProfile || builderProfile.role !== 'builder') {
      return NextResponse.json({ error: 'Access Denied: Only verified builder profiles can initiate handshakes' }, { status: 403 });
    }

    // 3. Extract the incoming 280-character payload parameters
    const { investorId, requestAbstract } = await request.json();
    if (!investorId || !requestAbstract) {
      return NextResponse.json({ error: 'Missing baseline handshake arguments' }, { status: 400 });
    }

    // Enforce character-length boundary rules strictly on the server side for maximum safety
    if (requestAbstract.trim().length === 0 || requestAbstract.length > 280) {
      return NextResponse.json({ error: 'Data Breach: Request abstract must adhere to the 280-character restriction rule' }, { status: 400 });
    }

    // 4. Verify that the target Investor is actively open to receiving incoming cold pitches
    const { data: investorProfile } = await supabase
      .from('users')
      .select('is_accepting_pitches')
      .eq('id', investorId)
      .single();

    if (!investorProfile || !investorProfile.is_accepting_pitches) {
      return NextResponse.json({ error: 'Inbox Locked: This fund allocator is currently optimized and closed to incoming applications' }, { status: 422 });
    }

    // 5. Insert rows into the network_connections relational database tracker
    const { data, error } = await supabase
      .from('network_connections')
      .insert({
        builder_id: builderProfile.id,
        investor_id: investorId,
        request_abstract: requestAbstract,
        status: 'pending'
      })
      .select()
      .single();

    // Unique key violations signify a duplicate spam attempt by the user
    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Duplicate Lock: You have already submitted a pending handshake request to this manager' }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Handshake transaction payload successfully saved to the connection stream queue', 
      data 
    });

  } catch (error: any) {
    console.error('Handshake API Execution Node Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
