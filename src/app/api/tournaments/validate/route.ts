import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { code } = await req.json();

  if (!code) {
    return NextResponse.json({ error: 'Code required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .eq('tournament_code', code)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 404 });
  }

  // You can add admin logic here if you have an admin_code column
  // For now, assuming all codes are for players
  const isAdmin = false;

  return NextResponse.json({
    tournamentId: data.tournament_id,
    isAdmin,
  });
}