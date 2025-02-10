"use client";

import React from "react";

export function QuestList({ quests }: { quests: { id: string; title: string }[] }) {
  return (
    <div>
      {quests.map((quest) => (
        <div key={quest.id}>{quest.title}</div>
      ))}
    </div>
  );
} 