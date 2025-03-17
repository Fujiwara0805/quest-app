import { BackgroundImage } from '@/components/ui/BackgroundImage';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BackgroundImage>
      <div className="min-h-screen bg-black/40 flex items-center justify-center p-4">
        {children}
      </div>
    </BackgroundImage>
  );
}