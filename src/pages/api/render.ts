import type { NextApiRequest, NextApiResponse } from 'next';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '500mb',
    },
  },
  maxDuration: 300, // 5 minutes for Vercel Pro
};

const outputDir = path.join(process.cwd(), 'public', 'renders');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { videoUrl, captions, style } = req.body;

    if (!videoUrl || !captions || !style) {
      return res.status(400).json({
        error: 'Missing required parameters: videoUrl, captions, style',
      });
    }

    // Bundle the Remotion project
    const bundleLocation = await bundle({
      entryPoint: path.join(process.cwd(), 'src', 'remotion', 'index.ts'),
      webpackOverride: (config) => config,
    });

    // Get the composition
    // Remotion needs relative path from public folder (e.g., "uploads/file.mp4")
    const relativeVideoPath = videoUrl.startsWith('/') ? videoUrl.slice(1) : videoUrl;
    
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: 'CaptionedVideo',
      inputProps: {
        videoUrl: relativeVideoPath,
        captions,
        style,
      },
    });

    // Generate output file name
    const outputFileName = `${uuidv4()}.mp4`;
    const outputPath = path.join(outputDir, outputFileName);

    // Render the video
    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: {
        videoUrl: relativeVideoPath,
        captions,
        style,
      },
    });

    return res.status(200).json({
      success: true,
      renderUrl: `/renders/${outputFileName}`,
    });
  } catch (error) {
    console.error('Render error:', error);
    return res.status(500).json({
      error: 'Failed to render video',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

