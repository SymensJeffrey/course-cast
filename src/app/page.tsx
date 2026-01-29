'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/Modal';

import { Course } from '@/types/course';

export default function Home() {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tournamentName, setTournamentName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const [courses, setCourses] = useState<Course[]>([]);
  const [courseId, setCourseId] = useState('');

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

    const res = await fetch('/api/tournaments/validate', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(data.error || 'Invalid code');
      return;
    }

    if (data.isAdmin) {
      router.push(`/admin/${code}`);
    } else {
      router.push(`/t/${code}`);
    }
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
          <input
            type="text"
            placeholder="Tournament Name"
            value={tournamentName}
            onChange={(e) => setTournamentName(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />

          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.course_id} value={course.course_id}>
                {course.name}
              </option>
            ))}
          </select>



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
          <input
            type="text"
            placeholder="Tournament Code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="w-full border rounded px-3 py-2 uppercase tracking-widest"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            className="w-full"
            onClick={handleEnterCode}
            disabled={loading || !code}
          >
            {loading ? 'Checking...' : 'Enter'}
          </Button>
        </div>
      </Modal>
    </main>
  );
}
