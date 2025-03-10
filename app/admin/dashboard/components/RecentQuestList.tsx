import Link from 'next/link';
import { Quest } from '@/app/admin/dashboard/hooks/useDashboardData';

interface RecentQuestsListProps {
  quests: Quest[];
  isLoading: boolean;
}

export default function RecentQuestsList({ quests, isLoading }: RecentQuestsListProps) {
  if (isLoading) {
    return <div className="p-6 text-center text-gray-300">読み込み中...</div>;
  }
  
  if (quests.length === 0) {
    return <div className="p-6 text-center text-gray-300">クエストがありません</div>;
  }
  
  return (
    <div className="divide-y divide-[#C0A172]/30">
      {quests.map((quest) => (
        <div key={quest.id} className="p-4 flex justify-between items-center hover:bg-[#4F4335]/50 transition-colors">
          <div>
            <h3 className="text-white font-medium">{quest.title}</h3>
            <p className="text-gray-400 text-sm">
              {new Date(quest.createdAt).toLocaleDateString('ja-JP')}
            </p>
          </div>
          <Link
            href={`/admin/quests/${quest.id}`}
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-3 py-1 rounded transition-colors"
          >
            詳細
          </Link>
        </div>
      ))}
    </div>
  );
}
