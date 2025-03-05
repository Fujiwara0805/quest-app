"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '../../../../components/ui/card';
import { PageHeader } from '@/app/(main)/components/page-header';

// クエスト作成画面
export default function CreateQuestPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [difficulty, setDifficulty] = useState("★");
  const [address, setAddress] = useState("");
  const [access, setAccess] = useState("");
  const [ticketsAvailable, setTicketsAvailable] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [rewardCardNumber, setRewardCardNumber] = useState("");
  const [rewardCardName, setRewardCardName] = useState("");

  // 認証状態を管理するステート
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // コンポーネントマウント時に認証状態を確認
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 一時的な認証チェック（NextAuthに置き換える前の実装）
        // 開発中は常に認証済みとする
        setIsAuthenticated(true);
        setUserId("temp-user-id");
        setIsLoading(false);
        
        console.log("認証済みユーザー: 開発用テストユーザー");
      } catch (error) {
        console.error("認証確認エラー:", error);
        alert('認証エラーが発生しました');
        router.push('/login');
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 認証状態を再確認（一時的な実装）
    if (!isAuthenticated) {
      alert('セッションが切れました。再度ログインしてください。');
      router.push('/login?returnTo=/admin/quests/create');
      return;
    }
    
    try {
      // 一時的な実装（実際のAPIエンドポイントが実装されるまで）
      console.log("クエスト作成データ:", {
        title,
        description,
        date,
        startTime,
        difficulty,
        address,
        access,
        ticketsAvailable: parseInt(ticketsAvailable, 10),
        ticketPrice: parseFloat(ticketPrice),
        rewardCardNumber,
        rewardCardName,
        userId
      });
      
      // 成功したと仮定
      alert('クエストが作成されました（開発モード）');
      router.push("/admin/quests/create/complete");
      
    } catch (error: any) {
      console.error("クエスト作成エラー:", error);
      alert(`エラーが発生しました: ${error.message || 'Unknown error'}`);
    }
  };

  // ローディング中の表示
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <p className="ml-3 text-white">認証を確認中...</p>
      </div>
    );
  }

  // 未認証の場合は何も表示しない（useEffectでリダイレクト）
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <PageHeader title="クエスト作成画面" />
      <div className="max-w-3xl mx-auto p-4">
        {/* 認証情報の表示（デバッグ用） */}
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p>認証済みユーザーID: {userId} (開発モード)</p>
        </div>
        
        <Card className="bg-[#463C2D]/80 backdrop-blur rounded-lg p-6 space-y-6 shadow-xl border border-[#C0A172]">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-1 font-medium text-white">タイトル</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="クエストのタイトルを入力"
                  className="w-full bg-[#3a2820] border border-[#C0A172] p-2 rounded-md text-white placeholder:text-gray-400"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-white">説明</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="クエストの詳細を記入"
                  className="w-full bg-[#3a2820] border border-[#C0A172] p-2 rounded-md text-white placeholder:text-gray-400 min-h-[100px]"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium text-white">日付</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#3a2820] border border-[#C0A172] p-2 rounded-md text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-white">開始時刻</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-[#3a2820] border border-[#C0A172] p-2 rounded-md text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1 font-medium text-white">難易度</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-[#3a2820] border border-[#C0A172] p-2 rounded-md text-white"
                  required
                >
                  <option value="★">★</option>
                  <option value="★★">★★</option>
                  <option value="★★★">★★★</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium text-white">場所 (住所)</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="住所を入力"
                  className="w-full bg-[#3a2820] border border-[#C0A172] p-2 rounded-md text-white placeholder:text-gray-400"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-white">アクセス</label>
                <input
                  type="text"
                  value={access}
                  onChange={(e) => setAccess(e.target.value)}
                  placeholder="最寄り駅やアクセス方法"
                  className="w-full bg-[#3a2820] border border-[#C0A172] p-2 rounded-md text-white placeholder:text-gray-400"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium text-white">チケット残数</label>
                  <input
                    type="number"
                    value={ticketsAvailable}
                    onChange={(e) => setTicketsAvailable(e.target.value)}
                    placeholder="在庫数"
                    className="w-full bg-[#3a2820] border border-[#C0A172] p-2 rounded-md text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-white">チケット価格</label>
                  <input
                    type="number"
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(e.target.value)}
                    placeholder="価格"
                    className="w-full bg-[#3a2820] border border-[#C0A172] p-2 rounded-md text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1 font-medium text-white">画像アップロード</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImage(e.target.files[0]);
                    }
                  }}
                  className="w-full bg-[#3a2820] border border-[#C0A172] p-2 rounded-md text-white
                             file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
                             file:text-white file:bg-purple-600 file:hover:bg-purple-700"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium text-white">報酬カード番号</label>
                  <input
                    type="text"
                    value={rewardCardNumber}
                    onChange={(e) => setRewardCardNumber(e.target.value)}
                    placeholder="例: No.001"
                    className="w-full bg-[#3a2820] border border-[#C0A172] p-2 rounded-md text-white placeholder:text-gray-400"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-white">報酬カード名</label>
                  <input
                    type="text"
                    value={rewardCardName}
                    onChange={(e) => setRewardCardName(e.target.value)}
                    placeholder="カード名を入力"
                    className="w-full bg-[#3a2820] border border-[#C0A172] p-2 rounded-md text-white placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-md transition"
                >
                  クエストを作成
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}