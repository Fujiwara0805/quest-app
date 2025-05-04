"use client";

import { useRouter, usePathname } from 'next/navigation';
import { Heart, Calendar, CreditCard, User, Sword, Bot } from 'lucide-react';
import { useLoading } from '@/lib/context/LoadingContext';

export function MainNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { startLoading } = useLoading();

  const isActive = (path: string) => pathname === path;

  // ナビゲーション関数をラップしてローディング状態を設定
  const navigateTo = (path: string) => {
    if (pathname !== path) {
      startLoading(); // ローディング開始
      router.push(path);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#463C2D]/95 backdrop-blur border-t border-[#C0A172]">
      <div className="container mx-auto grid grid-cols-5 py-2">
        <button 
          onClick={() => navigateTo('/quests')}
          className={`flex flex-col items-center space-y-1 ${
            isActive('/quests') ? 'text-[#E8D4B9]' : 'text-[#E8D4B9]/50 hover:text-[#E8D4B9]'
          } transition-colors`}
        >
          <Sword className="w-6 h-6" />
          <span className="text-xs">QUEST</span>
        </button>
        <button 
          onClick={() => navigateTo('/favorites')}
          className={`flex flex-col items-center space-y-1 ${
            isActive('/favorites') ? 'text-[#E8D4B9]' : 'text-[#E8D4B9]/50 hover:text-[#E8D4B9]'
          } transition-colors`}
        >
          <Heart className={`w-6 h-6 ${isActive('/favorites') ? 'fill-current' : ''}`} />
          <span className="text-xs">おきにいり</span>
        </button>
        <button 
          onClick={() => navigateTo('/reservations')}
          className={`flex flex-col items-center space-y-1 ${
            isActive('/reservations') ? 'text-[#E8D4B9]' : 'text-[#E8D4B9]/50 hover:text-[#E8D4B9]'
          } transition-colors`}
        >
          <Calendar className="w-6 h-6" />
          <span className="text-xs">予約管理</span>
        </button>
        <button 
          onClick={() => navigateTo('/')}
          className={`flex flex-col items-center space-y-1 ${
            isActive('/ai-recommend') ? 'text-[#E8D4B9]' : 'text-[#E8D4B9]/50 hover:text-[#E8D4B9]'
          } transition-colors`}
        >
          <Bot className="w-6 h-6" />
          <span className="text-xs">AIリコメンド</span>
        </button>
        <button 
          onClick={() => navigateTo('/profile')}
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