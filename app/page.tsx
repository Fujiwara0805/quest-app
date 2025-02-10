"use client";

export const dynamic = "force-dynamic";

import React, { Suspense } from "react";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DateSelector } from './components/DateSelector';
import { LocationSelector } from './components/LocationSelector';
import { QuestList } from './components/QuestList';
import { BottomNavigation } from './components/BottomNavigation';
import { useQuests } from './lib/hooks/useQuests';
import { useLocation } from './lib/hooks/useLocation';
import { useFavorites } from './lib/hooks/useFavorites';
import HomeContent from "./HomeContent";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}