"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaGoogle, FaEnvelope, FaLock, FaUserPlus, FaSpinner } from 'react-icons/fa';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  // エラーメッセージがURLに含まれている場合は表示
  const errorFromUrl = searchParams.get('error');
  
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      
      if (result?.error) {
        setError('メールアドレスまたはパスワードが正しくありません');
      } else if (result?.ok) {
        router.push('/quests');
      }
    } catch (err) {
      setError('ログイン中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await signIn('google', { 
        callbackUrl: '/quests',
        redirect: false  // リダイレクトを手動で処理するために false に変更
      });
      
      if (result?.error) {
        console.error('Googleログインエラー:', result.error);
        setError('Google認証中にエラーが発生しました');
        setIsGoogleLoading(false);
      } else {
        // 成功した場合は手動でリダイレクト
        router.push(result?.url || '/quests');
      }
    } catch (error) {
      console.error('Googleログイン中にエラーが発生しました', error);
      setError('認証処理中にエラーが発生しました');
      setIsGoogleLoading(false);
    }
  };

  const handleRegister = () => {
    router.push('/register');
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 ">
      <div className="absolute inset-0 bg-[url('/patterns/noise.png')] opacity-5" />
      
      <div className="w-full max-w-md space-y-8 bg-[#463C2D]/90 backdrop-blur rounded-lg p-6 shadow-xl border border-[#C0A172]">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-purple-400">Quest App</h2>
          <p className="mt-2 text-[#E8D4B9]/80">アカウントにログインしてください</p>
        </div>
        
        {(error || errorFromUrl) && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded text-sm">
            {error || (errorFromUrl === 'Callback' ? 'ログイン処理中にエラーが発生しました' : errorFromUrl)}
          </div>
        )}
        
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaEnvelope className="text-[#C0A172]" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="メールアドレス"
                required
                className="w-full pl-10 pr-3 py-2 bg-[#2A241B]/80 border border-[#C0A172]/50 focus:border-[#C0A172] rounded-md text-[#E8D4B9] placeholder-[#E8D4B9]/50 focus:outline-none focus:ring-1 focus:ring-[#C0A172]"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaLock className="text-[#C0A172]" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワード"
                required
                className="w-full pl-10 pr-3 py-2 bg-[#2A241B]/80 border border-[#C0A172]/50 focus:border-[#C0A172] rounded-md text-[#E8D4B9] placeholder-[#E8D4B9]/50 focus:outline-none focus:ring-1 focus:ring-[#C0A172]"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-md transition font-medium disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
        
        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#C0A172]/30 absolute w-full"></div>
          <div className="bg-[#463C2D] px-4 relative z-10 text-[#E8D4B9]/60 text-sm">または</div>
        </div>
        
        <div>
          <button
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-gray-100 rounded-md text-gray-800 font-medium transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGoogleLoading ? (
              <FaSpinner className="text-purple-500 animate-spin" />
            ) : (
              <>
                <FaGoogle className="text-purple-500" />
                Googleでログイン
              </>
            )}
          </button>
        </div>
        
        <div className="pt-2 border-t border-[#C0A172]/20">
          <button
            onClick={handleRegister}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-[#2A241B]/60 hover:bg-[#2A241B] text-[#E8D4B9] rounded-md transition mt-2"
          >
            <FaUserPlus className="text-[#C0A172]" />
            アカウントを新規作成
          </button>
        </div>
      </div>
    </div>
  );
}