"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Calendar, CreditCard, User, Sword, X, MapPin, Calendar as CalendarIcon, Star, QrCode } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function CardListPage() {
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState<{
    number: string;
    name: string;
    image: string;
    description: string;
    acquiredDate: string;
    location: string;
    quest: string;
    isAcquired: boolean;
  } | null>(null);

  // 獲得済みのカードデータ（仮にNo.001のみ）
  const acquiredCards = new Set(['No.001']);

  // カードデータを生成（No.001からNo.099まで）
  const cards = Array.from({ length: 99 }, (_, i) => {
    const numStr = String(i + 1).padStart(3, '0');
    const number = `No.${numStr}`;
    const isAcquired = acquiredCards.has(number);
    
    return {
      number,
      name: isAcquired ? '竹職人の誇り' : '????', // 未獲得の場合は???? を表示
      image: isAcquired 
        ? `/images/cards/${numStr}.png`
        : `/images/cards/locked.png`,
      description: isAcquired 
        ? '伝統ある別府竹細工の技を継承する職人の誇りと技術を表現したカード。竹細工の繊細な美しさと職人の情熱が込められている。' 
        : 'このカードの情報は未解放です。クエストをクリアしてカードを獲得しましょう。',
      acquiredDate: isAcquired ? '2025年2月1日' : '',
      location: isAcquired ? '大分県別府市' : '',
      quest: isAcquired ? '【伝統工芸】別府竹細工の職人体験' : '',
      isAcquired
    };
  });

  const handleCardClick = (card: any) => {
    setSelectedCard(card);
  };

  const handleScanQR = () => {
    // QRコードスキャン機能の実装（今回はアラートで代用）
    alert('カメラを起動してQRコードをスキャンします。');
  };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b')] bg-cover bg-center">
      <div className="min-h-screen bg-gradient-to-b from-black/30 via-black/20 to-black/40">
        {/* 装飾的な要素 */}
        <div className="absolute inset-0 bg-[url('/patterns/noise.png')] opacity-5 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2a1810]/40 to-transparent pointer-events-none" />

        {/* ヘッダー */}
        <div className="sticky top-0 z-40 bg-[#463C2D]/95 backdrop-blur border-b border-[#C0A172]">
          <div className="container mx-auto px-4 py-4 flex justify-center">
            <h1 className="text-xl font-bold text-white">カードコレクション</h1>
          </div>
        </div>

        {/* メインコンテンツ */}
        <main className="container mx-auto px-4 py-6 pb-24">
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {cards.map((card) => (
              <Card 
                key={card.number}
                onClick={() => handleCardClick(card)}
                className={`
                  backdrop-blur overflow-hidden transition-transform duration-300 cursor-pointer
                  ${card.isAcquired 
                    ? 'bg-[#463C2D]/90 border-[#C0A172] ring-2 ring-purple-500/50 hover:scale-105' 
                    : 'bg-gray-600/80 border-gray-500/50 hover:bg-gray-600/90 hover:scale-105'
                  }
                `}
              >
                <div className="aspect-[3/4] relative">
                  <img 
                    src={card.image}
                    alt={card.name}
                    className={`absolute inset-0 w-full h-full object-cover ${!card.isAcquired && 'opacity-50 grayscale'}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-center space-y-1">
                    <p className={`font-bold text-sm sm:text-base ${card.isAcquired ? 'text-purple-400' : 'text-gray-400'}`}>
                      {card.number}
                    </p>
                    <p className="text-white font-medium text-sm truncate">
                      {card.name}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>

        {/* カード詳細モーダル */}
        {selectedCard && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(42, 36, 27, 0.85)' }}
            onClick={() => setSelectedCard(null)}
          >
            <div className="absolute inset-0 bg-[url('/patterns/noise.png')] opacity-5" />
            
            <div 
              className="relative w-full max-w-lg mx-auto bg-[#463C2D] rounded-xl border-2 border-[#C0A172] shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* 閉じるボタン */}
              <button
                onClick={() => setSelectedCard(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-[#5C4D3C] text-[#E8D4B9]/60 hover:text-[#E8D4B9] transition-colors border border-[#C0A172]/50 hover:border-[#C0A172]"
              >
                <X className="w-4 h-4" />
              </button>

              {/* カード画像 */}
              <div className="relative aspect-video">
                <img 
                  src={selectedCard.image}
                  alt={selectedCard.name}
                  className={`w-full h-full object-cover ${!selectedCard.isAcquired && 'opacity-50 grayscale'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#463C2D] via-[#463C2D]/20 to-transparent" />
              </div>

              {/* カード情報 */}
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <p className={`font-bold text-lg ${selectedCard.isAcquired ? 'text-purple-400' : 'text-gray-400'}`}>
                    {selectedCard.number}
                  </p>
                  <h3 className="text-2xl font-bold text-white">
                    {selectedCard.name}
                  </h3>
                </div>

                <p className="text-[#E8D4B9]/90 leading-relaxed">
                  {selectedCard.description}
                </p>

                {selectedCard.isAcquired ? (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 text-[#E8D4B9]/80">
                      <CalendarIcon className="w-4 h-4 text-purple-400" />
                      <span>獲得日: {selectedCard.acquiredDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#E8D4B9]/80">
                      <MapPin className="w-4 h-4 text-purple-400" />
                      <span>獲得場所: {selectedCard.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#E8D4B9]/80">
                      <Star className="w-4 h-4 text-purple-400" />
                      <span>クエスト: {selectedCard.quest}</span>
                    </div>
                  </div>
                ) : (
                  <div className="pt-4">
                    <button
                      onClick={handleScanQR}
                      className="w-full py-4 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      <QrCode className="w-5 h-5" />
                      <span>QRコードを読み取る</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* フッター */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#463C2D]/95 backdrop-blur border-t border-[#C0A172]">
          <div className="container mx-auto grid grid-cols-5 py-2">
            <button 
              onClick={() => router.push('/')}
              className="flex flex-col items-center space-y-1 text-[#E8D4B9]/50 hover:text-[#E8D4B9] transition-colors"
            >
              <Sword className="w-6 h-6" />
              <span className="text-xs">QUEST</span>
            </button>
            <button 
              onClick={() => router.push('/?favorites=true')}
              className="flex flex-col items-center space-y-1 text-[#E8D4B9]/50 hover:text-[#E8D4B9] transition-colors"
            >
              <Heart className="w-6 h-6" />
              <span className="text-xs">おきにいり</span>
            </button>
            <button 
              onClick={() => router.push('/reservations')}
              className="flex flex-col items-center space-y-1 text-[#E8D4B9]/50 hover:text-[#E8D4B9] transition-colors"
            >
              <Calendar className="w-6 h-6" />
              <span className="text-xs">予約管理</span>
            </button>
            <button 
              className="flex flex-col items-center space-y-1 text-[#E8D4B9]"
            >
              <CreditCard className="w-6 h-6" />
              <span className="text-xs">カード</span>
            </button>
            <button 
              onClick={() => router.push('/profile')}
              className="flex flex-col items-center space-y-1 text-[#E8D4B9]/50 hover:text-[#E8D4B9] transition-colors"
            >
              <User className="w-6 h-6" />
              <span className="text-xs">マイページ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}