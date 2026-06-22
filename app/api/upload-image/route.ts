import { NextRequest, NextResponse } from 'next/server';
import ImageKit from 'imagekit';

// Lazy initialization to avoid build-time errors
const getImageKit = () => new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY?.replace(/^['"]|['"]$/g, '') || '',
  privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY?.replace(/^['"]|['"]$/g, '') || '',
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT?.replace(/^['"]|['"]$/g, '') || '',
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer for ImageKit upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to ImageKit using SDK
    const imagekit = getImageKit();
    const response = await imagekit.upload({
      file: buffer,
      fileName: file.name,
      folder: '/gallery', // Optional: organize uploads in folders
    });

    return NextResponse.json({
      url: response.url,
      fileId: response.fileId,
    });

  } catch (error: any) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: 'Upload failed', message: error.message },
      { status: 500 }
    );
  }
}
