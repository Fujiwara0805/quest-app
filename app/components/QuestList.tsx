"use client";

import { QuestCard } from './QuestCard';
import { Quest } from '@/types/quest';

interface QuestListProps {
  quests: Quest[];
}

export function QuestList({ quests }: QuestListProps) {
  return (
    <div className="container mx-auto px-4 py-4 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {quests.map((quest) => (
          <QuestCard 
            key={quest.id} 
            quest={quest}
          />
        ))}
      </div>
    </div>
  );
}