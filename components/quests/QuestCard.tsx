"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import type { Quest } from '@/lib/types/quest';
import { FavoriteButton } from './FavoriteButton';

interface QuestCardProps {
  quest: Quest;
}

export function QuestCard({ quest }: QuestCardProps) {
  const router = useRouter();

  // カードクリック時の処理
  const handleCardClick = () => {
    router.push(`/quests/${quest.id}`);
  };

  // 評価に基づく色を決定
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-yellow-400';
    if (rating >= 4.0) return 'text-green-400';
    if (rating >= 3.5) return 'text-blue-400';
    return 'text-gray-400';
  };

  // 難易度に基づく色を決定
  const getDifficultyColor = (difficulty: string) => {
    const stars = difficulty.length;
    if (stars === 3) return 'text-red-400';
    if (stars === 2) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <Card 
      className="bg-[#3a2820]/80 backdrop-blur hover:shadow-lg transition-all duration-300 cursor-pointer border-[#8b7355] hover:scale-[1.02] group relative overflow-hidden"
      onClick={handleCardClick}
    >
      {/* メインビジュアル */}
      <div className="relative aspect-video w-full overflow-hidden">
        <img
          src={quest.image}
          alt={quest.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        
        {/* オーバーレイコンテンツ */}
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
      </div>

      <CardContent className="p-4 space-y-4">
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

          {/* チケット情報 */}
          <div className="flex items-center justify-between pt-2 border-t border-white/20">
            <div className="flex flex-col">
              <span className="text-xs text-white/80">チケット</span>
              <span className="text-lg font-bold text-emerald-400">
                ¥{quest.tickets.price?.toLocaleString() || '0'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-white/80">残り</span>
              <span className={`text-sm font-medium ml-1 ${
                quest.tickets.available <= 5 ? 'text-red-400' : 
                quest.tickets.available <= 10 ? 'text-yellow-400' : 
                'text-green-400'
              }`}>
                {quest.tickets.available}枚
              </span>
            </div>
          </div>

          {/* 報酬カード情報 */}
          <div className="flex items-center justify-between pt-2 border-t border-white/20">
            <div className="flex flex-col">
              <span className="text-xs text-white/80">報酬カード</span>
              <span className="text-sm font-medium text-purple-400">
                {quest.reward.cardNumber}
              </span>
            </div>
            <span className="text-sm font-medium text-purple-400">
              {quest.reward.cardName}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 