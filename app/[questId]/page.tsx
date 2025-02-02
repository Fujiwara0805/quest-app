import { DUMMY_QUESTS } from "@/data/quests";
import { QuestDetail } from "./components/QuestDetail";

// 静的パスを生成する関数
export function generateStaticParams() {
  const questIds = Object.values(DUMMY_QUESTS)
    .flat()
    .map(quest => ({
      questId: quest.id
    }));
  
  return questIds;
}

export default function QuestDetailPage({ params }: { params: { questId: string } }) {
  // すべてのクエストを取得して、IDに一致するものを探す
  const quest = Object.values(DUMMY_QUESTS)
    .flat()
    .find(q => q.id === params.questId);

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

  return <QuestDetail quest={quest} />;
}