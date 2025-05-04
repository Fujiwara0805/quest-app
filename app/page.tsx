import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Image from 'next/image';


const ClientSplashScreen = dynamic(() => import('@/components/quests/SplashScreen'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-gradient-to-b from-[#2a1810] to-[#1a0f0a] flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-purple-600">QUEST</h1>
        <h1 className="text-5xl font-bold text-[#E8D4B9]">LAND</h1>
        <p className="mt-6 text-[#E8D4B9]/80 text-lg">あなたの冒険が地域を変える</p>
      </div>
    </div>
  )
});

export const metadata: Metadata = {
  title: 'QUEST LAND | スプラッシュ',
  description: 'あなたの冒険が地域を変える',
};

export default function Home() {
  return <ClientSplashScreen />;
}
