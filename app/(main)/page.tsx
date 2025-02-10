// 以前は「use client」ディレクティブが記述されていたかもしれませんが、サーバーコンポーネントとして扱うために削除します。

import React, { Suspense } from "react";
import QuestListContainer from "../components/QuestListContainer";

export default function MainPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuestListContainer />
    </Suspense>
  );
}