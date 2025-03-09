'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

export default function QuestsListPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [quests, setQuests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 認証状態をチェック
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/');
    } else if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchQuests();
    }
  }, [status, session, router]);

  // クエスト一覧を取得
  const fetchQuests = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/quests');
      if (response.ok) {
        const data = await response.json();
        setQuests(data.quests || []);
      }
    } catch (error) {
      console.error('クエスト一覧の取得に失敗しました', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 検索フィルター
  const filteredQuests = quests.filter(quest => 
    quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (quest.description && quest.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // ローディング中
  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <p className="ml-3 text-white">読み込み中...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">クエスト一覧</h1>
        <Link
          href="/admin/quests/create"
          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md flex items-center gap-2"
        >
          <FaPlus /> 新規クエスト作成
        </Link>
      </div>
      
      {/* 検索フォーム */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="クエストを検索..."
            className="w-full bg-[#3a2820] border border-[#C0A172] p-3 pl-10 rounded-md text-white placeholder:text-gray-400"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      
      {/* クエスト一覧 */}
      <Card className="bg-[#463C2D]/80 backdrop-blur rounded-lg shadow-xl border border-[#C0A172]">
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#C0A172]/30">
                  <th className="py-3 px-4 text-gray-300 font-medium">タイトル</th>
                  <th className="py-3 px-4 text-gray-300 font-medium">日付</th>
                  <th className="py-3 px-4 text-gray-300 font-medium">難易度</th>
                  <th className="py-3 px-4 text-gray-300 font-medium">チケット残数</th>
                  <th className="py-3 px-4 text-gray-300 font-medium">価格</th>
                  <th className="py-3 px-4 text-gray-300 font-medium">アクション</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuests.length > 0 ? (
                  filteredQuests.map((quest) => (
                    <tr key={quest.id} className="border-b border-[#C0A172]/10">
                      <td className="py-3 px-4 text-white">{quest.title}</td>
                      <td className="py-3 px-4 text-gray-300">
                        {quest.questDate ? new Date(quest.questDate).toLocaleDateString('ja-JP') : '-'}
                      </td>
                      <td className="py-3 px-4 text-gray-300">{quest.difficulty || '-'}</td>
                      <td className="py-3 px-4 text-gray-300">{quest.ticketsAvailable || '-'}</td>
                      <td className="py-3 px-4 text-gray-300">
                        {quest.ticketPrice ? `¥${quest.ticketPrice.toLocaleString()}` : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/quests/${quest.id}`}
                            className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                          >
                            <FaEdit /> 編集
                          </Link>
                          <Link
                            href={`/admin/quests/${quest.id}/delete`}
                            className="text-red-400 hover:text-red-300 flex items-center gap-1"
                          >
                            <FaTrash /> 削除
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-b border-[#C0A172]/10">
                    <td colSpan={6} className="py-3 px-4 text-white text-center">
                      {searchTerm ? '検索条件に一致するクエストがありません' : 'クエストがありません'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
