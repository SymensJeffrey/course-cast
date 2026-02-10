import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    // Get tournament with course info
    const { data: tournament, error: tournamentError } = await supabase
      .from('tournaments')
      .select(`
        tournament_id,
        course_id,
        courses (
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
        )
      `)
      .eq('tournament_code', code)
      .single();

    if (tournamentError || !tournament) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      );
    }

    // Get all teams for this tournament, ordered by total score
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('*')
      .eq('tournament_id', tournament.tournament_id)
      .order('total_score', { ascending: true, nullsFirst: false });

    if (teamsError) {
      return NextResponse.json(
        { error: 'Failed to fetch teams' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      teams,
      course: tournament.courses
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching scoreboard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}