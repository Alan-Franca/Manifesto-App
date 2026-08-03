import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { NewsCard } from '../components/NewsCard';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { Footer } from '../components/Footer';
import { InstagramBanner } from '../components/InstagramBanner';
import { PodcastSection } from '../components/PodcastSection';
import { ScrapbookSticker } from '../components/ScrapbookSticker';
import { AnimatedIcon } from '../components/AnimatedIcon';

const weeklySegments = [
  { day: 1, label: 'Segunda', emoji: '📰', title: 'Você perdeu', description: 'mas a Manifesto te conta' },
  { day: 2, label: 'Terça', emoji: '🤔', title: 'Você Sabia?', description: 'Conceitos e curiosidades explicadas' },
  { day: 3, label: 'Quarta', emoji: '✨', title: 'Destaque Semanal', description: 'Grandes inovações digitais em foco' },
  { day: 4, label: 'Quinta', emoji: '📖', title: 'Cultura Explicada', description: 'Tendências, música, moda e séries' },
  { day: 5, label: 'Sexta', emoji: '🎬', title: 'Manifesto Recomenda', description: 'Críticas e indicações da equipe' },
];

const categoryList = [
  { id: 'para-voce', label: '📍 Para Você' },
  { id: 'tudo', label: '🌐 Tudo' },
  { id: '🧠 TECNOLOGIA', label: '🧠 Tecnologia' },
  { id: '💼 TRABALHO E FUTURO', label: '💼 Trabalho e Futuro' },
  { id: '🎭 CULTURA', label: '🎭 Cultura' },
  { id: '💡 EXPLICAÇÕES', label: '💡 Explicações' },
  { id: '🌍 SOCIEDADE', label: '🌍 Sociedade' },
  { id: '📰 NOTÍCIAS', label: '📰 Notícias' },
];

