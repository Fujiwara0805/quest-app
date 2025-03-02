"use client";

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/app/(main)/components/page-header';
import { Card, CardContent } from '@/components/ui/card';

export default function CreateCompleatePage() {
  const router = useRouter();

  return (
    <>
      <PageHeader title="クエスト作成完了" />
      <div className="max-w-3xl mx-auto p-4">
        <Card className="bg-[#463C2D]/80 backdrop-blur rounded-lg p-6 space-y-6 shadow-xl border border-[#C0A172]">
          <CardContent className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">クエストの作成が完了しました</h2>
            <p className="mb-8">クエストの作成が正常に完了しました。</p>
            <div className="space-y-4">
              <button
                onClick={() => router.push('/admin/create')}
                className="bg-purple-600 text-white px-4 py-2 rounded-md w-full mb-2"
              >
                続けて作成する
              </button>
              <button
                onClick={() => router.push('/')}
                className="bg-gray-600 text-white px-4 py-2 rounded-md w-full"
              >
                トップページへ戻る
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
} 