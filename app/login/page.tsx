"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (userType: 'user' | 'master') => {
    try {
      setLoading(true);
      setError("");
      
      if (!email || !password) {
        setError("メールアドレスとパスワードを入力してください。");
        return;
      }

      // ユーザー種別に応じて遷移先を変更
      if (userType === 'user') {
        router.push('/'); // クエスト一覧画面へ
      } else {
        router.push('/admin'); // クエストマスター用ダッシュボードへ
      }
    } catch (error: any) {
      setError("ログインに失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1502786129293-79981df4e689')] bg-cover bg-center">
      <div className="min-h-screen bg-black/40 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur">
          <CardHeader className="space-y-1 flex flex-col items-center">
            <CardTitle className="text-2xl font-bold text-center">QUEST</CardTitle>
            <CardDescription className="text-center">
              地域特化型人材マッチングプラットフォーム
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="user" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger 
                  value="user"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-md transition-all duration-200"
                >
                  ユーザー
                </TabsTrigger>
                <TabsTrigger 
                  value="master"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-md transition-all duration-200"
                >
                  クエストマスター
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="user">
                <form onSubmit={(e) => { e.preventDefault(); handleLogin('user'); }} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-email">メールアドレス</Label>
                    <Input
                      id="user-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-password">パスワード</Label>
                    <Input
                      id="user-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? "ログイン中..." : "ログイン"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="master">
                <form onSubmit={(e) => { e.preventDefault(); handleLogin('master'); }} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="master-email">メールアドレス</Label>
                    <Input
                      id="master-email"
                      type="email"
                      placeholder="company@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="master-password">パスワード</Label>
                    <Input
                      id="master-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? "ログイン中..." : "ログイン"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 pb-6">
            <p className="text-sm text-center text-gray-600">
              アカウントをお持ちでない方は
            </p>
            <Button
              variant="outline"
              className="w-full border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-medium"
              onClick={() => router.push('/signup')}
            >
              新規登録はこちら
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}