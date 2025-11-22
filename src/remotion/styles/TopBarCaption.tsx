import React from 'react';
import { AbsoluteFill } from 'remotion';

interface TopBarCaptionProps {
  text: string;
}

export const TopBarCaption: React.FC<TopBarCaptionProps> = ({ text }) => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-start',
        alignItems: 'stretch',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(220, 38, 38, 0.95)',
          color: 'white',
          padding: '24px 48px',
          fontSize: 42,
          fontWeight: '600',
          fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
          borderBottom: '4px solid rgba(255, 255, 255, 0.3)',
          lineHeight: 1.3,
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

