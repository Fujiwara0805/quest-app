"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // アップロード処理など、バックエンドへの送信処理をここに実装してください

    router.push("/");
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold my-4 text-white">クエスト作成</h2>
      <Card className="bg-[#463C2D]/80 backdrop-blur rounded-lg p-6 space-y-6 shadow-xl border border-[#C0A172]">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-1 font-medium text-white">タイトル</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#3a2820] border border-[#C0A172] p-2 rounded-md text-white placeholder:text-gray-400"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-white">説明</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#3a2820] border border-[#C0A172] p-2 rounded-md text-white placeholder:text-gray-400"
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
                className="w-full bg-[#3a2820] border border-[#C0A172] p-2 rounded-md text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-white file:bg-purple-600 file:hover:bg-purple-700"
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
    </div>
  );
}