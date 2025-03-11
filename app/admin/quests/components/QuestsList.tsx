import Link from 'next/link';
import { FaEdit, FaTrash, FaMapMarkerAlt, FaCalendarAlt, FaTicketAlt, FaYenSign } from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Quest } from '../hooks/useQuestsList';

interface QuestsListProps {
  quests: Quest[];
  searchTerm: string;
}

export default function QuestsList({ quests, searchTerm }: QuestsListProps) {
  // 日付フォーマット
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '日付未設定';
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="bg-[#463C2D]/80 backdrop-blur rounded-lg shadow-xl border border-[#C0A172] w-full">
      <CardHeader className="border-b border-[#C0A172]/30 pb-3">
        <CardTitle className="text-xl font-bold text-white">クエスト一覧</CardTitle>
      </CardHeader>
      <CardContent className="p-0 max-h-[calc(100vh-250px)] overflow-y-auto">
        {quests.length === 0 ? (
          <div className="p-6 text-center text-gray-300">
            {searchTerm ? 'クエストが見つかりません' : 'クエストがありません'}
          </div>
        ) : (
          <div className="divide-y divide-[#C0A172]/30">
            {quests.map((quest) => (
              <div key={quest.id} className="p-4 hover:bg-[#4F4335]/50 transition-colors">
                {/* クエストタイトル */}
                <h3 className="text-white font-medium text-lg mb-3">{quest.title}</h3>
                
                {/* 情報とボタンを左右対称に配置 */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  {/* 左側：クエスト情報 */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div className="flex items-center text-gray-300 text-sm">
                      <FaCalendarAlt className="mr-2 text-purple-400 flex-shrink-0" />
                      <span className="truncate">{formatDate(quest.questDate)}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-300 text-sm">
                      <FaMapMarkerAlt className="mr-2 text-purple-400 flex-shrink-0" />
                      <span className="truncate">{quest.address || '場所未設定'}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-300 text-sm">
                      <FaYenSign className="mr-2 text-purple-400 flex-shrink-0" />
                      <span className="truncate">{quest.ticketPrice?.toLocaleString() || 0}円</span>
                    </div>
                    
                    <div className="flex items-center text-gray-300 text-sm">
                      <FaTicketAlt className="mr-2 text-purple-400 flex-shrink-0" />
                      <span className="truncate">残数: {quest.ticketsAvailable || 0}枚</span>
                    </div>
                  </div>
                  
                  {/* 右側：アクションボタン */}
                  <div className="flex items-center gap-3 justify-center md:self-center">
                    <Link
                      href={`/admin/quests/${quest.id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-1 transition-colors"
                    >
                      <FaEdit /> 編集
                    </Link>
                    <Link
                      href={`/admin/quests/${quest.id}/delete`}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-1 transition-colors"
                    >
                      <FaTrash /> 削除
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
