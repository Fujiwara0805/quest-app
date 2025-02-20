"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LoginFormProps {
  onLogin: (userType: 'user' | 'master') => void;
  error?: string;
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
    <Card className="w-full max-w-md bg-white/95 backdrop-blur">
      <CardHeader className="space-y-1 flex flex-col items-center">
        <CardTitle className="text-2xl font-bold text-center">QUEST</CardTitle>
        <CardDescription className="text-center">
          あなたの冒険が地域を変える
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
            <form onSubmit={(e) => handleSubmit(e, 'user')} className="space-y-4">
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
                className="w-full bg-white text-purple-600 border-2 border-purple-600 font-medium hover:bg-purple-600 hover:text-white"
                type="submit" 
                disabled={loading}
              >
                {loading ? "ログイン中..." : "ログイン"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="master">
            <form onSubmit={(e) => handleSubmit(e, 'master')} className="space-y-4">
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
                className="w-full bg-white text-purple-600 border-2 border-purple-600 font-medium hover:bg-purple-600 hover:text-white"
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
          className="w-full bg-white text-purple-600 border-2 border-purple-600 font-medium hover:bg-purple-600 hover:text-white"
          onClick={() => window.location.href = '/signup'}
        >
          新規登録はこちら
        </Button>
      </CardFooter>
    </Card>
  );
}