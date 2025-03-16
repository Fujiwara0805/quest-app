import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') as string;
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }
  
  // 支払い成功イベントを処理
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    
    // メタデータからクエストIDとユーザーIDを取得
    const { questId, userId } = paymentIntent.metadata;
    
    // 既存の予約を確認
    const existingReservation = await db.reservation.findUnique({
      where: { paymentIntentId: paymentIntent.id },
    });
    
    // 予約が存在しない場合は作成
    if (!existingReservation) {
      await db.reservation.create({
        data: {
          questId,
          userId,
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount / 100, // セントから円に変換
          status: 'confirmed',
          reservedAt: new Date(),
        },
      });
    }
  }
  
  return NextResponse.json({ received: true });
}
