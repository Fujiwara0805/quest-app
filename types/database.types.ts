export type Database = {
  public: {
    Tables: {
      quests: {
        Row: {
          id: string;
          title: string;
          description: string;
          date: string;
          start_time: string;
          difficulty: string;
          address: string;
          access: string;
          tickets_available: number;
          ticket_price: number;
          image_url: string | null;
          reward_card_number: string;
          reward_card_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          date: string;
          start_time: string;
          difficulty: string;
          address: string;
          access: string;
          tickets_available: number;
          ticket_price: number;
          image_url?: string | null;
          reward_card_number: string;
          reward_card_name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          date?: string;
          start_time?: string;
          difficulty?: string;
          address?: string;
          access?: string;
          tickets_available?: number;
          ticket_price?: number;
          image_url?: string | null;
          reward_card_number?: string;
          reward_card_name?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}; 