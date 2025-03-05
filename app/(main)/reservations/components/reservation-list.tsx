"use client";

import { useMemo, useState } from 'react';
import { DUMMY_QUESTS } from '@/data/quests';
import { CheckCircle, Clock, QrCode, X } from 'lucide-react';
import { QRCodeModal } from './qr-code-modal';
import { useReservations } from '../hooks/useReservations';
import { Reservation } from '../hooks/useReservations';

interface ReservationListProps {
  quests: Reservation[];
  onQuestClick: (id: string) => void;
}

export function ReservationList({ quests, onQuestClick }: ReservationListProps) {
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
          onClick={() => reservation.status === 'reserved' && onQuestClick(reservation.id)}
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
}