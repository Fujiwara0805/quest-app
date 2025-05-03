"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import type { Quest } from '@/lib/types/quest';
import { FavoriteButton } from './FavoriteButton';
import { motion } from 'framer-motion';

interface QuestCardProps {
  quest: Quest;
  dateSearchEnabled?: boolean;
}

export function QuestCard({ quest, dateSearchEnabled = true }: QuestCardProps) {
  const router = useRouter();

  // カードクリック時の処理
  const handleCardClick = () => {
    router.push(`/quests/${quest.id}`);
  };

  // 難易度に基づく色を決定
  const getDifficultyColor = (difficulty: string) => {
    const stars = difficulty.length;
    if (stars >= 3) return 'text-red-400';
    if (stars >= 2) return 'text-yellow-400';
    return 'text-green-400';
  };

  // チケット残数に基づく色を決定
  const getTicketColor = (available: number) => {
    if (available <= 5) return 'text-red-400';
    if (available <= 10) return 'text-yellow-400';
    return 'text-green-400';
  };

  // 日付フォーマット（曜日なし）
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('ja-JP', { 
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  };
  
  // タイトルを7文字に制限する関数
  const limitTitle = (title: string) => {
    if (title.length > 7) {
      return `${title.substring(0, 6)}...`;
    }
    return title;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card 
        className="bg-[#3a2820]/80 backdrop-blur hover:shadow-lg transition-all duration-300 cursor-pointer border-[#8b7355] hover:scale-[1.02] group relative overflow-hidden"
        onClick={handleCardClick}
      >
        {/* メインビジュアル (60%) */}
        <div className="relative aspect-video w-full overflow-hidden">
          <img
            src={quest.image}
            alt={quest.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          
          {/* 日付検索が有効な場合は難易度、開始時間、レビューを表示 */}
          {dateSearchEnabled && (
            <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
              <div className="flex justify-between items-start gap-2">
                <div className="flex flex-col gap-2">
                  <div className="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-md text-xs font-medium">
                    開始 {quest.startTime}
                  </div>
                  <div className={`w-fit flex items-center space-x-1 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-md text-xs ${getDifficultyColor(quest.difficulty)}`}>
                    <span>難易度</span>
                    <span>{quest.difficulty}</span>
                  </div>
                </div>
                <FavoriteButton questId={quest.id.toString()} />
              </div>

              <div>
                <div className="flex items-center mb-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md w-fit">
                  <span className="ml-1 text-sm font-medium">{quest.reviews?.rating.toFixed(1) || '0.0'}</span>
                  <span className="ml-1 text-xs text-white/60">({quest.reviews?.count || 0}件)</span>
                </div>
                <h3 className="font-bold text-lg mb-2 line-clamp-2 text-shadow-sm">
                  {quest.title}
                </h3>
              </div>
            </div>
          )}

          {/* 日付検索が無効な場合はお気に入りボタンのみ表示 */}
          {!dateSearchEnabled && (
            <div className="absolute top-4 right-4">
              <FavoriteButton questId={quest.id.toString()} />
            </div>
          )}
        </div>

        {/* テキスト部分 (40%) */}
        <CardContent className="p-4 space-y-4">
          {/* 日付検索のON/OFFで表示を切り替え */}
          {dateSearchEnabled ? (
            <div className="space-y-2 text-white/90 bg-[#3a2820]/30 p-3 rounded-lg">
              <div className="flex items-center">
                <span className="text-sm font-medium">{quest.location.address}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium">
                  {new Date(quest.date).toLocaleDateString('ja-JP', { 
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                  })}
                </span>
              </div>

              {/* チケット情報 - 別々に表記 */}
              <div className="flex items-center justify-between pt-2 border-t border-white/20">
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-white">
                    ¥{quest.tickets.price?.toLocaleString() || '0'}
                  </span>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-medium ${getTicketColor(quest.tickets.available)}`}>
                    残り {quest.tickets.available}枚
                  </span>
                </div>
              </div>
            </div>
          ) : (
            // 日付検索OFFの場合の新しいレイアウト
            <div className="flex flex-col space-y-3 text-white/90">
              {/* 日付 */}
              <div className="flex items-center">
                <span className="text-sm font-medium">{formatDate(quest.date)}</span>
              </div>
              
              {/* クエストタイトル（7文字制限） */}
              <h3 className="font-bold text-lg">
                {limitTitle(quest.title)}
              </h3>
              
              {/* チケット残り枚数 */}
              <div className="flex items-center">
                <span className={`text-sm font-medium ${getTicketColor(quest.tickets.available)}`}>
                  チケット残り {quest.tickets.available}枚
                </span>
              </div>
              
              {/* チケット金額（「以上」表記に変更、白色・サイズ大きく） */}
              <div className="pt-2 border-t border-white/20">
                <span className="text-2xl font-bold text-white">
                  ¥{quest.tickets.price?.toLocaleString() || '0'}〜
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
} 