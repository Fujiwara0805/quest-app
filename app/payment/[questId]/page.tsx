// "use client"; // この行を削除して、サーバーコンポーネントとして扱います。

import React, { Suspense } from 'react';
import { getQuests } from "@/app/data/quests";
import { PaymentForm } from "./components/PaymentForm";

// 静的パスを生成する関数
export async function generateStaticParams() {
  try {
    const quests = await getQuests();
    return quests.map(quest => ({
      questId: quest.id
    }));
  } catch (error) {
    console.error('静的パス生成エラー:', error);
    return [];
  }
}

export default function PaymentPage({ params }: { params: { questId: string } }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentForm questId={params.questId} />
    </Suspense>
  );
}