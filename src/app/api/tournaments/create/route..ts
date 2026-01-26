import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

function generateNumericCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function generateUniqueCode() {
  let code;
  let exists = true;

  while (exists) {
    code = generateNumericCode();

    const { data } = await supabaseServer
      .from('tournaments')
      .select('id')
      .eq('public_code', code)
      .single();

    exists = !!data;
  }

  return code!;
}

export async function POST(req: Request) {
  const { name, courseId } = await req.json();

  if (!name || !courseId) {
    return NextResponse.json(
      { error: 'Tournament name and course required' },
      { status: 400 }
    );
  }

  const publicCode = await generateUniqueCode();
  const adminCode = await generateUniqueCode();

  const { data, error } = await supabaseServer
    .from('tournaments')
    .insert({
      name,
      course_id: courseId,
      public_code: publicCode,
      admin_code: adminCode,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
