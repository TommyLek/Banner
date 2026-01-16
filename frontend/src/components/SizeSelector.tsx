import type { BannerSize } from '../types';

interface SizeSelectorProps {
  sizes: BannerSize[];
  selectedSize: string;
  onSelect: (size: string) => void;
}

export function SizeSelector({ sizes, selectedSize, onSelect }: SizeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Välj bannerstorlek
      </label>
      <div className="grid grid-cols-2 gap-2">
        {sizes.map((size) => (
          <button
            key={size.id}
            onClick={() => onSelect(size.id)}
            className={`
              px-4 py-3 rounded-lg border text-left transition-colors
              ${
                selectedSize === size.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }
            `}
          >
            <div className="font-medium">{size.name}</div>
            <div className="text-sm text-gray-500">
              {size.width} × {size.height}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
