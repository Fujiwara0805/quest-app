"use client";

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/lib/hooks/useFavorites';

interface FavoriteButtonProps {
  questId: string;
  className?: string;
}

export function FavoriteButton({ questId, className = '' }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const favorited = isFavorite(questId);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(questId);
      }}
      className={`p-2 rounded-full transition-all duration-200 ${
        favorited ? 'bg-red-500' : 'bg-black/60'
      } backdrop-blur-sm hover:scale-110 ${className}`}
      aria-label={favorited ? 'お気に入りから削除' : 'お気に入りに追加'}
    >
      <Heart
        className="w-5 h-5 text-white"
        fill={favorited ? "currentColor" : "none"}
      />
    </button>
  );
}