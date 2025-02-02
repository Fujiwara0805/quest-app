import { Quest } from '@/types/quest';

// 固定の時間を使用して一貫性を保つ
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 6; hour <= 20; hour++) {
    for (let minute of [0, 15, 30, 45]) {
      slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

const generateQuests = () => {
  const quests: Quest[] = [
    {
      id: "1",
      title: "【伝統工芸】別府竹細工の職人体験",
      description: "伝統ある別府竹細工の技法を学びながら、実際の制作体験ができます。職人から直接指導を受けられる貴重な機会です。",
      difficulty: "★★",
      date: new Date(2025, 2, 15),
      startTime: "09:00",
      location: {
        address: "大分県別府市鉄輪町",
        access: "別府駅からバスで15分"
      },
      tickets: {
        available: 10,
        price: 8500
      },
      reviews: {
        rating: 4.8,
        count: 24,
        comments: [
          {
            id: "r1",
            author: "工芸愛好家",
            rating: 5,
            comment: "職人さんの丁寧な指導のおかげで、素晴らしい作品が作れました。",
            date: new Date(2025, 1, 20)
          }
        ]
      },
      image: "https://images.unsplash.com/photo-1580933073521-dc49ac0d4e6a",
      reward: {
        cardNumber: "No.001",
        cardName: "竹職人の誇り"
      }
    },
    {
      id: "2",
      title: "【農業】有機野菜の収穫体験",
      description: "有機栽培にこだわった農園での収穫体験です。農業の基礎から収穫方法まで丁寧に指導します。",
      difficulty: "★★★",
      date: new Date(2025, 2, 15),
      startTime: "07:30",
      location: {
        address: "大分県杵築市山香町",
        access: "JR杵築駅からバスで20分"
      },
      tickets: {
        available: 15,
        price: 7500
      },
      reviews: {
        rating: 4.9,
        count: 18,
        comments: [
          {
            id: "r2",
            author: "農業初心者",
            rating: 5,
            comment: "土づくりから収穫まで、農業の基礎を学べました。",
            date: new Date(2025, 1, 25)
          }
        ]
      },
      image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2",
      reward: {
        cardNumber: "No.002",
        cardName: "大地の恵み"
      }
    },
    {
      id: "3",
      title: "【祭事】日田祇園祭の準備体験",
      description: "ユネスコ無形文化遺産に登録された日田祇園祭の準備作業を体験できます。",
      difficulty: "★★",
      date: new Date(2025, 2, 16),
      startTime: "10:00",
      location: {
        address: "大分県日田市豆田町",
        access: "JR日田駅から徒歩15分"
      },
      tickets: {
        available: 20,
        price: 6500
      },
      reviews: {
        rating: 4.7,
        count: 15,
        comments: [
          {
            id: "r3",
            author: "祭り好き",
            rating: 5,
            comment: "祭りの裏側を知ることができ、とても貴重な経験でした。",
            date: new Date(2025, 2, 1)
          }
        ]
      },
      image: "https://images.unsplash.com/photo-1528372444006-1bfc81acab02",
      reward: {
        cardNumber: "No.003",
        cardName: "祭魂"
      }
    }
  ];

  // 追加のクエストを生成
  const categories = [
    { name: "伝統工芸", basePrice: 8000 },
    { name: "農業", basePrice: 7000 },
    { name: "祭事", basePrice: 6500 },
    { name: "漁業", basePrice: 7500 },
    { name: "介護", basePrice: 6000 },
    { name: "保育", basePrice: 6000 }
  ];

  const locations = [
    { address: "大分県別府市", access: "別府駅から徒歩10分" },
    { address: "大分県日田市", access: "日田駅からバス15分" },
    { address: "大分県中津市", access: "中津駅から徒歩20分" },
    { address: "大分県佐伯市", access: "佐伯駅からタクシー10分" },
    { address: "大分県臼杵市", access: "臼杵駅から徒歩15分" }
  ];

  // 17個の追加クエストを生成（合計20個になるように）
  for (let i = 0; i < 17; i++) {
    const category = categories[i % categories.length];
    const location = locations[i % locations.length];
    const dateOffset = Math.floor(i / 3); // 3件ずつ異なる日付に分散
    const date = new Date(2025, 2, 15 + dateOffset);
    const timeSlotIndex = Math.floor(Math.random() * TIME_SLOTS.length);

    quests.push({
      id: (i + 4).toString(),
      title: `【${category.name}】${generateQuestTitle(category.name, i)}`,
      description: generateDescription(category.name),
      difficulty: "★".repeat((i % 3) + 1),
      date,
      startTime: TIME_SLOTS[timeSlotIndex],
      location,
      tickets: {
        available: 10 + (i % 11), // 10-20枚
        price: category.basePrice + (i * 500) // ベース価格 + 増分
      },
      reviews: {
        rating: 4.0 + (Math.random() * 1.0),
        count: 10 + Math.floor(Math.random() * 20),
        comments: [
          {
            id: `r${i + 4}`,
            author: "参加者",
            rating: 5,
            comment: generateComment(category.name),
            date: new Date(2025, 2, 1)
          }
        ]
      },
      image: getImageForCategory(category.name),
      reward: {
        cardNumber: `No.${String(i + 4).padStart(3, '0')}`,
        cardName: generateRewardCardName(category.name, i)
      }
    });
  }

  return quests;
};

function generateQuestTitle(category: string, index: number): string {
  const titles: Record<string, string[]> = {
    "伝統工芸": ["伝統的な織物体験", "陶芸ワークショップ", "漆器制作体験"],
    "農業": ["有機野菜の収穫", "果樹園での収穫体験", "田植え体験"],
    "祭事": ["地域祭りの準備", "伝統行事のサポート", "神輿担ぎ体験"],
    "漁業": ["朝市での魚の仕分け", "定置網漁体験", "養殖場でのサポート"],
    "介護": ["デイサービスでの介護補助", "高齢者との交流会", "介護施設でのレクリエーション"],
    "保育": ["保育園での保育補助", "子どもと遊ぼう", "園児と野外活動"]
  };

  const categoryTitles = titles[category] || titles["伝統工芸"];
  return categoryTitles[index % categoryTitles.length];
}

function generateDescription(category: string): string {
  const descriptions: Record<string, string[]> = {
    "伝統工芸": ["熟練の職人から直接指導を受けながら、伝統工芸の技を学びます。"],
    "農業": ["自然と触れ合いながら、持続可能な農業を体験できます。"],
    "祭事": ["地域の伝統行事の裏側を知り、文化継承に貢献できます。"],
    "漁業": ["海の恵みを直接体験し、漁業の現場を知ることができます。"],
    "介護": ["プロの介護士から指導を受けながら、介護の基礎を学べます。"],
    "保育": ["子どもたちと触れ合いながら、保育の現場を体験できます。"]
  };

  return descriptions[category]?.[0] || "貴重な体験ができます。";
}

function generateComment(category: string): string {
  const comments: Record<string, string[]> = {
    "伝統工芸": ["職人さんの技術と心意気に感動しました。"],
    "農業": ["自然の中での作業は心が癒されました。"],
    "祭事": ["地域の伝統を守る大切さを学びました。"],
    "漁業": ["漁師さんの仕事の大変さを知りました。"],
    "介護": ["利用者さんとの交流がとても心温まりました。"],
    "保育": ["子どもたちの笑顔に元気をもらいました。"]
  };

  return comments[category]?.[0] || "とても良い経験になりました。";
}

function getImageForCategory(category: string): string {
  const images: Record<string, string> = {
    "伝統工芸": "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1",
    "農業": "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2",
    "祭事": "https://images.unsplash.com/photo-1528372444006-1bfc81acab02",
    "漁業": "https://images.unsplash.com/photo-1507699622108-4be3abd695ad",
    "介護": "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289",
    "保育": "https://images.unsplash.com/photo-1526634332515-d56c5fd16991"
  };

  return images[category] || images["伝統工芸"];
}

function generateRewardCardName(category: string, index: number): string {
  const cardNames: Record<string, string[]> = {
    "伝統工芸": ["匠の技", "伝統の継承者", "工芸の心"],
    "農業": ["大地の守り手", "収穫の喜び", "自然との対話"],
    "祭事": ["祭りの継承者", "伝統の守り手", "祭魂"],
    "漁業": ["海の恵み", "漁師の誇り", "豊漁の証"],
    "介護": ["思いやりの心", "癒しの手", "介護の心"],
    "保育": ["子どもの笑顔", "未来の種", "保育の心"]
  };

  const names = cardNames[category] || cardNames["伝統工芸"];
  return names[index % names.length];
}

// クエストデータを生成して日付ごとに整理
const allQuests = generateQuests();
export const DUMMY_QUESTS: Record<string, Quest[]> = {};

allQuests.forEach(quest => {
  const dateKey = quest.date.getDate().toString();
  if (!DUMMY_QUESTS[dateKey]) {
    DUMMY_QUESTS[dateKey] = [];
  }
  DUMMY_QUESTS[dateKey].push(quest);
});