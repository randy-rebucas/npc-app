import { NextResponse } from 'next/server';
import connect from '@/lib/db';
import SharedFile from '@/app/models/SharedFile';
import { logtoConfig } from '@/app/logto';
import { getLogtoContext } from '@logto/next/server-actions';

export async function GET(request: Request) {
  try {
    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('chatId');

    if (!chatId) {
      return NextResponse.json({ error: 'Chat ID is required' }, { status: 400 });
    }

    await connect();

    const files = await SharedFile.find({ chatId })
      .sort({ uploadedAt: -1 })
      .populate('uploadedBy', 'name email')
      .lean();

    return NextResponse.json({ files });
  } catch (error) {
    console.error('Failed to fetch files:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { chatId, fileName, fileUrl, fileType, fileSize } = await request.json();

    if (!chatId || !fileName || !fileUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connect();

    const sharedFile = await SharedFile.create({
      chatId,
      fileName,
      fileUrl,
      fileType,
      fileSize,
      uploadedBy: claims?.id,
    });

    return NextResponse.json({ file: sharedFile });
  } catch (error) {
    console.error('Failed to share file:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 