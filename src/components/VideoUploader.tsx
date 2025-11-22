import React, { useCallback, useState } from 'react';

interface VideoUploaderProps {
  onUploadComplete: (videoUrl: string) => void;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  onUploadComplete,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Please upload a video file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setUploadProgress(100);
      onUploadComplete(data.videoUrl);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload video. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        uploadFile(files[0]);
      }
    },
    []
  );

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        className={`
          relative border-4 border-dashed rounded-3xl p-16 text-center transition-all duration-300
          ${isDragging ? 'border-purple-400 bg-purple-50/50 scale-105' : 'border-white/40 glass-card'}
          ${isUploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:border-purple-300 hover:scale-102 hover-lift'}
        `}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('video-input')?.click()}
      >
        <input
          id="video-input"
          type="file"
          accept="video/mp4,video/x-m4v,video/*"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="space-y-6">
          {isUploading ? (
            <>
              <div className="text-7xl animate-bounce">⏳</div>
              <p className="text-2xl font-black text-gray-800">
                Uploading your video...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 h-full transition-all duration-500 relative overflow-hidden"
                  style={{ width: `${uploadProgress}%` }}
                >
                  <div className="absolute inset-0 shimmer"></div>
                </div>
              </div>
              <p className="text-lg font-semibold text-gray-600">{uploadProgress}%</p>
            </>
          ) : (
            <>
              <div className="text-8xl float">🎬</div>
              <div className="space-y-3">
                <p className="text-3xl font-black text-gray-800">
                  Drop your video here
                </p>
                <p className="text-xl text-gray-600 font-medium">or click to browse files</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-bold shadow-sm">
                  📹 MP4 Supported
                </span>
                <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-sm font-bold shadow-sm">
                  📦 Up to 500MB
                </span>
                <span className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm font-bold shadow-sm">
                  ⚡ Fast Upload
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

