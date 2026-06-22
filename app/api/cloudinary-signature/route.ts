import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Generate signature for client-side upload
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { timestamp, folder } = body;

    // Parameters to sign (must match exactly what's sent in upload)
    const paramsToSign = {
      timestamp: timestamp,
      folder: folder || 'nice-quad-marrakech/gallery',
    };

    // Generate signature
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET as string
    );

    return NextResponse.json({
      signature,
      timestamp,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder: paramsToSign.folder,
    });
  } catch (error: any) {
    console.error('Signature generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate signature', message: error.message },
      { status: 500 }
    );
  }
}
