"use client";

import { useRouter } from 'next/navigation';
import { 
  User, Settings, Bell, HelpCircle, 
  FileText, Lock, LogOut, ChevronRight, 
  Swords, Trophy, Star
} from 'lucide-react';
import { PageHeader } from '../components/page-header';

export default function ProfilePage() {
  const router = useRouter();

  // レベルと経験値のデモデータ
  const userLevel = {
    current: 24,
    exp: 2400,
    nextLevel: 3000,
    title: "冒険者見習い",
    completedQuests: 48,
    totalRewards: 12
  };

  const menuItems = [
    {
      icon: Settings,
      label: '設定',
      onClick: () => router.push('/profile/settings')
    },
    {
      icon: Bell,
      label: '通知設定',
      onClick: () => router.push('/profile/notifications')
    },
    {
      icon: HelpCircle,
      label: 'よくある質問',
      onClick: () => router.push('/profile/faq')
    },
    {
      icon: FileText,
      label: 'お問い合わせ',
      onClick: () => router.push('/profile/contact')
    },
    {
      icon: Lock,
      label: 'プライバシーポリシー',
      onClick: () => router.push('/profile/privacy')
    },
    {
      icon: FileText,
      label: '利用規約',
      onClick: () => router.push('/profile/terms')
    },
    {
      icon: LogOut,
      label: '退会手続き',
      onClick: () => router.push('/profile/delete-account'),
      danger: true
    }
  ];

  // 経験値バーの進捗率を計算
  const expProgress = (userLevel.exp / userLevel.nextLevel) * 100;

  return (
    <>
      <PageHeader title="マイページ" />

      <main className="container mx-auto px-4 py-6 pb-24">
        {/* プロフィールカード */}
        <div className="bg-[#463C2D]/80 backdrop-blur rounded-lg border border-[#C0A172] p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-[#5C4D3C] border-2 border-[#C0A172] flex items-center justify-center">
                <User className="w-10 h-10 text-[#E8D4B9]" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-purple-600 border-2 border-[#C0A172] flex items-center justify-center text-white font-bold text-sm">
                {userLevel.current}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#E8D4B9]">ユーザー名</h2>
              <p className="text-[#E8D4B9]/70">user@example.com</p>
            </div>
          </div>
        </div>

        {/* レベル情報 */}
        <div className="bg-[#463C2D]/80 backdrop-blur rounded-lg border border-[#C0A172] p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Swords className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-[#E8D4B9]">レベル情報</h3>
          </div>

          {/* レベルと称号 */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[#E8D4B9]/70 text-sm">現在のレベル</p>
              <p className="text-3xl font-bold text-purple-400">Lv.{userLevel.current}</p>
            </div>
            <div className="text-right">
              <p className="text-[#E8D4B9]/70 text-sm">称号</p>
              <p className="text-xl font-bold text-[#E8D4B9]">{userLevel.title}</p>
            </div>
          </div>

          {/* 経験値バー */}
          <div className="space-y-2">
            <div className="h-4 bg-[#5C4D3C] rounded-full overflow-hidden border border-[#C0A172]">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-500"
                style={{ width: `${expProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#E8D4B9]">EXP: {userLevel.exp}</span>
              <span className="text-[#E8D4B9]/70">Next: {userLevel.nextLevel}</span>
            </div>
          </div>

          {/* 実績サマリー */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-[#5C4D3C] rounded-lg p-4 border border-[#C0A172]">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <p className="text-sm text-[#E8D4B9]/70">クリア数</p>
              </div>
              <p className="text-2xl font-bold text-[#E8D4B9]">{userLevel.completedQuests}</p>
            </div>
            <div className="bg-[#5C4D3C] rounded-lg p-4 border border-[#C0A172]">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <p className="text-sm text-[#E8D4B9]/70">獲得報酬</p>
              </div>
              <p className="text-2xl font-bold text-[#E8D4B9]">{userLevel.totalRewards}</p>
            </div>
          </div>
        </div>

        {/* メニューリスト */}
        <div className="bg-[#463C2D]/80 backdrop-blur rounded-lg border border-[#C0A172] overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`
                w-full flex items-center justify-between p-4 text-[#E8D4B9] hover:bg-[#5C4D3C] transition-colors
                ${index !== menuItems.length - 1 ? 'border-b border-[#C0A172]/20' : ''}
                ${item.danger ? 'text-red-400 hover:text-red-300' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#E8D4B9]/50" />
            </button>
          ))}
        </div>
      </main>
    </>
  );
}