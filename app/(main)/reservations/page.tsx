"use client";

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from '../components/page-header';
import { useReservations } from './hooks/useReservations';
import { QRCodeModal } from './components/qr-code-modal';
import { ReservationList } from './components/reservation-list';

export default function ReservationsPage() {
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
  const reservations = useReservations();

  // 選択されたクエストを取得
  const selectedQuest = selectedQuestId 
    ? reservations.upcoming.find(r => r.id === selectedQuestId)
    : undefined;

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
              <ReservationList 
                quests={reservations.upcoming} 
                onQuestClick={(id) => setSelectedQuestId(id)} 
              />
            </TabsContent>

            <TabsContent value="completed" className="overflow-hidden">
              <ReservationList 
                quests={reservations.completed} 
                onQuestClick={() => {}} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* QRコードモーダル */}
      {selectedQuestId && (
        <QRCodeModal
          quest={selectedQuest}
          onClose={() => setSelectedQuestId(null)}
        />
      )}
    </>
  );
}