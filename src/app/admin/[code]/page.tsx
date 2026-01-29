import { CopyButton } from '@/components/CopyButton';

export default async function AdminPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      <div className="flex items-center gap-3">
        <div>
          <p className="text-sm text-gray-500">Tournament Code</p>
          <p className="text-3xl font-mono tracking-widest">
            {code}
          </p>
        </div>

        <CopyButton value={code} />
      </div>
    </div>
  );
}
