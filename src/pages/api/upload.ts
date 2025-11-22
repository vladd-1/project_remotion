import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 500 * 1024 * 1024, // 500MB
    filename: (name, ext, part) => {
      const uniqueName = `${uuidv4()}${ext}`;
      return uniqueName;
    },
  });

  try {
    const [fields, files] = await form.parse(req);
    const file = Array.isArray(files.video) ? files.video[0] : files.video;

    if (!file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    // Get the relative path for the video
    const fileName = path.basename(file.filepath);
    const videoUrl = `/uploads/${fileName}`;

    return res.status(200).json({
      success: true,
      videoUrl,
      fileName,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      error: 'Failed to upload video',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

