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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

interface Course {
  hole_1_par: number;
  hole_2_par: number;
  hole_3_par: number;
  hole_4_par: number;
  hole_5_par: number;
  hole_6_par: number;
  hole_7_par: number;
  hole_8_par: number;
  hole_9_par: number;
  hole_10_par: number;
  hole_11_par: number;
  hole_12_par: number;
  hole_13_par: number;
  hole_14_par: number;
  hole_15_par: number;
  hole_16_par: number;
  hole_17_par: number;
  hole_18_par: number;
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
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  // Score entry state
  const [currentHole, setCurrentHole] = useState(1);
  const [scoreInput, setScoreInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

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

  // Get current team data
  const currentTeam = useMemo(() => {
    return teams.find(team => team.name === teamName);
  }, [teams, teamName]);

  // Get team ID from localStorage
  const teamId = useMemo(() => {
    if (typeof window !== 'undefined') {
      const storedTeam = localStorage.getItem(`team_${code}`);
      if (storedTeam) {
        try {
          const teamData = JSON.parse(storedTeam);
          return teamData.teamId;
        } catch (e) {
          console.error('Error parsing stored team data:', e);
        }
      }
    }
    return null;
  }, [code]);

  // Get current hole par
  const currentHolePar = useMemo(() => {
    if (!course) return null;
    const parKey = `hole_${currentHole}_par` as keyof Course;
    return course[parKey];
  }, [course, currentHole]);

  // Get current hole score
  const currentHoleScore = useMemo(() => {
    if (!currentTeam) return null;
    const scoreKey = `hole_${currentHole}` as keyof Team;
    return currentTeam[scoreKey] as number | null;
  }, [currentTeam, currentHole]);

  // Calculate par totals
  const parTotals = useMemo(() => {
    if (!course) return { frontNine: 0, backNine: 0, total: 0 };

    const frontNine =
      course.hole_1_par + course.hole_2_par + course.hole_3_par +
      course.hole_4_par + course.hole_5_par + course.hole_6_par +
      course.hole_7_par + course.hole_8_par + course.hole_9_par;

    const backNine =
      course.hole_10_par + course.hole_11_par + course.hole_12_par +
      course.hole_13_par + course.hole_14_par + course.hole_15_par +
      course.hole_16_par + course.hole_17_par + course.hole_18_par;

    return {
      frontNine,
      backNine,
      total: frontNine + backNine
    };
  }, [course]);

  // Calculate score to par for a team (only counting holes played)
  const calculateScoreToPar = (team: Team) => {
    if (!course) return { score: 0, holesPlayed: 0 };

    const holes = [
      { score: team.hole_1, par: course.hole_1_par },
      { score: team.hole_2, par: course.hole_2_par },
      { score: team.hole_3, par: course.hole_3_par },
      { score: team.hole_4, par: course.hole_4_par },
      { score: team.hole_5, par: course.hole_5_par },
      { score: team.hole_6, par: course.hole_6_par },
      { score: team.hole_7, par: course.hole_7_par },
      { score: team.hole_8, par: course.hole_8_par },
      { score: team.hole_9, par: course.hole_9_par },
      { score: team.hole_10, par: course.hole_10_par },
      { score: team.hole_11, par: course.hole_11_par },
      { score: team.hole_12, par: course.hole_12_par },
      { score: team.hole_13, par: course.hole_13_par },
      { score: team.hole_14, par: course.hole_14_par },
      { score: team.hole_15, par: course.hole_15_par },
      { score: team.hole_16, par: course.hole_16_par },
      { score: team.hole_17, par: course.hole_17_par },
      { score: team.hole_18, par: course.hole_18_par },
    ];

    let totalScore = 0;
    let totalPar = 0;
    let holesPlayed = 0;

    holes.forEach(hole => {
      if (hole.score !== null) {
        totalScore += hole.score;
        totalPar += hole.par;
        holesPlayed++;
      }
    });

    return {
      score: totalScore - totalPar,
      holesPlayed
    };
  };

  // Get color class based on score to par
  const getScoreToParColor = (scoreToPar: number) => {
    if (scoreToPar < 0) return 'text-red-600 font-semibold'; // Under par (good)
    if (scoreToPar > 0) return 'text-blue-600 font-semibold'; // Over par
    return 'text-foreground font-semibold'; // Even par
  };

  // Format score to par display
  const formatScoreToPar = (scoreToPar: number) => {
    if (scoreToPar === 0) return 'E';
    if (scoreToPar > 0) return `+${scoreToPar}`;
    return `${scoreToPar}`;
  };

  // Handle previous hole
  const handlePreviousHole = () => {
    if (currentHole > 1) {
      setCurrentHole(currentHole - 1);
      setScoreInput('');
      setSubmitError('');
    }
  };

  // Handle next hole
  const handleNextHole = () => {
    if (currentHole < 18) {
      setCurrentHole(currentHole + 1);
      setScoreInput('');
      setSubmitError('');
    }
  };

  // Handle submit score
  const handleSubmitScore = async () => {
    if (!scoreInput || !teamId) return;

    const score = parseInt(scoreInput);
    if (isNaN(score) || score < 1 || score > 20) {
      setSubmitError('Please enter a valid score (1-20)');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/teams/update-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamId,
          holeNumber: currentHole,
          score,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setSubmitError(data.error || 'Failed to submit score');
        return;
      }

      // Refresh scoreboard
      await fetchScoreboard();

      // Clear input and move to next hole
      setScoreInput('');
      if (currentHole < 18) {
        setCurrentHole(currentHole + 1);
      }
    } catch (error) {
      console.error('Error submitting score:', error);
      setSubmitError('Failed to submit score');
    } finally {
      setSubmitting(false);
    }
  };

