"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from './components/login-form';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLogin = async (userType: 'user' | 'master') => {
    try {
      setError("");
      router.push(userType === 'user' ? '/' : '/admin/create');
    } catch (error: any) {
      setError("ログインに失敗しました。");
    }
  };

  return <LoginForm onLogin={handleLogin} error={error} />;
}