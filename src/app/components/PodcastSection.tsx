import { useState } from 'react';
import { Play, Youtube, Mic, Clock, ExternalLink, Radio, Sparkles } from 'lucide-react';

interface Episode {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  duration: string;
  date: string;
  episodeNumber: number;
  tags: string[];
}

const PODCAST_EPISODES: Episode[] = [
  {
    id: 'ep-1',
    youtubeId: 'L_LUpnjgPso', // Example video ID
    title: 'O Futuro da Educação e Tecnologias Emergentes',
    description: 'Neste episódio de estreia do Podcast Manifesto, debatemos o impacto da inteligência artificial e novas tecnologias na formação dos jovens e no mercado de trabalho.',
    duration: '42 min',
    date: '28 de Julho',
    episodeNumber: 1,
    tags: ['Educação', 'Tecnologia', 'Futuro']
  },
  {
    id: 'ep-2',
    youtubeId: '3JZ_D3ELwOQ', // Example video ID
    title: 'Cultura Periférica e Democracia do Saber',
    description: 'Uma conversa enriquecedora sobre como a arte, a literatura e a expressão cultural das periferias transformam realidades e fortalecem o pensamento crítico.',
    duration: '38 min',
    date: '21 de Julho',
    episodeNumber: 2,
    tags: ['Cultura', 'Sociedade', 'Democracia']
  },
  {
    id: 'ep-3',
    youtubeId: 'fJ9rUzIMcZQ', // Example video ID
    title: 'Primeiro Emprego e Desafios da Juventude',
    description: 'Dicas práticas, orientações de carreira e depoimentos sobre como enfrentar o mercado de trabalho com autonomia e pensamento estratégico.',
    duration: '45 min',
    date: '14 de Julho',
    episodeNumber: 3,
    tags: ['Carreira', 'Trabalho', 'Juventude']
  },
  {
    id: 'ep-4',
    youtubeId: 'tgbNymZ7vqY', // Example video ID
    title: 'Comunicação Digital e Fake News no Século XXI',
    description: 'Como analisar criticamente as notícias na era da informação rápida e construir uma postura consciente nas redes sociais.',
    duration: '35 min',
    date: '07 de Julho',
    episodeNumber: 4,
    tags: ['Mídia', 'Informação', 'Crítica']
  }
];

export function PodcastSection() {
  const [selectedEpisode, setSelectedEpisode] = useState<Episode>(PODCAST_EPISODES[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSelectEpisode = (ep: Episode) => {
    setSelectedEpisode(ep);
    setIsPlaying(true); // Enable autoplay when user explicitly selects an episode
  };

  const channelUrl = 'https://www.youtube.com/@jornalmanifesto'; // Company YouTube Channel

  return (
    <section className="mb-12 bg-card rounded-2xl p-6 md:p-8 border border-border shadow-md transition-all duration-300">
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-display font-bold text-foreground tracking-tight">
                Podcast <span className="text-primary">Manifesto</span>
              </h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-md border border-red-500/20">
                <Radio className="w-3 h-3 animate-pulse text-red-500" />
                No YouTube
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-sans mt-0.5">
              Assista ou ouça nossos episódios direto pelo site
            </p>
          </div>
        </div>

        <a
          href={channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs transition-all cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <Youtube className="w-4 h-4" />
          <span>Canal no YouTube</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>
      </div>

      {/* Main Grid: Player (Iframe) + Episode List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col (Iframe & Current Episode Info): 7 cols */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          
          {/* Manipulated YouTube Iframe */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-border shadow-lg group">
            <iframe
              key={selectedEpisode.id}
              src={`https://www.youtube-nocookie.com/embed/${selectedEpisode.youtubeId}?autoplay=${isPlaying ? 1 : 0}&rel=0&modestbranding=1`}
              title={selectedEpisode.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>

          {/* Current Video Metadata */}
          <div className="bg-secondary/40 p-5 rounded-xl border border-border/50 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <span className="font-bold text-primary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                Episódio #{selectedEpisode.episodeNumber}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {selectedEpisode.duration} • {selectedEpisode.date}
              </span>
            </div>

            <h3 className="font-display font-bold text-lg text-foreground leading-snug">
              {selectedEpisode.title}
            </h3>

            <p className="text-xs text-muted-foreground font-sans leading-relaxed">
              {selectedEpisode.description}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {selectedEpisode.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-semibold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col (Playlist / Episodes Picker): 5 cols */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          <h3 className="text-sm font-bold text-foreground font-display uppercase tracking-wider flex items-center justify-between">
            <span>Todos os Episódios</span>
            <span className="text-xs text-muted-foreground font-sans font-normal">
              {PODCAST_EPISODES.length} disponíveis
            </span>
          </h3>

          <div className="flex-1 overflow-y-auto max-h-[460px] space-y-2.5 pr-1 scrollbar-thin scrollbar-thumb-border">
            {PODCAST_EPISODES.map((ep) => {
              const isSelected = selectedEpisode.id === ep.id;

              return (
                <div
                  key={ep.id}
                  onClick={() => handleSelectEpisode(ep)}
                  className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3 group ${
                    isSelected
                      ? 'bg-primary/10 border-primary shadow-sm'
                      : 'bg-card hover:bg-secondary/60 border-border hover:border-primary/40'
                  }`}
                >
                  {/* Thumbnail / Play Icon */}
                  <div className="relative flex-shrink-0 w-24 aspect-video rounded-lg overflow-hidden bg-muted border border-border group-hover:scale-102 transition-transform">
                    <img
                      src={`https://img.youtube.com/vi/${ep.youtubeId}/hqdefault.jpg`}
                      alt={ep.title}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                      isSelected ? 'bg-primary/40 opacity-100' : 'bg-black/40 group-hover:opacity-100 opacity-70'
                    }`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-white/90 text-black'
                      }`}>
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Episode details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1 text-[10px] text-muted-foreground font-semibold">
                      <span className={isSelected ? 'text-primary font-bold' : ''}>
                        EP #{ep.episodeNumber}
                      </span>
                      <span>{ep.duration}</span>
                    </div>

                    <h4 className={`text-xs font-bold font-sans line-clamp-2 leading-snug transition-colors ${
                      isSelected ? 'text-primary' : 'text-foreground group-hover:text-primary'
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
          </div>
        </div>

      </div>

    </section>
  );
}
