"use client";

import { useState } from 'react';

export function FavoriteButton() {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <button
      onClick={() => setIsFavorited(!isFavorited)}
      className={`p-2 rounded-full transition-all duration-200 ${
        isFavorited ? 'bg-red-500' : 'bg-black/60'
      } backdrop-blur-sm hover:scale-110`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={isFavorited ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-white"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
      </svg>
    </button>
  );
}