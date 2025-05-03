import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// 動的レンダリングを強制
export const dynamic = 'force-dynamic';

// クエスト一覧取得
export async function GET(req: NextRequest) {
  try {
    // 認証チェック
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: '認証エラー' }, { status: 401 });
    }

    // クエスト一覧を取得
    const quests = await db.quest.findMany({
      select: {
        id: true,
        title: true,
        questDate: true,
        difficulty: true,
        ticketsAvailable: true,
        ticketPrice: true,
        address: true,
        imageUrl: true,
        createdAt: true,
      },
      orderBy: {
        questDate: 'desc',
      },
    });

    return NextResponse.json({ quests });
  } catch (error) {
    console.error('クエスト一覧取得エラー:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}
