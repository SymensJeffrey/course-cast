import { CopyButton } from '@/components/CopyButton';
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default async function AdminPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  return (
    <main className="min-h-screen flex flex-col  justify-center gap-6">
      <div className="p-6 space-y-4">
        <div className='justify-cente items-center'>
          <h1 className="text-2xl font-bold">Share this code</h1>
        </div>
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex flex-row items-center gap-3">
            <p className="text-3xl font-mono tracking-widest">
              {code}
            </p>
            <CopyButton value={code} />
          </div>
          <div>
            <Field orientation="horizontal">
              <Input placeholder="Enter Team Name" />
              <Button>Submit</Button>
            </Field>
          </div>
        </div>
      </div >
    </main >
  );
}
