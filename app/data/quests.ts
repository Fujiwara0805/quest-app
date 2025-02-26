import { Quest } from '../types/quest';
import { createClient } from '@/utils/supabase/client';

// Supabaseからクエストデータを取得する関数
export async function getQuests(): Promise<Quest[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('quests')
    .select('*');
    
  if (error) {
    console.error('クエスト取得エラー:', error);
    return [];
  }
  
  // データベースから取得したデータをフロントエンドの型に変換
  return data.map((item: any) => ({
    id: item.id.toString(),
    title: item.title,
    description: item.description,
    // 実際のデータベースのカラム名に合わせる
    difficulty: item.quest_difficulty || '★', // データベースの列名が異なる場合は調整
    date: new Date(item.date),
    startTime: item.start_time,
    location: {
      address: item.address,
      access: item.access
    },
    tickets: {
      available: item.tickets_available,
      price: item.ticket_price
    },
    image: item.image_url,
    reward: {
      cardNumber: item.reward_card_number,
      cardName: item.reward_card_name
    },
    reviews: {
      rating: item.rating || 0,
      count: item.review_count || 0,
      comments: []
    }
  }));
}

// 日付ごとにクエストを整理する関数
export async function getQuestsByDate(): Promise<Record<string, Quest[]>> {
  const quests = await getQuests();
  const questsByDate: Record<string, Quest[]> = {};
  
  quests.forEach(quest => {
    // 日付が有効かチェック
    if (quest.date && quest.date instanceof Date && !isNaN(quest.date.getTime())) {
      const dateKey = quest.date.getDate().toString();
      if (!questsByDate[dateKey]) {
        questsByDate[dateKey] = [];
      }
      questsByDate[dateKey].push(quest);
    }
  });
  
  return questsByDate;
}