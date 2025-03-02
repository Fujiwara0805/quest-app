"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '../../../../components/ui/card';
import { PageHeader } from '@/app/(main)/components/page-header';
import { createClient } from '@/utils/supabase/client';

// クエスト作成画面
export default function CreateQuestPage() {
  const router = useRouter();
  const supabase = createClient();

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
        // 現在のセッションを取得
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("セッション取得エラー:", sessionError);
          throw sessionError;
        }
        
        if (!session) {
          console.log("セッションがありません");
          alert('ログインが必要です');
          router.push('/login?returnTo=/admin/quests/create');
          return;
        }
        
        // ユーザーIDを保存
        setUserId(session.user.id);
        
        // 認証状態をログ出力（デバッグ用）
        console.log("認証済みユーザー:", session.user);
        console.log("ユーザーロール:", session.user.user_metadata?.role);
        
        // 認証トークンを確認（デバッグ用）
        const { data: { user } } = await supabase.auth.getUser();
        console.log("現在のユーザー:", user);
        
        // RLSテスト - 読み取り権限の確認
        const { data: testData, error: testError } = await supabase
          .from('quests')
          .select('id')
          .limit(1);
          
        if (testError) {
          console.error("読み取りテストエラー:", testError);
        } else {
          console.log("読み取りテスト成功:", testData);
        }
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error("認証確認エラー:", error);
        alert('認証エラーが発生しました');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router, supabase]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 認証状態を再確認
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert('セッションが切れました。再度ログインしてください。');
      router.push('/login?returnTo=/admin/quests/create');
      return;
    }
    
    // デバッグ情報を出力
    console.log("認証ユーザー情報:", session.user);
    console.log("ユーザーID:", session.user.id);
    console.log("ユーザーロール:", session.user.user_metadata?.role);

    try {
      // 接続確認
      const { data: connectionTest, error: connectionError } = await supabase
        .from('quests')
        .select('id')
        .limit(1);

      if (connectionError) {
        console.error("接続エラー詳細:", connectionError);
        throw new Error(`データベース接続エラー: ${connectionError.message}`);
      }

      console.log('データベース接続成功:', connectionTest);
      
      let image_url = "";
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('quests-media')
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        // ファイル名のみを保存する（URLではなく）
        image_url = fileName;
      }
      
      // データ挿入部分の修正 - created_byフィールドを追加
      const { data: insertData, error: insertError } = await supabase
        .from('quests')
        .insert([
          {
            title,
            description,
            date,
            start_time: startTime,
            difficulty,
            address,
            access,
            tickets_available: parseInt(ticketsAvailable, 10),
            ticket_price: parseFloat(ticketPrice),
            image_url,
            reward_card_number: rewardCardNumber,
            reward_card_name: rewardCardName,
            created_by: session.user.id  // ユーザーIDを追加
          }
        ])
        .select(); // 挿入後のデータを返す
        
      if (insertError) {
        console.error("挿入エラー詳細:", insertError);
        throw new Error(`データ挿入エラー: ${insertError.message}, コード: ${insertError.code}`);
      }
      
      console.log('クエスト作成成功:', insertData);
      router.push("/admin/quests/create/complete");
      
    } catch (error: any) {
      console.error("クエスト作成エラー:", error);
      if (error.message) {
        console.error("エラーメッセージ:", error.message);
      }
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
          <p>認証済みユーザーID: {userId}</p>
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
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-md w-full"
              >
                クエストを作成
              </button>
            </form>
          </CardContent>
        </Card>
        <div className="mb-8"></div>
      </div>
    </>
  );
}