"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { DateSelector } from './components/date-selector';
import { LocationSelector } from './components/location-selector';
import { QuestList } from './components/quest-list';
import { useQuests } from '@/lib/hooks/useQuests';
import { useLocation } from '@/lib/hooks/useLocation';

export default function QuestListPage() {
  const searchParams = useSearchParams();
  const { selectedPrefecture, setSelectedPrefecture } = useLocation("大分県");
  const {
    quests,
    selectedDate,
    setSelectedDate,
    sortType,
    setSortType
  } = useQuests(new Date());

  // 検索関連の状態
  const [searchQuery, setSearchQuery] = useState('');
  const [dateSearchEnabled, setDateSearchEnabled] = useState(true);
  const [showFavorites, setShowFavorites] = useState(false);

  // クエストのフィルタリング
  const filteredQuests = quests
    .filter(quest => {
      if (showFavorites) {
        return false; // お気に入り画面に移動するため、ここでは表示しない
      }

      if (dateSearchEnabled) {
        const questDate = quest.date;
        return (
          questDate.getDate() === selectedDate.getDate() &&
          questDate.getMonth() === selectedDate.getMonth() &&
          questDate.getFullYear() === selectedDate.getFullYear()
        );
      }
      return true;
    })
    .filter(quest => {
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          quest.title.toLowerCase().includes(searchLower) ||
          quest.description.toLowerCase().includes(searchLower) ||
          quest.location.address.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });

  // URLパラメータの処理
  useEffect(() => {
    const dateParam = searchParams.get('date');
    if (dateParam === 'today') {
      setSelectedDate(new Date());
    }
  }, [searchParams, setSelectedDate]);

  return (
    <>
      <div className="sticky top-0 z-50">
        <LocationSelector
          selectedPrefecture={selectedPrefecture}
          onPrefectureSelect={setSelectedPrefecture}
          currentSort={sortType}
          onSortChange={setSortType}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          dateSearchEnabled={dateSearchEnabled}
          onDateSearchToggle={setDateSearchEnabled}
        />
        {dateSearchEnabled && !showFavorites && (
          <DateSelector
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        )}
      </div>

      <main className="pb-24">
        <QuestList quests={filteredQuests} />
      </main>
    </>
  );
}