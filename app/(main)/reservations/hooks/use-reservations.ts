"use client";

import { useMemo } from 'react';
import { DUMMY_QUESTS } from '@/data/quests';
import { Reservation } from '../types';

export function useReservations(status: 'reserved' | 'completed') {
  const reservations = useMemo(() => {
    const today = new Date();
    const baseQuests = Object.values(DUMMY_QUESTS).flat();
    
    if (status === 'reserved') {
      // 予約済みクエスト用のデータ（最新の5件）
      return baseQuests
        .slice(0, 1)
        .map(quest => ({
          id: quest.id,
          date: new Date(2025, 1, 1 + Math.floor(Math.random() * 14)), // 2/1から2週間以内
          time: quest.startTime,
          title: quest.title,
          location: quest.location,
          status: 'reserved' as const,
          qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${quest.id}`
        }));
    } else {
      // 完了済みクエスト用のデータ（過去の5件）
      return baseQuests
        .slice(2, 5)
        .map(quest => ({
          id: quest.id + '_completed',
          date: new Date(2025, 1, 1 - Math.floor(Math.random() * 14)), // 2/1から過去2週間以内
          time: quest.startTime,
          title: quest.title,
          location: quest.location,
          status: 'completed' as const
        }));
    }
  }, [status]);

  return { reservations };
}