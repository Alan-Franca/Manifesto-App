import { ArrowUpRight, Instagram, Sparkles, Users, MessageSquareHeart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function InstagramBanner() {
  const { t } = useLanguage();
  const instagramUrl = 'https://instagram.com/manifesto_espro';

  return (
    <section className="mb-10 relative overflow-hidden rounded-2xl border border-border shadow-lg transition-all duration-300 bg-gradient-to-r from-card via-card to-secondary/30">
      {/* Background Gradient Accent Glow */}
      <div 
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(214,36,159,1) 0%, rgba(253,89,73,1) 50%, rgba(253,244,151,1) 100%)'
        }}
      />
      <div 
        className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full opacity-15 blur-2xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(40,90,235,1) 0%, rgba(214,36,159,1) 100%)'
        }}
      />

      <div className="relative z-10 p-6 md:p-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
        
        {/* Left Side: Content & Headline */}
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-foreground tracking-tight leading-snug">
              {t('insta.headline_start')}<span className="bg-gradient-to-r from-[#fd5949] via-[#d6249f] to-[#285AEB] bg-clip-text text-transparent">Jornal Manifesto</span>{t('insta.headline_end')}
            </h2>
            <p className="text-muted-foreground text-sm font-sans mt-2 max-w-2xl leading-relaxed">
              {t('insta.subtext')}
            </p>
          </div>

          {/* Highlights / Badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground pt-1">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{t('insta.badge_carousels')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-500" />
              <span>{t('insta.badge_debates')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageSquareHeart className="w-4 h-4 text-rose-500" />
              <span>{t('insta.badge_interaction')}</span>
            </div>
          </div>
        </div>

        {/* Right Side: CTA Button & Profile Card Teaser */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-3 flex-shrink-0 min-w-[220px]">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full group relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-white font-bold text-sm shadow-md hover:shadow-xl active:scale-[0.98] transition-all duration-300 overflow-hidden"
            style={{
              background: 'linear-gradient(45deg, #fdf497 0%, #fd5949 25%, #d6249f 60%, #285AEB 100%)'
            }}
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Instagram className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
            <span>{t('insta.cta_button')}</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <p className="text-[11px] text-muted-foreground font-sans text-center">
            {t('insta.footnote')}
          </p>
        </div>

      </div>
    </section>
  );
}
