"use client";

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { DateSelector } from './DateSelector';
import { LocationSelector } from './LocationSelector';
import { BottomNavigation } from './BottomNavigation';
import { useQuests } from '../../lib/hooks/useQuests';
import { useLocation } from '../../lib/hooks/useLocation';
import { useFavorites } from '../../lib/hooks/useFavorites';
import QuestList from './QuestList';
import { SortType } from '@/lib/constants/sort-options';
import { BackgroundImage } from '@/components/ui/BackgroundImage';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Quest } from '@/lib/types/quest';
import { QuestCard } from './QuestCard';

export default function QuestListContainer() {
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

  // データからカテゴリーのリストを抽出
  const getUniqueCategories = () => {
    // クエストからcategoryフィールドを抽出して重複を削除
    const categories = quests
      .map(quest => quest.category)
      .filter(Boolean) // nullやundefinedを除外
      .filter((category, index, self) => 
        self.indexOf(category) === index // 重複を削除
      );
    
    return categories.length > 0 
      ? categories 
      : ['伝統工芸品', '農業体験', '漁業体験']; // データがない場合はデフォルト
  };

  // カテゴリー別にクエストを分類
  const getQuestsByCategory = (category: string) => {
    return quests.filter(quest => quest.category === category);
  };

  // カテゴリーセクションのレンダリング
  const renderCategorySection = () => {
    const categories = getUniqueCategories();
    
    return (
      <div className="space-y-8 mt-4">
        {categories.map(category => (
          <CategorySection
            key={category}
            categoryName={category}
            quests={getQuestsByCategory(category)}
          />
        ))}
      </div>
    );
  };

  return (
    <BackgroundImage>
      <div className="min-h-screen bg-gradient-to-b from-black/30 via-black/20 to-black/40">
        {/* 装飾的な要素 */}
        <div className="absolute inset-0 bg-black/5 pointer-events-none" />
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
          {/* 日付検索OFF + お気に入り表示OFF + 検索クエリなしの場合のみカテゴリー表示 */}
          {!dateSearchEnabled && !showFavorites && !searchQuery ? (
            renderCategorySection()
          ) : (
            // それ以外の場合は通常のリスト表示
            filteredQuests.length === 0 ? (
              <div className="text-center py-10 text-white">
                クエストが見つかりませんでした
              </div>
            ) : (
              <QuestList quests={filteredQuests} />
            )
          )}
        </main>
        
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <BottomNavigation onFavoritesToggle={setShowFavorites} showFavorites={showFavorites} />
        </div>
      </div>
    </BackgroundImage>
  );
}

// CategorySectionコンポーネント（内部で定義）
function CategorySection({ categoryName, quests }: { categoryName: string, quests: Quest[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollPosition = () => {
    if (!sliderRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // 10pxの余裕を持たせる
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    
    const slider = sliderRef.current;
    const cardWidth = slider.querySelector('.quest-card')?.clientWidth || 250; // カード幅の取得
    const gap = 16; // ギャップ
    const scrollDistance = cardWidth + gap;
    
    if (direction === 'left') {
      slider.scrollBy({ left: -scrollDistance, behavior: 'smooth' });
    } else {
      slider.scrollBy({ left: scrollDistance, behavior: 'smooth' });
    }
    
    // スクロール後に状態をチェック
    setTimeout(checkScrollPosition, 300);
  };

  // 初期表示時にスクロール状態をチェック
  useEffect(() => {
    checkScrollPosition();
    // リサイズ時にもチェック
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, [quests]);

  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white text-xl font-bold">{categoryName}</h2>
        {quests.length > 2 && (
          <div className="flex items-center space-x-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-1 rounded-full bg-[#3a2820]/80 ${!canScrollLeft ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label="前へ"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-1 rounded-full bg-[#3a2820]/80 ${!canScrollRight ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label="次へ"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </motion.button>
          </div>
        )}
      </div>

      {quests.length === 0 ? (
        <div className="text-white/70 text-center py-8 bg-[#3a2820]/30 rounded-lg">
          クエストがありません
        </div>
      ) : (
        <div 
          ref={sliderRef}
          className="flex overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory"
          onScroll={checkScrollPosition}
          style={{ 
            scrollbarWidth: 'none',  /* Firefox */
            msOverflowStyle: 'none'  /* Internet Explorer 10+ */
          }}
        >
          <style jsx>{`
            /* Webkit (Chrome, Safari, etc) */
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {quests.map((quest) => (
            <motion.div
              key={quest.id}
              className="flex-none w-[calc(50%-8px)] sm:w-[calc(50%-8px)] pr-4 snap-start quest-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <QuestCard quest={quest} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
} 