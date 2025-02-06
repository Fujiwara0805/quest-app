"use client";

import { usePathname, useRouter } from 'next/navigation';
import { Heart, Calendar, CreditCard, User, Sword } from 'lucide-react';

interface BottomNavigationProps {
  onFavoritesToggle: (show: boolean) => void;
  showFavorites: boolean;
}

export function BottomNavigation({ onFavoritesToggle, showFavorites }: BottomNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => pathname === path;

  const navigateToTodayQuests = () => {
    onFavoritesToggle(false);
    router.push('/?date=today');
  };

  return (
    <div className="bg-[#463C2D]/95 backdrop-blur border-t border-[#C0A172]">
      <div className="container mx-auto grid grid-cols-5 py-2">
        <button 
          onClick={navigateToTodayQuests}
          className={`flex flex-col items-center space-y-1 transition-colors ${
            !showFavorites ? 'text-[#E8D4B9]' : 'text-[#E8D4B9]/50 hover:text-[#E8D4B9]'
          }`}
        >
          <Sword className="w-6 h-6" />
          <span className="text-xs">QUEST</span>
        </button>
        <button 
          className="flex flex-col items-center space-y-1 text-[#E8D4B9]/50 hover:text-[#E8D4B9] transition-colors"
          onClick={() => router.push('/favorites')}
        >
          <Heart className={`w-6 h-6 ${showFavorites ? 'fill-current' : ''}`} />
          <span className="text-xs">おきにいり</span>
        </button>
        <button 
          className="flex flex-col items-center space-y-1 text-[#E8D4B9]/50 hover:text-[#E8D4B9] transition-colors"
          onClick={() => router.push('/reservations')}
        >
          <Calendar className="w-6 h-6" />
          <span className="text-xs">予約管理</span>
        </button>
        <button 
          className="flex flex-col items-center space-y-1 text-[#E8D4B9]/50 hover:text-[#E8D4B9] transition-colors"
          onClick={() => router.push('/cards')}
        >
          <CreditCard className="w-6 h-6" />
          <span className="text-xs">カード</span>
        </button>
        <button 
          className="flex flex-col items-center space-y-1 text-[#E8D4B9]/50 hover:text-[#E8D4B9] transition-colors"
          onClick={() => router.push('/profile')}
        >
          <User className="w-6 h-6" />
          <span className="text-xs">マイページ</span>
        </button>
      </div>
    </div>
  );
}