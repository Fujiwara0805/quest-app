// "use client"; を削除：このページはサーバーコンポーネントとして扱います。

import React, { Suspense } from "react";
import QuestListContainer from "../components/QuestListContainer";

export default function MainPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuestListContainer />
    </Suspense>
  );
}