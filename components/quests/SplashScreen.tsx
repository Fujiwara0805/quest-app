"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

export default function SplashScreen() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [animationComplete, setAnimationComplete] = useState(false);
  // クライアントサイドでのレンダリングを安全に処理するための状態
  const [dimensions, setDimensions] = useState({ width: 500, height: 500 });
  const [isMounted, setIsMounted] = useState(false);

  // windowオブジェクトへのアクセスをクライアントサイドのみに限定
  useEffect(() => {
    setIsMounted(true);
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // アニメーション完了から少し待機した後にリダイレクト
  useEffect(() => {
    if (animationComplete && status !== 'loading') {
      const redirectTimer = setTimeout(() => {
        if (status === 'authenticated') {
          // ログイン済みの場合、ロールに応じてリダイレクト
          if (session?.user?.role === 'admin') {
            router.push('/admin/dashboard');
          } else {
            router.push('/quests');
          }
        } else if (status === 'unauthenticated') {
          // 未ログインの場合はログイン画面へ
          router.push('/login');
        }
      }, 500); // リダイレクト前の待機時間

      return () => clearTimeout(redirectTimer);
    }
  }, [status, session, router, animationComplete]);

  // アニメーション完了のタイミングを管理
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 2500); // アニメーション時間

    return () => clearTimeout(timer);
  }, []);

  // サーバーサイドレンダリング時またはマウント前はシンプルな表示を返す
  if (!isMounted) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-[#2a1810] to-[#1a0f0a] flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-purple-600">QUEST</h1>
          <h1 className="text-5xl font-bold text-[#E8D4B9]">LAND</h1>
          <p className="mt-6 text-[#E8D4B9]/80 text-lg">あなたの冒険が地域を変える</p>
        </div>
      </div>
    );
  }

  // ロゴ文字のアニメーション用の配列
  const logoWords = ["QUEST", "LAND"];

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#2a1810] to-[#1a0f0a] flex flex-col items-center justify-center overflow-hidden">
      {/* 背景のパターン */}
      <div className="absolute inset-0 bg-[url('/patterns/noise.png')] opacity-5" />
      
      {/* 流れ星のような装飾 - 安全なwindowサイズ使用 */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(dimensions.width < 768 ? 5 : 10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-purple-400"
            initial={{ 
              x: Math.random() * dimensions.width, 
              y: -10,
              opacity: 0 
            }}
            animate={{ 
              x: Math.random() * dimensions.width,
              y: dimensions.height + 10,
              opacity: [0, 1, 0],
            }}
            transition={{ 
              duration: Math.random() * 3 + 2, 
              delay: Math.random() * 2,
              repeat: Infinity,
              repeatDelay: Math.random() * 3
            }}
          />
        ))}
      </div>
      
      {/* メインのロゴアニメーション */}
      <div className="relative z-10 px-4 w-full max-w-md mx-auto text-center">
        <motion.div 
          className="flex flex-col items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* ロゴ文字 */}
          <div className="flex flex-col items-center">
            {logoWords.map((word, index) => (
              <div key={index} className="flex flex-wrap justify-center">
                {word.split('').map((char, charIndex) => (
                  <motion.span
                    key={charIndex}
                    className="text-4xl sm:text-5xl md:text-7xl font-bold"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ 
                      delay: 0.3 + (index * 0.1) + (charIndex * 0.05), 
                      duration: 0.5,
                      type: "spring",
                      stiffness: 100
                    }}
                    style={{ color: index === 0 ? '#9333ea' : '#E8D4B9' }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
            ))}
          </div>
          
          {/* サブタイトル */}
          <motion.p
            className="text-[#E8D4B9]/80 mt-4 sm:mt-6 text-base sm:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            あなたの冒険が地域を変える
          </motion.p>
        </motion.div>
        
        {/* ローディングインジケーター */}
        <motion.div
          className="mt-8 sm:mt-12 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <motion.div 
            className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-t-purple-600 border-purple-300/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          
          <motion.div
            className="mt-4 sm:mt-6 h-1 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: dimensions.width < 640 ? 200 : 240 }}
            transition={{ 
              delay: 1.8, 
              duration: 1.5, 
              ease: "easeInOut"
            }}
            onAnimationComplete={() => setAnimationComplete(true)}
          />
        </motion.div>
      </div>
    </div>
  );
}
