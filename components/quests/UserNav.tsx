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
            <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
            <AvatarFallback className="bg-[#5C4D3C] text-[#E8D4B9]">
              {session?.user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-[#463C2D] border border-[#C0A172] text-[#E8D4B9]" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{session?.user?.name}</p>
            <p className="text-xs text-[#E8D4B9]/70 truncate">{session?.user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#C0A172]/20" />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer hover:bg-[#5C4D3C]">
            プロフィール
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/reservations" className="cursor-pointer hover:bg-[#5C4D3C]">
            予約管理
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[#C0A172]/20" />
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-[#5C4D3C]"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          ログアウト
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
