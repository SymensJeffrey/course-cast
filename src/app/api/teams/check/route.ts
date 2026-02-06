import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { tournamentCode, teamName } = await request.json();

    if (!tournamentCode || !teamName) {
      return NextResponse.json(
        { error: 'Tournament code and team name are required' },
        { status: 400 }
      );
    }

    // Get the tournament
    const { data: tournament, error: tournamentError } = await supabase
      .from('tournaments')
      .select('tournament_id')
      .eq('tournament_code', tournamentCode)
      .single();

    if (tournamentError || !tournament) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      );
    }

    // Check if team exists
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('*')
      .eq('tournament_id', tournament.tournament_id)
      .eq('name', teamName)
      .single();

    if (teamError || !team) {
      return NextResponse.json(
        { exists: false },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { exists: true, team },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking team:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}