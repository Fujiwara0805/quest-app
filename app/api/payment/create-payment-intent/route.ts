import { NextResponse } from 'next/server';
import stripe  from '@/lib/stripe';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';


export async function POST(request: Request) {
  try {
    // セッション確認（オプション - 認証が必要な場合）
    // const session = await getServerSession(authOptions);
    // 
    // if (!session || !session.user) {
    //   return NextResponse.json(
    //     { message: '認証が必要です' },
    //     { status: 401 }
    //   );
    // }
    
    // リクエストボディを取得
    const { questId, amount, userId, quantity, testMode } = await request.json();
    
    if (!questId || amount === undefined) {
      return NextResponse.json(
        { message: '必要なデータが不足しています' },
        { status: 400 }
      );
    }
    
    // クエストの存在確認
    const quest = await db.quest.findUnique({
      where: { id: questId },
    });
    
    if (!quest) {
      return NextResponse.json(
        { message: 'クエストが見つかりません' },
        { status: 404 }
      );
    }
    
    // テストモードの場合は模擬的なPaymentIntentを返す
    if (testMode) {
      console.log('テストモードで支払い意図を作成しています');
      
      // テスト用のPaymentIntent ID
      const testPaymentIntentId = `test_pi_${Date.now()}`;
      
      return NextResponse.json({
        clientSecret: 'test_secret_' + Date.now(),
        paymentIntentId: testPaymentIntentId,
        testMode: true
      });
    }
    
    // 通常の支払い意図を作成
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripeは金額をセント単位で扱う
      currency: 'jpy',
      metadata: {
        questId,
        userId,
        quantity: String(quantity || 1)
      },
    });
    
    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error: any) {
    console.error('支払い意図作成エラー:', error);
    return NextResponse.json(
      { message: error.message || '支払い処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
