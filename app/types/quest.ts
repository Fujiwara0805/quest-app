export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  date: Date;
  startTime: string; // 追加: HH:mm形式
  location: {
    address: string;
    access: string;
  };
  tickets: {
    available: number;
    price: number;
  };
  reviews: {
    rating: number;
    count: number;
    comments: Array<{
      id: string;
      author: string;
      rating: number;
      comment: string;
      date: Date;
    }>;
  };
  image: string;
  reward: {
    cardNumber: string; // No.000~099形式
    cardName: string;
  };
}