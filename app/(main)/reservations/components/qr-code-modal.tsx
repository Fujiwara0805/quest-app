"use client";

import { X, QrCode } from 'lucide-react';
import { Reservation } from '../hooks/useReservations';

interface QRCodeModalProps {
  quest: Reservation | undefined;
  onClose: () => void;
}

export function QRCodeModal({ quest, onClose }: QRCodeModalProps) {
  if (!quest) return null;
  
  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(42, 36, 27, 0.95)' }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[url('/patterns/noise.png')] opacity-5" />
      
      <div 
        className="relative w-full max-w-lg mx-auto bg-[#463C2D] rounded-xl border-2 border-[#C0A172] shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#5C4D3C] text-[#E8D4B9]/60 hover:text-[#E8D4B9] transition-colors border border-[#C0A172]/50 hover:border-[#C0A172]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* タイトル */}
          <h3 className="text-xl sm:text-2xl font-bold text-center text-purple-400 px-8">
            {quest.title}
          </h3>
          
          {/* QRコード */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-inner mx-auto max-w-[250px] sm:max-w-[300px]">
            <img 
              src={quest.qrCode} 
              alt="QR Code" 
              className="w-full h-auto aspect-square"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          
          {/* 説明テキスト */}
          <p className="text-center text-[#E8D4B9] font-medium text-lg">
            QRコードを提示してください
          </p>
        </div>
      </div>
    </div>
  );
}