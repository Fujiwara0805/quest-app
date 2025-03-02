"use client";

import { useState, useEffect } from 'react';
import { Quest } from '@/types/quest';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  // お気に入りの読み込み
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // お気に入りの保存
  const toggleFavorite = (questId: string) => {
    const newFavorites = favorites.includes(questId)
      ? favorites.filter(id => id !== questId)
      : [...favorites, questId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const isFavorite = (questId: string) => favorites.includes(questId);

  return {
    favorites,
    toggleFavorite,
    isFavorite
  };
}