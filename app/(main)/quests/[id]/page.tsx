import { getQuests } from "@/app/data/quests";
import { QuestDetail } from "./components/QuestDetail";
import { Quest } from "@/lib/types/quest";

// // 静的パスを生成する関数
// export async function generateStaticParams() {
//   try {
//     const quests = await getQuests();
//     return quests.map(quest => ({
//       id: quest.id
//     }));
//   } catch (error) {
//     console.error('静的パス生成エラー:', error);
//     return [];
//   }
// }

export default async function QuestDetailPage({ params }: { params: { id: string } }) {
  // すべてのクエストを取得して、IDに一致するものを探す
  let quest: Quest | undefined;
  
  try {
    const quests = await getQuests();
    console.log('Params ID:', params.id, typeof params.id);
    console.log('Available Quests:', quests.map(q => ({ id: q.id, type: typeof q.id })));
    
    // より柔軟な比較を試みる
    quest = quests.find(q => 
      String(q.id).trim().toLowerCase() === String(params.id).trim().toLowerCase()
    );
    
    console.log('Found Quest:', quest);
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

  return <QuestDetail quest={quest} />;
}