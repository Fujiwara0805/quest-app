import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';

// クエスト統計情報取得
export async function GET(req: NextRequest) {
  try {
    // 認証チェック
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: '認証エラー' }, { status: 401 });
    }

    // クエスト総数を取得
    const count = await db.quest.count();
    
    // 最近のクエストを取得
    const recentQuests = await db.quest.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });

    return NextResponse.json({ count, recentQuests });
  } catch (error) {
    console.error('クエスト統計情報取得エラー:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}
