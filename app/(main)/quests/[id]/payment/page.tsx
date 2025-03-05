import React, { Suspense } from 'react';
import { getQuests } from "@/app/data/quests";
import { PaymentForm } from "./components/PaymentForm";

// 静的パスを生成する関数
export async function generateStaticParams() {
  try {
    const quests = await getQuests();
    return quests.map(quest => ({
      id: quest.id
    }));
  } catch (error) {
    console.error('静的パス生成エラー:', error);
    return [];
  }
}

export default function PaymentPage({ params }: { params: { id: string } }) {
  console.log('Payment Page Params:', params);
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentForm questId={params.id} />
    </Suspense>
  );
}