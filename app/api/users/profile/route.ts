// app/api/users/profile/route.ts
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    // 1. Extract the target wallet execution address parameter from the incoming URL query string
    const { searchParams } = new URL(request.url);
    const rawAddress = searchParams.get('address');

    if (!rawAddress || rawAddress.trim().length !== 42) {
      return NextResponse.json({ error: 'Missing or corrupted cryptographic address parameter' }, { status: 400 });
    }

    const sanitizedAddress = rawAddress.trim().toLowerCase();

    // 2. Query the 'users' relational table for an existing role-allocation record
    let { data: profile, error } = await supabase
      .from('users')
      .select('id, wallet_address, role, is_accepting_pitches')
      .eq('wallet_address', sanitizedAddress)
      .maybeSingle();

    if (error) throw error;

    // 3. Fallback Onboarding Strategy: If the wallet address is new, register them automatically
    if (!profile) {
      const { data: newProfile, error: insertError } = await supabase
        .from('users')
        .insert({
          wallet_address: sanitizedAddress,
          role: 'builder', // Default sandbox role assignment for onboarding evaluators
          is_accepting_pitches: false
        })
        .select()
        .single();

      if (insertError) throw insertError;
      profile = newProfile;
    }

    // 4. Return the synchronized profile parameters to the dashboard layout client
    return NextResponse.json({
      success: true,
      profile
    });

  } catch (error: any) {
    console.error('Identity Resolution API Node Failure:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
