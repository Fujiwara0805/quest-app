"use client";

import { useSearchParams } from "next/navigation";

export default function HomeContent() {
  const searchParams = useSearchParams();
  // searchParams を利用した処理を記述
  return <div>Home Content</div>;
} 