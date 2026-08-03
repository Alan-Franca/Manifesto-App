import { ArrowUpRight, Instagram, Sparkles, Users, MessageSquareHeart } from 'lucide-react';

export function InstagramBanner() {
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
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#fd5949]/15 via-[#d6249f]/15 to-[#285AEB]/15 text-foreground border border-[#d6249f]/30 backdrop-blur-md">
              <Instagram className="w-4 h-4 text-[#d6249f]" />
              <span className="bg-gradient-to-r from-[#fd5949] via-[#d6249f] to-[#285AEB] bg-clip-text text-transparent font-extrabold">
                @manifesto_espro
              </span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Comunidade Ativa
            </span>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-foreground tracking-tight leading-snug">
              Conecte-se com o <span className="bg-gradient-to-r from-[#fd5949] via-[#d6249f] to-[#285AEB] bg-clip-text text-transparent">Jornal Manifesto</span> no Instagram
            </h2>
            <p className="text-muted-foreground text-sm font-sans mt-2 max-w-2xl leading-relaxed">
              Receba pautas diárias, bastidores das reportagens, conteúdos em vídeo, carrosséis explicativos e participe das nossas enquetes exclusivas em primeira mão.
            </p>
          </div>

          {/* Highlights / Badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground pt-1">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Carrosséis Explicativos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-500" />
              <span>Debates Jovens</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageSquareHeart className="w-4 h-4 text-rose-500" />
              <span>Interação Direta</span>
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
            <span>Siga no Instagram</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <p className="text-[11px] text-muted-foreground font-sans text-center">
            @manifesto_espro • Conteúdo diário e transformador
          </p>
        </div>

      </div>
    </section>
  );
}
