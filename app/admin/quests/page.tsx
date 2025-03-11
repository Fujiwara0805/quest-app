'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';
import { PageHeader } from '@/app/admin/components/page-header';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import QuestsList from './components/QuestsList';
import SearchBar from './components/SearchBar';
import { useQuestsList } from './hooks/useQuestsList';

export default function QuestsListPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { 
    quests, 
    isLoading, 
    error, 
    fetchQuests, 
    searchTerm, 
    setSearchTerm 
  } = useQuestsList();

  // 認証状態をチェック
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/');
    } else if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchQuests();
    }
  }, [status, session, router, fetchQuests]);

  // ローディング中
  if (status === 'loading' || isLoading) {
    return <LoadingSpinner message="クエスト一覧を読み込み中..." />;
  }

  // エラー表示
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-500/20 border border-red-500 p-4 rounded-md text-white">
          <h2 className="text-xl font-bold mb-2">エラーが発生しました</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader title="クエスト一覧画面" />
      <div className="flex flex-col h-screen container mx-auto px-4 py-4 flex-1 overflow-y-auto">
        {/* ヘッダーとの間に余白を追加 */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          
          <Link
            href="/admin/quests/create"
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <FaPlus /> 新規作成
          </Link>
        </div>
        
        <QuestsList quests={quests} searchTerm={searchTerm} />
      </div>
    </>
  );
}
