'use client';

import { useMemo } from 'react';
import { use } from 'react';

export default function TournamentPage({
  params,
  searchParams
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ team?: string }>;
}) {
  const { code } = use(params);
  const { team: teamFromUrl } = use(searchParams);

  // Use useMemo to get team name from URL or localStorage
  const teamName = useMemo(() => {
    if (teamFromUrl) {
      return teamFromUrl;
    }

    if (typeof window !== 'undefined') {
      const storedTeam = localStorage.getItem(`team_${code}`);
      if (storedTeam) {
        try {
          const teamData = JSON.parse(storedTeam);
          return teamData.teamName;
        } catch (e) {
          console.error('Error parsing stored team data:', e);
        }
      }
    }

    return '';
  }, [code, teamFromUrl]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Tournament Scoreboard</h1>
      <p>Code: {code}</p>
      {teamName && <p>Team: {teamName}</p>}
    </div>
  );
}