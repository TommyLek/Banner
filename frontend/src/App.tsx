import { useEffect, useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { PromptInput } from './components/PromptInput';
import { SizeSelector } from './components/SizeSelector';
import { ImageGallery } from './components/ImageGallery';
import { LogoLibrary } from './components/LogoLibrary';
import { LogoUploader } from './components/LogoUploader';
import { useImageGeneration } from './hooks/useImageGeneration';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [selectedSize, setSelectedSize] = useState('social');
  const [selectedLogoIds, setSelectedLogoIds] = useState<string[]>([]);

  const {
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
  } = useImageGeneration();

  useEffect(() => {
    fetchSizes();
    fetchImages();
    fetchLogos();
  }, []);

  const handleGenerate = async () => {
    if (!selectedFile || !prompt.trim()) return;
    await generate(selectedFile, prompt, selectedSize, selectedLogoIds);
  };

  const handleToggleLogo = (logoId: string) => {
    setSelectedLogoIds((prev) =>
      prev.includes(logoId)
        ? prev.filter((id) => id !== logoId)
        : [...prev, logoId]
    );
  };

  const handleDeleteLogo = async (logoId: string) => {
    await deleteLogo(logoId);
    setSelectedLogoIds((prev) => prev.filter((id) => id !== logoId));
  };

  const isFormValid = selectedFile && prompt.trim() && selectedSize;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Banner Generator</h1>
          <p className="text-gray-600 mt-2">
            Generera banners med AI baserat på dina referensbilder
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column - Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
              <ImageUploader
                onFileSelect={setSelectedFile}
                selectedFile={selectedFile}
              />

              <PromptInput value={prompt} onChange={setPrompt} />

              <SizeSelector
                sizes={sizes}
                selectedSize={selectedSize}
                onSelect={setSelectedSize}
              />

              {/* Logo Library */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Logotypbibliotek
                  {selectedLogoIds.length > 0 && (
                    <span className="ml-2 text-blue-600">
                      ({selectedLogoIds.length} vald{selectedLogoIds.length > 1 ? 'a' : ''})
                    </span>
                  )}
                </label>
                <LogoLibrary
                  logos={logos}
                  selectedLogoIds={selectedLogoIds}
                  onToggleLogo={handleToggleLogo}
                  onDeleteLogo={handleDeleteLogo}
                />
                <LogoUploader onUpload={uploadLogo} />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={!isFormValid || isLoading}
                className={`
                  w-full py-3 px-4 rounded-lg font-medium text-white transition-colors
                  ${
                    isFormValid && !isLoading
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-300 cursor-not-allowed'
                  }
                `}
              >
                {isLoading ? 'Genererar...' : 'Generera Banner'}
              </button>
            </div>
          </div>

          {/* Right column - Gallery */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Genererade banners
            </h2>
            <ImageGallery images={generatedImages} isLoading={isLoading} onDeleteImage={deleteImage} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
