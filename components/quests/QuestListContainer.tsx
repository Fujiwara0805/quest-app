"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DateSelector } from './DateSelector';
import { LocationSelector } from './LocationSelector';
import { BottomNavigation } from './BottomNavigation';
import { useQuests } from '../../lib/hooks/useQuests';
import { useLocation } from '../../lib/hooks/useLocation';
import { useFavorites } from '../../lib/hooks/useFavorites';
import QuestList from './QuestList';
import { SortType } from '@/lib/constants/sort-options';
import { BackgroundImage } from '@/components/ui/BackgroundImage';

export default function QuestListContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedPrefecture, setSelectedPrefecture } = useLocation("大分県");
  const { favorites } = useFavorites();
  const { quests, selectedDate, setSelectedDate, sortType, setSortType, isLoading, error } = useQuests(new Date());
  
  // 検索関連の状態
  const [searchQuery, setSearchQuery] = useState('');
  const [dateSearchEnabled, setDateSearchEnabled] = useState(true);
  const [showFavorites, setShowFavorites] = useState(false);

  // URLパラメータの処理
  useEffect(() => {
    const dateParam = searchParams.get('date');
    const favoritesParam = searchParams.get('favorites');

    if (dateParam === 'today') {
      setSelectedDate(new Date());
    }

    if (favoritesParam === 'true') {
      setShowFavorites(true);
    } else {
      setShowFavorites(false);
    }
  }, [searchParams, setSelectedDate]);

  // ローディング状態の表示
  if (isLoading) {
    return (
      <BackgroundImage>
        <div className="text-white text-xl text-center">読み込み中...</div>
      </BackgroundImage>
    );
  }

  // エラー状態の表示
  if (error) {
    return (
      <BackgroundImage>
        <div className="text-white text-xl text-center">エラーが発生しました: {error.message}</div>
      </BackgroundImage>
    );
  }

  // クエストのフィルタリング
  const filteredQuests = quests
    .filter(quest => {
      // お気に入り表示の場合
      if (showFavorites) {
        return favorites.includes(quest.id.toString());
      }
      // 日付検索が有効な場合のみ日付でフィルタリング
      if (dateSearchEnabled) {
        const questDate = quest.date;
        if (!questDate || !(questDate instanceof Date) || isNaN(questDate.getTime())) {
          return false;
        }
        return (
          questDate.getDate() === selectedDate.getDate() &&
          questDate.getMonth() === selectedDate.getMonth() &&
          questDate.getFullYear() === selectedDate.getFullYear()
        );
      }
      return true;
    })
    .filter(quest => {
      // 検索クエリでフィルタリング
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          quest.title.toLowerCase().includes(searchLower) ||
          quest.description?.toLowerCase().includes(searchLower) ||
          quest.location.address.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });

  return (
    <BackgroundImage>
      <div className="min-h-screen bg-gradient-to-b from-black/30 via-black/20 to-black/40">
        {/* 装飾的な要素 */}
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-5 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2a1810]/40 to-transparent pointer-events-none" />
        
        <div className="sticky top-0 z-50">
          <LocationSelector
            selectedPrefecture={selectedPrefecture}
            onPrefectureSelect={setSelectedPrefecture}
            currentSort={sortType as SortType}
            onSortChange={setSortType}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            dateSearchEnabled={dateSearchEnabled}
            onDateSearchToggle={setDateSearchEnabled}
          />
          {dateSearchEnabled && !showFavorites && (
            <DateSelector selectedDate={selectedDate} onDateSelect={setSelectedDate} />
          )}
        </div>
        
        <main className="pb-24">
          {filteredQuests.length === 0 ? (
            <div className="text-center py-10 text-white">
              クエストが見つかりませんでした
            </div>
          ) : (
            <QuestList quests={filteredQuests} />
          )}
        </main>
        
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <BottomNavigation onFavoritesToggle={setShowFavorites} showFavorites={showFavorites} />
        </div>
      </div>
    </BackgroundImage>
  );
} 