import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaPlus, FaList } from 'react-icons/fa';
import { Quest } from '@/app/admin/dashboard/hooks/useDashboardData';
import QuickActions from '@/app/admin/dashboard/components/QuickActions';
import RecentQuestsList from '@/app/admin/dashboard/components/RecentQuestList';

interface DashboardContentProps {
  recentQuests: Quest[];
  isLoading: boolean;
}

export default function DashboardContent({ recentQuests, isLoading }: DashboardContentProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* クイックアクション */}
      <Card className="bg-[#463C2D]/80 backdrop-blur rounded-lg shadow-xl border border-[#C0A172]">
        <CardHeader className="border-b border-[#C0A172]/30 pb-3">
          <CardTitle className="text-xl font-bold text-white">クイックアクション</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <QuickActions />
        </CardContent>
      </Card>
      
      {/* 最近のクエスト */}
      <Card className="bg-[#463C2D]/80 backdrop-blur rounded-lg shadow-xl border border-[#C0A172]">
        <CardHeader className="border-b border-[#C0A172]/30 pb-3">
          <CardTitle className="text-xl font-bold text-white">最近のクエスト</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <RecentQuestsList quests={recentQuests} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
