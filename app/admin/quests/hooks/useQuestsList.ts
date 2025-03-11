import { useState, useCallback, useEffect } from 'react';

export interface Quest {
  id: string;
  title: string;
  questDate: string | null;
  difficulty: string;
  ticketsAvailable: number;
  ticketPrice: number;
  address: string;
  imageUrl: string | null;
  createdAt: string;
}

export function useQuestsList() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // クエスト一覧を取得
  const fetchQuests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/quests');
      if (response.ok) {
        const data = await response.json();
        setQuests(data.quests || []);
      }
    } catch (error) {
      console.error('クエスト一覧の取得に失敗しました', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 検索フィルター
  const filteredQuests = quests.filter(quest => 
    quest.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return { 
    quests: filteredQuests, 
    isLoading, 
    error, 
    fetchQuests, 
    searchTerm, 
    setSearchTerm 
  };
}
