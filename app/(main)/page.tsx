// "use client"; // この行を削除して、サーバーコンポーネントとして扱う

import React from "react";
import HomeContent from "../HomeContent";  // app/HomeContent.tsx への相対パス

export default function MainPage() {
  return <HomeContent />;
}