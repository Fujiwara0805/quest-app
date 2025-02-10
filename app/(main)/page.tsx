// 以前は「use client」ディレクティブが記述されていたかもしれませんが、サーバーコンポーネントとして扱うために削除します。

import React, { Suspense } from "react";
import dynamic from "next/dynamic";

// クライアントコンポーネントを dynamic() 経由でインポートし、suspense オプションとともに
// ssr: false を指定して、サーバー側でのレンダリングを無効にします
const QuestListContainer = dynamic(() => import("../components/QuestListContainer"), {
  suspense: true,
  ssr: false,
});

export default function MainPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuestListContainer />
    </Suspense>
  );
}