import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export default async function MainPage() {
  // サーバーサイドでセッションを確認
  const session = await getServerSession(authOptions);
  
  // 未ログインならルートページにリダイレクト
  if (!session) {
    redirect('/');
  }
  
  // 常にクエスト一覧にリダイレクト
  redirect('/quests');
}