'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { QuestEditForm } from './components/QuestEditForm';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { BackgroundImage } from '@/components/ui/BackgroundImage';

export default function QuestEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [quest, setQuest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 認証状態をチェック
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/');
    } else if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchQuest();
    }
  }, [status, session, router, params.id]);

  // クエスト情報を取得
  const fetchQuest = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // パラメータのIDを明示的に文字列として扱う
      const questId = String(params.id).trim();
      console.log('Fetching quest with ID:', questId);
      
      const response = await fetch(`/api/admin/quests/${questId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'クエストの取得に失敗しました');
      }
      
      const data = await response.json();
      console.log('Fetched quest data:', data);
      
      if (!data.quest) {
        throw new Error('クエストデータが見つかりませんでした');
      }
      
      setQuest(data.quest);
    } catch (error: any) {
      console.error('クエスト情報の取得に失敗しました', error);
      setError(error.message || 'クエスト情報の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // クエスト更新後の処理
  const handleQuestUpdated = (updatedQuest: any, message: string) => {
    setQuest(updatedQuest);
    setSuccessMessage(message);
    // 最新のデータを再取得
    fetchQuest();
  };

  // ローディング中
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-[#3a2820] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <p className="ml-3 text-white">読み込み中...</p>
      </div>
    );
  }

  // エラー表示
  if (error && !quest) {
    return (
      <div className="min-h-screen bg-[#3a2820] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="bg-red-500/20 p-4 rounded-lg mb-6">
            <p className="text-red-400">{error}</p>
          </div>
          <Link
            href="/admin/quests"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
            クエスト一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <BackgroundImage>
      <div className="min-h-screen bg-gradient-to-b from-black/30 via-black/20 to-black/40">
        {/* 装飾的な要素 */}
        <div className="absolute inset-0 bg-[url('/patterns/noise.png')] opacity-5 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2a1810]/40 to-transparent pointer-events-none" />

        {/* ヘッダー */}
        <div className="sticky top-0 z-50 bg-[#463C2D]/95 backdrop-blur border-b border-[#C0A172]">
          <div className="container mx-auto px-4 py-4">
            <Link
              href="/admin/quests"
              className="flex items-center text-[#E8D4B9] hover:text-white transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              <span>戻る</span>
            </Link>
          </div>
        </div>

        <main className="container mx-auto px-4 py-6 space-y-6 pb-32 max-w-4xl">
          {/* エラーメッセージ */}
          {error && (
            <div className="bg-red-500/20 p-4 rounded-lg mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}
          
          {/* 成功メッセージ */}
          {successMessage && (
            <div className="bg-green-500/20 p-4 rounded-lg mb-6">
              <p className="text-green-400">{successMessage}</p>
            </div>
          )}
          
          {quest && (
            <QuestEditForm 
              quest={quest} 
              questId={params.id} 
              onQuestUpdated={handleQuestUpdated}
              onError={(errorMsg) => setError(errorMsg)}
            />
          )}
        </main>
      </div>
    </BackgroundImage>
  );
}
