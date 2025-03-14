import { getQuestById } from "@/app/data/quests";
import { PaymentForm } from "./components/PaymentForm";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Suspense } from "react";
export const dynamic = 'force-dynamic';

export default async function PaymentPage({ params }: { params: { id: string } }) {
  // ユーザーセッションの取得
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    // 未ログインの場合はログインページにリダイレクト
    redirect('/api/auth/signin?callbackUrl=/quests/' + params.id + '/payment');
  }
  
  // クエストデータを取得
  const quest = await getQuestById(params.id);
  
  if (!quest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#3a2820]">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">クエストが見つかりません</h1>
          <a href="/" className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
            クエスト一覧に戻る
          </a>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container mx-auto px-4 py-8">
        <PaymentForm quest={quest} userId={session.user.id} />
      </div>
    </Suspense>
  );

}