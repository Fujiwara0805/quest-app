"use client";

import { useState } from 'react';

interface LoginFormProps {
  onLogin: (userType: 'user' | 'master') => void;
  error: string;
}

export function LoginForm({ onLogin, error }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent, userType: 'user' | 'master') => {
    e.preventDefault();
    setLoading(true);
    try {
      await onLogin(userType);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-[#463C2D]/80 backdrop-blur rounded-lg p-6 shadow-xl border border-[#C0A172]">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">ログイン</h2>
          <p className="mt-2 text-sm text-gray-300">アカウントタイプを選択してください</p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <button
            onClick={() => onLogin('user')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md transition"
          >
            一般ユーザーとしてログイン
          </button>
          
          <button
            onClick={() => onLogin('master')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-md transition"
          >
            クエストマスターとしてログイン
          </button>
        </div>
      </div>
    </div>
  );
}