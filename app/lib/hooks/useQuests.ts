"use client";

import { useState, useMemo, useCallback } from 'react';
import { Quest } from '@/types/quest';
import { DUMMY_QUESTS } from '@/data/quests';
import { SortType } from '@/lib/constants/sort-options';

export function useQuests(initialDate: Date) {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [sortType, setSortType] = useState<SortType>('nearDate');

  const sortQuests = useCallback((quests: Quest[]) => {
    return [...quests].sort((a, b) => {
      switch (sortType) {
        case 'nearDate':
          // 開催日が近い順（現在日時との差が小さい順）
          const now = new Date();
          const diffA = Math.abs(a.date.getTime() - now.getTime());
          const diffB = Math.abs(b.date.getTime() - now.getTime());
          return diffA - diffB;
        
        case 'highPrice':
          // チケット代金が高い順
          return b.tickets.price - a.tickets.price;
        
        case 'lowPrice':
          // チケット代金が少ない順
          return a.tickets.price - b.tickets.price;
        
        case 'lowTickets':
          // チケット残りが少ない順
          return a.tickets.available - b.tickets.available;
        
        case 'difficulty':
          // 難易度順（★の数で比較）
          return b.difficulty.length - a.difficulty.length;
        
        default:
          return 0;
      }
    });
  }, [sortType]);

  const quests = useMemo(() => {
    // 全クエストを取得
    const allQuests = Object.values(DUMMY_QUESTS).flat();
    return sortQuests(allQuests);
  }, [sortQuests]);

  return {
    quests,
    selectedDate,
    setSelectedDate,
    sortType,
    setSortType
  };
}