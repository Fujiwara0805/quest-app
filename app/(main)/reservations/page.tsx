"use client";

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from '../components/page-header';
import { useMemo } from 'react';
import { DUMMY_QUESTS } from '@/data/quests';
import { CheckCircle, Clock, X } from 'lucide-react';

export default function ReservationsPage() {
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);

  // ダミーの予約データを生成
  const reservations = useMemo(() => {
    const today = new Date();
    const baseQuests = Object.values(DUMMY_QUESTS).flat();
    
    // 予約済みクエスト用のデータ（最新の3件）
    const upcomingQuests = baseQuests
      .slice(0, 2)
      .map(quest => ({
        id: quest.id,
        date: quest.date, 
        time: quest.startTime,
        title: quest.title,
        location: quest.location,
        status: 'reserved' as const,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${quest.id}` // QRコードのURL
      }));

    // 完了済みクエスト用のデータ（過去の3件）
    const completedQuests = baseQuests
      .slice(3, 5)
      .map(quest => ({
        id: quest.id + '_completed',
        date: new Date(2025, 1, 16 - Math.floor(Math.random() * 14)), // 2/16から過去2週間以内
        time: quest.startTime,
        title: quest.title,
        location: quest.location,
        status: 'completed' as const
      }));

    return {
      upcoming: upcomingQuests.sort((a, b) => b.date.getTime() - a.date.getTime()),
      completed: completedQuests.sort((a, b) => b.date.getTime() - a.date.getTime())
    };
  }, []);

  // QRコードモーダル
  const QRCodeModal = ({ quest, onClose }: { quest: any; onClose: () => void }) => (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(42, 36, 27, 0.95)' }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[url('/patterns/noise.png')] opacity-5" />
      
      <div 
        className="relative w-full max-w-lg mx-auto bg-[#463C2D] rounded-xl border-2 border-[#C0A172] shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#5C4D3C] text-[#E8D4B9]/60 hover:text-[#E8D4B9] transition-colors border border-[#C0A172]/50 hover:border-[#C0A172]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* タイトル */}
          <h3 className="text-xl sm:text-2xl font-bold text-center text-purple-400 px-8">
            {quest.title}
          </h3>
          
          {/* QRコード */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-inner mx-auto max-w-[250px] sm:max-w-[300px]">
            <img 
              src={quest.qrCode} 
              alt="QR Code" 
              className="w-full h-auto aspect-square"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          
          {/* 説明テキスト */}
          <p className="text-center text-[#E8D4B9] font-medium text-lg">
            QRコードを提示してください
          </p>
        </div>
      </div>
    </div>
  );

  // 予約リストコンポーネント
  const ReservationList = ({ quests }: { quests: any[] }) => {
    if (quests.length === 0) {
      return (
        <div className="p-8 text-center text-[#E8D4B9]/70">
          予約したクエストはありません
        </div>
      );
    }

    return (
      <div className="p-4 space-y-4">
        {quests.map((reservation) => (
          <div
            key={reservation.id}
            onClick={() => reservation.status === 'reserved' && setSelectedQuestId(reservation.id)}
            className={`
              p-4 rounded-lg border border-[#C0A172]/20 transition-all duration-200
              ${reservation.status === 'reserved' 
                ? 'bg-[#5C4D3C]/50 cursor-pointer hover:bg-[#5C4D3C]/70 hover:border-[#C0A172] hover:shadow-lg hover:scale-[1.02]' 
                : 'bg-[#5C4D3C]/30'
              }
            `}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {reservation.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <Clock className="w-5 h-5 text-purple-400" />
                  )}
                  <span className={`text-sm font-medium
                    ${reservation.status === 'completed' ? 'text-green-400' : 'text-purple-400'}
                  `}>
                    {reservation.status === 'completed' ? '完了したクエスト' : '予約したクエスト'}
                  </span>
                </div>
                <h4 className="text-white font-medium">{reservation.title}</h4>
                <p className="text-white/70 text-sm">{reservation.location.address}</p>
              </div>
              <div className="text-right">
                <p className="text-white">
                  {reservation.date.toLocaleDateString('ja-JP', {
                    month: 'long',
                    day: 'numeric',
                    weekday: 'short'
                  })}
                </p>
                <p className="text-white/70 text-sm">{reservation.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <PageHeader title="予約管理" />

      <main className="container mx-auto px-4 py-6 pb-24 relative">
        <div className="bg-[#463C2D]/80 backdrop-blur rounded-lg border border-[#C0A172] overflow-hidden">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="w-full grid grid-cols-2 bg-[#5C4D3C] p-0 h-12">
              <TabsTrigger 
                value="upcoming"
                className="h-12 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-[#E8D4B9]"
              >
                クエスト前
              </TabsTrigger>
              <TabsTrigger 
                value="completed"
                className="h-12 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-[#E8D4B9]"
              >
                クエスト後
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="overflow-hidden">
              <ReservationList quests={reservations.upcoming} />
            </TabsContent>

            <TabsContent value="completed" className="overflow-hidden">
              <ReservationList quests={reservations.completed} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* QRコードモーダル */}
      {selectedQuestId && (
        <QRCodeModal
          quest={reservations.upcoming.find(r => r.id === selectedQuestId)}
          onClose={() => setSelectedQuestId(null)}
        />
      )}
    </>
  );
}