import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/database.types";

export const createClient = () => {
  const client = createClientComponentClient<Database>({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
  
  // デバッグ用のオーバーライド
  const originalFrom = client.from;
  client.from = function(relation: string) {
    console.log('Supabase query:', relation);
    return originalFrom.call(this, relation);
  };
  
  return client;
};

