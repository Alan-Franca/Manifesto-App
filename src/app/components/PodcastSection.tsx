import { useState } from 'react';
import { Play, Youtube, Mic, Clock, ExternalLink, Radio, Sparkles, Calendar, Bell } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import ep1Thumbnail from '../../imports/podcast-ep1-thumbnail.png';

interface Episode {
  id: string;
  youtubeId?: string;
  thumbnailUrl?: string;
  title: string;
  description: string;
  duration: string;
  date: string;
  episodeNumber: number;
  tags: string[];
  isPremiere?: boolean;
  premiereDate?: string;
  premiereTime?: string;
  videoUrl?: string;
}

const CHANNEL_URL = 'https://www.youtube.com/@JornalManifesto';

const PODCAST_EPISODES: Episode[] = [
  {
    id: 'ep-1',
    youtubeId: '',
    thumbnailUrl: ep1Thumbnail,
    title: 'Desvio De Rota! — Episódio 01, Nathalia Brasil',
    description: 'Neste episódio imperdível de estreia do Podcast Manifesto, Nathalia Brasil comanda o papo no "Desvio De Rota!". Uma conversa instigante sobre caminhos da juventude, escolhas e visões de mundo. Estreia oficial dia 15 de Agosto às 19:00!',
    duration: 'Estreia 15/08 às 19h',
    date: '15/08 às 19:00',
    episodeNumber: 1,
    tags: ['Desvio De Rota', 'Nathalia Brasil', 'Estreia', 'Podcast Manifesto'],
    isPremiere: true,
    premiereDate: '15/08',
    premiereTime: '19:00',
    videoUrl: CHANNEL_URL
  }
];

