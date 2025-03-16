"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Quest } from "@/lib/types/quest";
import { ChevronLeft, CreditCard, QrCode, AlertCircle } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PaymentFormProps {
  quest: Quest;
  userId: string;
}

type PaymentMethod = 'card' | 'qr';

interface CardInfo {
  number: string;
  expiry: string;
  cvc: string;
  name: string;
}

export function PaymentForm({ quest, userId }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  
  // テスト用の状態
  const [testCardNumber, setTestCardNumber] = useState('4242 4242 4242 4242');
  const [testExpiry, setTestExpiry] = useState('12/25');
  const [testCvc, setTestCvc] = useState('123');
  const [testName, setTestName] = useState('TEST USER');
  const [showTestForm, setShowTestForm] = useState(false);
  
  // 購入枚数の状態
  const [quantity, setQuantity] = useState(1);
  
  // URLからクエリパラメータを取得
  useEffect(() => {
    // 開発環境かどうかを確認
    if (process.env.NODE_ENV === 'development') {
      setShowTestForm(true);
    }
    
    // URLからクエリパラメータを取得
    const params = new URLSearchParams(window.location.search);
    const qty = params.get('quantity');
    
    // 数量が指定されていれば状態を更新
    if (qty && !isNaN(Number(qty))) {
      setQuantity(Number(qty));
    }
  }, []);
  
  // 金額計算（単価 × 枚数）
  const totalAmount = (quest.tickets.price || 0) * quantity;
  
  // 通常の支払い処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      // Stripeがまだロードされていない
      return;
    }
    
    setProcessing(true);
    
    try {
      // 支払い意図を作成
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questId: quest.id,
          amount: totalAmount,
          userId: userId,
          quantity: quantity
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || '支払い処理中にエラーが発生しました');
      }
      
      // カード情報を使用して支払いを確定
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('カード情報が見つかりません');
      }
      
      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: userId,
          },
        },
      });
      
      if (error) {
        throw new Error(error.message || '支払い処理中にエラーが発生しました');
      }
      
      if (paymentIntent.status === 'succeeded') {
        setSucceeded(true);
        
        // 予約情報を保存
        await fetch('/api/reservations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            questId: quest.id,
            userId: userId,
            paymentIntentId: paymentIntent.id,
            amount: totalAmount,
            quantity: quantity
          }),
        });
        
        // 購入完了ページに遷移
        router.push(`/quests/${quest.id}/payment/complete`);
      }
    } catch (err: any) {
      setError(err.message || '支払い処理中にエラーが発生しました');
    } finally {
      setProcessing(false);
    }
  };
  
  // テスト用の支払い処理（簡略版）
  const handleTestPayment = async () => {
    setProcessing(true);
    setError(null);
    
    try {
      // まず簡易APIをテスト
      console.log('テストAPIを確認中...');
      const testResponse = await fetch('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true })
      });
      
      const testData = await testResponse.text();
      console.log('テストAPI応答:', testData);
      
      // 本来のAPI呼び出し
      console.log('支払いAPIを呼び出し中...');
      const paymentResponse = await fetch('/api/payment/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questId: quest.id,
          amount: totalAmount,
          userId: userId,
          quantity: quantity,
          testMode: true
        })
      });
      
      // テキストとして応答を取得（デバッグ用）
      const responseText = await paymentResponse.text();
      console.log('支払いAPI応答テキスト:', responseText);
      
      // テキストをJSONに変換
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('支払いAPI応答JSON:', data);
      } catch (jsonError) {
        console.error('JSON解析エラー:', jsonError);
        throw new Error('APIからの応答をJSONとして解析できませんでした');
      }
      
      // 成功処理
      setSucceeded(true);
      
      // 購入完了ページに遷移
      router.push(`/quests/${quest.id}/payment/complete`);
    } catch (err) {
      console.error('テスト決済エラー:', err);
      setError(err instanceof Error ? err.message : '支払い処理中にエラーが発生しました');
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[url('/images/background.jpeg')] bg-cover bg-center">
      <div className="min-h-screen bg-gradient-to-b from-black/30 via-black/20 to-black/40">
        {/* 装飾的な要素 */}
        <div className="absolute inset-0 bg-[url('/patterns/noise.png')] opacity-5 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2a1810]/40 to-transparent pointer-events-none" />

        {/* ヘッダー - 固定 */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-[#463C2D]/95 backdrop-blur border-b border-[#C0A172]">
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

        {/* メインコンテンツ - ヘッダーとの間隔を開ける */}
        <main className="container mx-auto px-4 py-6 max-w-2xl pt-24">
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
                  <p>{quest.date instanceof Date 
                    ? quest.date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }) 
                    : new Date(quest.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}</p>
                  <p>{quest.startTime || '時間未設定'}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">購入枚数</h3>
                  <p>{quantity}枚</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">合計金額</h3>
                  <p className="text-xl font-bold">
                    ¥{totalAmount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-300">
                    (¥{(quest.tickets.price || 0).toLocaleString()} × {quantity}枚)
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
                      onChange={() => setPaymentMethod('card')}
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
                      onChange={() => setPaymentMethod('qr')}
                      className="w-4 h-4 text-purple-600 bg-[#5C4D3C]/50 border-[#C0A172]"
                    />
                    <div className="flex items-center space-x-2 text-white">
                      <QrCode className="w-5 h-5" />
                      <span>QRコード決済</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* 支払い方法に応じたフォーム表示 */}
              {paymentMethod === 'card' ? (
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
                        value={''}
                        onChange={(e) => {}}
                        placeholder="1234 5678 9012 3456"
                        className="bg-[#5C4D3C]/50 border-[#C0A172] text-white placeholder:text-white/50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry" className="text-white">有効期限</Label>
                        <Input
                          id="expiry"
                          value={''}
                          onChange={(e) => {}}
                          placeholder="MM/YY"
                          className="bg-[#5C4D3C]/50 border-[#C0A172] text-white placeholder:text-white/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc" className="text-white">セキュリティコード</Label>
                        <Input
                          id="cvc"
                          value={''}
                          onChange={(e) => {}}
                          placeholder="123"
                          className="bg-[#5C4D3C]/50 border-[#C0A172] text-white placeholder:text-white/50"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">カード名義人</Label>
                      <Input
                        id="name"
                        value={''}
                        onChange={(e) => {}}
                        placeholder="TARO YAMADA"
                        className="bg-[#5C4D3C]/50 border-[#C0A172] text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-t border-[#C0A172]/20 pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <QrCode className="w-5 h-5 text-white" />
                    <h2 className="text-lg font-bold text-white">QRコード決済</h2>
                  </div>
                  <div className="bg-white p-6 rounded-lg flex flex-col items-center">
                    <div className="w-48 h-48 bg-gray-200 flex items-center justify-center mb-4">
                      <QrCode className="w-24 h-24 text-gray-500" />
                    </div>
                    <p className="text-center text-gray-700">
                      このQRコードをスキャンして決済を完了してください
                    </p>
                  </div>
                </div>
              )}
              
              {/* エラーメッセージ表示 */}
              {error && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-md">
                  <p className="text-white">{error}</p>
                </div>
              )}
              
              {/* テスト用フォーム（開発環境のみ表示） */}
              {showTestForm && (
                <div className="mt-6 p-4 border border-yellow-500 bg-yellow-500/10 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <h3 className="font-bold text-yellow-400">開発環境用テストフォーム</h3>
                  </div>
                  <p className="text-sm text-yellow-300 mb-4">
                    このフォームは開発環境でのみ表示されます。テスト用のカード情報を入力して決済をテストできます。
                  </p>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="testCardNumber" className="text-yellow-300">テスト用カード番号</Label>
                      <Input
                        id="testCardNumber"
                        value={testCardNumber}
                        onChange={(e) => setTestCardNumber(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        className="bg-[#5C4D3C]/50 border-[#C0A172] text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="testExpiry" className="text-yellow-300">有効期限</Label>
                        <Input
                          id="testExpiry"
                          value={testExpiry}
                          onChange={(e) => setTestExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="bg-[#5C4D3C]/50 border-[#C0A172] text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="testCvc" className="text-yellow-300">CVC</Label>
                        <Input
                          id="testCvc"
                          value={testCvc}
                          onChange={(e) => setTestCvc(e.target.value)}
                          placeholder="123"
                          className="bg-[#5C4D3C]/50 border-[#C0A172] text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="testName" className="text-yellow-300">カード名義人</Label>
                      <Input
                        id="testName"
                        value={testName}
                        onChange={(e) => setTestName(e.target.value)}
                        placeholder="TEST USER"
                        className="bg-[#5C4D3C]/50 border-[#C0A172] text-white"
                      />
                    </div>
                    <button
                      onClick={handleTestPayment}
                      disabled={processing}
                      className="w-full py-3 text-white font-medium rounded-lg bg-yellow-600 hover:bg-yellow-700 transition-colors"
                    >
                      {processing ? "処理中..." : "テスト決済を実行"}
                    </button>
                    <p className="text-xs text-yellow-300 text-center">
                      ※ テスト用カード番号: 4242 4242 4242 4242（成功）、4000 0000 0000 9995（残高不足）
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
                  onClick={handleSubmit}
                  disabled={!stripe || processing || succeeded}
                  className={`flex-1 py-3 text-white font-medium rounded-lg transition-all duration-300
                    ${(!stripe || processing || succeeded)
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 transform hover:scale-[1.02]'
                    }`}
                >
                  {processing ? "処理中..." : "支払い完了"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}