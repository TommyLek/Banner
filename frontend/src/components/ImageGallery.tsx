import type { GeneratedImage } from '../types';
import { ImageCard } from './ImageCard';

interface ImageGalleryProps {
  images: GeneratedImage[];
  isLoading: boolean;
  onDeleteImage: (id: string) => void;
}

export function ImageGallery({ images, isLoading, onDeleteImage }: ImageGalleryProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-gray-600">Genererar banner...</p>
        <p className="text-sm text-gray-400">Detta kan ta upp till en minut</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="text-4xl mb-2">🖼️</div>
        <p>Inga genererade bilder än</p>
        <p className="text-sm text-gray-400">Ladda upp en referensbild och generera din första banner</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {images.map((image) => (
        <ImageCard key={image.id} image={image} onDelete={onDeleteImage} />
      ))}
    </div>
  );
}
