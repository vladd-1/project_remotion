import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { AssemblyAI } from 'assemblyai';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { TranscriptionResponse, CaptionSegment } from '@/types';

export const config = {
  api: {
    bodyParser: false, // important: prevents Next.js from slowing large requests
  },
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 3, // auto retry for 502/503/504
});

const assemblyai = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY || '',
});

// Convert video → audio using ffmpeg
function extractAudio(videoPath: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    let stderrOutput = '';
    
    const ffmpeg = spawn('ffmpeg', [
      '-y',                    // overwrite
      '-i', videoPath,         // input file
      '-vn',                   // no video
      '-acodec', 'libmp3lame', // mp3 codec
      '-ar', '16000',          // sample rate 16kHz (optimal for Whisper)
      '-ac', '1',              // mono audio
      '-b:a', '128k',          // bitrate
      outputPath,
    ]);

    // Capture stderr for debugging
    ffmpeg.stderr?.on('data', (data) => {
      stderrOutput += data.toString();
    });

    ffmpeg.on('error', (err) => {
      console.error('ffmpeg spawn error:', err);
      reject(new Error(`ffmpeg spawn failed: ${err.message}`));
    });

    ffmpeg.on('exit', (code) => {
      if (code === 0) {
        console.log('✅ Audio extraction successful');
        resolve();
      } else {
        console.error('ffmpeg stderr:', stderrOutput);
        reject(new Error(`ffmpeg failed with code ${code}. Check logs for details.`));
      }
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TranscriptionResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📥 Transcription request received');
    
    const bodyChunks: Uint8Array[] = [];

    // Manually parse the JSON body since bodyParser is disabled
    for await (const chunk of req) {
      bodyChunks.push(chunk);
    }

    const bodyData = Buffer.concat(bodyChunks).toString();
    const { videoUrl, provider = 'openai' } = JSON.parse(bodyData);

    if (!videoUrl) {
      return res.status(400).json({ error: 'Video URL is required' });
    }

    console.log('📹 Video URL:', videoUrl);

    const fileName = videoUrl.replace('/uploads/', '');
    const videoPath = path.join(process.cwd(), 'public', 'uploads', fileName);

    if (!fs.existsSync(videoPath)) {
      console.error('❌ Video file not found:', videoPath);
      return res.status(404).json({ error: 'Video file not found' });
    }

    console.log('✅ Video file found:', videoPath);
    
    // Extract audio to temp file
    const audioPath = path.join(process.cwd(), 'public', 'uploads', `${fileName}.mp3`);
    console.log('🔊 Extracting audio to:', audioPath);

    await extractAudio(videoPath, audioPath);

    let segments: CaptionSegment[] = [];
    let fullText = '';

    if (provider === 'assemblyai') {
      console.log('🎙️  Sending audio to AssemblyAI API...');
      
      const transcript = await assemblyai.transcripts.transcribe({
        audio: audioPath,
        speech_model: 'best',
      });

      if (transcript.status === 'error') {
        throw new Error(`AssemblyAI failed: ${transcript.error}`);
      }

      console.log('✅ AssemblyAI transcription completed!');
      
      // Group words into 5-second segments
      if (transcript.words && transcript.words.length > 0) {
        let currentSegment: CaptionSegment = {
          start: transcript.words[0].start / 1000,
          end: transcript.words[0].end / 1000,
          text: transcript.words[0].text,
        };

        for (let i = 1; i < transcript.words.length; i++) {
          const word = transcript.words[i];
          const wordStart = word.start / 1000;
          const wordEnd = word.end / 1000;
          
          if (wordEnd - currentSegment.start >= 5 || word.text.match(/[.!?]$/)) {
            segments.push(currentSegment);
            currentSegment = {
              start: wordStart,
              end: wordEnd,
              text: word.text,
            };
          } else {
            currentSegment.end = wordEnd;
            currentSegment.text += ' ' + word.text;
          }
        }
        
        if (currentSegment.text) {
          segments.push(currentSegment);
        }
      }

      fullText = transcript.text || '';
      console.log(`📝 Generated ${segments.length} caption segments`);
      
    } else {
      console.log('🎙️  Sending audio to OpenAI Whisper API...');
      const audioStream = fs.createReadStream(audioPath);

      const transcription = await openai.audio.transcriptions.create({
        file: audioStream,
        model: 'gpt-4o-mini-transcribe',
        response_format: 'verbose_json',
        timestamp_granularities: ['segment'],
      });

      console.log('✅ OpenAI transcription completed!');
      console.log(`📝 Generated ${transcription.segments?.length || 0} caption segments`);

      segments = transcription.segments?.map((segment: any) => ({
        start: segment.start,
        end: segment.end,
        text: segment.text.trim(),
      })) || [];

      fullText = transcription.text || '';
    }

    // Cleanup audio file
    fs.unlink(audioPath, () => {});

    const response: TranscriptionResponse = {
      segments,
      fullText,
    };

    return res.status(200).json(response);
  } catch (err) {
    console.error('❌ Transcription error:', err);

    return res.status(500).json({
      error: 'Failed to transcribe video',
    });
  }
}

