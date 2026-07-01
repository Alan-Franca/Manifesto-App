import React, { useState } from 'react';
import { Button } from './ui/button';

interface PreferencesModalProps {
  onComplete: (preferences: string[]) => void;
}

const categories = [
  'Esportes',
  'Moda',
  'Economia',
  'Tecnologia',
  'Política',
  'Cultura',
  'Entretenimento',
  'Ciência',
  'Saúde',
  'Educação'
];

export function PreferencesModal({ onComplete }: PreferencesModalProps) {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  const togglePreference = (category: string) => {
    setSelectedPreferences(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleContinue = () => {
    if (selectedPreferences.length > 0) {
      onComplete(selectedPreferences);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto border border-border shadow-lg">
        <div className="mb-6">
          <h2 className="text-2xl mb-2">Seus Interesses</h2>
          <p className="text-muted-foreground">
            Selecione os temas que mais te interessam para personalizar seu feed
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => togglePreference(category)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedPreferences.includes(category)
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <Button
          onClick={handleContinue}
          disabled={selectedPreferences.length === 0}
          className="w-full"
          size="lg"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
