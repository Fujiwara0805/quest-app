import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // ファイルを保存するパス
    const publicDir = join(process.cwd(), 'public');
    const uploadsDir = join(publicDir, 'uploads');
    
    // uploadsディレクトリが存在することを確認
    try {
      await writeFile(join(uploadsDir, '.gitkeep'), '');
    } catch (error) {
      // ディレクトリが存在しない場合は作成
      const { mkdir } = require('fs/promises');
      await mkdir(uploadsDir, { recursive: true });
    }
    
    const filePath = join(uploadsDir, fileName);
    
    // ファイルをバイナリデータとして読み込む
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // ファイルを保存
    await writeFile(filePath, buffer);
    
    // 保存したファイルのURLを返す
    const fileUrl = `/uploads/${fileName}`;
    
    return NextResponse.json({ url: fileUrl }, { status: 201 });
  } catch (error: any) {
    console.error('ファイルアップロードエラー:', error);
    return NextResponse.json(
      { message: `ファイルアップロードに失敗しました: ${error.message}` },
      { status: 500 }
    );
  }
}
