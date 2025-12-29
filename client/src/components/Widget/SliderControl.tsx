import { useState, useEffect } from 'react';

interface SliderControlProps {
  label: string;
  value: number;
  unit?: string;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}

export function SliderControl({ label, value, unit = '', min, max, step = 1, onChange }: SliderControlProps) {
  const [inputValue, setInputValue] = useState(value.toString());
  const [isEditing, setIsEditing] = useState(false);

  // Sincronizza inputValue quando value cambia dall'esterno
  useEffect(() => {
    if (!isEditing) {
      setInputValue(value.toString());
    }
  }, [value, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      // Permetti valori fuori dal range min/max per input manuale
      onChange(numValue);
    } else {
      setInputValue(value.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
      (e.target as HTMLInputElement).blur();
    }
    if (e.key === 'Escape') {
      setInputValue(value.toString());
      setIsEditing(false);
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div>
      {/* Label */}
      <label className="text-xs font-medium uppercase tracking-wide text-gray-500 block mb-3">
        {label}
      </label>

      {/* Slider + Value */}
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="flex-1 h-2 bg-[#333] rounded-full appearance-none cursor-pointer accent-green-500"
        />
        <div className="bg-[#252525] rounded-lg min-w-[4rem] flex items-center justify-center">
          <input
            type="text"
            value={isEditing ? inputValue : `${value}${unit}`}
            onChange={handleInputChange}
            onFocus={() => {
              setIsEditing(true);
              setInputValue(value.toString());
            }}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            className="w-full text-sm font-semibold text-white bg-transparent px-3 py-1.5 text-center outline-none focus:ring-1 focus:ring-green-500 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
