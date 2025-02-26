"use client";

import { useState, useEffect, useMemo } from 'react';
import { getQuests } from '@/app/data/quests';
import { Quest } from '@/app/types/quest';

export function useQuests(initialDate: Date) {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [sortType, setSortType] = useState<string>('date');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [allQuests, setAllQuests] = useState<Quest[]>([]);

  // Supabaseからデータを取得
  useEffect(() => {
    let isMounted = true; // コンポーネントがマウントされているかを追跡
    
    async function loadQuests() {
      try {
        setIsLoading(true);
        const data = await getQuests();
        
        // コンポーネントがまだマウントされている場合のみ状態を更新
        if (isMounted) {
          setAllQuests(data);
        }
      } catch (err) {
        // コンポーネントがまだマウントされている場合のみ状態を更新
        if (isMounted) {
          console.error('クエスト取得エラー:', err);
          setError(err instanceof Error ? err : new Error('クエスト取得中にエラーが発生しました'));
        }
      } finally {
        // コンポーネントがまだマウントされている場合のみ状態を更新
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    
    loadQuests();
    
    // クリーンアップ関数
    return () => {
      isMounted = false;
    };
  }, []);

  // クエストをソート
  const sortedQuests = useMemo(() => {
    if (!allQuests || allQuests.length === 0) {
      return [];
    }
    
    return [...allQuests].sort((a, b) => {
      if (sortType === 'date') {
        return a.date.getTime() - b.date.getTime();
      } else if (sortType === 'price') {
        return a.tickets.price - b.tickets.price;
      } else if (sortType === 'rating') {
        return (b.reviews?.rating || 0) - (a.reviews?.rating || 0);
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