export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-purple-600 text-white p-4">
        <h1 className="text-2xl font-bold">管理者パネル</h1>
      </header>
      <main className="p-4">
        {children}
      </main>
    </div>
  );
} 