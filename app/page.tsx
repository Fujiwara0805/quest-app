import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// クライアントコンポーネントを動的インポート
const SplashScreen = dynamic(() => import('@/components/quests/SplashScreen'), {
  ssr: false // クライアントサイドでのみレンダリング
});

export const metadata: Metadata = {
  title: 'QUEST LAND | スプラッシュ',
  description: 'あなたの冒険が地域を変える',
};

export default function Home() {
  return <SplashScreen />;
}
