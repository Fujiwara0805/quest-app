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

// クエストデータを取得する関数（一時的なモックデータを返す）
export async function getQuests(): Promise<Quest[]> {
  // クエリを実行する前にログを出力
  console.log('Fetching quests from database...');
  
  // 一時的なモックデータ
  const mockQuests: Quest[] = [
    {
      id: "1",
      title: "古代遺跡の謎を解け",
      description: "古代文明の遺跡で謎を解き明かすアドベンチャー",
      difficulty: "★★",
      date: new Date("2023-03-15"),
      startTime: "10:00",
      location: {
        address: "東京都渋谷区神宮前X-X-X",
        access: "渋谷駅から徒歩10分"
      },
      tickets: {
        available: 20,
        price: 3500
      },
      image: "https://placehold.co/600x400?text=Ancient+Ruins",
      reward: {
        cardNumber: "No.001",
        cardName: "古代の秘宝"
      },
      reviews: {
        rating: 4.5,
        count: 12,
        comments: []
      }
    },
    {
      id: "2",
      title: "魔法の森の冒険",
      description: "不思議な生き物が住む魔法の森での冒険",
      difficulty: "★★★",
      date: new Date("2023-03-20"),
      startTime: "13:00",
      location: {
        address: "東京都新宿区西新宿X-X-X",
        access: "新宿駅から徒歩15分"
      },
      tickets: {
        available: 15,
        price: 4000
      },
      image: "https://placehold.co/600x400?text=Magic+Forest",
      reward: {
        cardNumber: "No.002",
        cardName: "森の精霊"
      },
      reviews: {
        rating: 4.8,
        count: 8,
        comments: []
      }
    }
  ];
  
  console.log('Mock data:', mockQuests.map(item => ({ id: item.id, title: item.title })));
  
  return mockQuests;
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