import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { teamId, holeNumber, score } = await request.json();

    if (!teamId || !holeNumber || score === undefined) {
      return NextResponse.json(
        { error: 'Team ID, hole number, and score are required' },
        { status: 400 }
      );
    }

    if (holeNumber < 1 || holeNumber > 18) {
      return NextResponse.json(
        { error: 'Hole number must be between 1 and 18' },
        { status: 400 }
      );
    }

    if (score < 1 || score > 20) {
      return NextResponse.json(
        { error: 'Score must be between 1 and 20' },
        { status: 400 }
      );
    }

    // Update the specific hole score
    const columnName = `hole_${holeNumber}`;
    const { data, error } = await supabase
      .from('teams')
      .update({ [columnName]: score })
      .eq('team_id', teamId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to update score' },
        { status: 500 }
      );
    }

    return NextResponse.json({ team: data }, { status: 200 });
  } catch (error) {
    console.error('Error updating score:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}