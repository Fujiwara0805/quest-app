import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    // リクエストボディからデータを取得
    const data = await req.json();
    
    // Prismaを使用してクエストを作成
    const quest = await db.quest.create({
      data: {
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        questDate: data.questDate,
        startTime: data.startTime,
        address: data.address,
        access: data.access,
        ticketsAvailable: data.ticketsAvailable,
        ticketPrice: data.ticketPrice,
        imageUrl: data.imageUrl,
        rewardCardNumber: data.rewardCardNumber,
        rewardCardName: data.rewardCardName,
      },
    });
    
    return NextResponse.json({ quest }, { status: 201 });
  } catch (error: any) {
    console.error('クエスト作成エラー:', error);
    return NextResponse.json(
      { message: `クエスト作成に失敗しました: ${error.message}` },
      { status: 500 }
    );
  }
}
