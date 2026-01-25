export default function TournamentPage({
  params,
}: {
  params: { code: string };
}) {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Tournament {params.code}</h1>
    </div>
  );
}
