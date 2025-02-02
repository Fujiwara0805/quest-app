"use client";

import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function ApplyCompletePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b')] bg-cover bg-center">
      <div className="min-h-screen bg-gradient-to-b from-black/30 via-black/20 to-black/40 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-[#3a2820]/80 backdrop-blur rounded-lg p-6 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">応募完了</h1>
              <p className="text-white/90">
                クエストへの応募が完了しました。<br />
                クエストマスターからの連絡をお待ちください。
              </p>
            </div>

            <button
              onClick={() => router.push('/')}
              className="w-full py-3 text-white font-medium rounded-lg
                border-2 border-purple-600 bg-transparent
                hover:bg-purple-600 transition-all duration-300"
            >
              クエスト一覧に戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}