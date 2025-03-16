"use client";

import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/lib/hooks/useFavorites';
import { getQuests } from '@/app/data/quests';
import { QuestCard } from '@/components/quests/QuestCard';
import { PageHeader } from '../components/page-header';
import { useEffect, useState } from 'react';
import { Quest } from '@/lib/types/quest';

export default function FavoritesPage() {
  const router = useRouter();
  const { favorites } = useFavorites();
  const [favoriteQuests, setFavoriteQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFavoriteQuests() {
      try {
        setIsLoading(true);
        const allQuests = await getQuests();
        const filteredQuests = allQuests.filter(quest => favorites.includes(quest.id.toString()));
        setFavoriteQuests(filteredQuests);
      } catch (error) {
        console.error('お気に入りクエスト取得エラー:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFavoriteQuests();
  }, [favorites]);

  return (
    <>
      <PageHeader title="お気に入り" />

      <main className="container mx-auto px-4 py-6 pb-24">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <p className="text-[#E8D4B9]/70">読み込み中...</p>
          </div>
        ) : favoriteQuests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favoriteQuests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-[#E8D4B9]/70">
            <Heart className="w-12 h-12 mb-4 stroke-current" />
            <p className="text-lg mb-4">お気に入りのクエストはありません</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              クエストを探す
            </button>
          </div>
        )}
      </main>
    </>
  );
}