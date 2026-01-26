export default function TournamentPage({ params }: { params: { code: string } }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Tournament Scoreboard</h1>
      <p>Code: {params.code}</p>
    </div>
  );
}
