// "use client"; // クライアントロジックは専用のコンポーネントに移動したので削除

import React, { Suspense } from 'react';
import QuestListContainer from './components/QuestListContainer';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuestListContainer />
    </Suspense>
  );
}