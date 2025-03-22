"use client";

import { useState, useEffect, Suspense } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaGoogle, FaEnvelope, FaLock, FaUserPlus, FaSpinner, FaUserShield, FaUser } from 'react-icons/fa';

// SearchParamsを使用するコンポーネント
function LoginForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [isAdminLogin, setIsAdminLogin] = useState<boolean>(false);
  
  // useSearchParamsを使用
  const searchParams = useSearchParams();
  const errorFromUrl = searchParams.get('error');
  
  // 既にログインしている場合はリダイレクト
  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user?.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/quests');
      }
    }
  }, [status, session, router]);

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
      // 管理者ログインの場合は、管理者メールアドレスをヒントとして表示
      if (isAdminLogin) {
        await signIn('google', { 
          callbackUrl: '/admin/dashboard',
        });
      } else {
        await signIn('google', { 
          callbackUrl: '/quests',
        });
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

  const toggleAdminLogin = () => {
    setIsAdminLogin(!isAdminLogin);
    if (!isAdminLogin) {
      // 管理者ログインモードに切り替えたら、管理者メールアドレスを自動入力
      setEmail('quest202412@gmail.com');
    } else {
      setEmail('');
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 ">
      <div className="absolute inset-0 bg-[url('/patterns/noise.png')] opacity-5" />
      
      <div className="w-full max-w-md space-y-8 bg-[#463C2D]/90 backdrop-blur rounded-lg p-6 shadow-xl border border-[#C0A172]">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-purple-400">QUEST LAND</h2>
          <p className="mt-2 text-[#E8D4B9]/80">
            {isAdminLogin ? '管理者アカウントでログイン' : 'アカウントにログインしてください'}
          </p>
        </div>
        
        {(error || errorFromUrl) && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded text-sm">
            {error || (errorFromUrl === 'Callback' ? 'ログイン処理中にエラーが発生しました' : errorFromUrl)}
          </div>
        )}

        {isAdminLogin ? (
          // 管理者ログイン画面 - 3つのボタンのみ表示
          <div className="space-y-4 pt-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md transition-colors"
            >
              <FaGoogle />
              管理者ログイン
            </button>
            
            <button
              type="button"
              onClick={toggleAdminLogin}
              className="w-full flex items-center justify-center gap-3 bg-gray-400 hover:bg-gray-600 text-black py-3 rounded-md transition-colors"
            >
              <FaUser />
              通常ログインに戻る
            </button>
            
          </div>
        ) : (
          // 一般ユーザーログイン画面 - 既存のフォームとボタン
          <>
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
                className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-md font-medium transition disabled:opacity-70 disabled:cursor-not-allowed ${
                  isAdminLogin 
                    ? 'bg-purple-700 hover:bg-purple-800 text-white' 
                    : 'bg-white hover:bg-gray-100 text-gray-800'
                }`}
              >
                {isGoogleLoading ? (
                  <FaSpinner className={isAdminLogin ? "text-white animate-spin" : "text-purple-500 animate-spin"} />
                ) : (
                  <>
                    {isAdminLogin ? (
                      <FaUserShield className="text-white" />
                    ) : (
                      <FaGoogle className="text-purple-500" />
                    )}
                    {isAdminLogin ? '管理者としてログイン' : 'Googleでログイン'}
                  </>
                )}
              </button>
            </div>
            
            <div className="pt-2 border-t border-[#C0A172]/20 flex flex-col sm:flex-row justify-between gap-2">
              <button
                onClick={handleRegister}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-[#2A241B]/60 hover:bg-[#2A241B] text-[#E8D4B9] rounded-md transition"
              >
                <FaUserPlus className="text-[#C0A172]" />
                アカウントを新規作成
              </button>
              
              <button
                onClick={toggleAdminLogin}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition ${
                  isAdminLogin 
                    ? 'bg-purple-900/60 hover:bg-purple-900 text-white' 
                    : 'bg-[#2A241B]/60 hover:bg-[#2A241B] text-[#E8D4B9]'
                }`}
              >
                <FaUserShield className={isAdminLogin ? "text-white" : "text-[#C0A172]"} />
                {isAdminLogin ? '一般ユーザーログインに戻る' : '管理者ログイン'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}