import type { GeneratedImage } from '../types';

interface ImageCardProps {
  image: GeneratedImage;
}

export function ImageCard({ image }: ImageCardProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `banner-${image.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="aspect-video bg-gray-100 relative">
        <img
          src={image.url}
          alt={`Generated banner ${image.id}`}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="p-3 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {image.width > 0 && `${image.width} × ${image.height}`}
        </div>
        <button
          onClick={handleDownload}
          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
        >
          Ladda ner
        </button>
      </div>
    </div>
  );
}
