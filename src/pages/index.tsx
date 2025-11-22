import React, { useState } from 'react';
import { Player } from '@remotion/player';
import { VideoUploader } from '@/components/VideoUploader';
import { CaptionEditor } from '@/components/CaptionEditor';
import { StyleSelector } from '@/components/StyleSelector';
import { CaptionSegment, CaptionStyle } from '@/types';
import { CaptionedVideo } from '@/remotion/CaptionedVideo';

type TranscriptionProvider = 'openai' | 'assemblyai';

export default function Home() {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [captions, setCaptions] = useState<CaptionSegment[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<CaptionStyle>('bottom-centered');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [renderUrl, setRenderUrl] = useState<string>('');
  const [videoDuration, setVideoDuration] = useState<number>(10); // Store actual video duration
  const [transcriptionProvider, setTranscriptionProvider] = useState<TranscriptionProvider>('openai');

  const handleUploadComplete = (url: string) => {
    setVideoUrl(url);
    setCaptions([]);
    setRenderUrl('');
    
    // Get actual video duration
    const video = document.createElement('video');
    video.src = url;
    video.onloadedmetadata = () => {
      setVideoDuration(video.duration);
    };
  };

  const handleAutoGenerateCaptions = async () => {
    if (!videoUrl) {
      alert('Please upload a video first');
      return;
    }

    setIsTranscribing(true);

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          videoUrl,
          provider: transcriptionProvider 
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Transcription failed');
      }

      const data = await response.json();
      setCaptions(data.segments);
    } catch (error) {
      console.error('Transcription error:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to generate captions. Please check your API key and try again.'
      );
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleExport = async () => {
    if (!videoUrl || captions.length === 0) {
      alert('Please upload a video and add captions first');
      return;
    }

    setIsRendering(true);

    try {
      const response = await fetch('/api/render', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoUrl,
          captions,
          style: selectedStyle,
        }),
      });

      if (!response.ok) {
        throw new Error('Render failed');
      }

      const data = await response.json();
      setRenderUrl(data.renderUrl);
      alert('Video rendered successfully! You can download it below.');
    } catch (error) {
      console.error('Render error:', error);
      alert('Failed to render video. Note: Rendering may timeout on free hosting plans. Consider using the CLI for local rendering.');
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className="min-h-screen animated-gradient">
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl float" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <header className="relative glass-card border-b border-white/20 shadow-xl sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 mb-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-lg float">
              🎬
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Remotion Video Captioning
              </h1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-1 font-medium">
                AI-Powered Video Captions with Hinglish Support ✨
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-12 sm:space-y-16 max-w-7xl">
        {/* Step 1: Upload Video */}
        <section className="smooth-transition">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <div className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-2xl font-black text-lg sm:text-xl shadow-lg ${!videoUrl ? 'step-active' : ''}`}>
              1
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white drop-shadow-lg">Upload Video</h2>
              <p className="text-white/80 text-xs sm:text-sm mt-1">Choose your video file to get started</p>
            </div>
          </div>
          <VideoUploader onUploadComplete={handleUploadComplete} />
        </section>

        {/* Step 2: Generate or Edit Captions */}
        {videoUrl && (
          <section className="smooth-transition animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 sm:mb-8">
              <div className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-pink-500 to-purple-500 text-white rounded-2xl font-black text-lg sm:text-xl shadow-lg ${captions.length === 0 ? 'step-active' : ''}`}>
                2
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white drop-shadow-lg">
                  Generate Captions
                </h2>
                <p className="text-white/80 text-xs sm:text-sm mt-1">AI-powered transcription with Whisper</p>
              </div>
            </div>
            {/* Provider Selection */}
            <div className="flex justify-center mb-6">
              <div className="glass-card rounded-2xl p-2 inline-flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setTranscriptionProvider('openai')}
                  className={`px-4 sm:px-6 py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 ${
                    transcriptionProvider === 'openai'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                      : 'bg-white/50 text-gray-700 hover:bg-white/70'
                  }`}
                >
                  🤖 OpenAI Whisper
                </button>
                <button
                  onClick={() => setTranscriptionProvider('assemblyai')}
                  className={`px-4 sm:px-6 py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 ${
                    transcriptionProvider === 'assemblyai'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105'
                      : 'bg-white/50 text-gray-700 hover:bg-white/70'
                  }`}
                >
                  ⚡ AssemblyAI
                </button>
              </div>
            </div>

            <div className="text-center mb-8">
              <button
                onClick={handleAutoGenerateCaptions}
                disabled={isTranscribing}
                className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white text-lg sm:text-xl font-bold rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 pulse-glow overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative z-10 flex items-center gap-3 justify-center">
                  {isTranscribing ? (
                    <>
                      <svg
                        className="animate-spin h-6 w-6"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Transcribing Audio...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">🎙️</span>
                      <span>Auto-Generate Captions</span>
                    </>
                  )}
                </span>
              </button>
            </div>

            {/* Manual Caption Entry Option */}
            {captions.length === 0 && (
              <div className="text-center mb-8">
                <div className="flex items-center gap-4 justify-center mb-4">
                  <div className="h-px bg-white/30 flex-1 max-w-xs"></div>
                  <span className="text-white/80 font-semibold">OR</span>
                  <div className="h-px bg-white/30 flex-1 max-w-xs"></div>
                </div>
                <button
                  onClick={() => {
                    // Add first caption manually
                    setCaptions([
                      {
                        start: 0,
                        end: 3,
                        text: '',
                      },
                    ]);
                  }}
                  className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white text-base sm:text-lg font-bold rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <span className="relative z-10 flex items-center gap-3 justify-center">
                    <span className="text-2xl">✏️</span>
                    <span>Add Captions Manually</span>
                  </span>
                </button>
              </div>
            )}

            {captions.length > 0 && (
              <CaptionEditor
                captions={captions}
                onCaptionsChange={setCaptions}
              />
            )}
          </section>
        )}

        {/* Step 3: Choose Style */}
        {captions.length > 0 && (
          <section className="smooth-transition animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 sm:mb-8">
              <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl font-black text-lg sm:text-xl shadow-lg step-active">
                3
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white drop-shadow-lg">
                  Choose Caption Style
                </h2>
                <p className="text-white/80 text-xs sm:text-sm mt-1">Pick your favorite caption design</p>
              </div>
            </div>
            <StyleSelector
              selectedStyle={selectedStyle}
              onStyleChange={setSelectedStyle}
            />
          </section>
        )}

        {/* Step 4: Preview */}
        {videoUrl && captions.length > 0 && (
          <section className="smooth-transition animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 sm:mb-8">
              <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-2xl font-black text-lg sm:text-xl shadow-lg">
                4
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white drop-shadow-lg">
                  Preview & Export
                </h2>
                <p className="text-white/80 text-xs sm:text-sm mt-1">Watch your creation and download</p>
              </div>
            </div>
            <div className="glass-card rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border-2 border-white/30 hover-lift">
              <div className="max-w-5xl mx-auto">
                <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white/50">
                  <Player
                    component={CaptionedVideo}
                    inputProps={{
                      videoUrl,
                      captions,
                      style: selectedStyle,
                    }}
                    durationInFrames={Math.ceil(videoDuration * 30)}
                    compositionWidth={1920}
                    compositionHeight={1080}
                    fps={30}
                    style={{
                      width: '100%',
                      aspectRatio: '16/9',
                    }}
                    controls
                  />
                </div>
              </div>

              <div className="mt-6 sm:mt-8 text-center flex flex-col sm:flex-row flex-wrap gap-4 justify-center items-center">
                <button
                  onClick={handleExport}
                  disabled={isRendering}
                  className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white text-lg sm:text-xl font-bold rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                  <span className="relative z-10 flex items-center gap-3">
                    {isRendering ? (
                      <>
                        <svg
                          className="animate-spin h-6 w-6"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>Rendering Magic...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl">🎬</span>
                        <span>Export Video</span>
                      </>
                    )}
                  </span>
                </button>

                {renderUrl && (
                  <a
                    href={renderUrl}
                    download
                    className="group relative px-10 py-5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white text-xl font-bold rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden pulse-glow"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                    <span className="relative z-10 flex items-center gap-3">
                      <span className="text-2xl">📥</span>
                      <span>Download Video</span>
                    </span>
                  </a>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="relative mt-20 border-t-2 border-white/20 bg-gradient-to-b from-transparent to-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left: Name & Copyright */}
            <div className="text-center md:text-left bg-black/60 backdrop-blur-md rounded-2xl px-6 py-4 border-2 border-purple-500/30 shadow-lg">
              <h3 className="text-3xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl mb-1">
                Abhay Tiwari
              </h3>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                <p className="text-white text-base font-bold drop-shadow-lg">
                  Software Engineer
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                <span className="text-yellow-300 text-base drop-shadow-lg">⚡</span>
                <p className="text-white text-sm font-medium">
                  © {new Date().getFullYear()} All rights reserved
                </p>
              </div>
            </div>
            
            {/* Right: Social Links */}
            <div className="text-center md:text-right">
              <p className="text-white font-bold text-sm mb-3 tracking-wider">CONNECT WITH ME</p>
              <div className="flex gap-3 justify-center md:justify-end">
                <a 
                  href="mailto:abhaytiwari9876@gmail.com" 
                  className="group bg-purple-600 hover:bg-purple-500 p-3 rounded-lg transition-all duration-300 hover:scale-110"
                  title="Email"
                >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </a>
              
              <a 
                href="tel:+919169792054" 
                className="group bg-blue-600 hover:bg-blue-500 p-3 rounded-lg transition-all duration-300 hover:scale-110"
                title="Call"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </a>
              
              <a 
                href="https://wa.me/919169792054" 
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-green-600 hover:bg-green-500 p-3 rounded-lg transition-all duration-300 hover:scale-110"
                title="WhatsApp"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
              
              <a 
                href="https://linkedin.com/in/abhay-tiwari" 
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-cyan-600 hover:bg-cyan-500 p-3 rounded-lg transition-all duration-300 hover:scale-110"
                title="LinkedIn"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

