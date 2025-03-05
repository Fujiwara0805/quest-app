"use client";

import { useMemo } from 'react';

export type ReservationStatus = 'reserved' | 'completed';

export interface Reservation {
  id: string;
  date: Date;
  time: string;
  title: string;
  location: {
    address: string;
    access: string;
  };
  status: ReservationStatus;
  qrCode?: string;
}

export interface ReservationsData {
  upcoming: Reservation[];
  completed: Reservation[];
}

export function useReservations(): ReservationsData {
  return useMemo(() => {
    // 現在の日付を取得
    const today = new Date();
    
    // 実際のアプリケーションでは、ここでAPIからユーザーの予約データを取得します
    // 例: const userReservations = await fetchUserReservations(userId);
    
    // 仮のデータを生成（実際の実装では削除してAPIデータを使用）
    const mockUpcomingReservations: Reservation[] = [
      {
        id: "quest_1",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
        time: "14:00",
        title: "古代遺跡の謎を解け",
        location: {
          address: "東京都渋谷区神宮前X-X-X",
          access: "渋谷駅から徒歩10分"
        },
        status: 'reserved',
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=quest_1`
      },
      {
        id: "quest_2",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
        time: "10:30",
        title: "失われた宝物を探せ",
        location: {
          address: "東京都新宿区新宿X-X-X",
          access: "新宿駅から徒歩5分"
        },
        status: 'reserved',
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=quest_2`
      }
    ];

    const mockCompletedReservations: Reservation[] = [
      {
        id: "quest_3_completed",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14),
        time: "13:00",
        title: "幽霊屋敷からの脱出",
        location: {
          address: "東京都目黒区自由が丘X-X-X",
          access: "自由が丘駅から徒歩8分"
        },
        status: 'completed'
      },
      {
        id: "quest_4_completed",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7),
        time: "16:00",
        title: "暗号を解読せよ",
        location: {
          address: "東京都千代田区秋葉原X-X-X",
          access: "秋葉原駅から徒歩3分"
        },
        status: 'completed'
      }
    ];

    return {
      upcoming: mockUpcomingReservations.sort((a, b) => a.date.getTime() - b.date.getTime()),
      completed: mockCompletedReservations.sort((a, b) => b.date.getTime() - a.date.getTime())
    };
  }, []);
}