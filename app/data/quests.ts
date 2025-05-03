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

// 完全なURLを生成する関数 - クライアントサイド対応
function getBaseUrl() {
  // クライアントサイドの場合
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // サーバーサイドの場合は環境変数を使用
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
}

// クエストデータを取得する関数
export async function getQuests(): Promise<Quest[]> {
  console.log('Fetching quests from API...');
  
  try {
    const baseUrl = getBaseUrl();
    // 完全なURLを使用
    const response = await fetch(`${baseUrl}/api/quests`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // SSRで毎回最新データを取得
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const quests: Quest[] = data.quests || [];
    
    // 日付文字列をDateオブジェクトに変換
    quests.forEach(quest => {
      if (typeof quest.date === 'string') {
        quest.date = new Date(quest.date);
      }
    });
    
    console.log('Fetched quests count:', quests.length);
    
    return quests;
  } catch (error) {
    console.error('クエスト取得エラー:', error);
    return [];
  }
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
  console.log('Fetching quest by ID from API:', id);
  
  try {
    const baseUrl = getBaseUrl();
    console.log('Using base URL:', baseUrl);
    
    // 完全なURLを使用
    const response = await fetch(`${baseUrl}/api/quests/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // SSRで毎回最新データを取得
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log(`Quest with ID ${id} not found`);
        return null;
      }
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const quest: Quest = data.quest;
    
    if (!quest) {
      return null;
    }
    
    // 日付文字列をDateオブジェクトに変換
    if (typeof quest.date === 'string') {
      quest.date = new Date(quest.date);
    }
    
    console.log('Fetched quest:', { id: quest.id, title: quest.title });
    
    return quest;
  } catch (error) {
    console.error(`ID: ${id} のクエスト取得エラー:`, error);
    return null;
  }
}