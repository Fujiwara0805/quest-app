"use client";

import { Reservation as PrismaReservation, Quest } from '@prisma/client';
import Link from 'next/link';

type ReservationWithQuest = PrismaReservation & {
  quest: Quest;
};

interface ReservationListProps {
  reservations: ReservationWithQuest[];
}

export function ReservationList({ reservations }: ReservationListProps) {
  return (
    <div className="space-y-4">
      {reservations.map((reservation) => (
        <div key={reservation.id} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold mb-2">{reservation.quest.title}</h2>
              <p className="text-gray-600 mb-1">
                日付: {reservation.quest.questDate ? new Date(reservation.quest.questDate).toLocaleDateString('ja-JP') : '未設定'}
              </p>
              <p className="text-gray-600 mb-1">
                開始時間: {reservation.quest.startTime || '未設定'}
              </p>
              <p className="text-gray-600 mb-1">
                場所: {reservation.quest.address || '未設定'}
              </p>
              <p className="text-gray-600 mb-3">
                予約日: {new Date(reservation.reservedAt).toLocaleDateString('ja-JP')}
              </p>
              <div className="text-lg font-bold">
                料金: {reservation.amount.toLocaleString()}円
              </div>
              <div className="mt-2 inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {reservation.status === 'confirmed' ? '予約確定' : reservation.status}
              </div>
            </div>
            
            {reservation.quest.imageUrl && (
              <div className="w-24 h-24 rounded-md overflow-hidden">
                <img 
                  src={reservation.quest.imageUrl} 
                  alt={reservation.quest.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          
          <div className="mt-4 flex space-x-3">
            <Link 
              href={`/quests/${reservation.questId}`}
              className="text-purple-600 hover:text-purple-800"
            >
              クエスト詳細を見る
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}