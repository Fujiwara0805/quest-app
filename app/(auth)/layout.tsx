export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[url('/images/login.jpeg')] bg-cover bg-center">
      <div className="min-h-screen bg-black/40 flex items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
}