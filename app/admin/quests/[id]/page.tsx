'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { FaSave, FaArrowLeft, FaTrash, FaImage } from 'react-icons/fa';

export default function QuestEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [quest, setQuest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // フォームの状態
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [difficulty, setDifficulty] = useState('★');
  const [address, setAddress] = useState('');
  const [access, setAccess] = useState('');
  const [ticketsAvailable, setTicketsAvailable] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [rewardCardNumber, setRewardCardNumber] = useState('');
  const [rewardCardName, setRewardCardName] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 認証状態をチェック
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/');
    } else if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchQuest();
    }
  }, [status, session, router, params.id]);

  // クエスト情報を取得
  const fetchQuest = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/quests/${params.id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'クエストの取得に失敗しました');
      }
      
      const data = await response.json();
      setQuest(data.quest);
      
      // フォームの初期値を設定
      setTitle(data.quest.title || '');
      setDescription(data.quest.description || '');
      if (data.quest.questDate) {
        const date = new Date(data.quest.questDate);
        setDate(date.toISOString().split('T')[0]);
      }
      setStartTime(data.quest.startTime || '');
      setDifficulty(data.quest.difficulty || '★');
      setAddress(data.quest.address || '');
      setAccess(data.quest.access || '');
      setTicketsAvailable(data.quest.ticketsAvailable?.toString() || '');
      setTicketPrice(data.quest.ticketPrice?.toString() || '');
      setCurrentImageUrl(data.quest.imageUrl || '');
      setImagePath(data.quest.imagePath || '');
      setRewardCardNumber(data.quest.rewardCardNumber || '');
      setRewardCardName(data.quest.rewardCardName || '');
    } catch (error: any) {
      console.error('クエスト情報の取得に失敗しました', error);
      setError(error.message || 'クエスト情報の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 画像プレビュー処理
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImage(file);
    
    // プレビュー用のURL生成
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // クエスト更新処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // バリデーション
      if (!title) {
        throw new Error('タイトルは必須です');
      }
      if (!date) {
        throw new Error('開催日は必須です');
      }
      
      // 画像のアップロード処理
      let imageUrl = currentImageUrl;
      let updatedImagePath = imagePath;
      
      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || '画像のアップロードに失敗しました');
        }
        
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
        updatedImagePath = uploadData.path;
      }
      
      // クエストデータをAPIに送信
      const questData = {
        title,
        description,
        difficulty,
        questDate: date ? new Date(date).toISOString() : null,
        startTime,
        address,
        access,
        ticketsAvailable: ticketsAvailable ? parseInt(ticketsAvailable, 10) : null,
        ticketPrice: ticketPrice ? parseFloat(ticketPrice) : null,
        imageUrl,
        imagePath: updatedImagePath,
        rewardCardNumber,
        rewardCardName
      };
      
      const updateResponse = await fetch(`/api/admin/quests/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questData),
      });
      
      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || 'クエストの更新に失敗しました');
      }
      
      const updateData = await updateResponse.json();
      setQuest(updateData.quest);
      setSuccessMessage('クエストが更新されました');
      
      // 画像プレビューをリセット
      setImagePreview(null);
      setImage(null);
      
      // 最新のデータを再取得
      fetchQuest();
      
    } catch (error: any) {
      console.error('クエスト更新エラー:', error);
      setError(error.message || 'クエストの更新中にエラーが発生しました');
    } finally {
      setIsSaving(false);
    }
  };

  // ローディング中
  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <p className="ml-3 text-white">読み込み中...</p>
      </div>
    );
  }

  // エラー表示
  if (error && !quest) {
    return (
      <div className="text-center">
        <div className="bg-red-500/20 p-4 rounded-lg mb-6">
          <p className="text-red-400">{error}</p>
        </div>
        <Link
          href="/admin/quests"
          className="text-purple-400 hover:text-purple-300"
        >
          クエスト一覧に戻る
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <Link
            href="/admin/quests"
            className="text-purple-400 hover:text-purple-300 flex items-center gap-2 mb-2"
          >
            <FaArrowLeft /> クエスト一覧に戻る
          </Link>
          <h1 className="text-3xl font-bold text-white">クエスト編集</h1>
        </div>
        <Link
          href={`/admin/quests/${params.id}/delete`}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md flex items-center gap-2 mt-4 md:mt-0"
        >
          <FaTrash /> このクエストを削除
        </Link>
      </div>
      
      {/* エラーメッセージ */}
      {error && (
        <div className="bg-red-500/20 p-4 rounded-lg mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}
      
      {/* 成功メッセージ */}
      {successMessage && (
        <div className="bg-green-500/20 p-4 rounded-lg mb-6">
          <p className="text-green-400">{successMessage}</p>
        </div>
      )}
      
      <Card className="bg-[#463C2D]/80 backdrop-blur rounded-lg p-6 space-y-6 shadow-xl border border-[#C0A172]">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 左側のフォーム */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-white mb-2">タイトル <span className="text-red-500">*</span></label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full bg-[#3a2820] border border-[#C0A172] p-3 rounded-md text-white"
                    placeholder="クエストのタイトルを入力"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-white mb-2">説明</label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    className="w-full bg-[#3a2820] border border-[#C0A172] p-3 rounded-md text-white"
                    placeholder="クエストの詳細説明を入力"
                  />
                </div>
                
                <div>
                  <label htmlFor="date" className="block text-white mb-2">開催日 <span className="text-red-500">*</span></label>
                  <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full bg-[#3a2820] border border-[#C0A172] p-3 rounded-md text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="startTime" className="block text-white mb-2">開始時間</label>
                  <input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-[#3a2820] border border-[#C0A172] p-3 rounded-md text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="difficulty" className="block text-white mb-2">難易度</label>
                  <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full bg-[#3a2820] border border-[#C0A172] p-3 rounded-md text-white"
                  >
                    <option value="★">★</option>
                    <option value="★★">★★</option>
                    <option value="★★★">★★★</option>
                    <option value="★★★★">★★★★</option>
                    <option value="★★★★★">★★★★★</option>
                  </select>
                </div>
              </div>
              
              {/* 右側のフォーム */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-white mb-2">開催場所</label>
                  <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[#3a2820] border border-[#C0A172] p-3 rounded-md text-white"
                    placeholder="開催場所の住所を入力"
                  />
                </div>
                
                <div>
                  <label htmlFor="access" className="block text-white mb-2">アクセス</label>
                  <input
                    id="access"
                    type="text"
                    value={access}
                    onChange={(e) => setAccess(e.target.value)}
                    className="w-full bg-[#3a2820] border border-[#C0A172] p-3 rounded-md text-white"
                    placeholder="最寄り駅や交通手段など"
                  />
                </div>
                
                <div>
                  <label htmlFor="ticketsAvailable" className="block text-white mb-2">チケット残数</label>
                  <input
                    id="ticketsAvailable"
                    type="number"
                    value={ticketsAvailable}
                    onChange={(e) => setTicketsAvailable(e.target.value)}
                    min="0"
                    className="w-full bg-[#3a2820] border border-[#C0A172] p-3 rounded-md text-white"
                    placeholder="利用可能なチケット数"
                  />
                </div>
                
                <div>
                  <label htmlFor="ticketPrice" className="block text-white mb-2">チケット価格 (円)</label>
                  <input
                    id="ticketPrice"
                    type="number"
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(e.target.value)}
                    min="0"
                    className="w-full bg-[#3a2820] border border-[#C0A172] p-3 rounded-md text-white"
                    placeholder="チケット1枚あたりの価格"
                  />
                </div>
                
                <div>
                  <label htmlFor="rewardCardNumber" className="block text-white mb-2">報酬カード番号</label>
                  <input
                    id="rewardCardNumber"
                    type="text"
                    value={rewardCardNumber}
                    onChange={(e) => setRewardCardNumber(e.target.value)}
                    className="w-full bg-[#3a2820] border border-[#C0A172] p-3 rounded-md text-white"
                    placeholder="報酬カードの番号"
                  />
                </div>
                
                <div>
                  <label htmlFor="rewardCardName" className="block text-white mb-2">報酬カード名</label>
                  <input
                    id="rewardCardName"
                    type="text"
                    value={rewardCardName}
                    onChange={(e) => setRewardCardName(e.target.value)}
                    className="w-full bg-[#3a2820] border border-[#C0A172] p-3 rounded-md text-white"
                    placeholder="報酬カードの名称"
                  />
                </div>
              </div>
            </div>
            
            {/* 画像アップロード */}
            <div className="mt-6">
              <label htmlFor="image" className="block text-white mb-2">クエスト画像</label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 現在の画像 */}
                <div>
                  <p className="text-gray-300 mb-2">現在の画像:</p>
                  <div className="relative w-full h-48 bg-[#3a2820] rounded-md overflow-hidden border border-[#C0A172]/30 flex items-center justify-center">
                    {currentImageUrl ? (
                      <Image
                        src={currentImageUrl}
                        alt="クエスト画像"
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    ) : (
                      <div className="text-gray-500 flex flex-col items-center">
                        <FaImage className="text-3xl mb-2" />
                        <p>画像なし</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 新しい画像プレビュー */}
                {imagePreview && (
                  <div>
                    <p className="text-gray-300 mb-2">新しい画像プレビュー:</p>
                    <div className="relative w-full h-48 bg-[#3a2820] rounded-md overflow-hidden border border-[#C0A172]/30">
                      <Image
                        src={imagePreview}
                        alt="新しい画像プレビュー"
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full bg-[#3a2820] border border-[#C0A172] p-3 rounded-md text-white"
                />
                <p className="text-gray-400 text-sm mt-1">新しい画像をアップロードすると、現在の画像は置き換えられます</p>
              </div>
            </div>
            
            {/* 送信ボタン */}
            <div className="flex justify-end mt-8">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    保存中...
                  </>
                ) : (
                  <>
                    <FaSave /> 変更を保存
                  </>
                )}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* クエストプレビュー */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white mb-4">クエストプレビュー</h2>
        <Card className="bg-[#463C2D]/80 backdrop-blur rounded-lg p-6 shadow-xl border border-[#C0A172]">
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">{title || 'クエストタイトル'}</h3>
                
                <div className="space-y-3">
                  <p className="text-gray-300">
                    <span className="font-semibold">開催日:</span> {date ? new Date(date).toLocaleDateString('ja-JP') : '-'}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-semibold">開始時間:</span> {startTime || '-'}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-semibold">難易度:</span> {difficulty || '-'}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-semibold">開催場所:</span> {address || '-'}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-semibold">アクセス:</span> {access || '-'}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-semibold">チケット残数:</span> {ticketsAvailable || '-'}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-semibold">チケット価格:</span> {ticketPrice ? `¥${parseInt(ticketPrice).toLocaleString()}` : '-'}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-semibold">報酬カード:</span> {rewardCardName ? `${rewardCardName} (${rewardCardNumber})` : '-'}
                  </p>
                </div>
                
                {description && (
                  <div className="mt-4">
                    <h4 className="text-white font-semibold mb-2">クエスト詳細:</h4>
                    <p className="text-gray-300 whitespace-pre-line">{description}</p>
                  </div>
                )}
              </div>
              
              <div className="relative w-full h-64 bg-[#2A1A12] rounded-md overflow-hidden">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt={title || 'クエスト画像'}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                ) : currentImageUrl ? (
                  <Image
                    src={currentImageUrl}
                    alt={title || 'クエスト画像'}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-gray-500 flex flex-col items-center">
                      <FaImage className="text-5xl mb-2" />
                      <p>画像なし</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
