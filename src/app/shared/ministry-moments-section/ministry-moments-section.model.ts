export type MinistryMomentsTheme = 'dunamis' | 'escuadron' | 'kaynos';

export interface MinistryMomentAsset {
  publicId: string;
  alt?: string;
  width?: number;
  quality?: number;
}

export interface MinistryMomentMedia {
  url: string;
  type: 'image' | 'video';
  alt: string;
}
