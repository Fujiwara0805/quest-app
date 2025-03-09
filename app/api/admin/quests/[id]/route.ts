import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';
import { createClient } from '@supabase/supabase-js';

// Supabaseクライアントの初期化
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// クエスト詳細取得
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 認証チェック
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: '認証エラー' }, { status: 401 });
    }

    const id = params.id;
    
    // クエスト詳細を取得
    const quest = await db.quest.findUnique({
      where: { id },
    });

    if (!quest) {
      return NextResponse.json({ error: 'クエストが見つかりません' }, { status: 404 });
    }

    return NextResponse.json({ quest });
  } catch (error) {
    console.error('クエスト詳細取得エラー:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}

// クエスト更新
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 認証チェック
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: '認証エラー' }, { status: 401 });
    }

    const id = params.id;
    const data = await req.json();
    
    // 既存のクエストを確認
    const existingQuest = await db.quest.findUnique({
      where: { id },
    });

    if (!existingQuest) {
      return NextResponse.json({ error: 'クエストが見つかりません' }, { status: 404 });
    }
    
    // クエストを更新
    const updatedQuest = await db.quest.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        questDate: data.questDate,
        startTime: data.startTime,
        difficulty: data.difficulty,
        address: data.address,
        access: data.access,
        ticketsAvailable: data.ticketsAvailable,
        ticketPrice: data.ticketPrice,
        imageUrl: data.imageUrl,
        imagePath: data.imagePath,
        rewardCardNumber: data.rewardCardNumber,
        rewardCardName: data.rewardCardName,
      },
    });

    return NextResponse.json({ quest: updatedQuest });
  } catch (error) {
    console.error('クエスト更新エラー:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}

// クエスト削除
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 認証チェック
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: '認証エラー' }, { status: 401 });
    }

    const id = params.id;
    
    // 既存のクエストを確認
    const existingQuest = await db.quest.findUnique({
      where: { id },
    });

    if (!existingQuest) {
      return NextResponse.json({ error: 'クエストが見つかりません' }, { status: 404 });
    }
    
    // 画像がある場合は削除
    if (existingQuest.imagePath) {
      try {
        // Supabaseから画像を削除
        const { error } = await supabase.storage
          .from('quests-image')
          .remove([existingQuest.imagePath]);
          
        if (error) {
          console.error('画像削除エラー:', error);
        }
      } catch (error) {
        console.error('Supabase画像削除エラー:', error);
      }
    }
    
    // クエストを削除
    await db.quest.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('クエスト削除エラー:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}
