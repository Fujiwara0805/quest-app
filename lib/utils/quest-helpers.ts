// 難易度に基づく色を決定
export const getDifficultyColor = (difficulty: string) => {
  const stars = difficulty.length;
  if (stars >= 3) return 'text-red-400';
  if (stars >= 2) return 'text-yellow-400';
  return 'text-green-400';
};

// チケット残数に基づく色を決定
export const getTicketColor = (available: number) => {
  if (available <= 5) return 'text-red-400';
  if (available <= 10) return 'text-yellow-400';
  return 'text-green-400';
};

// 評価に基づく色を決定
export const getRatingColor = (rating: number) => {
  if (rating >= 4.5) return 'text-yellow-400';
  if (rating >= 4.0) return 'text-green-400';
  if (rating >= 3.5) return 'text-blue-400';
  return 'text-gray-400';
};

// データベースのクエストデータを表示用に変換
export const formatQuestForDisplay = (dbQuest: any) => {
  return {
    id: dbQuest.id,
    title: dbQuest.title || '',
    description: dbQuest.description || '',
    difficulty: dbQuest.difficulty || '★',
    date: dbQuest.questDate ? new Date(dbQuest.questDate) : null,
    startTime: dbQuest.startTime || '',
    location: {
      address: dbQuest.address || '',
      access: dbQuest.access || ''
    },
    tickets: {
      available: dbQuest.ticketsAvailable || 0,
      price: dbQuest.ticketPrice || 0
    },
    reward: {
      cardNumber: dbQuest.rewardCardNumber || '',
      cardName: dbQuest.rewardCardName || ''
    },
    image: dbQuest.imageUrl || ''
  };
};
