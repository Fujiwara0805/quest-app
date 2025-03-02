"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Quest } from "@/lib/types/quest";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PurchaseFormProps {
  quest: Quest;
}

export function PurchaseForm({ quest }: PurchaseFormProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedQuantity, setSelectedQuantity] = useState<string>("");

  // 予約可能日を生成（例：今日から7日間）
  const availableDates = useMemo(() => {
    const dates = [];
    const startDate = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, []);

  // 予約可能時間を生成（9:00から17:00まで1時間おき）
  const availableTimes = useMemo(() => {
    const times = [];
    for (let hour = 9; hour <= 17; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return times;
  }, []);

  // 購入可能枚数の配列を生成
  const availableQuantities = useMemo(() => {
    return Array.from({ length: quest.tickets.available }, (_, i) => i + 1);
  }, [quest.tickets.available]);

  // フォームが完了しているかチェック
  const isFormComplete = selectedDate && selectedTime && selectedQuantity;

  const handleProceedToPayment = () => {
    if (!isFormComplete) return;
    
    // 支払い画面へ遷移
    router.push(`/payment/${quest.id}?date=${selectedDate}&time=${selectedTime}&quantity=${selectedQuantity}`);
  };

  // 日付をフォーマット
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b')] bg-cover bg-center">
      <div className="min-h-screen bg-gradient-to-b from-black/30 via-black/20 to-black/40">
        {/* 装飾的な要素 */}
        <div className="absolute inset-0 bg-[url('/patterns/noise.png')] opacity-5 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2a1810]/40 to-transparent pointer-events-none" />

        {/* ヘッダー */}
        <div className="sticky top-0 z-50 bg-[#463C2D]/95 backdrop-blur border-b border-[#C0A172]">
          <div className="container mx-auto px-4 py-4">
            <button
              onClick={() => router.back()}
              className="flex items-center text-white hover:text-white/80 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              <span>戻る</span>
            </button>
          </div>
        </div>

        <main className="container mx-auto px-4 py-6 max-w-2xl">
          <div className="bg-[#463C2D]/80 backdrop-blur rounded-lg border border-[#C0A172] overflow-hidden">
            {/* クエスト情報 */}
            <div className="relative aspect-video">
              <img
                src={quest.image}
                alt={quest.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {quest.title}
                </h1>
              </div>
            </div>

            {/* 購入フォーム */}
            <div className="p-6 space-y-6">
              {/* 予約情報 */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-white">予約日</Label>
                  <Select value={selectedDate} onValueChange={setSelectedDate}>
                    <SelectTrigger id="date" className="bg-[#5C4D3C]/50 border-[#C0A172] text-white">
                      <SelectValue placeholder="予約日を選択してください" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#5C4D3C] border-[#C0A172]">
                      {availableDates.map((date) => (
                        <SelectItem
                          key={date.toISOString()}
                          value={date.toISOString()}
                          className="text-white hover:bg-[#6E5D4A] focus:bg-[#6E5D4A]"
                        >
                          {formatDate(date)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time" className="text-white">開始時間</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger id="time" className="bg-[#5C4D3C]/50 border-[#C0A172] text-white">
                      <SelectValue placeholder="開始時間を選択してください" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#5C4D3C] border-[#C0A172]">
                      {availableTimes.map((time) => (
                        <SelectItem
                          key={time}
                          value={time}
                          className="text-white hover:bg-[#6E5D4A] focus:bg-[#6E5D4A]"
                        >
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-white">購入枚数</Label>
                  <Select value={selectedQuantity} onValueChange={setSelectedQuantity}>
                    <SelectTrigger id="quantity" className="bg-[#5C4D3C]/50 border-[#C0A172] text-white">
                      <SelectValue placeholder="購入枚数を選択してください" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#5C4D3C] border-[#C0A172]">
                      {availableQuantities.map((num) => (
                        <SelectItem
                          key={num}
                          value={num.toString()}
                          className="text-white hover:bg-[#6E5D4A] focus:bg-[#6E5D4A]"
                        >
                          {num}枚
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-white/80">
                    残り{quest.tickets.available}枚
                  </p>
                </div>
              </div>

              {/* 料金情報 */}
              <div className="border-t border-[#C0A172]/20 pt-4">
                <div className="flex justify-between items-center text-white">
                  <span className="text-lg">合計金額</span>
                  <span className="text-xl font-bold">
                    ¥{(quest.tickets.price * (parseInt(selectedQuantity) || 0)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* フッター */}
            <div className="p-4 bg-[#463C2D]/95 backdrop-blur border-t border-[#C0A172]">
              <div className="flex gap-4">
                <button
                  onClick={() => router.back()}
                  className="flex-1 py-3 text-white font-medium rounded-lg
                    border-2 border-[#C0A172] bg-transparent
                    hover:bg-[#5C4D3C] transition-colors"
                >
                  戻る
                </button>
                <button
                  onClick={handleProceedToPayment}
                  disabled={!isFormComplete}
                  className={`flex-1 py-3 text-white font-medium rounded-lg transition-colors
                    ${isFormComplete 
                      ? 'bg-purple-600 hover:bg-purple-700' 
                      : 'bg-gray-500 cursor-not-allowed'}`}
                >
                  支払いへ進む
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}