  async function fetchScoreboard() {
    try {
      const res = await fetch(`/api/tournaments/${code}/scoreboard`);
      if (res.ok) {
        const data = await res.json();
        setTeams(data.teams || []);
        setCourse(data.course || null);
      }
    } catch (error) {
      console.error('Error fetching scoreboard:', error);
    }
  }

  useEffect(() => {
    async function initialFetch() {
      await fetchScoreboard();
      setLoading(false);
    }

    initialFetch();

    // Optional: Poll for updates every 10 seconds
    const interval = setInterval(fetchScoreboard, 10000);
    return () => clearInterval(interval);
  }, [code]);

  // Update score input when hole changes to show existing score
  useEffect(() => {
    if (currentHoleScore !== null) {
      setScoreInput(currentHoleScore.toString());
    } else {
      setScoreInput('');
    }
  }, [currentHoleScore, currentHole]);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Tournament Scoreboard</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tournament Scoreboard</h1>
        <p className="text-muted-foreground">Code: {code}</p>
        {teamName && <p className="text-sm">Your Team: {teamName}</p>}
      </div>

      <div className="rounded-md border overflow-x-auto mb-8">
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
            {/* Par Row */}
            {course && (
              <TableRow className="bg-muted/50 font-semibold">
                <TableCell className="sticky left-0 bg-muted/50">Par</TableCell>
                <TableCell className="text-center">{course.hole_1_par}</TableCell>
                <TableCell className="text-center">{course.hole_2_par}</TableCell>
                <TableCell className="text-center">{course.hole_3_par}</TableCell>
                <TableCell className="text-center">{course.hole_4_par}</TableCell>
                <TableCell className="text-center">{course.hole_5_par}</TableCell>
                <TableCell className="text-center">{course.hole_6_par}</TableCell>
                <TableCell className="text-center">{course.hole_7_par}</TableCell>
                <TableCell className="text-center">{course.hole_8_par}</TableCell>
                <TableCell className="text-center">{course.hole_9_par}</TableCell>
                <TableCell className="text-center bg-muted">{parTotals.frontNine}</TableCell>
                <TableCell className="text-center">{course.hole_10_par}</TableCell>
                <TableCell className="text-center">{course.hole_11_par}</TableCell>
                <TableCell className="text-center">{course.hole_12_par}</TableCell>
                <TableCell className="text-center">{course.hole_13_par}</TableCell>
                <TableCell className="text-center">{course.hole_14_par}</TableCell>
                <TableCell className="text-center">{course.hole_15_par}</TableCell>
                <TableCell className="text-center">{course.hole_16_par}</TableCell>
                <TableCell className="text-center">{course.hole_17_par}</TableCell>
                <TableCell className="text-center">{course.hole_18_par}</TableCell>
                <TableCell className="text-center bg-muted">{parTotals.backNine}</TableCell>
                <TableCell className="text-center bg-primary text-primary-foreground">{parTotals.total}</TableCell>
              </TableRow>
            )}

            {/* Team Rows */}
            {teams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={22} className="text-center text-muted-foreground">
                  No teams yet
                </TableCell>
              </TableRow>
            ) : (
              teams.map((team, index) => {
                const { score: scoreToPar, holesPlayed } = calculateScoreToPar(team);

                return (
                  <TableRow
                    key={team.team_id}
                    className={team.name === teamName ? 'bg-accent' : ''}
                  >
                    <TableCell className="sticky left-0 bg-background font-medium">
                      <div className="flex items-center gap-2">
                        <span>{index + 1}. {team.name}</span>
                        {holesPlayed > 0 && (
                          <span className={getScoreToParColor(scoreToPar)}>
                            ({formatScoreToPar(scoreToPar)})
                          </span>
                        )}
                      </div>
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
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Score Entry Section */}
      {teamName && teamId && (
        <div className="border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4">Enter Your Score</h2>

          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousHole}
              disabled={currentHole === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="text-center">
              <h3 className="text-2xl font-bold">Hole {currentHole}</h3>
              {currentHolePar && (
                <p className="text-muted-foreground">Par {currentHolePar}</p>
              )}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNextHole}
              disabled={currentHole === 18}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Input
                type="number"
                placeholder="Enter score"
                value={scoreInput}
                onChange={(e) => setScoreInput(e.target.value)}
                className="text-center text-2xl h-16"
                min="1"
                max="20"
              />
              {currentHoleScore !== null && (
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Current score: {currentHoleScore}
                </p>
              )}
            </div>

            {submitError && (
              <p className="text-red-500 text-sm text-center">{submitError}</p>
            )}

            <Button
              className="w-full h-12 text-lg"
              onClick={handleSubmitScore}
              disabled={submitting || !scoreInput}
            >
              {submitting ? 'Submitting...' : 'Submit Score'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}