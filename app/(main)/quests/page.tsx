
import React, { Suspense } from 'react';
import QuestListContainer from '@/components/quests/QuestListContainer';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuestListContainer />
    </Suspense>
  );
}