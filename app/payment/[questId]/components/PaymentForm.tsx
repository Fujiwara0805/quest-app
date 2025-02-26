"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, CreditCard, QrCode } from 'lucide-react';
import { Quest } from "@/app/types/quest";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createClient } from '@/utils/supabase/client';

interface PaymentFormProps {
  questId: string;
}

type PaymentMethod = 'card' | 'qr';

interface CardInfo {
  number: string;
  expiry: string;
  cvc: string;
  name: string;
}

export function PaymentForm({ questId }: PaymentFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardInfo, setCardInfo] = useState<CardInfo>({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  const [quest, setQuest] = useState<Quest | null>(null);
  const [error, setError] = useState<string | null>(null);

  // URLパラメータから予約情報を取得
  const date = searchParams.get('date');
  const time = searchParams.get('time');
  const quantity = searchParams.get('quantity');

  // クエストデータを取得
  useEffect(() => {
    async function fetchQuest() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('quests')
          .select('*')
          .eq('id', questId)
          .single();
          
        if (error) {
          throw error;
        }
        
        if (data) {
          // データベースから取得したデータをフロントエンドの型に変換
          setQuest({
            id: data.id.toString(),
            title: data.title,
            description: data.description,
            difficulty: data.quest_difficulty || '★',
            date: new Date(data.date),
            startTime: data.start_time,
            location: {
              address: data.address,
              access: data.access
            },
            tickets: {
              available: data.tickets_available,
              price: data.ticket_price
            },
            image: data.image_url,
            reward: {
              cardNumber: data.reward_card_number,
              cardName: data.reward_card_name
            },
            reviews: {
              rating: data.rating || 0,
              count: data.review_count || 0,
              comments: []
            }
          });
        } else {
          setError('クエストが見つかりませんでした');
        }
      } catch (error) {
        console.error('クエスト取得エラー:', error);
        setError('クエスト情報の取得に失敗しました');
      }
    }
    
    fetchQuest();
  }, [questId]);

  // カード情報が全て入力されているかチェック
  const isCardInfoComplete = paymentMethod === 'qr' || (
    cardInfo.number.length >= 16 &&
    cardInfo.expiry.length === 5 &&
    cardInfo.cvc.length >= 3 &&
    cardInfo.name.length > 0
  );

  // 予約情報がない場合は購入画面に戻る
  useEffect(() => {
    if (!date || !time || !quantity) {
      router.push(`/purchase/${questId}`);
    }
  }, [date, time, quantity, questId, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#3a2820]">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">エラー: {error}</h1>
          <a href="/" className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
            クエスト一覧に戻る
          </a>
        </div>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#3a2820]">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">読み込み中...</h1>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    if (!isCardInfoComplete) return;
    
    setIsLoading(true);
    // TODO: 実際の支払い処理を実装
    await new Promise(resolve => setTimeout(resolve, 2000)); // 支払い処理のシミュレーション
    router.push('/payment/complete');
  };

  // カード情報の更新
  const handleCardInfoChange = (field: keyof CardInfo, value: string) => {
    let formattedValue = value;

    // カード番号のフォーマット (4桁ごとにスペース)
    if (field === 'number') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return; // 16桁 + 3スペース
    }

    // 有効期限のフォーマット (MM/YY)
    if (field === 'expiry') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})/, '$1/')
        .substring(0, 5);
    }

    // セキュリティコードは数字のみ、最大4桁
    if (field === 'cvc') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }

    setCardInfo(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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
            {/* 予約内容確認 */}
            <div className="p-6 space-y-6">
              <h2 className="text-xl font-bold text-white">予約内容確認</h2>
              <div className="space-y-4 text-white">
                <div>
                  <h3 className="font-medium mb-2">クエスト</h3>
                  <p>{quest.title}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">予約日時</h3>
                  <p>{date && formatDate(date)}</p>
                  <p>{time}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">購入枚数</h3>
                  <p>{quantity}枚</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">合計金額</h3>
                  <p className="text-xl font-bold">
                    ¥{(quest.tickets.price * (parseInt(quantity || '0'))).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* 支払い方法選択 */}
              <div className="border-t border-[#C0A172]/20 pt-6">
                <h2 className="text-lg font-bold text-white mb-4">支払い方法</h2>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod('card')}
                      className="w-4 h-4 text-purple-600 bg-[#5C4D3C]/50 border-[#C0A172]"
                    />
                    <div className="flex items-center space-x-2 text-white">
                      <CreditCard className="w-5 h-5" />
                      <span>クレジットカード決済</span>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="qr"
                      checked={paymentMethod === 'qr'}
                      onChange={(e) => setPaymentMethod('qr')}
                      className="w-4 h-4 text-purple-600 bg-[#5C4D3C]/50 border-[#C0A172]"
                    />
                    <div className="flex items-center space-x-2 text-white">
                      <QrCode className="w-5 h-5" />
                      <span>QRコード決済</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* クレジットカード情報フォーム */}
              {paymentMethod === 'card' && (
                <div className="border-t border-[#C0A172]/20 pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-white" />
                    <h2 className="text-lg font-bold text-white">カード情報入力</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber" className="text-white">カード番号</Label>
                      <Input
                        id="cardNumber"
                        value={cardInfo.number}
                        onChange={(e) => handleCardInfoChange('number', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        className="bg-[#5C4D3C]/50 border-[#C0A172] text-white placeholder:text-white/50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry" className="text-white">有効期限</Label>
                        <Input
                          id="expiry"
                          value={cardInfo.expiry}
                          onChange={(e) => handleCardInfoChange('expiry', e.target.value)}
                          placeholder="MM/YY"
                          className="bg-[#5C4D3C]/50 border-[#C0A172] text-white placeholder:text-white/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc" className="text-white">セキュリティコード</Label>
                        <Input
                          id="cvc"
                          value={cardInfo.cvc}
                          onChange={(e) => handleCardInfoChange('cvc', e.target.value)}
                          placeholder="123"
                          className="bg-[#5C4D3C]/50 border-[#C0A172] text-white placeholder:text-white/50"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">カード名義人</Label>
                      <Input
                        id="name"
                        value={cardInfo.name}
                        onChange={(e) => handleCardInfoChange('name', e.target.value)}
                        placeholder="TARO YAMADA"
                        className="bg-[#5C4D3C]/50 border-[#C0A172] text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* QRコード決済の場合 */}
              {paymentMethod === 'qr' && (
                <div className="border-t border-[#C0A172]/20 pt-6">
                  <div className="text-center text-white">
                    <p className="mb-4">QRコード決済は現在準備中です。</p>
                    <p className="text-sm text-white/70">
                      クレジットカード決済をご利用ください。
                    </p>
                  </div>
                </div>
              )}
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
                  onClick={handlePayment}
                  disabled={!isCardInfoComplete || isLoading}
                  className={`flex-1 py-3 text-white font-medium rounded-lg transition-all duration-300
                    ${isCardInfoComplete && !isLoading
                      ? 'bg-purple-600 hover:bg-purple-700 transform hover:scale-[1.02]'
                      : 'bg-gray-500 cursor-not-allowed'
                    }`}
                >
                  {isLoading ? "処理中..." : "支払いを確定する"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}