"use client";

import { useState } from 'react';
import { QrCode, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { PageHeader } from '../components/page-header';
import { CardModal } from './components/card-modal';
import { useCards } from './hooks/use-cards';

export default function CardsPage() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const { cards } = useCards();

  return (
    <>
      <PageHeader title="カードコレクション" />

      <main className="container mx-auto px-4 py-6 pb-24">
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {cards.map((card) => (
            <Card 
              key={card.number}
              onClick={() => setSelectedCard(card.number)}
              className={`
                backdrop-blur overflow-hidden transition-transform duration-300 cursor-pointer
                ${card.isAcquired 
                  ? 'bg-[#463C2D]/90 border-[#C0A172] ring-2 ring-purple-500/50 hover:scale-105' 
                  : 'bg-gray-600/80 border-gray-500/50 hover:bg-gray-600/90 hover:scale-105'
                }
              `}
            >
              <div className="aspect-[3/4] relative">
                <img 
                  src={card.image}
                  alt={card.name}
                  className={`absolute inset-0 w-full h-full object-cover ${!card.isAcquired && 'opacity-50 grayscale'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-center space-y-1">
                  <p className={`font-bold text-sm sm:text-base ${card.isAcquired ? 'text-purple-400' : 'text-gray-400'}`}>
                    {card.number}
                  </p>
                  <p className="text-white font-medium text-sm truncate">
                    {card.name}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      {selectedCard && (
        <CardModal
          card={cards.find(c => c.number === selectedCard)!}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </>
  );
}