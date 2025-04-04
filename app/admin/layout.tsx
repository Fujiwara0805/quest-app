import React from 'react';
import { MainNav } from './components/main-nav';
import { BackgroundImage } from '@/components/ui/BackgroundImage';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BackgroundImage>
      <div className="min-h-screen bg-gradient-to-b from-black/30 via-black/20 to-black/40">
        {/* 装飾的な要素 */}
        <div className="absolute inset-0 bg-[url('/patterns/noise.png')] opacity-5 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2a1810]/40 to-transparent pointer-events-none" />
        
        {children}
        
        <MainNav />
      </div>
    </BackgroundImage>
  );
}