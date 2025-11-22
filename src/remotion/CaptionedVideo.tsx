import React from 'react';
import {
  AbsoluteFill,
  Video,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Img,
} from 'remotion';
import { CaptionSegment, CaptionStyle } from '@/types';
import { BottomCenteredCaption } from './styles/BottomCenteredCaption';
import { TopBarCaption } from './styles/TopBarCaption';
import { KaraokeCaption } from './styles/KaraokeCaption';

export interface CaptionedVideoProps {
  videoUrl: string;
  captions: CaptionSegment[];
  style: CaptionStyle;
}

export const CaptionedVideo: React.FC<CaptionedVideoProps> = ({
  videoUrl,
  captions,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Find the current caption based on the current time
  const currentCaption = captions.find(
    (caption) => currentTime >= caption.start && currentTime < caption.end
  );

  const renderCaption = () => {
    if (!currentCaption) return null;

    switch (style) {
      case 'bottom-centered':
        return <BottomCenteredCaption text={currentCaption.text} />;
      case 'top-bar':
        return <TopBarCaption text={currentCaption.text} />;
      case 'karaoke':
        return (
          <KaraokeCaption
            text={currentCaption.text}
            progress={(currentTime - currentCaption.start) / (currentCaption.end - currentCaption.start)}
          />
        );
      default:
        return <BottomCenteredCaption text={currentCaption.text} />;
    }
  };

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {videoUrl && (
        <Video
          src={videoUrl.startsWith('http') ? videoUrl : staticFile(videoUrl)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      )}
      {renderCaption()}
    </AbsoluteFill>
  );
};

