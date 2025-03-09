'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaPlus, FaList, FaChartLine, FaCalendarAlt } from 'react-icons/fa';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [questCount, setQuestCount] = useState<number | null>(null);
  const [recentQuests, setRecentQuests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 認証状態をチェック
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/');
    } else if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchDashboardData();
    }
  }, [status, session, router]);

  // ダッシュボードデータを取得
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // クエスト数を取得
      const response = await fetch('/api/admin/quests/stats');
      if (response.ok) {
        const data = await response.json();
        setQuestCount(data.count);
        setRecentQuests(data.recentQuests || []);
      }
    } catch (error) {
      console.error('ダッシュボードデータの取得に失敗しました', error);
    } finally {
      setIsLoading(false);
    }
  };

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
      <h1 className="text-3xl font-bold text-white mb-6">管理者ダッシュボード</h1>
      
      {/* 管理者情報 */}
      <Card className="bg-[#463C2D]/80 backdrop-blur rounded-lg shadow-xl border border-[#C0A172] mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-purple-700 flex items-center justify-center text-white text-xl font-bold">
              {session?.user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{session?.user?.name || '管理者'}</h2>
              <p className="text-gray-300">{session?.user?.email || ''}</p>
              <div className="mt-2 inline-block bg-purple-700 text-white text-xs px-2 py-1 rounded">
                管理者
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* クイックアクション */}
      <h2 className="text-xl font-bold text-white mb-4">クイックアクション</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="bg-[#463C2D]/80 backdrop-blur rounded-lg shadow-xl border border-[#C0A172]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FaPlus className="text-purple-400" /> クエスト作成
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">新しいクエストを作成します。</p>
            <Link
              href="/admin/quests/create"
              className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md text-center transition"
            >
              クエスト作成へ
            </Link>
          </CardContent>
        </Card>
        
        <Card className="bg-[#463C2D]/80 backdrop-blur rounded-lg shadow-xl border border-[#C0A172]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FaList className="text-blue-400" /> クエスト管理
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">既存のクエストを管理します。</p>
            <Link
              href="/admin/quests"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-center transition"
            >
              クエスト一覧へ
            </Link>
          </CardContent>
        </Card>
      </div>
      
      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="bg-[#463C2D]/80 backdrop-blur rounded-lg shadow-xl border border-[#C0A172]">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-300 text-sm">クエスト数</p>
                <h3 className="text-2xl font-bold text-white">{questCount !== null ? questCount : '-'}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-700/20 flex items-center justify-center">
                <FaCalendarAlt className="text-purple-400 text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#463C2D]/80 backdrop-blur rounded-lg shadow-xl border border-[#C0A172]">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-300 text-sm">今月のクエスト</p>
                <h3 className="text-2xl font-bold text-white">-</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-700/20 flex items-center justify-center">
                <FaChartLine className="text-green-400 text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* 最近のクエスト */}
      <h2 className="text-xl font-bold text-white mb-4">最近のクエスト</h2>
      <Card className="bg-[#463C2D]/80 backdrop-blur rounded-lg shadow-xl border border-[#C0A172]">
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#C0A172]/30">
                  <th className="py-3 px-4 text-gray-300 font-medium">タイトル</th>
                  <th className="py-3 px-4 text-gray-300 font-medium">日付</th>
                  <th className="py-3 px-4 text-gray-300 font-medium">難易度</th>
                  <th className="py-3 px-4 text-gray-300 font-medium">アクション</th>
                </tr>
              </thead>
              <tbody>
                {recentQuests.length > 0 ? (
                  recentQuests.map((quest) => (
                    <tr key={quest.id} className="border-b border-[#C0A172]/10">
                      <td className="py-3 px-4 text-white">{quest.title}</td>
                      <td className="py-3 px-4 text-gray-300">
                        {quest.questDate ? new Date(quest.questDate).toLocaleDateString('ja-JP') : '-'}
                      </td>
                      <td className="py-3 px-4 text-gray-300">{quest.difficulty || '-'}</td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/admin/quests/${quest.id}`}
                          className="text-purple-400 hover:text-purple-300 mr-3"
                        >
                          編集
                        </Link>
                        <Link
                          href={`/admin/quests/${quest.id}/delete`}
                          className="text-red-400 hover:text-red-300"
                        >
                          削除
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-b border-[#C0A172]/10">
                    <td colSpan={4} className="py-3 px-4 text-white text-center">
                      クエストがありません
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-center">
            <Link
              href="/admin/quests"
              className="text-purple-400 hover:text-purple-300 text-sm"
            >
              すべてのクエストを表示 →
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
