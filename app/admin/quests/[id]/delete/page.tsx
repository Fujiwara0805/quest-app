'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { FaArrowLeft, FaTrash } from 'react-icons/fa';
import Image from 'next/image';

export default function QuestDeletePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [quest, setQuest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

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
    try {
      const response = await fetch(`/api/admin/quests/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setQuest(data.quest);
      } else {
        throw new Error('クエストの取得に失敗しました');
      }
    } catch (error) {
      console.error('クエスト情報の取得に失敗しました', error);
      alert('クエスト情報の取得に失敗しました');
      router.push('/admin/quests');
    } finally {
      setIsLoading(false);
    }
  };

  // クエスト削除処理
  const handleDelete = async () => {
    if (!confirm('本当にこのクエストを削除しますか？この操作は元に戻せません。')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/quests/${params.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'クエストの削除に失敗しました');
      }
      
      alert('クエストが削除されました');
      router.push('/admin/quests');
      
    } catch (error: any) {
      console.error('クエスト削除エラー:', error);
      alert(`エラーが発生しました: ${error.message || 'Unknown error'}`);
    } finally {
      setIsDeleting(false);
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

  if (!quest) {
    return (
      <div className="text-center text-white">
        <p>クエストが見つかりませんでした</p>
        <Link
          href="/admin/quests"
          className="text-purple-400 hover:text-purple-300 mt-4 inline-block"
        >
          クエスト一覧に戻る
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/admin/quests/${params.id}`}
          className="text-purple-400 hover:text-purple-300 flex items-center gap-2 mb-2"
        >
          <FaArrowLeft /> クエスト編集に戻る
        </Link>
        <h1 className="text-3xl font-bold text-white">クエスト削除</h1>
      </div>
      
      <Card className="bg-[#463C2D]/80 backdrop-blur rounded-lg p-6 shadow-xl border border-[#C0A172]">
        <CardContent>
          <div className="text-center">
            <div className="bg-red-600/20 p-4 rounded-full inline-flex items-center justify-center mb-4">
              <FaTrash className="text-red-500 text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">このクエストを削除しますか？</h2>
            <p className="text-gray-300 mb-6">この操作は元に戻せません。</p>
          </div>
          
          <div className="bg-[#3a2820] border border-[#C0A172]/30 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">{quest.title}</h3>
                <p className="text-gray-300 mb-2">
                  <span className="font-semibold">開催日:</span> {quest.questDate ? new Date(quest.questDate).toLocaleDateString('ja-JP') : '-'}
                </p>
                <p className="text-gray-300 mb-2">
                  <span className="font-semibold">難易度:</span> {quest.difficulty || '-'}
                </p>
                <p className="text-gray-300 mb-2">
                  <span className="font-semibold">チケット残数:</span> {quest.ticketsAvailable || '-'}
                </p>
                <p className="text-gray-300 mb-2">
                  <span className="font-semibold">チケット価格:</span> {quest.ticketPrice ? `¥${quest.ticketPrice.toLocaleString()}` : '-'}
                </p>
                {quest.description && (
                  <div className="mt-4">
                    <p className="text-gray-300 whitespace-pre-line">{quest.description}</p>
                  </div>
                )}
              </div>
              
              {quest.imageUrl && (
                <div className="relative w-full h-48 bg-[#2A1A12] rounded-md overflow-hidden">
                  <Image
                    src={quest.imageUrl}
                    alt={quest.title}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
            <Link
              href={`/admin/quests/${params.id}`}
              className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-md text-center"
            >
              キャンセル
            </Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  削除中...
                </>
              ) : (
                <>
                  <FaTrash /> クエストを削除する
                </>
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
