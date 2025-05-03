import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    
    // Prismaを使用して特定のクエストを取得
    const quest = await db.quest.findUnique({
      where: {
        id: id
      }
    });
    
    if (!quest) {
      return NextResponse.json(
        { message: 'クエストが見つかりません' },
        { status: 404 }
      );
    }
    
    // データをフロントエンド用の形式に変換
    const formattedQuest = {
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
    };
    
    return NextResponse.json({ quest: formattedQuest });
  } catch (error: any) {
    console.error('クエスト詳細取得エラー:', error);
    return NextResponse.json(
      { message: `クエスト詳細の取得に失敗しました: ${error.message}` },
      { status: 500 }
    );
  }
}
