'use client';

import { useMemo, useEffect, useState } from 'react';
import { use } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Team {
  team_id: string;
  name: string;
  hole_1: number | null;
  hole_2: number | null;
  hole_3: number | null;
  hole_4: number | null;
  hole_5: number | null;
  hole_6: number | null;
  hole_7: number | null;
  hole_8: number | null;
  hole_9: number | null;
  hole_10: number | null;
  hole_11: number | null;
  hole_12: number | null;
  hole_13: number | null;
  hole_14: number | null;
  hole_15: number | null;
  hole_16: number | null;
  hole_17: number | null;
  hole_18: number | null;
  front_nine: number;
  back_nine: number;
  total_score: number;
}

export default function TournamentPage({
  params,
  searchParams
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ team?: string }>;
}) {
  const { code } = use(params);
  const { team: teamFromUrl } = use(searchParams);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    async function fetchScoreboard() {
      try {
        const res = await fetch(`/api/tournaments/${code}/scoreboard`);
        if (res.ok) {
          const data = await res.json();
          setTeams(data.teams || []);
        }
      } catch (error) {
        console.error('Error fetching scoreboard:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchScoreboard();

    // Optional: Poll for updates every 10 seconds
    const interval = setInterval(fetchScoreboard, 10000);
    return () => clearInterval(interval);
  }, [code]);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Tournament Scoreboard</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tournament Scoreboard</h1>
        <p className="text-muted-foreground">Code: {code}</p>
        {teamName && <p className="text-sm">Your Team: {teamName}</p>}
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 bg-background z-10 min-w-[150px]">Team</TableHead>
              <TableHead className="text-center">1</TableHead>
              <TableHead className="text-center">2</TableHead>
              <TableHead className="text-center">3</TableHead>
              <TableHead className="text-center">4</TableHead>
              <TableHead className="text-center">5</TableHead>
              <TableHead className="text-center">6</TableHead>
              <TableHead className="text-center">7</TableHead>
              <TableHead className="text-center">8</TableHead>
              <TableHead className="text-center">9</TableHead>
              <TableHead className="text-center font-semibold bg-muted">Out</TableHead>
              <TableHead className="text-center">10</TableHead>
              <TableHead className="text-center">11</TableHead>
              <TableHead className="text-center">12</TableHead>
              <TableHead className="text-center">13</TableHead>
              <TableHead className="text-center">14</TableHead>
              <TableHead className="text-center">15</TableHead>
              <TableHead className="text-center">16</TableHead>
              <TableHead className="text-center">17</TableHead>
              <TableHead className="text-center">18</TableHead>
              <TableHead className="text-center font-semibold bg-muted">In</TableHead>
              <TableHead className="text-center font-bold bg-primary text-primary-foreground">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={22} className="text-center text-muted-foreground">
                  No teams yet
                </TableCell>
              </TableRow>
            ) : (
              teams.map((team, index) => (
                <TableRow
                  key={team.team_id}
                  className={team.name === teamName ? 'bg-accent' : ''}
                >
                  <TableCell className="sticky left-0 bg-background font-medium">
                    {index + 1}. {team.name}
                  </TableCell>
                  <TableCell className="text-center">{team.hole_1 || '-'}</TableCell>
                  <TableCell className="text-center">{team.hole_2 || '-'}</TableCell>
                  <TableCell className="text-center">{team.hole_3 || '-'}</TableCell>
                  <TableCell className="text-center">{team.hole_4 || '-'}</TableCell>
                  <TableCell className="text-center">{team.hole_5 || '-'}</TableCell>
                  <TableCell className="text-center">{team.hole_6 || '-'}</TableCell>
                  <TableCell className="text-center">{team.hole_7 || '-'}</TableCell>
                  <TableCell className="text-center">{team.hole_8 || '-'}</TableCell>
                  <TableCell className="text-center">{team.hole_9 || '-'}</TableCell>
                  <TableCell className="text-center font-semibold bg-muted">
                    {team.front_nine || 0}
                  </TableCell>
                  <TableCell className="text-center">{team.hole_10 || '-'}</TableCell>
                  <TableCell className="text-center">{team.hole_11 || '-'}</TableCell>
                  <TableCell className="text-center">{team.hole_12 || '-'}</TableCell>
                  <TableCell className="text-center">{team.hole_13 || '-'}</TableCell>
                  <TableCell className="text-center">{team.hole_14 || '-'}</TableCell>
                  <TableCell className="text-center">{team.hole_15 || '-'}</TableCell>
                  <TableCell className="text-center">{team.hole_16 || '-'}</TableCell>
                  <TableCell className="text-center">{team.hole_17 || '-'}</TableCell>
                  <TableCell className="text-center">{team.hole_18 || '-'}</TableCell>
                  <TableCell className="text-center font-semibold bg-muted">
                    {team.back_nine || 0}
                  </TableCell>
                  <TableCell className="text-center font-bold bg-primary text-primary-foreground">
                    {team.total_score || 0}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}