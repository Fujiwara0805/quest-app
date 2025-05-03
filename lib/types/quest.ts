export interface Quest {
  id: string | number;
  title: string;
  description?: string;
  difficulty: string;
  date: string | Date;
  startTime?: string;
  location: {
    address: string;
    access?: string;
  };
  tickets: {
    available: number;
    price?: number;
  };
  image?: string;
  reviews?: {
    rating: number;
    count: number;
    comments?: {
      id: string | number;
      author: string;
      rating: number;
      comment: string;
      date: string | Date;
    }[];
  };
  category: string;
}

export interface QuestFormData {
  title: string;
  description: string;
  difficulty: string;
  category: string;
  questDate: string | null;
  startTime: string;
  address: string;
  access: string;
  ticketsAvailable: number | null;
  ticketPrice: number | null;
  imageUrl: string;
  imagePath: string;
}

export interface QuestPreviewData {
  title: string;
  description: string;
  date: Date | null;
  startTime: string;
  difficulty: string;
  location: {
    address: string;
    access: string;
  };
  tickets: {
    available: number;
    price: number;
  };
  image: string;
}