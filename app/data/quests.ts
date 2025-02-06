import { Quest } from '@/types/quest';
import { getQuestImagePath } from '@/lib/utils/image';

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
      title: "【伝統工芸】別府竹細工クエスト",
      description: "伝統ある別府竹細工の技法を学びながら、実際の制作体験ができます。職人から直接指導を受けられる貴重な機会です。",
      difficulty: "★★",
      date: new Date(2025, 1, 3),  //2月5日
      startTime: "09:00",
      location: {
        address: "大分県別府市",
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
      image: getQuestImagePath('竹細工.png'),
      reward: {
        cardNumber: "No.001",
        cardName: "竹職人の誇り"
      }
    },
    {
      id: "2",
      title: "【農業】かぼすの収穫クエスト",
      description: 
      "大分県臼杵市で、かぼす収穫作業に参加しませんか？近年、担い手不足により農業経営が厳しい状況にあります。そこで、農業に興味があり、地域に貢献したいと考える方、新しい挑戦に意欲的な方の参加を求めています。代々受け継がれた農園での作業を通して、地元の恵みを実際に手にする貴重な体験ができます。また、収穫の合間には地元の方々との温かな交流を楽しみ、人と人との繋がりを実感していただけます。",
      difficulty: "★",
      date: new Date(2025, 1, 4),   //2月4日
      startTime: "07:30",
      location: {
        address: "大分県臼杵市",
        access: "臼杵駅からバスで20分"
      },
      tickets: {
        available: 5,
        price: 3000
      },
      reviews: {
        rating: 4.9,
        count: 18,
        comments: [
          {
            id: "r2",
            author: "農業初心者",
            rating: 5,
            comment: "優しい指導のもと、楽しく収穫作業が行えました。",
            date: new Date(2024, 11, 25)
          }
        ]
      },
      image: getQuestImagePath('収穫.png'),
      reward: {
        cardNumber: "No.002",
        cardName: "大地の恵み"
      }
    },
    {
      id: "3",
      title: "【祭事】祇園祭の準備クエスト",
      description: "ユネスコ無形文化遺産に登録された日田祇園祭の準備作業を体験できます。",
      difficulty: "★★",
      date: new Date(2025, 1, 16),  //2月16日
      startTime: "10:00",
      location: {
        address: "大分県日田市",
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
      image: getQuestImagePath('お祭り.png'),
      reward: {
        cardNumber: "No.003",
        cardName: "祭魂"
      }
    },
    // {
    //   id: "4",
    //   title: "【林業】伐採クエスト",
    //   description: "伐採作業のお手伝いをお願いします",
    //   difficulty: "★★",
    //   date: new Date(2025, 1, 7),  //2月7日
    //   startTime: "10:00",
    //   location: {
    //     address: "大分県日田市",
    //     access: "JR日田駅から徒歩15分"
    //   },
    //   tickets: {
    //     available: 20,
    //     price: 4500
    //   },
    //   reviews: {
    //     rating: 4.7,
    //     count: 15,
    //     comments: [
    //       {
    //         id: "r3",
    //         author: "大分最高",
    //         rating: 5,
    //         comment: "伐採作業の大変さをしりました",
    //         date: new Date(2025, 2, 1)
    //       }
    //     ]
    //   },
    //   image: getQuestImagePath('林業.png'),
    //   reward: {
    //     cardNumber: "No.006",
    //     cardName: "大自然の息吹"
    //   }
    // }
  ];

  // 追加のクエストを生成
  const categories = [
    { name: "伝統工芸", basePrice: 5000 },
    { name: "農業", basePrice: 4000 },
    { name: "祭事", basePrice: 8000 },
    { name: "漁業", basePrice: 6000 },
    { name: "林業", basePrice: 3000 },
  ];

  const locations = [
    { address: "大分県別府市", access: "別府駅から徒歩10分" },
    { address: "大分県日田市", access: "日田駅からバス15分" },
    { address: "大分県中津市", access: "中津駅から徒歩20分" },
    { address: "大分県佐伯市", access: "佐伯駅からタクシー10分" },
    { address: "大分県臼杵市", access: "臼杵駅から徒歩15分" }
  ];

  // 追加クエストを生成（合計5個になるように）
  for (let i = 0; i < 1; i++) {
    const category = categories[i % categories.length];
    const location = locations[i % locations.length];
    const dateOffset = Math.floor(i / 3); // 3件ずつ異なる日付に分散
    const date = new Date(2025, 1, 15 + dateOffset);   //2月15日
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
            date: new Date(2025, 1, 1)
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
    "伝統工芸": ["伝統的クエスト", "陶芸ワークショップクエスト", "漆器制作クエスト"],
    "農業": ["有機野菜の収穫クエスト", "果樹園での収穫クエスト", "田植えクエスト"],
    "祭事": ["地域祭りクエスト", "伝統行事クエスト", "神輿担ぎクエスト"],
    "漁業": ["朝市での魚の仕分けクエスト", "定置網漁クエスト", "養殖場クエスト"],
    "林業": ["伐採クエスト"],
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
    "林業": ["自然の恵みを直接体験し、林業の現場を知ることができます。"]
  };

  return descriptions[category]?.[0] || "貴重な体験ができます。";
}

function generateComment(category: string): string {
  const comments: Record<string, string[]> = {
    "伝統工芸": ["職人さんの技術と心意気に感動しました。"],
    "農業": ["自然の中での作業は心が癒されました。"],
    "祭事": ["地域の伝統を守る大切さを学びました。"],
    "漁業": ["漁師さんの仕事の大変さを知りました。"],
    "林業": ["伐採作業の大変さを知りました。"]
  };

  return comments[category]?.[0] || "とても良い経験になりました。";
}

function getImageForCategory(category: string): string {
  const images: Record<string, string> = {
    "伝統工芸": getQuestImagePath('伝統工芸品.png'),
    "農業": getQuestImagePath('収穫.png'),
    "祭事": getQuestImagePath('お祭り.png'),
    "漁業": getQuestImagePath('漁業.png'),
    "林業": getQuestImagePath('林業.png'),
  };

  return images[category] || images["伝統工芸"];
}

function generateRewardCardName(category: string, index: number): string {
  const cardNames: Record<string, string[]> = {
    "伝統工芸": ["匠の技", "伝統の継承者", "工芸の心"],
    "農業": ["大地の守り手", "収穫の喜び", "自然との対話"],
    "祭事": ["祭りの継承者", "伝統の守り手", "祭魂"],
    "漁業": ["海の恵み", "漁師の誇り", "豊漁の証"],
    "林業": ["林の恵み", "大自然の息吹"],
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