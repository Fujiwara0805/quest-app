import Link from 'next/link';
import { FaPlus, FaList } from 'react-icons/fa';

export default function QuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Link href="/admin/quests/create" className="block">
        <div className="bg-[#4F4335]/50 hover:bg-[#5A4E40]/50 transition-colors rounded-lg p-4 flex items-center space-x-4 h-full">
          <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center flex-shrink-0">
            <FaPlus className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-medium">クエスト作成</h3>
            <p className="text-gray-400 text-sm">新しいクエストを作成</p>
          </div>
        </div>
      </Link>
      
      <Link href="/admin/quests" className="block">
        <div className="bg-[#4F4335]/50 hover:bg-[#5A4E40]/50 transition-colors rounded-lg p-4 flex items-center space-x-4 h-full">
          <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center flex-shrink-0">
            <FaList className="text-green-400" />
          </div>
          <div>
            <h3 className="text-white font-medium">クエスト一覧</h3>
            <p className="text-gray-400 text-sm">クエストを管理</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
