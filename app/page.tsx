import { Metadata } from 'next';
import SplashScreen from '@/components/quests/SplashScreen';

export const metadata: Metadata = {
  title: 'QUEST LAND | スプラッシュ',
  description: 'あなたの冒険が地域を変える',
};

export default function Home() {
  return <SplashScreen />;
}
