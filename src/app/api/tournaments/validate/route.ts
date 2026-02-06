import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { code } = await req.json();

  if (!code) {
    return NextResponse.json({ error: 'Code required' }, { status: 400 });
  }

  const { data, error } = await supabaseServer
    .from('tournaments')
    .select('*')
    .or(`tournament_code.eq.${code}`)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 404 });
  }

  const isAdmin = data.admin_code === code;

  return NextResponse.json({
    tournamentId: data.id,
    isAdmin,
    publicCode: data.public_code,
    adminCode: data.admin_code,
  });
}
