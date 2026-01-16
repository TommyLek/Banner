import type { Logo } from '../types';

interface LogoLibraryProps {
  logos: Logo[];
  selectedLogoIds: string[];
  onToggleLogo: (logoId: string) => void;
  onDeleteLogo: (logoId: string) => void;
}

export function LogoLibrary({
  logos,
  selectedLogoIds,
  onToggleLogo,
  onDeleteLogo,
}: LogoLibraryProps) {
  if (logos.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <p className="text-sm">Inga logotyper uppladdade</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {logos.map((logo) => {
        const isSelected = selectedLogoIds.includes(logo.id);
        return (
          <div
            key={logo.id}
            className={`
              relative group rounded-lg border-2 p-2 cursor-pointer transition-all
              ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
            `}
            onClick={() => onToggleLogo(logo.id)}
          >
            <img
              src={logo.url}
              alt={logo.name}
              className="w-full h-16 object-contain"
            />
            <p className="text-xs text-center mt-1 truncate text-gray-600">
              {logo.name}
            </p>
            {isSelected && (
              <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteLogo(logo.id);
              }}
              className="absolute top-1 left-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              title="Ta bort"
            >
              <span className="text-white text-xs">×</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
