import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    // Prismaを使用してクエストを取得
    const quests = await db.quest.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // データをフロントエンド用の形式に変換
    const formattedQuests = quests.map(quest => ({
      id: quest.id,
      title: quest.title,
      description: quest.description,
      difficulty: quest.difficulty || '★',
      date: quest.questDate,
      startTime: quest.startTime,
      location: {
        address: quest.address || '',
        access: quest.access || ''
      },
      tickets: {
        available: quest.ticketsAvailable || 0,
        price: quest.ticketPrice || 0
      },
      image: quest.imageUrl || '',
      reviews: {
        rating: 0,
        count: 0,
        comments: []
      },
      category: quest.category || ''
    }));
    
    return NextResponse.json({ quests: formattedQuests });
  } catch (error: any) {
    console.error('クエスト一覧取得エラー:', error);
    return NextResponse.json(
      { message: `クエスト一覧の取得に失敗しました: ${error.message}` },
      { status: 500 }
    );
  }
}
