import React from 'react';
import { CaptionSegment } from '@/types';

interface CaptionEditorProps {
  captions: CaptionSegment[];
  onCaptionsChange: (captions: CaptionSegment[]) => void;
}

export const CaptionEditor: React.FC<CaptionEditorProps> = ({
  captions,
  onCaptionsChange,
}) => {
  const handleCaptionChange = (index: number, field: keyof CaptionSegment, value: string | number) => {
    const newCaptions = [...captions];
    newCaptions[index] = {
      ...newCaptions[index],
      [field]: value,
    };
    onCaptionsChange(newCaptions);
  };

  const handleAddCaption = () => {
    const lastCaption = captions[captions.length - 1];
    const newCaption: CaptionSegment = {
      start: lastCaption ? lastCaption.end : 0,
      end: lastCaption ? lastCaption.end + 3 : 3,
      text: '',
    };
    onCaptionsChange([...captions, newCaption]);
  };

  const handleDeleteCaption = (index: number) => {
    const newCaptions = captions.filter((_, i) => i !== index);
    onCaptionsChange(newCaptions);
  };

  return (
    <div className="w-full max-w-5xl mx-auto glass-card rounded-3xl shadow-2xl p-8 border-2 border-white/30">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <span className="text-3xl">✏️</span>
            Edit Captions
          </h3>
          <p className="text-sm text-gray-600 mt-1">Fine-tune your caption timing and text</p>
        </div>
        <button
          onClick={handleAddCaption}
          className="group relative px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:scale-105 hover:shadow-lg transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
          <span className="relative z-10 flex items-center gap-2">
            <span className="text-xl">+</span>
            <span>Add Caption</span>
          </span>
        </button>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {captions.map((caption, index) => (
          <div
            key={index}
            className="group flex gap-4 items-start p-6 bg-gradient-to-r from-white to-gray-50 rounded-2xl hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-purple-200 hover-lift"
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-md">
                {index + 1}
              </div>
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    ⏱️ Start Time
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={caption.start}
                    onChange={(e) =>
                      handleCaptionChange(index, 'start', parseFloat(e.target.value))
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    ⏱️ End Time
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={caption.end}
                    onChange={(e) =>
                      handleCaptionChange(index, 'end', parseFloat(e.target.value))
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-semibold"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  💬 Caption Text (Hindi/English)
                </label>
                <textarea
                  value={caption.text}
                  onChange={(e) => handleCaptionChange(index, 'text', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hinglish-text resize-none transition-all font-medium text-lg"
                  rows={2}
                  placeholder="Type your caption here..."
                />
              </div>
            </div>

            <button
              onClick={() => handleDeleteCaption(index)}
              className="flex-shrink-0 p-3 text-red-500 hover:bg-red-100 rounded-xl transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
              title="Delete caption"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {captions.length === 0 && (
        <div className="text-center py-20">
          <div className="text-7xl mb-4">📝</div>
          <p className="text-xl font-bold text-gray-600">No captions yet</p>
          <p className="text-gray-500 mt-2">Click "Auto-Generate Captions" or add manually</p>
        </div>
      )}
    </div>
  );
};

