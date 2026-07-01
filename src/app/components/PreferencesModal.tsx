import { useState } from 'react';
import { Button } from './ui/button';
import { ScrapbookSticker } from './ScrapbookSticker';

interface PreferencesModalProps {
  onComplete: (preferences: string[]) => void;
}

const categories = [
  {
    id: '🧠 TECNOLOGIA',
    title: '🧠 TECNOLOGIA',
    description: 'Inteligência artificial, algoritmos, privacidade, inovação e futuro da internet.',
  },
  {
    id: '💼 TRABALHO E FUTURO',
    title: '💼 TRABALHO E FUTURO',
    description: 'Mercado de trabalho, profissões do futuro, produtividade, burnout e carreira.',
  },
  {
    id: '🎭 CULTURA',
    title: '🎭 CULTURA',
    description: 'Música, filmes, séries, moda, eventos e novas tendências culturais.',
  },
  {
    id: '💡 EXPLICAÇÕES',
    title: '💡 EXPLICAÇÕES',
    description: 'Quiet quitting, afrofuturismo, burnout digital, fandom e conceitos modernos explicados.',
  },
  {
    id: '🌍 SOCIEDADE',
    title: '🌍 SOCIEDADE',
    description: 'Comportamento humano, saúde mental, ansiedade digital e impacto das redes.',
  },
  {
    id: '📰 NOTÍCIAS',
    title: '📰 NOTÍCIAS',
    description: 'Fatos relevantes do mundo, economia simplificada e política de forma leve.',
  }
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl p-6 md:p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto border border-border shadow-2xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold font-display tracking-wide mb-2 text-primary">Seus Interesses</h2>
          <p className="text-muted-foreground text-sm">
            Selecione as editorias que mais te interessam para personalizar sua experiência no Manifesto.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => togglePreference(cat.id)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer flex flex-col gap-1 select-none ${
                selectedPreferences.includes(cat.id)
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border bg-card hover:border-primary/40'
              }`}
            >
              <div className="font-display text-base font-bold tracking-wide flex items-center justify-between text-foreground w-full">
                <div className="flex items-center gap-3">
                  <ScrapbookSticker category={cat.id} size="sm" hasTape={false} />
                  <span>{cat.title.replace(/[\uD800-\uDFFF\u2600-\u27BF]/g, '').trim()}</span>
                </div>
                <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold transition-all ${
                  selectedPreferences.includes(cat.id)
                    ? 'border-primary bg-primary text-primary-foreground scale-110'
                    : 'border-muted-foreground/30'
                }`}>
                  {selectedPreferences.includes(cat.id) ? '✓' : ''}
                </span>
              </div>
              <p className="text-muted-foreground text-xs font-sans leading-relaxed">
                {cat.description}
              </p>
            </button>
          ))}
        </div>

        <Button
          onClick={handleContinue}
          disabled={selectedPreferences.length === 0}
          className="w-full text-base py-6 font-semibold"
          size="lg"
        >
          Continuar e Ver Feed
        </Button>
      </div>
    </div>
  );
}
