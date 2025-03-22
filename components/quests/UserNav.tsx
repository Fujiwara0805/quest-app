"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function UserNav() {
  const { data: session, status } = useSession();
  
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };
  
  if (status === "loading") {
    return (
      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
        <div className="w-8 h-8 rounded-full bg-[#5C4D3C]"></div>
      </Button>
    );
  }
  
  if (status === "unauthenticated") {
    return (
      <Link href="/login">
        <Button variant="ghost" className="text-[#E8D4B9]/70 hover:text-[#E8D4B9] hover:bg-[#5C4D3C]">
          ログイン
        </Button>
      </Link>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative w-8 h-8 rounded-full">
          <Avatar className="w-8 h-8 border border-[#C0A172]/50">
            <AvatarImage 
              src={session?.user?.image || ""} 
              alt={session?.user?.name || "User"} 
              className="object-cover"
            />
            <AvatarFallback className="bg-[#5C4D3C] text-[#E8D4B9]">
              {session?.user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-[#2A241B] border border-[#C0A172]/30 text-[#E8D4B9]" align="end">
        <DropdownMenuLabel className="border-b border-[#C0A172]/20 pb-2">
          {session?.user?.name || "ユーザー"}
        </DropdownMenuLabel>
        <DropdownMenuItem className="py-2 hover:bg-[#463C2D] cursor-pointer">
          <Link href="/profile" className="w-full">プロフィール</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="py-2 hover:bg-[#463C2D] cursor-pointer">
          <Link href="/reservations" className="w-full">予約履歴</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[#C0A172]/20" />
        <DropdownMenuItem 
          className="py-2 text-red-400 hover:bg-[#463C2D] cursor-pointer" 
          onClick={handleLogout}
        >
          ログアウト
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
