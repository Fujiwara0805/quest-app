"use client";

import { useMemo } from 'react';
import { Card } from '@/types/card';

export function useCards() {
  // 獲得済みのカードデータ（仮にNo.001のみ）
  const acquiredCards = new Set(['No.001']);

  // カードデータを生成（No.001からNo.099まで）
  const cards = useMemo(() => {
    return Array.from({ length: 99 }, (_, i) => {
      const numStr = String(i + 1).padStart(3, '0');
      const number = `No.${numStr}`;
      const isAcquired = acquiredCards.has(number);
      
      return {
        number,
        name: isAcquired ? '竹職人の誇り' : '????',
        image: isAcquired 
          ? `/images/cards/${numStr}.png`
          : `https://images.unsplash.com/photo-1597589827317-4c6d6e0a90bd`,
        description: isAcquired 
          ? '伝統ある別府竹細工の技を継承する職人の誇りと技術を表現したカード。竹細工の繊細な美しさと職人の情熱が込められている。' 
          : 'このカードの情報は未解放です。クエストをクリアしてカードを獲得しましょう。',
        acquiredDate: isAcquired ? '2025年2月1日' : '',
        location: isAcquired ? '大分県別府市' : '',
        quest: isAcquired ? '【伝統工芸】別府竹細工の職人体験' : '',
        isAcquired,
        qrCode: isAcquired ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${number}` : undefined
      };
    });
  }, []);

  return { cards };
}