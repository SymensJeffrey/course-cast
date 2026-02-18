import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET() {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      course_id,
      name,
      location,
      hole_1_par,
      hole_2_par,
      hole_3_par,
      hole_4_par,
      hole_5_par,
      hole_6_par,
      hole_7_par,
      hole_8_par,
      hole_9_par,
      hole_10_par,
      hole_11_par,
      hole_12_par,
      hole_13_par,
      hole_14_par,
      hole_15_par,
      hole_16_par,
      hole_17_par,
      hole_18_par
    `)
    .order('name');

  if (error) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ courses: data });
}