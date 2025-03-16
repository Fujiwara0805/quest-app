import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    // セッション確認（オプション）
    // const session = await getServerSession(authOptions);
    // 
    // if (!session || !session.user) {
    //   return NextResponse.json(
    //     { message: '認証が必要です' },
    //     { status: 401 }
    //   );
    // }
    
    // リクエストボディを取得
    const { questId, userId, paymentIntentId, amount, quantity, testMode } = await request.json();
    
    if (!questId || !userId || !paymentIntentId) {
      return NextResponse.json(
        { message: '必要なデータが不足しています' },
        { status: 400 }
      );
    }
    
    // テストモードの場合はコンソールに出力するだけ
    if (testMode) {
      console.log('テストモードで予約を作成:', {
        questId,
        userId,
        paymentIntentId,
        amount,
        quantity: quantity || 1,
        status: 'test_confirmed',
        reservedAt: new Date(),
      });
      
      return NextResponse.json({ 
        success: true, 
        testMode: true,
        message: 'テスト予約が作成されました',
        reservation: {
          id: 'test_' + Date.now(),
          questId,
          userId,
          paymentIntentId,
          amount,
          status: 'test_confirmed',
          createdAt: new Date()
        }
      });
    }
    
    // 本番モードの場合は実際にデータベースに保存
    // Prismaスキーマに存在するフィールドのみを使用
    const reservation = await db.reservation.create({
      data: {
        questId,
        userId,
        paymentIntentId,
        amount,
        status: 'confirmed'
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      reservation,
      // レスポンスに購入枚数情報を追加
      additionalInfo: {
        quantity: quantity || 1
      }
    });
  } catch (error: any) {
    console.error('予約保存エラー:', error);
    return NextResponse.json(
      { message: error.message || '予約処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
