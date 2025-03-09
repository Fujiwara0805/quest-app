'use client';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Clock, MapPin, Users, Trophy } from 'lucide-react';
import { FaImage } from 'react-icons/fa';

interface QuestPreviewProps {
  quest: {
    title: string;
    description: string;
    date: Date | null;
    startTime: string;
    difficulty: string;
    location: {
      address: string;
      access: string;
    };
    tickets: {
      available: number;
      price: number;
    };
    reward: {
      cardNumber: string;
      cardName: string;
    };
    image: string;
  };
}

export function QuestPreview({ quest }: QuestPreviewProps) {
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

  return (
    <Card className="bg-[#463C2D]/80 backdrop-blur rounded-lg p-6 shadow-xl border border-[#C0A172]">
      <CardContent>
        <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-xl mb-6">
          {quest.image ? (
            <Image
              src={quest.image}
              alt={quest.title || 'クエスト画像'}
              fill
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-[#2A1A12]">
              <div className="text-[#E8D4B9]/50 flex flex-col items-center">
                <FaImage className="text-5xl mb-2" />
                <p>画像なし</p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-md text-white text-sm">
                開始 {quest.startTime || '--:--'}
              </span>
              <span className={`bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-md text-sm ${getDifficultyColor(quest.difficulty)}`}>
                難易度 {quest.difficulty}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-2 line-clamp-2">
              {quest.title || 'クエストタイトル'}
            </h1>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-center text-[#E8D4B9]">
              <Clock className="w-5 h-5 mr-3 flex-shrink-0" />
              <span>{quest.date ? quest.date.toLocaleDateString('ja-JP', { 
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
              }) : '日付未設定'}</span>
            </div>
            <div className="flex items-center text-[#E8D4B9]">
              <MapPin className="w-5 h-5 mr-3 flex-shrink-0" />
              <div>
                <p>{quest.location.address || '住所未設定'}</p>
                <p className="text-sm text-[#E8D4B9]/60">{quest.location.access || 'アクセス情報なし'}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-3 flex-shrink-0 text-[#E8D4B9]" />
              <span className={getTicketColor(quest.tickets.available)}>
                残り {quest.tickets.available || '0'}枚
              </span>
            </div>
            <div className="flex items-center text-[#E8D4B9]">
              <Trophy className="w-5 h-5 mr-3 flex-shrink-0" />
              <span>{quest.reward.cardName || '報酬カード未設定'}</span>
            </div>
          </div>
        </div>
        
        {/* クエスト説明 */}
        <div className="border-t border-[#C0A172]/20 pt-6 mt-6">
          <h2 className="text-lg font-medium text-[#E8D4B9] mb-3">クエスト内容</h2>
          <p className="text-[#E8D4B9]/90 leading-relaxed text-sm sm:text-base">
            {quest.description || 'クエスト説明はまだ入力されていません。'}
          </p>
        </div>
        
        {/* 報酬カード情報 */}
        <div className="border-t border-[#C0A172]/20 pt-6 mt-6">
          <h2 className="text-lg font-medium text-[#E8D4B9] mb-3">報酬カード</h2>
          <div className="bg-[#5C4D3C]/50 rounded-lg p-4 border border-[#C0A172]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#E8D4B9]/80 text-sm">カード番号</p>
                <p className="text-lg font-bold text-purple-400">{quest.reward.cardNumber || '未設定'}</p>
              </div>
              <div className="text-right">
                <p className="text-[#E8D4B9]/80 text-sm">カード名</p>
                <p className="text-lg font-bold text-purple-400">{quest.reward.cardName || '未設定'}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
