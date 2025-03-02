"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from './components/login-form';
import { createClient } from '@/utils/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const supabase = createClient();

  const handleLogin = async (userType: 'user' | 'master') => {
    try {
      setError("");
      
      // マスターアカウントの認証情報（本番環境では環境変数などで管理すべき）
      const masterEmail = "master@example.com";
      const masterPassword = "masterpassword";
      
      // 一般ユーザーの認証情報（テスト用）
      const userEmail = "user@example.com";
      const userPassword = "userpassword";
      
      // ユーザータイプに応じた認証情報を選択
      const email = userType === 'master' ? masterEmail : userEmail;
      const password = userType === 'master' ? masterPassword : userPassword;
      
      // Supabaseで認証を行う
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // ユーザーのロールを設定（オプション）
      if (data.user) {
        // メタデータにロールを設定
        await supabase.auth.updateUser({
          data: { role: userType }
        });
        
        console.log(`${userType}としてログインしました`, data.user);
      }
      
      // ログイン後のリダイレクト
      router.push(userType === 'user' ? '/' : '/admin/quests/create');
      
    } catch (error: any) {
      console.error("ログインエラー:", error);
      setError(`ログインに失敗しました: ${error.message}`);
    }
  };

  return <LoginForm onLogin={handleLogin} error={error} />;
}