'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PageHeader } from '@/app/admin/components/page-header';
import DashboardContent from '@/app/admin/dashboard/components/DachboardContent';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useDashboardData } from '@/app/admin/dashboard/hooks/useDashboardData';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { recentQuests, isLoading, fetchDashboardData } = useDashboardData();

  // 認証状態をチェック
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/');
    } else if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchDashboardData();
    }
  }, [status, session, router, fetchDashboardData]);

  // ローディング中
  if (status === 'loading' || isLoading) {
    return <LoadingSpinner message="読み込み中..." />;
  }

  return (
    <div>
      <PageHeader title="ダッシュボード画面" />
      <div className="container mx-auto px-4 py-8">
        <DashboardContent recentQuests={recentQuests} isLoading={isLoading} />
      </div>
    </div>
  );
}
