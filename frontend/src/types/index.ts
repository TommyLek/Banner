export interface BannerSize {
  id: string;
  name: string;
  width: number;
  height: number;
}

export interface GeneratedImage {
  id: string;
  url: string;
  width: number;
  height: number;
  createdAt: string;
}

export interface GenerateResponse {
  success: boolean;
  image: GeneratedImage;
  error?: string;
}

export interface Logo {
  id: string;
  name: string;
  filename: string;
  url: string;
  mimeType: string;
  createdAt: string;
}
