import { useState, useCallback } from 'react';

interface LogoUploaderProps {
  onUpload: (file: File, name: string) => Promise<void>;
}

export function LogoUploader({ onUpload }: LogoUploaderProps) {
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const handleSubmit = async () => {
    if (!file || !name.trim()) return;

    setIsUploading(true);
    try {
      await onUpload(file, name.trim());
      setFile(null);
      setName('');
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <label className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 cursor-pointer hover:border-gray-400 text-center">
            {preview ? (
              <img src={preview} alt="Preview" className="h-8 mx-auto object-contain" />
            ) : (
              'Välj bild'
            )}
          </div>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Logotypnamn"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
        <button
          onClick={handleSubmit}
          disabled={!file || !name.trim() || isUploading}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors
            ${file && name.trim() && !isUploading
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-300 cursor-not-allowed'}
          `}
        >
          {isUploading ? '...' : '+'}
        </button>
      </div>
    </div>
  );
}
