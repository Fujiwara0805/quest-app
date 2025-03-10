import { useState, useCallback } from 'react';

export interface Quest {
  id: string;
  title: string;
  createdAt: string;
  // 他の必要なプロパティを追加
}

export function useDashboardData() {
  const [recentQuests, setRecentQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ダッシュボードデータを取得
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      // クエスト統計情報を取得
      const questResponse = await fetch('/api/admin/quests/stats');
      const questData = await questResponse.json();
      
      setRecentQuests(questData.recentQuests || []);
    } catch (error) {
      console.error('ダッシュボードデータの取得に失敗しました', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { recentQuests, isLoading, fetchDashboardData };
}
