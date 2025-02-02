"use client";

import { Clock, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// ソートオプションを直接定義
export const SORT_OPTIONS = {
  deadline: '締切時刻が近い順',
  reward: '報酬が高い順',
  startTime: '開始時刻が早い順'
} as const;

export type SortType = keyof typeof SORT_OPTIONS;

interface SortHeaderProps {
  onSortChange: (sortType: SortType) => void;
  currentSort: SortType;
}

export function SortHeader({ onSortChange, currentSort }: SortHeaderProps) {
  return (
    <div className="bg-white/95 backdrop-blur border-b sticky top-[108px] z-40">
      <div className="container mx-auto py-2 px-4 flex justify-between items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>{SORT_OPTIONS[currentSort]}</span>
              <ChevronDown className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {Object.entries(SORT_OPTIONS).map(([key, label]) => (
              <DropdownMenuItem
                key={key}
                onClick={() => onSortChange(key as SortType)}
              >
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">この日の新しい募集を通知</span>
          <Button variant="outline" size="sm">OFF</Button>
        </div>
      </div>
    </div>
  );
}