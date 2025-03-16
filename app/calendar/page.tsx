"use client";

import { useState, useEffect } from 'react';
import { getQuestsByDate } from '@/app/data/quests';
import { Quest } from '@/lib/types/quest';

export default function CalendarPage() {
  // Supabaseからデータを取得
  const [questsByDate, setQuestsByDate] = useState<Record<string, Quest[]>>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadQuests() {
      try {
        const data = await getQuestsByDate();
        setQuestsByDate(data || {});
      } catch (error) {
        console.error('クエスト取得エラー:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadQuests();
  }, []);
  
  return (
    <div>
      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <div>
          <p>カレンダー表示（実装予定）</p>
          {Object.entries(questsByDate).map(([date, quests]) => (
            <div key={date}>
              <h3>{date}</h3>
              <p>クエスト数: {quests.length}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 