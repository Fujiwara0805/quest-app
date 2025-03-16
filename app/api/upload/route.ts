import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    // 認証チェック
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { message: '権限がありません' },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { message: 'ファイルがアップロードされていません' },
        { status: 400 }
      );
    }
    
    // ファイル名を生成（一意のIDを使用）
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}_${uuidv4()}.${fileExtension}`;
    
    // ファイルをバイナリデータとして読み込む
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // バケット名を確認（正確なバケット名を使用）
    const bucketName = 'quests-image';
    
    // デバッグ情報をログに出力
    console.log(`Uploading file to bucket: ${bucketName}, filename: ${fileName}`);
    
    // Supabaseのストレージにアップロード
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: file.type || 'application/octet-stream',
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Supabaseアップロードエラー:', error);
      return NextResponse.json(
        { message: `ファイルアップロードに失敗しました: ${error.message}` },
        { status: 500 }
      );
    }
    
    // 公開URLを取得
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);
    
    return NextResponse.json({ 
      url: publicUrlData.publicUrl,
      path: fileName
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('ファイルアップロードエラー:', error);
    return NextResponse.json(
      { message: `ファイルアップロードに失敗しました: ${error.message}` },
      { status: 500 }
    );
  }
}
