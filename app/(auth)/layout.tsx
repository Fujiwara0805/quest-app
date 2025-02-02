export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1502786129293-79981df4e689')] bg-cover bg-center">
      <div className="min-h-screen bg-black/40 flex items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
}