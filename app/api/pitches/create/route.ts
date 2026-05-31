// app/api/pitches/create/route.ts
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
    const builderWallet = session.user.email; // Assuming wallet mapping strategy inside session email block
    const { data: builderProfile, error: profileError } = await supabase
      .from('users')
      .select('id, role')
      .eq('wallet_address', builderWallet?.toLowerCase())
      .single();

    if (profileError || !builderProfile || builderProfile.role !== 'builder') {
      return NextResponse.json({ error: 'Access Denied: Only verified builder profiles can submit proposals' }, { status: 403 });
    }

    // 3. Extract parameter payloads from the form request body
    const { investorId, title, description, fundingGoal } = await request.json();
    if (!investorId || !title || !description || !fundingGoal) {
      return NextResponse.json({ error: 'Missing required pitch variables' }, { status: 400 });
    }

    // 4. Security Check: Confirm an active 'connected' relational handshake clearance exists
    const { data: activeConnection } = await supabase
      .from('network_connections')
      .select('status')
      .eq('builder_id', builderProfile.id)
      .eq('investor_id', investorId)
      .eq('status', 'connected')
      .single();

    if (!activeConnection) {
      return NextResponse.json({ error: 'Access Denied: You must establish an approved handshake connection before submitting pitches' }, { status: 403 });
    }

    // 5. Insert rows into the 'pitches' relational database tracker
    const { data, error } = await supabase
      .from('pitches')
      .insert({
        builder_id: builderProfile.id,
        investor_id: investorId,
        title,
        description,
        funding_goal: fundingGoal,
        status: 'review'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      message: 'Venture proposal successfully registered inside the deal flow queue', 
      data 
    });

  } catch (error: any) {
    console.error('Pitch Creation API Execution Node Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
                               }
