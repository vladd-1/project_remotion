# project_remotion
# 🎬 Remotion Caption Generator

A modern full-stack web application for adding beautiful captions to videos using AI transcription.

## ✨ Features

- **Video Upload**: Upload MP4 videos
- **AI Transcription**: 
  - OpenAI Whisper API
  - AssemblyAI API
- **Manual Captions**: Add and edit captions manually
- **3 Caption Styles**:
  - Bottom Centered
  - Top Bar
  - Karaoke
- **Real-time Preview**: See captions on video instantly
- **Export**: Render final video with captions

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API Keys
Create `.env` file:
```bash
OPENAI_API_KEY=your_openai_key
ASSEMBLYAI_API_KEY=your_assemblyai_key
MAX_FILE_SIZE=524288000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎨 Usage

1. **Upload Video**: Drag & drop or click to upload
2. **Choose Provider**: Select OpenAI or AssemblyAI
3. **Auto-Generate** or **Add Manually**: Get AI captions or create your own
4. **Edit Captions**: Adjust timing and text
5. **Select Style**: Choose caption style
6. **Preview**: Watch video with captions
7. **Export**: Render final video

## 🔑 Get API Keys

- **OpenAI**: https://platform.openai.com/api-keys
- **AssemblyAI**: https://www.assemblyai.com/dashboard

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Video**: Remotion
- **AI**: OpenAI Whisper, AssemblyAI
- **Audio Processing**: ffmpeg

## 📦 Project Structure

```
├── src/
│   ├── pages/           # Next.js pages & API routes
│   ├── components/      # React components
│   ├── remotion/        # Remotion video components
│   ├── styles/          # Global styles
│   └── types/           # TypeScript types
├── public/
│   └── uploads/         # Uploaded videos
└── .env                 # Environment variables
```

## 🎯 API Endpoints

- `POST /api/upload` - Upload video
- `POST /api/transcribe` - Generate captions
- `POST /api/render` - Render final video

## 📄 License

MIT License
