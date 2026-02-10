'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CopyButton } from '@/components/CopyButton';
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function AdminPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const router = useRouter();
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (!teamName.trim()) {
      setError('Team name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check if team already exists
      const checkRes = await fetch('/api/teams/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tournamentCode: code,
          teamName: teamName.trim(),
        }),
      });

      const checkData = await checkRes.json();

      let teamId;

      if (checkData.exists) {
        // Team already exists, use existing team
        teamId = checkData.team.team_id;
      } else {
        // Create new team
        const createRes = await fetch('/api/teams/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tournamentCode: code,
            teamName: teamName.trim(),
          }),
        });

        if (!createRes.ok) {
          const createData = await createRes.json();
          setError(createData.error || 'Failed to create team');
          setLoading(false);
          return;
        }

        const createData = await createRes.json();
        teamId = createData.team.team_id;
      }

      // Store team info in localStorage
      localStorage.setItem(`team_${code}`, JSON.stringify({
        teamId: teamId,
        teamName: teamName.trim(),
        tournamentCode: code,
      }));

      // Navigate to tournament page
      router.push(`/t/${code}?team=${encodeURIComponent(teamName.trim())}`);
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred');
      setLoading(false);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }

  return (
    <main className="min-h-screen flex flex-col justify-center gap-6">
      <div className="p-6 space-y-4">
        <div className='flex justify-center items-center'>
          <h1 className="text-2xl font-bold">Share this code</h1>
        </div>
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex flex-row items-center gap-3">
            <p className="text-3xl font-mono tracking-widest">
              {code}
            </p>
            <CopyButton value={code} />
          </div>
          <div className="items-center">
            <Field orientation="horizontal">
              <Input
                placeholder="Enter Team Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                disabled={loading}
                className='w-auto'
              />
              <Button
                onClick={handleSubmit}
                disabled={loading || !teamName.trim()}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </Field>
            {error && (
              <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}