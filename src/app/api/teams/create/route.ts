import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const { tournamentCode, teamName } = await request.json();

    if (!tournamentCode || !teamName) {
      return NextResponse.json(
        { error: 'Tournament code and team name are required' },
        { status: 400 }
      );
    }

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

    // Check if team name already exists in this tournament
    const { data: existingTeam } = await supabase
      .from('teams')
      .select('team_id')
      .eq('tournament_id', tournament.tournament_id)
      .eq('name', teamName)
      .single();

    if (existingTeam) {
      return NextResponse.json(
        { error: 'Team name already exists in this tournament' },
        { status: 409 }
      );
    }

    // Create the team
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert({
        tournament_id: tournament.tournament_id,
        name: teamName,
      })
      .select()
      .single();

    if (teamError) {
      return NextResponse.json(
        { error: 'Failed to create team' },
        { status: 500 }
      );
    }

    return NextResponse.json({ team }, { status: 201 });
  } catch (error) {
    console.error('Error creating team:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}