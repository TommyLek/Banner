import { useState } from 'react';
import type { GeneratedImage, BannerSize, Logo } from '../types';

interface UseImageGenerationResult {
  isLoading: boolean;
  error: string | null;
  generatedImages: GeneratedImage[];
  sizes: BannerSize[];
  logos: Logo[];
  generate: (file: File, prompt: string, size: string, logoIds?: string[]) => Promise<void>;
  fetchSizes: () => Promise<void>;
  fetchImages: () => Promise<void>;
  fetchLogos: () => Promise<void>;
  uploadLogo: (file: File, name: string) => Promise<void>;
  deleteLogo: (logoId: string) => Promise<void>;
  deleteImage: (imageId: string) => Promise<void>;
}

export function useImageGeneration(): UseImageGenerationResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [sizes, setSizes] = useState<BannerSize[]>([]);
  const [logos, setLogos] = useState<Logo[]>([]);

  const fetchSizes = async () => {
    try {
      const response = await fetch('/api/sizes');
      const data = await response.json();
      setSizes(data);
    } catch (err) {
      console.error('Failed to fetch sizes:', err);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/images');
      const data = await response.json();
      const images: GeneratedImage[] = data.images.map((url: string) => ({
        id: url.split('/').pop()?.replace('.png', '') || '',
        url,
        width: 0,
        height: 0,
        createdAt: '',
      }));
      setGeneratedImages(images);
    } catch (err) {
      console.error('Failed to fetch images:', err);
    }
  };

  const fetchLogos = async () => {
    try {
      const response = await fetch('/api/logos');
      const data = await response.json();
      setLogos(data);
    } catch (err) {
      console.error('Failed to fetch logos:', err);
    }
  };

  const uploadLogo = async (file: File, name: string) => {
    const formData = new FormData();
    formData.append('logo', file);
    formData.append('name', name);

    const response = await fetch('/api/logos', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to upload logo');
    }

    const newLogo = await response.json();
    setLogos((prev) => [...prev, newLogo]);
  };

  const deleteLogo = async (logoId: string) => {
    const response = await fetch(`/api/logos/${logoId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete logo');
    }

    setLogos((prev) => prev.filter((l) => l.id !== logoId));
  };

  const deleteImage = async (imageId: string) => {
    const response = await fetch(`/api/images/${imageId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete image');
    }

    setGeneratedImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const generate = async (file: File, prompt: string, size: string, logoIds?: string[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('referenceImage', file);
      formData.append('prompt', prompt);
      formData.append('size', size);

      if (logoIds && logoIds.length > 0) {
        formData.append('logoIds', JSON.stringify(logoIds));
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setGeneratedImages((prev) => [data.image, ...prev]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    generatedImages,
    sizes,
    logos,
    generate,
    fetchSizes,
    fetchImages,
    fetchLogos,
    uploadLogo,
    deleteLogo,
    deleteImage,
  };
}
