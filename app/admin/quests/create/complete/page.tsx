"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/app/(main)/components/page-header';
import { FaCheckCircle, FaPlus, FaList } from 'react-icons/fa';

export default function CreateQuestCompletePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // 認証状態をチェック
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/");
    }
  }, [status, session, router]);

  // ローディング中
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <p className="ml-3 text-white">読み込み中...</p>
      </div>
    );
  }

  // 管理者でない場合は何も表示しない（useEffectでリダイレクト）
  if (status === "authenticated" && session?.user?.role !== "admin") {
    return null;
  }

  return (
    <>
      <PageHeader title="クエスト作成完了" />
      <div className="max-w-3xl mx-auto p-4">
        <Card className="bg-[#463C2D]/80 backdrop-blur rounded-lg p-6 space-y-6 shadow-xl border border-[#C0A172]">
          <CardContent className="flex flex-col items-center text-center">
            <FaCheckCircle className="text-green-500 text-6xl mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">クエストが正常に作成されました</h2>
            <p className="text-gray-300 mb-6">クエストが正常に作成され、ユーザーが参加できるようになりました。</p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <Link
                href="/admin/quests/create"
                className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-md transition"
              >
                <FaPlus />
                新しいクエストを作成
              </Link>
              
              <Link
                href="/admin/quests"
                className="flex-1 flex items-center justify-center gap-2 bg-[#3a2820] hover:bg-[#2a1a12] text-white py-3 px-4 rounded-md transition border border-[#C0A172]"
              >
                <FaList />
                クエスト一覧を見る
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="h-8"></div>
    </>
  );
} 