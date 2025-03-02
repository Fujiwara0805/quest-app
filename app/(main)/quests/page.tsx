
import React, { Suspense } from 'react';
import QuestListContainer from '../../components/QuestListContainer';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuestListContainer />
    </Suspense>
  );
}