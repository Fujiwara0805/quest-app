"use client";

import { useEffect } from 'react';
import { Suspense } from 'react';
import { useLoading } from '@/lib/context/LoadingContext';
import QuestListContainer from '../../../components/quests/QuestListContainer';

export default function Page() {
  const { stopLoading } = useLoading();

  // コンポーネントマウント時にローディングを停止
  useEffect(() => {
    // ページが読み込まれたらローディングを停止
    const timer = setTimeout(() => {
      stopLoading();
    }, 300); // 遅延を追加してローディングアニメーションを見せる

    return () => clearTimeout(timer);
  }, [stopLoading]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuestListContainer />
    </Suspense>
  );
}