export function PodcastSection() {
  const { t } = useLanguage();
  const [selectedEpisode, setSelectedEpisode] = useState<Episode>(PODCAST_EPISODES[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSelectEpisode = (ep: Episode) => {
    setSelectedEpisode(ep);
    setIsPlaying(false);
  };

  return (
    <section className="mb-12 bg-card rounded-2xl p-6 md:p-8 border border-border shadow-md transition-all duration-300">

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-500/20 shadow-sm">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl md:text-2xl font-display font-bold text-foreground tracking-tight">
                {t('podcast.title_start')}<span className="text-primary">{t('podcast.title_end')}</span>
              </h2>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-400 px-2.5 py-1 rounded-md border border-red-500/20">
                <Radio className="w-3.5 h-3.5 animate-pulse text-red-500" />
                {t('podcast.youtube_badge')}
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-sans mt-0.5">
              Assista no nosso canal oficial do YouTube <strong className="text-foreground">@JornalManifesto</strong>
            </p>
          </div>
        </div>

        {/* Channel Direct Link Button */}
        <a
          href={CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs transition-all cursor-pointer shadow-md hover:shadow-lg self-start sm:self-auto group"
        >
          <Youtube className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Visitar Canal @JornalManifesto</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>
      </div>

      {/* Main Grid: Visualizer Player + Episode Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Col: Main Visualizer Player (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">

          {/* Main Visualizer Container */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-border shadow-xl group">

            {isPlaying && selectedEpisode.youtubeId ? (
              <iframe
                key={selectedEpisode.id}
                src={`https://www.youtube-nocookie.com/embed/${selectedEpisode.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={selectedEpisode.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              /* Custom Visualizer Banner with Thumbnail Cover */
              <div className="relative w-full h-full bg-gradient-to-t from-black/90 via-black/30 to-black/40 flex flex-col justify-between p-4 sm:p-6">

                {/* Background Thumbnail Image */}
                <img
                  src={selectedEpisode.thumbnailUrl || `https://img.youtube.com/vi/${selectedEpisode.youtubeId}/hqdefault.jpg`}
                  alt={selectedEpisode.title}
                  className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-95 group-hover:scale-105 transition-transform duration-500"
                />

                {/* Gradient Overlays for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 z-10 pointer-events-none" />

                {/* Top Badge: Channel link */}
                <div className="relative z-20 flex items-center justify-end gap-2">
                  <a
                    href={CHANNEL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-white/90 bg-black/50 hover:bg-red-600/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 transition-all font-medium"
                  >
                    <Youtube className="w-3.5 h-3.5 text-red-500 group-hover:text-white" />
                    <span className="hidden sm:inline">@JornalManifesto</span>
                  </a>
                </div>

                {/* Bottom Details Overlay inside Visualizer */}
                <div className="relative z-20 space-y-1">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {selectedEpisode.isPremiere ? 'Grande Estreia do Episódio 01' : `Episódio #${selectedEpisode.episodeNumber}`}
                  </span>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-white line-clamp-1 drop-shadow-md">
                    {selectedEpisode.title}
                  </h3>
                </div>

              </div>
            )}
          </div>

          {/* Current Video Info Card */}
          <div className="bg-secondary/40 p-5 rounded-xl border border-border/50 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <span className="font-bold text-primary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                Episódio #{selectedEpisode.episodeNumber}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-foreground">
                <Clock className="w-3.5 h-3.5 text-red-500" />
                {selectedEpisode.date}
              </span>
            </div>

            <h3 className="font-display font-bold text-lg text-foreground leading-snug">
              {selectedEpisode.title}
            </h3>

            <p className="text-xs text-muted-foreground font-sans leading-relaxed">
              {selectedEpisode.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap gap-1.5">
                {selectedEpisode.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-semibold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <a
                href={CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400 hover:underline"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Ativar lembrete no YouTube</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

        {/* Right Col: Single Episode Highlight / Playlist (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          <h3 className="text-sm font-bold text-foreground font-display uppercase tracking-wider flex items-center justify-between">
            <span>{t('podcast.all_episodes')}</span>
            <span className="text-xs text-muted-foreground font-sans font-normal">
              1 de 1 episódio
            </span>
          </h3>

          <div className="space-y-3">
            {PODCAST_EPISODES.map((ep) => {
              const isSelected = selectedEpisode.id === ep.id;

              return (
                <div
                  key={ep.id}
                  onClick={() => handleSelectEpisode(ep)}
                  className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3 group ${isSelected
                      ? 'bg-primary/10 border-primary shadow-sm'
                      : 'bg-card hover:bg-secondary/60 border-border hover:border-primary/40'
                    }`}
                >
                  {/* Thumbnail Preview */}
                  <div className="relative flex-shrink-0 w-28 aspect-video rounded-lg overflow-hidden bg-muted border border-border group-hover:scale-102 transition-transform">
                    <img
                      src={ep.thumbnailUrl || `https://img.youtube.com/vi/${ep.youtubeId}/hqdefault.jpg`}
                      alt={ep.title}
                      className="w-full h-full object-cover"
                    />
                    {ep.isPremiere && (
                      <div className="absolute top-1 left-1 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                        ESTREIA
                      </div>
                    )}
                  </div>

                  {/* Episode details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1 text-[10px] text-muted-foreground font-semibold">
                      <span className={isSelected ? 'text-primary font-bold' : ''}>
                        EP #{ep.episodeNumber}
                      </span>
                      <span className={ep.isPremiere ? 'text-red-500 font-bold' : ''}>{ep.duration}</span>
                    </div>

                    <h4 className={`text-xs font-bold font-sans line-clamp-2 leading-snug transition-colors ${isSelected ? 'text-primary' : 'text-foreground group-hover:text-primary'
                      }`}>
                      {ep.title}
                    </h4>

                    <p className="text-[10px] text-muted-foreground line-clamp-1 mt-1 font-sans">
                      {ep.date}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Teaser Box for Future Episodes */}
            <div className="p-4 rounded-xl border border-dashed border-border bg-muted/20 text-center space-y-1 mt-4">
              <p className="text-[11px] text-muted-foreground/80">
                Inscreva-se no canal <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="text-red-500 font-bold hover:underline">@JornalManifesto</a> para não perder os próximos lançamentos!
              </p>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}

