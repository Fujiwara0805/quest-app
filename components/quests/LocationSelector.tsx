"use client";

import { MapPin, ChevronDown, LogOut, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { PREFECTURES } from '@/data/prefectures';
import { SORT_OPTIONS, SortType } from '@/lib/constants/sort-options';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

interface LocationSelectorProps {
  selectedPrefecture: string;
  onPrefectureSelect: (prefecture: string) => void;
  currentSort: SortType;
  onSortChange: (sortType: SortType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  dateSearchEnabled: boolean;
  onDateSearchToggle: (enabled: boolean) => void;
}

export function LocationSelector({
  selectedPrefecture,
  onPrefectureSelect,
  currentSort,
  onSortChange,
  searchQuery,
  onSearchChange,
  dateSearchEnabled,
  onDateSearchToggle
}: LocationSelectorProps) {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <div className="bg-[#463C2D]/95 backdrop-blur border-b border-[#C0A172] sticky top-0 z-50">
      <div className="container mx-auto px-2 py-2 space-y-2">
        {/* 上段: 都道府県選択、ソート、ログアウト */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex-1">
              <div className="flex items-center justify-between border border-[#C0A172] rounded-lg px-3 py-1.5 bg-[#5C4D3C]/50 backdrop-blur hover:bg-[#5C4D3C]/80 transition-colors w-full text-[#E8D4B9]">
                <div className="flex items-center flex-1">
                  <MapPin className="w-4 h-4 text-[#E8D4B9]" />
                  <span className="text-base px-1.5 truncate">{selectedPrefecture}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-[#E8D4B9]" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[calc(100vw-1rem)] sm:w-[400px] bg-[#5C4D3C] border-[#C0A172] text-[#E8D4B9]" align="start">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 p-2 max-h-[60vh] overflow-y-auto">
                {PREFECTURES.map((prefecture) => (
                  <DropdownMenuItem
                    key={prefecture}
                    onClick={() => onPrefectureSelect(prefecture)}
                    className={`cursor-pointer text-sm py-1.5 hover:bg-[#6E5D4A] ${
                      prefecture === selectedPrefecture ? 'bg-[#6E5D4A]' : ''
                    }`}
                  >
                    {prefecture}
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="min-w-[120px] sm:min-w-[160px]">
              <div className="flex items-center justify-between border border-[#C0A172] rounded-lg px-3 py-1.5 bg-[#5C4D3C]/50 backdrop-blur hover:bg-[#5C4D3C]/80 transition-colors text-[#E8D4B9]">
                <span className="truncate text-sm">{SORT_OPTIONS[currentSort]}</span>
                <ChevronDown className="w-4 h-4 text-[#E8D4B9] flex-shrink-0 ml-1.5" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[160px] bg-[#5C4D3C] border-[#C0A172] text-[#E8D4B9]">
              {Object.entries(SORT_OPTIONS).map(([key, label]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => onSortChange(key as SortType)}
                  className={`cursor-pointer text-sm py-1.5 hover:bg-[#6E5D4A] ${
                    key === currentSort ? 'bg-[#6E5D4A]' : ''
                  }`}
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center border border-[#C0A172] rounded-lg px-3 py-1.5 bg-[#5C4D3C]/50 backdrop-blur hover:bg-[#5C4D3C]/80 transition-colors text-[#E8D4B9]"
            aria-label="ログアウト"
          >
            <LogOut className="w-4 h-4 text-[#E8D4B9]" />
          </button>
        </div>

        {/* 下段: 検索バーと日付検索切り替え */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#E8D4B9]" />
            <Input
              type="text"
              placeholder="クエストを検索"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-[#5C4D3C]/50 hover:bg-[#5C4D3C]/80 transition-colors border-[#C0A172] text-[#E8D4B9] placeholder:text-[#E8D4B9]/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="date-search"
              checked={dateSearchEnabled}
              onCheckedChange={onDateSearchToggle}
              className="data-[state=checked]:bg-[#C0A172]"
            />
            <Label htmlFor="date-search" className="text-sm text-[#E8D4B9]">
              日付検索
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}