import { getQuestById } from "@/app/data/quests";
import { QuestDetail } from "./components/QuestDetail";

export default async function QuestDetailPage({ params }: { params: { id: string } }) {
  // IDに基づいてSupabaseから特定のクエストを取得
  const quest = await getQuestById(params.id);

  if (!quest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#3a2820]">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">クエストが見つかりません</h1>
          <a href="/quests" className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
            クエスト一覧に戻る
          </a>
        </div>
      </div>
    );
  }

  return <QuestDetail quest={quest} />;
}