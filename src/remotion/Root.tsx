import React from 'react';
import { Composition } from 'remotion';
import { CaptionedVideo } from './CaptionedVideo';
import { CaptionSegment, CaptionStyle } from '@/types';

export const RemotionRoot: React.FC = () => {
  const defaultCaptions: CaptionSegment[] = [
    { start: 0, end: 3, text: 'Welcome to the demo' },
    { start: 3, end: 6, text: 'यह एक Hinglish example है' },
    { start: 6, end: 9, text: 'This supports Hindi and English' },
  ];

  return (
    <>
      <Composition
        id="CaptionedVideo"
        component={CaptionedVideo as React.ComponentType<any>}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          videoUrl: '',
          captions: defaultCaptions,
          style: 'bottom-centered' as CaptionStyle,
        }}
      />
    </>
  );
};
