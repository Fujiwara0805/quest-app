import { Quest } from '../../lib/types/quest';
import { createClient } from '@/utils/supabase/client';

// URLが有効かどうかを確認する関数
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

// Supabaseからクエストデータを取得する関数
export async function getQuests(): Promise<Quest[]> {
  const supabase = createClient();
  
  // クエリを実行する前にログを出力
  console.log('Fetching quests from Supabase...');
  
  const { data, error } = await supabase
    .from('quests')
    .select('*');
    
  if (error) {
    console.error('クエスト取得エラー:', error);
    return [];
  }
  
  // 生のデータをログに出力して確認
  console.log('Raw Supabase data:', data.map(item => ({ id: item.id, title: item.title })));
  
  // データベースから取得したデータをフロントエンドの型に変換
  return data.map((item: any) => {
    // IDの処理を修正 - 変換前後の値をログに出力
    const originalId = item.id;
    const convertedId = item.id.toString();
    console.log(`ID conversion: ${originalId} (${typeof originalId}) -> ${convertedId} (${typeof convertedId})`);
    
    // 画像URLの処理
    let imageUrl = item.image_url;
    
    // URLが有効でない場合、Supabaseのストレージから取得を試みる
    if (!isValidUrl(imageUrl) && imageUrl) {
      const { data } = supabase
        .storage
        .from('quests-media')
        .getPublicUrl(imageUrl);
      
      imageUrl = data.publicUrl;
    }
    
    // それでも有効なURLでない場合はプレースホルダー画像を使用
    if (!isValidUrl(imageUrl)) {
      imageUrl = 'https://placehold.co/600x400?text=No+Image';
    }
    
    return {
      id: convertedId, // 変換後のIDを使用
      title: item.title,
      description: item.description,
      difficulty: item.quest_difficulty || '★',
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
      image: imageUrl,
      reward: {
        cardNumber: item.reward_card_number,
        cardName: item.reward_card_name
      },
      reviews: {
        rating: item.rating || 0,
        count: item.review_count || 0,
        comments: []
      }
    };
  });
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