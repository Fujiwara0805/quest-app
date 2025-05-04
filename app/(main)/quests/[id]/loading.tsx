"use client";

// framer-motionをインポートする方法を変更
import { motion } from 'framer-motion';
import { BackgroundImage } from '@/components/ui/BackgroundImage';

export default function QuestDetailLoading() {
  return (
    <BackgroundImage>
      <div className="min-h-screen bg-gradient-to-b from-black/30 via-black/20 to-black/40 flex flex-col items-center justify-center">
        {/* 装飾的な要素 */}
        <div className="absolute inset-0 bg-[url('/patterns/noise.png')] opacity-5 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2a1810]/40 to-transparent pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="w-20 h-20 border-4 border-t-purple-600 border-purple-300/30 rounded-full"
          />
          
          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 text-white text-xl font-medium"
          >
            クエストを準備中...
          </motion.p>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "240px" }}
            transition={{ delay: 0.5, duration: 2, ease: "easeInOut", repeat: Infinity }}
            className="h-1 bg-purple-600 rounded-full mt-4 max-w-[240px]"
          />
        </motion.div>
      </div>
    </BackgroundImage>
  );
}
