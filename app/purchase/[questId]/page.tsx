import { getQuests } from "@/app/data/quests";
import { PurchaseForm } from "./components/PurchaseForm";
import { Quest } from "@/app/types/quest";

// 静的パスを生成する関数
export async function generateStaticParams() {
  try {
    const quests = await getQuests();
    return quests.map(quest => ({
      questId: quest.id
    }));
  } catch (error) {
    console.error('静的パス生成エラー:', error);
    return [];
  }
}

export default async function PurchasePage({ params }: { params: { questId: string } }) {
  // クエストデータを取得
  let quest: Quest | undefined;
  
  try {
    const quests = await getQuests();
    quest = quests.find(q => q.id === params.questId);
  } catch (error) {
    console.error('クエスト取得エラー:', error);
  }

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

  return <PurchaseForm quest={quest} />;
}