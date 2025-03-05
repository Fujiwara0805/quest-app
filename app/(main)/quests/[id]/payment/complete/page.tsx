"use client";

import { useRouter } from 'next/navigation';
import { CheckCircle, Mail, User } from 'lucide-react';

export default function PaymentCompletePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b')] bg-cover bg-center">
      <div className="min-h-screen bg-gradient-to-b from-black/30 via-black/20 to-black/40 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-[#463C2D]/80 backdrop-blur rounded-lg p-6 text-center space-y-6 border border-[#C0A172]">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-white">購入完了</h1>
              <div className="space-y-6 text-white/90">
                <p>
                  クエストの予約が完了しました。<br />
                  ご購入ありがとうございます。
                </p>

                <div className="bg-[#5C4D3C]/50 rounded-lg p-4 space-y-4 text-left">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <p>
                      購入完了通知を登録されたメールアドレスに送信しました。
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <p>
                      購入したチケットは予約管理ページからご確認いただけます。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => router.push('/')}
                className="flex-1 py-3 text-white font-medium rounded-lg
                  border-2 border-[#C0A172] bg-transparent
                  hover:bg-[#5C4D3C] transition-colors"
              >
                クエスト一覧へ
              </button>
              <button
                onClick={() => router.push(`/quests`)}
                className="flex-1 py-3 text-white font-medium rounded-lg
                  bg-purple-600 hover:bg-purple-700
                  transition-colors"
              >
                予約管理ページへ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}