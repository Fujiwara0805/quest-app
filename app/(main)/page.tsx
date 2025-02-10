// 以前は「use client」ディレクティブが記述されていたかもしれませんが、サーバーコンポーネントとして扱うために削除します。

import React, { Suspense } from "react";
import dynamic from "next/dynamic";

// クライアントコンポーネントを dynamic() 経由でインポートし、suspense オプションを有効にします
const QuestListContainer = dynamic(() => import("../components/QuestListContainer"), {
  suspense: true,
});

export default function MainPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuestListContainer />
    </Suspense>
  );
}