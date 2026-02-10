import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log("Create tournament API hit");

  const body = await req.json();
  console.log("Body:", body);

  const { name, courseId } = body;

  if (!name || !courseId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const tournamentCode = crypto.getRandomValues(new Uint32Array(1))[0]
    .toString()
    .slice(0, 6);

  const { data, error } = await supabaseServer
    .from('tournaments')
    .insert([{ name, course_id: courseId, tournament_code: tournamentCode }])
    .select('tournament_code')
    .single();

  console.log("Supabase result:", { data, error });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}