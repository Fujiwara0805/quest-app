"use client";

import { useState } from 'react';

export function useLocation(initialPrefecture: string) {
  const [selectedPrefecture, setSelectedPrefecture] = useState(initialPrefecture);

  return {
    selectedPrefecture,
    setSelectedPrefecture
  };
}