'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FaSave, FaTrash, FaImage } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { QuestPreview } from './QuestPreview';

// ダミーカテゴリーのリスト
const CATEGORIES = [
  '伝統工芸品',
  '農業体験',
  '漁業体験',
  '温泉体験',
  '祭り・イベント',
  '歴史体験',
  '料理体験',
  'その他'
];

interface QuestEditFormProps {
  quest: any;
  questId: string;
  onQuestUpdated: (quest: any, message: string) => void;
  onError: (message: string) => void;
}

export function QuestEditForm({ quest, questId, onQuestUpdated, onError }: QuestEditFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  
  // フォームの状態
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [difficulty, setDifficulty] = useState('★');
  const [category, setCategory] = useState('');
  const [address, setAddress] = useState('');
  const [access, setAccess] = useState('');
  const [ticketsAvailable, setTicketsAvailable] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // クエストデータからフォームの初期値を設定
  useEffect(() => {
    if (quest) {
      setTitle(quest.title || '');
      setDescription(quest.description || '');
      if (quest.questDate) {
        const date = new Date(quest.questDate);
        setDate(date.toISOString().split('T')[0]);
      }
      setStartTime(quest.startTime || '');
      setDifficulty(quest.difficulty || '★');
      setCategory(quest.category || '');
      setAddress(quest.address || '');
      setAccess(quest.access || '');
      setTicketsAvailable(quest.ticketsAvailable?.toString() || '');
      setTicketPrice(quest.ticketPrice?.toString() || '');
      setCurrentImageUrl(quest.imageUrl || '');
      setImagePath(quest.imagePath || '');
    }
  }, [quest]);

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
        category,
        questDate: date ? new Date(date).toISOString() : null,
        startTime,
        address,
        access,
        ticketsAvailable: ticketsAvailable ? parseInt(ticketsAvailable, 10) : null,
        ticketPrice: ticketPrice ? parseFloat(ticketPrice) : null,
        imageUrl,
        imagePath: updatedImagePath,
      };
      
      const updateResponse = await fetch(`/api/admin/quests/${questId}`, {
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
      
      // 画像プレビューをリセット
      setImagePreview(null);
      setImage(null);
      
      // 親コンポーネントに更新を通知
      onQuestUpdated(updateData.quest, 'クエストが更新されました');
      
    } catch (error: any) {
      console.error('クエスト更新エラー:', error);
      onError(error.message || 'クエストの更新中にエラーが発生しました');
    } finally {
      setIsSaving(false);
    }
  };

  // フォームデータをプレビュー用に整形
  const previewData = {
    title,
    description,
    date: date ? new Date(date) : null,
    startTime,
    difficulty,
    category,
    location: {
      address,
      access
    },
    tickets: {
      available: ticketsAvailable ? parseInt(ticketsAvailable) : 0,
      price: ticketPrice ? parseFloat(ticketPrice) : 0
    },
    image: imagePreview || currentImageUrl
  };

  return (
    <>
      <Card className="bg-[#463C2D]/80 backdrop-blur rounded-lg p-6 space-y-6 shadow-xl border border-[#C0A172]">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 左側のフォーム */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-[#E8D4B9] mb-2">タイトル <span className="text-red-500">*</span></label>
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
                  <label htmlFor="description" className="block text-[#E8D4B9] mb-2">説明</label>
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
                  <label htmlFor="category" className="block text-[#E8D4B9] mb-2">カテゴリー</label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#3a2820] border border-[#C0A172] p-3 rounded-md text-white"
                  >
                    <option value="">カテゴリーを選択</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="date" className="block text-[#E8D4B9] mb-2">開催日 <span className="text-red-500">*</span></label>
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
                  <label htmlFor="startTime" className="block text-[#E8D4B9] mb-2">開始時間</label>
                  <input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-[#3a2820] border border-[#C0A172] p-3 rounded-md text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="difficulty" className="block text-[#E8D4B9] mb-2">難易度</label>
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
                  <label htmlFor="address" className="block text-[#E8D4B9] mb-2">開催場所</label>
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
                  <label htmlFor="access" className="block text-[#E8D4B9] mb-2">アクセス</label>
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
                  <label htmlFor="ticketsAvailable" className="block text-[#E8D4B9] mb-2">チケット残数</label>
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
                  <label htmlFor="ticketPrice" className="block text-[#E8D4B9] mb-2">チケット価格 (円)</label>
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
                

              </div>
            </div>
            
            {/* 画像アップロード */}
            <div className="mt-6">
              <label htmlFor="image" className="block text-[#E8D4B9] mb-2">クエスト画像</label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 現在の画像 */}
                <div>
                  <p className="text-[#E8D4B9]/80 mb-2">現在の画像:</p>
                  <div className="relative w-full h-48 bg-[#3a2820] rounded-md overflow-hidden border border-[#C0A172]/30 flex items-center justify-center">
                    {currentImageUrl ? (
                      <Image
                        src={currentImageUrl}
                        alt="クエスト画像"
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    ) : (
                      <div className="text-[#E8D4B9]/50 flex flex-col items-center">
                        <FaImage className="text-3xl mb-2" />
                        <p>画像なし</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 新しい画像プレビュー */}
                {imagePreview && (
                  <div>
                    <p className="text-[#E8D4B9]/80 mb-2">新しい画像プレビュー:</p>
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
                <p className="text-[#E8D4B9]/60 text-sm mt-1">新しい画像をアップロードすると、現在の画像は置き換えられます</p>
              </div>
            </div>
            
            {/* 送信ボタンと削除ボタンを横並びに配置 */}
            <div className="flex justify-between items-center mt-8 gap-4">
              <Link
                href={`/admin/quests/${questId}/delete`}
                className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-md flex items-center justify-center gap-2 flex-1 text-center"
              >
                <FaTrash /> 削除
              </Link>
              
              <button
                type="submit"
                disabled={isSaving}
                className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-md flex items-center justify-center gap-2 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    保存中...
                  </>
                ) : (
                  <>
                    <FaSave /> 更新
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
        <QuestPreview quest={previewData} />
      </div>
    </>
  );
}
