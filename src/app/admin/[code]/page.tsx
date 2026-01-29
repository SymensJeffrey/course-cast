import { CopyButton } from '@/components/CopyButton';

export default async function AdminPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Share this code</h1>

        <div className="flex items-center justify-center gap-3">
          <div>
            <p className="text-3xl font-mono tracking-widest">
              {code}
            </p>
          </div>
          <div>
            <CopyButton value={code} />
          </div>

        </div>
      </div>
    </main >
  );
}
