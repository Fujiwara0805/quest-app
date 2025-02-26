"use client";

import { useState, useEffect } from 'react';
import { QuestCard } from './QuestCard';
import { Quest } from '../types/quest';
import { getQuestsByDate } from '@/app/data/quests';

interface QuestListProps {
  quests?: Quest[];
}

export default function QuestList({ quests: propQuests }: QuestListProps) {
  // Supabaseからデータを取得（propsがない場合のみ）
  const [fetchedQuests, setFetchedQuests] = useState<Record<string, Quest[]>>({});
  const [loading, setLoading] = useState(!propQuests);
  
  useEffect(() => {
    // propsでクエストが渡された場合は取得しない
    if (propQuests) return;
    
    async function loadQuests() {
      try {
        const data = await getQuestsByDate();
        setFetchedQuests(data || {});
      } catch (error) {
        console.error('クエスト取得エラー:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadQuests();
  }, [propQuests]);
  
  // propsで渡されたクエストがある場合はそれを使用
  const questsToRender = propQuests || Object.values(fetchedQuests).flat();
  
  return (
    <div className="container mx-auto px-4 py-4 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          <p>読み込み中...</p>
        ) : questsToRender.length === 0 ? (
          <p>クエストが見つかりませんでした</p>
        ) : (
          questsToRender.map((quest) => (
            <QuestCard 
              key={quest.id} 
              quest={quest}
            />
          ))
        )}
      </div>
    </div>
  );
}