"use client";

import { useState, useEffect, useMemo } from 'react';
import { Quest } from '@/lib/types/quest';
import { getQuests } from '@/app/data/quests';
import { SortType } from '@/lib/constants/sort-options';

export function useQuests(initialDate: Date) {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [allQuests, setAllQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [sortType, setSortType] = useState<SortType>('nearDate');

  // Supabaseからクエストデータを取得
  useEffect(() => {
    async function fetchQuests() {
      setIsLoading(true);
      try {
        const data = await getQuests();
        setAllQuests(data);
      } catch (err) {
        console.error('クエスト取得エラー:', err);
        setError(err instanceof Error ? err : new Error('クエスト取得中にエラーが発生しました'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuests();
  }, []);

  // クエストをソート
  const sortedQuests = useMemo(() => {
    if (!allQuests || allQuests.length === 0) {
      return [];
    }
    
    return [...allQuests].sort((a, b) => {
      if (sortType === 'nearDate') {
        // dateがstring型の場合はDateオブジェクトに変換
        const dateA = a.date instanceof Date ? a.date : new Date(a.date);
        const dateB = b.date instanceof Date ? b.date : new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      } else if (sortType === 'highPrice') {
        // priceがundefinedの場合は0として扱う
        const priceA = a.tickets.price ?? 0;
        const priceB = b.tickets.price ?? 0;
        return priceB - priceA; // 高い順
      } else if (sortType === 'lowPrice') {
        const priceA = a.tickets.price ?? 0;
        const priceB = b.tickets.price ?? 0;
        return priceA - priceB; // 安い順
      } else if (sortType === 'lowTickets') {
        return a.tickets.available - b.tickets.available; // 残りが少ない順
      } else if (sortType === 'difficulty') {
        // 難易度（★の数）で比較
        return b.difficulty.length - a.difficulty.length;
      }
      return 0;
    });
  }, [allQuests, sortType]);

  return {
    quests: sortedQuests,
    selectedDate,
    setSelectedDate,
    sortType,
    setSortType,
    isLoading,
    error
  };
}