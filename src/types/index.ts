export interface CaptionSegment {
  start: number;
  end: number;
  text: string;
}

export interface TranscriptionResponse {
  segments: CaptionSegment[];
  fullText: string;
}

export type CaptionStyle = 'bottom-centered' | 'top-bar' | 'karaoke';

export interface VideoData {
  videoUrl: string;
  captions: CaptionSegment[];
  style: CaptionStyle;
}

export interface RenderRequest {
  videoUrl: string;
  captions: CaptionSegment[];
  style: CaptionStyle;
}

