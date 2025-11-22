import React from 'react';
import { AbsoluteFill } from 'remotion';

interface BottomCenteredCaptionProps {
  text: string;
}

export const BottomCenteredCaption: React.FC<BottomCenteredCaptionProps> = ({
  text,
}) => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 80,
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '16px 32px',
          borderRadius: 8,
          fontSize: 48,
          fontWeight: 'bold',
          fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
          textAlign: 'center',
          maxWidth: '90%',
          lineHeight: 1.4,
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

