import React from 'react';
import { CaptionStyle } from '@/types';

interface StyleSelectorProps {
  selectedStyle: CaptionStyle;
  onStyleChange: (style: CaptionStyle) => void;
}

const styles: { value: CaptionStyle; label: string; description: string }[] = [
  {
    value: 'bottom-centered',
    label: '📍 Bottom Centered',
    description: 'Classic subtitle style at the bottom',
  },
  {
    value: 'top-bar',
    label: '📰 Top Bar',
    description: 'News-style captions at the top',
  },
  {
    value: 'karaoke',
    label: '🎤 Karaoke',
    description: 'Animated highlighting effect',
  },
];

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyle,
  onStyleChange,
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {styles.map((style) => (
          <button
            key={style.value}
            onClick={() => onStyleChange(style.value)}
            className={`
              group relative p-8 rounded-3xl border-4 transition-all duration-300 text-left overflow-hidden hover-lift
              ${
                selectedStyle === style.value
                  ? 'border-purple-400 glass-card shadow-2xl scale-105'
                  : 'border-white/30 glass-card hover:border-purple-300 hover:shadow-xl'
              }
            `}
          >
            {/* Selected indicator */}
            {selectedStyle === style.value && (
              <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            
            {/* Animated background on hover */}
            <div className={`
              absolute inset-0 bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-blue-400/20 
              transition-opacity duration-300
              ${selectedStyle === style.value ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}
            `}></div>
            
            <div className="relative z-10">
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {style.label.split(' ')[0]}
              </div>
              <div className="text-2xl font-black text-gray-800 mb-2">
                {style.label.substring(style.label.indexOf(' ') + 1)}
              </div>
              <p className="text-gray-600 font-medium">{style.description}</p>
              
              {/* Preview indicator */}
              <div className="mt-4 pt-4 border-t-2 border-gray-200">
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wide">
                  {selectedStyle === style.value ? '✨ Active Style' : 'Click to preview'}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

