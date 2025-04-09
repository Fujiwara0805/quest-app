import Image from 'next/image';

interface BackgroundImageProps {
  children: React.ReactNode;
}

export function BackgroundImage({ children }: BackgroundImageProps) {
  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <Image
        src="https://res.cloudinary.com/dz9trbwma/image/upload/v1744171660/background_y6uzi5.jpg"
        alt="背景画像"
        fill
        priority
        sizes="100vw"
        style={{
          objectFit: 'cover',
          zIndex: -1,
        }}
        quality={85}
      />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