export function Feed() {
  const { user } = useAuth();
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering states
  const [activeCategory, setActiveCategory] = useState<string>('para-voce');
  const [activeSegment, setActiveSegment] = useState<number | null>(null);

  // Get current day of week (1-5 for Mon-Fri, 0/6 fallback to Monday)
  const todayDay = new Date().getDay();
  const currentWeekday = todayDay === 0 || todayDay === 6 ? 1 : todayDay;

  useEffect(() => {
    async function fetchNews() {
      try {
        const token = localStorage.getItem('manifesto_token');
        const headers: any = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        const res = await fetch('/api/news', { headers });
        if (res.ok) {
          const data = await res.json();
          setNewsList(data);
        } else {
          setError('Não foi possível carregar as notícias.');
        }
      } catch (err) {
        console.error('Erro de rede ao buscar notícias:', err);
        setError('Erro de conexão ao buscar notícias.');
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  // Set default tab to "tudo" if user has no preferences selected
  useEffect(() => {
    if (user && (!user.preferences || user.preferences.length === 0)) {
      setActiveCategory('tudo');
    }
  }, [user]);

  // Filtering logic
  const filteredNews = newsList.filter(news => {
    // If filtering by weekly segment
    if (activeSegment !== null) {
      const segmentMapping: Record<number, string[]> = {
        1: ['📰 NOTÍCIAS'],
        2: ['💡 EXPLICAÇÕES'],
        3: ['🧠 TECNOLOGIA'],
        4: ['🎭 CULTURA'],
        5: ['💼 TRABALHO E FUTURO', '🌍 SOCIEDADE']
      };
      const allowedCategories = segmentMapping[activeSegment] || [];
      return allowedCategories.includes(news.category);
    }

    // Standard category filtering
    if (activeCategory === 'tudo') {
      return true;
    }
    if (activeCategory === 'para-voce') {
      if (!user?.preferences || user.preferences.length === 0) {
        return true;
      }
      return user.preferences.includes(news.category);
    }
    return news.category === activeCategory;
  });

  const featuredNews = filteredNews[0];
  const gridNews = filteredNews.slice(1);


  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      <Header />

      <main className="flex-1 pt-28 pb-20 md:pb-8 px-4 max-w-7xl mx-auto w-full">
        {/* Greetings Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/60 pb-6">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight text-primary mb-1">
              Olá, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-muted-foreground text-sm font-sans">
              As análises e explicações mais profundas selecionadas para você.
            </p>
          </div>
          <div className="flex gap-2">
            {user?.role === 'admin' && (
              <Button onClick={() => window.location.href = '/admin'} variant="outline" className="border-primary text-primary hover:bg-primary/5 font-semibold text-xs py-1">
                Painel Admin
              </Button>
            )}
          </div>
        </div>

        {/* Instagram Direct Card */}
        <InstagramBanner />

        {/* Manifesto Podcast Section */}
        <PodcastSection />

        {/* 1. WEEKLY SCHEDULE COMPONENT (Manifesto Semanal) */}
        <section className="mb-10 bg-card/40 rounded-2xl p-5 border border-border/80 shadow-sm backdrop-blur-sm">
          <h2 className="text-lg font-display font-bold text-primary mb-4 flex items-center gap-2">
            <AnimatedIcon icon="calendar" size={20} colors="primary:#540B0E,secondary:#540B0E" />
            Manifesto Semanal
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {weeklySegments.map((seg) => {
              const isToday = seg.day === currentWeekday;
              const isActive = activeSegment === seg.day;

              return (
                <div
                  key={seg.day}
                  onClick={() => {
                    setActiveSegment(seg.day);
                    setActiveCategory('');
                  }}
                  className={`p-4 rounded-xl border-2 text-left cursor-pointer transition-all duration-200 select-none flex flex-col justify-between ${
                    isActive
                      ? 'border-accent bg-accent/5 shadow-md scale-102 ring-1 ring-accent'
                      : isToday
                      ? 'border-primary/60 bg-primary/5 hover:border-primary'
                      : 'border-border bg-card hover:border-primary/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold font-sans uppercase tracking-widest text-muted-foreground">
                        {seg.label}
                      </span>
                      {isToday && (
                        <span className="text-[10px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded">
                          HOJE
                        </span>
                      )}
                    </div>
                    <div className="font-display text-base font-bold text-foreground leading-snug flex items-center gap-1.5 mb-1">
                      <span>{seg.emoji}</span>
                      <span>{seg.title}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground font-sans mt-2 leading-relaxed">
                    {seg.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2. CATEGORIES FILTER BAR (Editorias) */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-bold text-primary flex items-center gap-2">
              <AnimatedIcon icon="filter" size={18} colors="primary:#540B0E,secondary:#540B0E" />
              Editorias
            </h2>
            {(activeCategory || activeSegment) && (
              <button 
                onClick={() => {
                  setActiveCategory('tudo');
                  setActiveSegment(null);
                }}
                className="text-xs text-accent hover:underline font-bold"
              >
                Limpar Filtros
              </button>
            )}
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            {categoryList.map((cat) => {
              if (cat.id === 'para-voce' && (!user?.preferences || user.preferences.length === 0)) {
                return null; // Don't show "Para Você" if user hasn't selected interests
              }
              const isActive = activeCategory === cat.id && activeSegment === null;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setActiveSegment(null);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold font-sans tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer select-none border flex items-center gap-2 shadow-sm ${
                    isActive
                      ? 'bg-primary text-primary-foreground border-transparent scale-105 shadow-md'
                      : 'bg-secondary hover:bg-secondary/80 text-foreground border-border'
                  }`}
                >
                  {cat.id !== 'para-voce' && cat.id !== 'tudo' && (
                    <ScrapbookSticker category={cat.id} size="sm" hasTape={false} />
                  )}
                  {cat.id === 'para-voce' && <span className="text-sm">📍</span>}
                  {cat.id === 'tudo' && <span className="text-sm">🌐</span>}
                  <span>{cat.label.replace(/[\uD800-\uDFFF\u2600-\u27BF]/g, '').trim()}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* News List Status */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground text-sm font-sans font-medium">Carregando notícias...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12 bg-destructive/5 border border-destructive/20 rounded-xl max-w-xl mx-auto">
            <p className="text-destructive font-bold mb-3">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-white">
              Tentar Novamente
            </Button>
          </div>
        )}

        {/* 3. NEWS FEED LAYOUT */}
        {!loading && !error && (
          <>
            {filteredNews.length === 0 ? (
              <div className="text-center py-20 bg-muted/20 border border-dashed border-border rounded-xl">
                <p className="text-muted-foreground mb-2 font-medium">Nenhuma notícia encontrada.</p>
                <p className="text-xs text-muted-foreground">Experimente alterar os filtros ou cadastrar novos interesses no perfil.</p>
              </div>
            ) : (
              <div className="space-y-10">
                
                {/* 3A. FEATURED NEWS CARD (Vox Explainer Style) */}
                {featuredNews && (
                  <div className="border-b border-border/60 pb-10">
                    <div 
                      onClick={() => {}}
                      className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 border-t-4 border-t-accent cursor-pointer group"
                    >
                      {featuredNews.image && (
                        <div className="lg:col-span-7 h-64 lg:h-96 bg-muted overflow-hidden relative">
                          <img 
                            src={featuredNews.image} 
                            alt={featuredNews.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103" 
                          />
                        </div>
                      )}
                      
                      <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-center">
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-xs font-bold font-sans uppercase tracking-widest text-accent flex items-center gap-1.5 select-none">
                            <AnimatedIcon icon="tag" size={14} colors="primary:#540B0E,secondary:#540B0E" />
                            {featuredNews.category.replace(/[\uD800-\uDFFF\u2600-\u27BF]/g, '').trim()}
                          </span>
                          <ScrapbookSticker category={featuredNews.category} size="sm" hasTape={false} />
                        </div>
                        
                        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-snug mb-4 group-hover:text-primary transition-colors duration-200">
                          {featuredNews.title}
                        </h2>
                        
                        <p className="text-muted-foreground text-sm font-sans leading-relaxed mb-6 line-clamp-4 flex-1">
                          {featuredNews.summary}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-border/60 text-xs text-muted-foreground mt-auto">
                          <span className="flex items-center gap-1 font-medium">
                            <AnimatedIcon icon="clock" size={14} />
                            {featuredNews.readTime}
                          </span>
                          <span className="font-medium">{featuredNews.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3B. REMAINING NEWS GRID */}
                {gridNews.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gridNews.map((news) => (
                      <NewsCard key={news._id || news.id} {...news} />
                    ))}
                  </div>
                )}

              </div>
            )}
          </>
        )}
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}

