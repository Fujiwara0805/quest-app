import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/database.types";

export const createClient = () => {
  const client = createClientComponentClient<Database>();
  
  // 接続確認用のオーバーライド（型エラーを修正）
  const originalFrom = client.from;
  client.from = function(relation: string) {
    console.log('Supabase query:', relation);
    return originalFrom.call(this, relation);
  };
  
  return client;
};

