import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();

  const {
    name,
    city,
    state,
    country,
    hole_1_par, hole_2_par, hole_3_par,
    hole_4_par, hole_5_par, hole_6_par,
    hole_7_par, hole_8_par, hole_9_par,
    hole_10_par, hole_11_par, hole_12_par,
    hole_13_par, hole_14_par, hole_15_par,
    hole_16_par, hole_17_par, hole_18_par,
  } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: 'Course name is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('courses')
    .insert([{
      name: name.trim(),
      city: city?.trim() || null,
      state: state?.trim() || null,
      country: country?.trim() || null,
      hole_1_par, hole_2_par, hole_3_par,
      hole_4_par, hole_5_par, hole_6_par,
      hole_7_par, hole_8_par, hole_9_par,
      hole_10_par, hole_11_par, hole_12_par,
      hole_13_par, hole_14_par, hole_15_par,
      hole_16_par, hole_17_par, hole_18_par,
    }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ course: data }, { status: 201 });
}