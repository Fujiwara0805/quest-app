"use client";

import { useRouter, usePathname } from 'next/navigation';
import { Heart, Calendar, CreditCard, User, Sword } from 'lucide-react';

export function MainNav() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#463C2D]/95 backdrop-blur border-t border-[#C0A172]">
      <div className="container mx-auto grid grid-cols-5 py-2">
        <button 
          onClick={() => router.push('/')}
          className={`flex flex-col items-center space-y-1 ${
            isActive('/') ? 'text-[#E8D4B9]' : 'text-[#E8D4B9]/50 hover:text-[#E8D4B9]'
          } transition-colors`}
        >
          <Sword className="w-6 h-6" />
          <span className="text-xs">QUEST</span>
        </button>
        <button 
          onClick={() => router.push('/favorites')}
          className={`flex flex-col items-center space-y-1 ${
            isActive('/favorites') ? 'text-[#E8D4B9]' : 'text-[#E8D4B9]/50 hover:text-[#E8D4B9]'
          } transition-colors`}
        >
          <Heart className={`w-6 h-6 ${isActive('/favorites') ? 'fill-current' : ''}`} />
          <span className="text-xs">おきにいり</span>
        </button>
        <button 
          onClick={() => router.push('/reservations')}
          className={`flex flex-col items-center space-y-1 ${
            isActive('/reservations') ? 'text-[#E8D4B9]' : 'text-[#E8D4B9]/50 hover:text-[#E8D4B9]'
          } transition-colors`}
        >
          <Calendar className="w-6 h-6" />
          <span className="text-xs">予約管理</span>
        </button>
        <button 
          onClick={() => router.push('/cards')}
          className={`flex flex-col items-center space-y-1 ${
            isActive('/cards') ? 'text-[#E8D4B9]' : 'text-[#E8D4B9]/50 hover:text-[#E8D4B9]'
          } transition-colors`}
        >
          <CreditCard className="w-6 h-6" />
          <span className="text-xs">カード</span>
        </button>
        <button 
          onClick={() => router.push('/profile')}
          className={`flex flex-col items-center space-y-1 ${
            isActive('/profile') ? 'text-[#E8D4B9]' : 'text-[#E8D4B9]/50 hover:text-[#E8D4B9]'
          } transition-colors`}
        >
          <User className="w-6 h-6" />
          <span className="text-xs">マイページ</span>
        </button>
      </div>
    </div>
  );
}