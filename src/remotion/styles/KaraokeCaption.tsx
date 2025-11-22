import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';

interface KaraokeCaptionProps {
  text: string;
  progress: number;
}

export const KaraokeCaption: React.FC<KaraokeCaptionProps> = ({
  text,
  progress,
}) => {
  const highlightWidth = interpolate(progress, [0, 1], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 100,
      }}
    >
      <div
        style={{
          position: 'relative',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          padding: '20px 40px',
          borderRadius: 12,
          fontSize: 52,
          fontWeight: 'bold',
          fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
          textAlign: 'center',
          maxWidth: '90%',
          lineHeight: 1.4,
          overflow: 'hidden',
          border: '3px solid rgba(255, 215, 0, 0.8)',
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        {/* Background text (unhighlighted) */}
        <div
          style={{
            color: '#888',
          }}
        >
          {text}
        </div>
        {/* Highlighted text overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            padding: '20px 40px',
            overflow: 'hidden',
            clipPath: `inset(0 ${100 - highlightWidth}% 0 0)`,
          }}
        >
          <div
            style={{
              color: '#FFD700',
              fontWeight: 'bold',
              textShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
            }}
          >
            {text}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

