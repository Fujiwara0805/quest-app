"use client";

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateSelectorProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function DateSelector({ selectedDate, onDateSelect }: DateSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // 今日から3月末までの日付を生成
  const dates = Array.from({ length: getDaysUntilEndOfMarch() }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  // スクロール位置に基づいて矢印の表示/非表示を制御
  const handleScroll = () => {
    if (!scrollRef.current) return;
    
    setShowLeftArrow(scrollRef.current.scrollLeft > 0);
    setShowRightArrow(
      scrollRef.current.scrollLeft < 
      scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 10
    );
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      handleScroll(); // 初期状態の矢印表示を設定
      
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  // スクロール処理
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    const newScrollLeft = direction === 'left'
      ? scrollRef.current.scrollLeft - scrollAmount
      : scrollRef.current.scrollLeft + scrollAmount;
    
    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  // ドラッグ開始
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current!.offsetLeft);
    setScrollLeft(scrollRef.current!.scrollLeft);
  };

  // ドラッグ中
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current!.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current!.scrollLeft = scrollLeft - walk;
  };

  // ドラッグ終了
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // タッチイベント
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current!.offsetLeft);
    setScrollLeft(scrollRef.current!.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollRef.current!.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current!.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="bg-white/95 backdrop-blur border-b relative">
      {/* 左矢印 */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur p-2 rounded-r-lg shadow-lg hover:bg-white transition-colors"
          aria-label="前の日付へ"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
      )}

      {/* 右矢印 */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur p-2 rounded-l-lg shadow-lg hover:bg-white transition-colors"
          aria-label="次の日付へ"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      )}

      {/* スクロール可能な日付コンテナ */}
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none'
        }}
      >
        <div className="flex p-2 gap-2 min-w-max px-8">
          {dates.map((date, i) => {
            const { day, weekday, isToday, isSaturday, isSunday } = formatDate(date);
            const isSelected = date.getDate() === selectedDate.getDate() &&
                             date.getMonth() === selectedDate.getMonth();
            return (
              <button
                key={i}
                className={`
                  flex-none w-16 py-3 flex flex-col items-center
                  border rounded-lg transition-all duration-200
                  ${isSelected ? 'bg-purple-500 text-white border-purple-600 shadow-md scale-105' : 'border-gray-200'}
                  ${isToday && !isSelected ? 'bg-purple-100 border-purple-300' : ''}
                  ${!isSelected && !isToday ? 'hover:border-purple-300 hover:bg-purple-50' : ''}
                  ${isSaturday && !isSelected ? 'text-blue-600' : ''}
                  ${isSunday && !isSelected ? 'text-red-600' : ''}
                `}
                onClick={() => onDateSelect(date)}
              >
                <span className={`text-sm ${isSelected ? 'text-white' : ''}`}>
                  {isToday ? '今日' : weekday}
                </span>
                <span className={`text-xl font-semibold ${isSelected ? 'text-white' : ''}`}>
                  {day}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getDaysUntilEndOfMarch(): number {
  const today = new Date();
  const endOfMarch = new Date(today.getFullYear(), 2, 31); // 2: March (0-based)
  
  if (today > endOfMarch) {
    // If we're past March, get days until next March
    endOfMarch.setFullYear(today.getFullYear() + 1);
  }
  
  const diffTime = endOfMarch.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

function formatDate(date: Date) {
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  const weekday = days[date.getDay()];
  return {
    day: date.getDate(),
    weekday,
    isToday: isSameDay(date, new Date()),
    isSaturday: date.getDay() === 6,
    isSunday: date.getDay() === 0
  };
}

function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
}