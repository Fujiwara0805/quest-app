import { supabase } from '@/lib/supabase';
import { Quest } from '../../lib/types/quest';

// URLが有効かどうかを確認する関数
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

// クエストデータを取得する関数
export async function getQuests(): Promise<Quest[]> {
  console.log('Fetching quests from Supabase...');
  
  const { data, error } = await supabase
    .from('quests')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('クエスト取得エラー:', error);
    return [];
  }
  
  // Supabaseから取得したデータをQuestインターフェースに変換
  const quests: Quest[] = data.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    difficulty: item.difficulty || '★',
    date: new Date(item.quest_date),
    startTime: item.start_time,
    location: {
      address: item.address || '',
      access: item.access || ''
    },
    tickets: {
      available: item.tickets_available || 0,
      price: item.ticket_price || 0
    },
    reward: {
      cardNumber: item.reward_card_number || '',
      cardName: item.reward_card_name || ''
    },
    image: item.image_url || '',
    reviews: item.reviews || {
      rating: 0,
      count: 0,
      comments: []
    }
  }));
  
  console.log('Fetched quests:', quests.map(item => ({ id: item.id, title: item.title })));
  
  return quests;
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

// IDに基づいて特定のクエストを取得
export async function getQuestById(id: string): Promise<Quest | null> {
  console.log('Fetching quest by ID from Supabase:', id);
  
  const { data, error } = await supabase
    .from('quests')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`ID: ${id} のクエスト取得エラー:`, error);
    return null;
  }
  
  if (!data) return null;
  
  // Supabaseから取得したデータをQuestインターフェースに変換
  const quest: Quest = {
    id: data.id,
    title: data.title,
    description: data.description,
    difficulty: data.difficulty || '★',
    date: new Date(data.quest_date),
    startTime: data.start_time,
    location: {
      address: data.address || '',
      access: data.access || ''
    },
    tickets: {
      available: data.tickets_available || 0,
      price: data.ticket_price || 0
    },
    reward: {
      cardNumber: data.reward_card_number || '',
      cardName: data.reward_card_name || ''
    },
    image: data.image_url || '',
    reviews: data.reviews || {
      rating: 0,
      count: 0,
      comments: []
    }
  };
  
  console.log('Fetched quest:', { id: quest.id, title: quest.title });
  
  return quest;
}