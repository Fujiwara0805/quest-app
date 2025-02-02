"use client";

import { useMemo } from 'react';
import { DUMMY_QUESTS } from '@/data/quests';

interface ReservationCalendarProps {
  currentMonth: Date;
}

export function ReservationCalendar({ currentMonth }: ReservationCalendarProps) {
  // カレンダーのデータを生成
  const calendarData = useMemo(() => {
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    // 月の最初の日の曜日（0-6）
    const firstDayOfWeek = firstDay.getDay();
    
    // カレンダーの日付を格納する配列
    const days = [];
    
    // 前月の日付を追加
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(firstDay);
      date.setDate(date.getDate() - i - 1);
      days.push({ date, isCurrentMonth: false });
    }
    
    // 当月の日付を追加
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      days.push({ date, isCurrentMonth: true });
    }
    
    // 次月の日付を追加（6週間分になるように）
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(lastDay);
      date.setDate(date.getDate() + i);
      days.push({ date, isCurrentMonth: false });
    }
    
    return days;
  }, [currentMonth]);

  // ダミーの予約データを生成
  const reservations = useMemo(() => {
    const today = new Date();
    return Object.values(DUMMY_QUESTS).flat().map(quest => ({
      date: quest.date,
      title: quest.title,
      status: quest.date < today ? 'completed' : 'reserved'
    }));
  }, []);

  // 日付に対応する予約を取得
  const getReservationsForDate = (date: Date) => {
    return reservations.filter(reservation => 
      reservation.date.getDate() === date.getDate() &&
      reservation.date.getMonth() === date.getMonth() &&
      reservation.date.getFullYear() === date.getFullYear()
    );
  };

  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className="p-4 bg-white rounded-lg">
      {/* 曜日の行 */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`text-center text-sm font-medium p-2 ${
              index === 0 ? 'text-red-500' :
              index === 6 ? 'text-blue-500' :
              'text-gray-700'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* カレンダー本体 */}
      <div className="grid grid-cols-7 gap-1">
        {calendarData.map(({ date, isCurrentMonth }, index) => {
          const reservationsForDate = getReservationsForDate(date);
          const hasReserved = reservationsForDate.some(r => r.status === 'reserved');
          const hasCompleted = reservationsForDate.some(r => r.status === 'completed');

          return (
            <div
              key={date.toISOString()}
              className={`
                min-h-[100px] p-1 rounded-lg border
                ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                ${hasReserved ? 'ring-2 ring-purple-500' : ''}
                ${hasCompleted ? 'ring-2 ring-green-500' : ''}
              `}
            >
              <div className={`
                text-right text-sm p-1
                ${!isCurrentMonth ? 'text-gray-400' :
                  index % 7 === 0 ? 'text-red-500' :
                  index % 7 === 6 ? 'text-blue-500' :
                  'text-gray-700'}
              `}>
                {date.getDate()}
              </div>
              <div className="space-y-1">
                {reservationsForDate.map((reservation, i) => (
                  <div
                    key={i}
                    className={`
                      text-xs p-1 rounded truncate
                      ${reservation.status === 'reserved' ? 'bg-purple-100 text-purple-700 border border-purple-200' : ''}
                      ${reservation.status === 'completed' ? 'bg-green-100 text-green-700 border border-green-200' : ''}
                    `}
                  >
                    {reservation.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}