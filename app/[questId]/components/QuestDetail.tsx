"use client";

import { useRouter } from 'next/navigation';
import { Clock, MapPin, Users, Trophy, Star } from 'lucide-react';
import { Share2 } from 'lucide-react';
import { Quest } from '@/app/types/quest';
import { FavoriteButton } from '@/components/FavoriteButton';

interface QuestDetailProps {
  quest: Quest;
}

export function QuestDetail({ quest }: QuestDetailProps) {
  const router = useRouter();

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

  // チケット残数に基づく色を決定
  const getTicketColor = (available: number) => {
    if (available <= 5) return 'text-red-400';
    if (available <= 10) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b')] bg-cover bg-center">
      <div className="min-h-screen bg-gradient-to-b from-black/30 via-black/20 to-black/40">
        {/* 装飾的な要素 */}
        <div className="absolute inset-0 bg-[url('/patterns/noise.png')] opacity-5 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2a1810]/40 to-transparent pointer-events-none" />

        {/* ヘッダー */}
        <div className="sticky top-0 z-50 bg-[#463C2D]/95 backdrop-blur border-b border-[#C0A172]">
          <div className="container mx-auto px-4 py-4">
            <a
              href="/"
              className="flex items-center text-[#E8D4B9] hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="m15 18-6-6 6-6"/>
              </svg>
              <span>戻る</span>
            </a>
          </div>
        </div>

        <main className="container mx-auto px-4 py-6 space-y-6 pb-32 max-w-4xl">
          {/* メインビジュアル */}
          <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-xl">
            <img
              src={quest.image}
              alt={quest.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-md text-white text-sm">
                  開始 {quest.startTime}
                </span>
                <span className={`bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-md text-sm ${getDifficultyColor(quest.difficulty)}`}>
                  難易度 {quest.difficulty}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 line-clamp-2">
                {quest.title}
              </h1>
            </div>
          </div>

          {/* クエスト情報 */}
          <div className="bg-[#463C2D]/80 backdrop-blur rounded-lg p-4 sm:p-6 space-y-6 shadow-xl border border-[#C0A172]">
            {/* 基本情報 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center text-[#E8D4B9]">
                  <Clock className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>{new Date(quest.date).toLocaleDateString('ja-JP', { 
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                  })}</span>
                </div>
                <div className="flex items-center text-[#E8D4B9]">
                  <MapPin className="w-5 h-5 mr-3 flex-shrink-0" />
                  <div>
                    <p>{quest.location.address}</p>
                    <p className="text-sm text-[#E8D4B9]/60">{quest.location.access}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-3 flex-shrink-0 text-[#E8D4B9]" />
                  <span className={getTicketColor(quest.tickets.available)}>
                    残り {quest.tickets.available}枚
                  </span>
                </div>
                <div className="flex items-center text-[#E8D4B9]">
                  <Trophy className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>{quest.reward.cardName}</span>
                </div>
              </div>
            </div>

            {/* クエスト説明 */}
            <div className="border-t border-[#C0A172]/20 pt-6">
              <h2 className="text-lg font-medium text-[#E8D4B9] mb-3">クエスト内容</h2>
              <p className="text-[#E8D4B9]/90 leading-relaxed text-sm sm:text-base">
                {quest.description}
              </p>
            </div>

            {/* 報酬カード情報 */}
            <div className="border-t border-[#C0A172]/20 pt-6">
              <h2 className="text-lg font-medium text-[#E8D4B9] mb-3">報酬カード</h2>
              <div className="bg-[#5C4D3C]/50 rounded-lg p-4 border border-[#C0A172]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#E8D4B9]/80 text-sm">カード番号</p>
                    <p className="text-lg font-bold text-purple-400">{quest.reward.cardNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#E8D4B9]/80 text-sm">カード名</p>
                    <p className="text-lg font-bold text-purple-400">{quest.reward.cardName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* レビュー情報 */}
            <div className="border-t border-[#C0A172]/20 pt-6">
              <h2 className="text-lg font-medium text-[#E8D4B9] mb-3">レビュー</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Star className={`w-5 h-5 ${getRatingColor(quest.reviews?.rating || 0)} fill-current`} />
                  <span className={`font-medium ml-2 ${getRatingColor(quest.reviews?.rating || 0)}`}>
                    {(quest.reviews?.rating || 0).toFixed(1)}
                  </span>
                  <span className="text-[#E8D4B9]/60 ml-2">({quest.reviews?.count || 0}件)</span>
                </div>
                {quest.reviews?.comments?.map((comment) => (
                  <div key={comment.id} className="bg-[#5C4D3C]/50 rounded-lg p-4 border border-[#C0A172]">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-[#E8D4B9] font-medium">{comment.author}</p>
                        <div className="flex items-center">
                          <Star className={`w-4 h-4 ${getRatingColor(comment.rating)} fill-current`} />
                          <span className={`ml-1 ${getRatingColor(comment.rating)}`}>
                            {comment.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <p className="text-[#E8D4B9]/60 text-sm">
                        {new Date(comment.date).toLocaleDateString('ja-JP')}
                      </p>
                    </div>
                    <p className="text-[#E8D4B9]/90">{comment.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* フッター */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#463C2D]/95 backdrop-blur border-t border-[#C0A172]">
          <div className="container mx-auto max-w-2xl flex items-center gap-4">
            <FavoriteButton questId={quest.id} />
            <button
              className="flex items-center justify-center p-3 rounded-full bg-[#5C4D3C]/50 hover:bg-[#5C4D3C] transition-colors border border-[#C0A172]"
              aria-label="シェア"
            >
              <Share2 className="w-6 h-6 text-[#E8D4B9]" />
            </button>
            <button
              onClick={() => router.push(`/purchase/${quest.id}`)}
              className="flex-1 py-4 text-lg font-medium rounded-lg transition-all duration-300
                bg-purple-600 text-white hover:bg-purple-700 transform hover:scale-[1.02]"
            >
              購入へ進む
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}