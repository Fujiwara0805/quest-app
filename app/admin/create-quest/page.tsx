"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Quest } from '@/types/quest';
// QuestCard コンポーネントは app/components/QuestCard.tsx に移動済みのため、ここでは定義不要です
// また、Card、CardContent、FavoriteButton も不要になりました

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
  const [image, setImage] = useState("");
  const [rewardCardNumber, setRewardCardNumber] = useState("");
  const [rewardCardName, setRewardCardName] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 必要に応じて入力チェックやバックエンドへの送信処理を実装してください
    // 例：新たに作成したクエストオブジェクトをバックエンドに送信する処理など

    router.push("/");
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold my-4">クエスト作成</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">タイトル</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">説明</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md"
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">日付</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">開始時刻</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md"
              required
            />
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium">難易度</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md"
            required
          >
            <option value="★">★</option>
            <option value="★★">★★</option>
            <option value="★★★">★★★</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">場所 (住所)</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">アクセス</label>
          <input
            type="text"
            value={access}
            onChange={(e) => setAccess(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md"
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">チケット残数</label>
            <input
              type="number"
              value={ticketsAvailable}
              onChange={(e) => setTicketsAvailable(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">チケット価格</label>
            <input
              type="number"
              value={ticketPrice}
              onChange={(e) => setTicketPrice(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md"
              required
            />
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium">画像パス</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md"
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">報酬カード番号</label>
            <input
              type="text"
              value={rewardCardNumber}
              onChange={(e) => setRewardCardNumber(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">報酬カード名</label>
            <input
              type="text"
              value={rewardCardName}
              onChange={(e) => setRewardCardName(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded-md"
        >
          クエストを作成
        </button>
      </form>
    </div>
  );
}