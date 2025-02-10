"use client";

import React, { Suspense } from 'react';
import { DUMMY_QUESTS } from "@/data/quests";
import { PaymentForm } from "./components/PaymentForm";

// 静的パスを生成する関数
export function generateStaticParams() {
  const questIds = Object.values(DUMMY_QUESTS)
    .flat()
    .map(quest => ({
      questId: quest.id
    }));
  
  return questIds;
}

export default function PaymentPage({ params }: { params: { questId: string } }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentForm questId={params.questId} />
    </Suspense>
  );
}