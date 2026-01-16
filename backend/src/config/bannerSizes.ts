export interface BannerSize {
  id: string;
  name: string;
  width: number;
  height: number;
}

export const BANNER_SIZES: BannerSize[] = [
  { id: 'social', name: 'Social Media', width: 1200, height: 628 },
  { id: 'leaderboard', name: 'Leaderboard', width: 728, height: 90 },
  { id: 'medium-rect', name: 'Medium Rectangle', width: 300, height: 250 },
  { id: 'full-banner', name: 'Hel Banner', width: 1500, height: 500 },
];

export function getBannerSize(sizeId: string): BannerSize | undefined {
  return BANNER_SIZES.find(s => s.id === sizeId);
}

export function parseSizeString(sizeStr: string): { width: number; height: number } | null {
  const match = sizeStr.match(/^(\d+)x(\d+)$/);
  if (match) {
    return { width: parseInt(match[1]), height: parseInt(match[2]) };
  }
  const preset = getBannerSize(sizeStr);
  if (preset) {
    return { width: preset.width, height: preset.height };
  }
  return null;
}
