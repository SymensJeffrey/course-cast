export default function AdminPage({ params }: { params: { code: string } }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <p>Code: {params.code}</p>
    </div>
  );
}
