'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/Modal';

import { Course } from '@/types/course';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input';

export default function Home() {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tournamentName, setTournamentName] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const [courses, setCourses] = useState<Course[]>([]);
  const [courseId, setCourseId] = useState('');

  // Check localStorage when code input changes
  function handleCodeChange(value: string) {
    const upperValue = value.toUpperCase();
    setCode(upperValue);

    // Check if we have stored team info for this tournament
    if (upperValue && typeof window !== 'undefined') {
      const storedTeam = localStorage.getItem(`team_${upperValue}`);
      if (storedTeam) {
        try {
          const teamData = JSON.parse(storedTeam);
          setName(teamData.teamName);
        } catch (e) {
          console.error('Error parsing stored team data:', e);
        }
      } else {
        // Clear name if switching to a tournament we haven't joined
        setName('');
      }
    }
  }

  async function loadCourses() {
    const res = await fetch('/api/courses');
    const data: Course[] = await res.json();
    setCourses(data);
  }

  async function handleCreateTournament() {
    setLoading(true);
    setError('');

    const res = await fetch('/api/tournaments/create', {
      method: 'POST',
      body: JSON.stringify({
        name: tournamentName,
        courseId
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(data.error || 'Failed to create tournament');
      return;
    }

    router.push(`/admin/${data.tournament_code}`);
  }

  async function handleEnterCode() {
    setLoading(true);
    setError('');

    // First validate the tournament code
    const validateRes = await fetch('/api/tournaments/validate', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });

    const validateData = await validateRes.json();

    if (!validateRes.ok) {
      setLoading(false);
      setError(validateData.error || 'Invalid code');
      return;
    }

    // If admin, go directly to admin page
    if (validateData.isAdmin) {
      setLoading(false);
      router.push(`/admin/${code}`);
      return;
    }

    // Check if team already exists for this tournament
    const checkTeamRes = await fetch('/api/teams/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tournamentCode: code,
        teamName: name,
      }),
    });

    const checkTeamData = await checkTeamRes.json();

    if (checkTeamRes.ok && checkTeamData.exists) {
      // Team already exists, just store info and redirect
      localStorage.setItem(`team_${code}`, JSON.stringify({
        teamId: checkTeamData.team.team_id,
        teamName: checkTeamData.team.name,
        tournamentCode: code,
      }));
      setLoading(false);
      router.push(`/t/${code}`);
      return;
    }

    // If not admin and team doesn't exist, create the team
    const teamRes = await fetch('/api/teams/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tournamentCode: code,
        teamName: name,
      }),
    });

    const teamData = await teamRes.json();

    setLoading(false);

    if (!teamRes.ok) {
      setError(teamData.error || 'Failed to create team');
      return;
    }

    // Store team info in localStorage
    localStorage.setItem(`team_${code}`, JSON.stringify({
      teamId: teamData.team.team_id,
      teamName: teamData.team.name,
      tournamentCode: code,
    }));

    // Successfully created team, navigate to tournament page
    router.push(`/t/${code}`);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">Welcome to Course Cast</h1>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => { setCreateOpen(true); loadCourses(); }}>
          Create Tournament
        </Button>
        <Button onClick={() => setCodeOpen(true)}>
          Enter Tournament Code
        </Button>
      </div>

      {/* Create Tournament Modal */}
      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Tournament"
      >
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Tournament Name"
            value={tournamentName}
            onChange={(e) => setTournamentName(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <Select value={courseId} onValueChange={setCourseId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.course_id} value={course.course_id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            className="w-full"
            onClick={handleCreateTournament}
            disabled={loading || !tournamentName || !courseId}
          >
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </Modal>

      {/* Enter Code Modal */}
      <Modal
        isOpen={codeOpen}
        onClose={() => setCodeOpen(false)}
        title="Enter Tournament Code"
      >
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Tournament Code"
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <Input
            type="text"
            placeholder="Team Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            className="w-full"
            onClick={handleEnterCode}
            disabled={loading || !code || !name}
          >
            {loading ? 'Checking...' : 'Enter'}
          </Button>
        </div>
      </Modal>
    </main>
  );
}