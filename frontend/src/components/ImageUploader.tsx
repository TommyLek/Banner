import { useCallback, useState } from 'react';

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

export function ImageUploader({ onFileSelect, selectedFile }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (file.type.startsWith('image/')) {
        onFileSelect(file);
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      }
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-colors duration-200
        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        ${preview ? 'bg-gray-50' : ''}
      `}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />

      {preview ? (
        <div className="space-y-4">
          <img
            src={preview}
            alt="Preview"
            className="max-h-48 mx-auto rounded-lg shadow-sm"
          />
          <p className="text-sm text-gray-600">{selectedFile?.name}</p>
          <p className="text-xs text-gray-400">Klicka eller dra för att byta bild</p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-4xl">📁</div>
          <p className="text-gray-600 font-medium">Dra och släpp en referensbild här</p>
          <p className="text-sm text-gray-400">eller klicka för att välja fil</p>
          <p className="text-xs text-gray-400">JPEG, PNG, WebP, GIF (max 10MB)</p>
        </div>
      )}
    </div>
  );
}
