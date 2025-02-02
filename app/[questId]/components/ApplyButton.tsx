"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ApplyButton() {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleApply = () => {
    // 応募完了画面へ遷移
    router.push('/apply/complete');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
      <div className="container mx-auto max-w-2xl">
        <button
          className={`w-full py-6 text-lg font-medium rounded-lg transition-all duration-300
            border-2 border-purple-600
            ${isHovered 
              ? 'bg-purple-600 text-white transform scale-[1.02]' 
              : 'bg-transparent text-purple-600 hover:bg-purple-600 hover:text-white'
            }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleApply}
        >
          このクエストに応募する
        </button>
      </div>
    </div>
  );
}