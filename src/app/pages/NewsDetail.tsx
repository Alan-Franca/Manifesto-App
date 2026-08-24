import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { Footer } from '../components/Footer';
import { NewsCard } from '../components/NewsCard';
import { ScrapbookSticker } from '../components/ScrapbookSticker';
import { AnimatedIcon } from '../components/AnimatedIcon';
import { CatBurst } from '../components/CatBurst';
import { Button } from '../components/ui/button';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'sonner';

export function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, translateCategory } = useLanguage();

  const [news, setNews] = useState<any>(null);
  const [relatedNews, setRelatedNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Reader options
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showCatBurst, setShowCatBurst] = useState(false);

  useEffect(() => {
    async function fetchArticleAndRelated() {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('manifesto_token');
        const headers: any = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // Fetch primary article
        const res = await fetch(`/api/news/${id}`, { headers });
        if (res.ok) {
          const data = await res.json();
          setNews(data);
          setLikesCount(Math.floor(Math.random() * 24) + 12);
        } else {
          setError(t('news_detail.not_found'));
        }

        // Fetch only related news selected by the backend
        const allRes = await fetch(`/api/news/${id}/related?limit=3`, { headers });
        if (allRes.ok) {
          const allData = await allRes.json();
          setRelatedNews(allData.items);
        }
      } catch (err) {
        console.error('Erro ao buscar matéria:', err);
        setError(t('feed.error_loading'));
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchArticleAndRelated();
      window.scrollTo(0, 0);
    }
  }, [id]);

  const handleShare = async () => {
    const currentUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: news?.title || 'Jornal Manifesto',
          text: news?.summary || '',
          url: currentUrl,
        });
        return;
      } catch (err) {
        // Fallback to copy clipboard if share dismissed/failed
      }
    }
    
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast.success(t('news_detail.copied'));
    } catch (err) {
      toast.error('Erro ao copiar link.');
    }
  };

  const handleToggleLike = () => {
    if (liked) {
      setLiked(false);
      setLikesCount(prev => prev - 1);
    } else {
      setLiked(true);
      setLikesCount(prev => prev + 1);
      setShowCatBurst(true);
      toast.success('Obrigado pelo seu feedback!');
    }
  };

  // Helper font size mapping
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-base leading-relaxed';
      case 'lg':
        return 'text-xl leading-loose';
      case 'md':
      default:
        return 'text-lg leading-relaxed md:leading-loose';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      {showCatBurst && <CatBurst onComplete={() => setShowCatBurst(false)} />}
      <Header />

      <main className="flex-1 pt-28 pb-20 md:pb-12 px-4 max-w-4xl mx-auto w-full">
        {/* Navigation Back Button */}
        <div className="mb-6">
          <Button
            onClick={() => navigate('/feed')}
            variant="ghost"
            className="hover:bg-secondary/80 text-muted-foreground hover:text-foreground -ml-3 gap-2 font-medium text-sm"
          >
            <span>←</span>
            <span>{t('news_detail.back')}</span>
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground text-sm font-sans font-medium">{t('feed.loading_news')}</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16 bg-destructive/5 border border-destructive/20 rounded-2xl max-w-xl mx-auto my-12">
            <p className="text-destructive font-bold text-lg mb-4">{error}</p>
            <Button onClick={() => navigate('/feed')} className="bg-primary text-primary-foreground">
              {t('news_detail.back')}
            </Button>
          </div>
        )}

        {/* Article Reader Content */}
        {!loading && !error && news && (
          <article className="space-y-8 animate-in fade-in duration-300">
            {/* Header / Category / Meta */}
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold font-sans uppercase tracking-widest text-accent flex items-center gap-1.5 bg-accent/10 px-3 py-1 rounded-full">
                    <AnimatedIcon icon="tag" size={14} colors="primary:#540B0E,secondary:#540B0E" />
                    {translateCategory(news.category)}
                  </span>
                  <ScrapbookSticker category={news.category} size="sm" hasTape={false} />
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                  <span className="flex items-center gap-1">
                    <AnimatedIcon icon="clock" size={14} />
                    {news.readTime}
                  </span>
                  <span>•</span>
                  <span>{news.date}</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight tracking-tight">
                {news.title}
              </h1>

              {/* Subtitle / Lead Summary */}
              {news.summary && (
                <p className="text-lg md:text-xl text-muted-foreground font-sans leading-relaxed border-l-4 border-primary/60 pl-4 py-1 italic">
                  {news.summary}
                </p>
              )}
            </div>

            {/* Hero Image */}
            {news.image && (
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-border bg-muted my-6">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-auto max-h-[500px] object-cover"
                />
                <div className="absolute bottom-2 right-2">
                  <ScrapbookSticker category={news.category} size="md" hasTape={true} />
                </div>
              </div>
            )}

            {/* Interactive Reader Toolbar */}
            <div className="flex items-center justify-between py-3 px-4 bg-card/60 backdrop-blur-sm border border-border/80 rounded-xl my-6 flex-wrap gap-4">
              {/* Font Size Adjuster */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium mr-1">
                  {t('news_detail.font_size')}:
                </span>
                <button
                  onClick={() => setFontSize('sm')}
                  className={`px-2.5 py-1 text-xs rounded-md font-bold transition-colors ${
                    fontSize === 'sm' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80 text-foreground'
                  }`}
                >
                  A-
                </button>
                <button
                  onClick={() => setFontSize('md')}
                  className={`px-2.5 py-1 text-xs rounded-md font-bold transition-colors ${
                    fontSize === 'md' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80 text-foreground'
                  }`}
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize('lg')}
                  className={`px-2.5 py-1 text-xs rounded-md font-bold transition-colors ${
                    fontSize === 'lg' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80 text-foreground'
                  }`}
                >
                  A+
                </button>
              </div>

              {/* Action Buttons: Like & Share */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleToggleLike}
                  variant="outline"
                  size="sm"
                  className={`gap-1.5 text-xs font-medium ${
                    liked ? 'border-primary text-primary bg-primary/10' : ''
                  }`}
                >
                  <span>{liked ? '❤️' : '🤍'}</span>
                  <span>{likesCount}</span>
                </Button>

                <Button
                  onClick={handleShare}
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs font-medium hover:bg-secondary"
                >
                  <span>🔗</span>
                  <span>{t('news_detail.share')}</span>
                </Button>
              </div>
            </div>

            {/* Article Main Text Body */}
            <div className={`prose dark:prose-invert max-w-none text-foreground/90 font-sans space-y-6 ${getFontSizeClass()}`}>
              {news.content ? (
                news.content.split('\n\n').map((paragraph: string, idx: number) => (
                  <p key={idx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))
              ) : (
                <>
                  <p className="first-letter:float-left first-letter:text-5xl first-letter:font-bold first-letter:font-display first-letter:mr-3 first-letter:text-primary leading-relaxed">
                    {news.summary}
                  </p>
                  <p className="leading-relaxed">
                    O Jornal Manifesto traz anomalias, dados e explicações estruturadas para ajudar você a compreender as profundas transformações no mundo contemporâneo. Através de uma abordagem analítica e acessível, buscamos conectar os fatos aos seus impactos diretos na sociedade e no futuro.
                  </p>
                  <p className="leading-relaxed">
                    Acompanhe nossas próximas atualizações e análises exclusivas. Mantenha-se informado com reflexões que estimulam o pensamento crítico e o debate jovem.
                  </p>
                </>
              )}
            </div>

            {/* Article Author Footer / Signature */}
            <div className="border-t border-b border-border/80 py-6 my-10 flex items-center justify-between gap-4 bg-card/30 rounded-xl px-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-display font-bold text-xl">
                  M
                </div>
                <div>
                  <h4 className="font-display font-bold text-foreground text-sm">Redação Jornal Manifesto</h4>
                  <p className="text-xs text-muted-foreground">Jornalismo jovem, crítico e transformador</p>
                </div>
              </div>
              <Button onClick={handleShare} variant="outline" size="sm" className="hidden sm:flex text-xs">
                {t('news_detail.share')}
              </Button>
            </div>

            {/* Related News Section */}
            {relatedNews.length > 0 && (
              <div className="pt-8">
                <h3 className="text-xl font-display font-bold text-primary mb-6 flex items-center gap-2">
                  <AnimatedIcon icon="newspaper" size={20} />
                  {t('news_detail.related')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedNews.map((relItem) => (
                    <NewsCard key={relItem._id || relItem.id} {...relItem} id={relItem._id || relItem.id} />
                  ))}
                </div>
              </div>
            )}
          </article>
        )}
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
