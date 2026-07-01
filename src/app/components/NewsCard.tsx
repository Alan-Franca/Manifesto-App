import { ScrapbookSticker } from './ScrapbookSticker';
import { AnimatedIcon } from './AnimatedIcon';

interface NewsCardProps {
  title: string;
  summary: string;
  category: string;
  image?: string;
  readTime: string;
  date: string;
  isPremium?: boolean;
}

export function NewsCard({ title, summary, category, image, readTime, date, isPremium }: NewsCardProps) {
  return (
    <article className={`bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-primary/40 transition-all duration-300 cursor-pointer flex flex-col h-full ${
      isPremium ? 'border-t-4 border-t-amber-500' : 'border-t-4 border-t-primary'
    }`}>
      {image && (
        <div className="w-full h-48 bg-muted overflow-hidden relative group">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" 
          />
          {isPremium && (
            <div className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded flex items-center gap-1 shadow-md">
              <AnimatedIcon icon="sparkles" size={12} colors="primary:#ffffff,secondary:#ffffff" />
              Premium
            </div>
          )}
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-bold font-sans uppercase tracking-widest text-accent flex items-center gap-1.5 select-none">
            <AnimatedIcon icon="tag" size={14} colors="primary:#540B0E,secondary:#540B0E" />
            {category.replace(/[\uD800-\uDFFF\u2600-\u27BF]/g, '').trim()}
          </span>
          <ScrapbookSticker category={category} size="sm" hasTape={false} />
        </div>

        <h3 className="font-display text-xl font-bold text-foreground leading-snug mb-3 line-clamp-2 hover:text-primary transition-colors duration-200">
          {title}
        </h3>

        <p className="text-muted-foreground text-sm font-sans leading-relaxed mb-4 line-clamp-3 flex-1">
          {summary}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border/60 text-xs text-muted-foreground mt-auto">
          <span className="flex items-center gap-1 font-medium">
            <AnimatedIcon icon="clock" size={14} />
            {readTime}
          </span>
          <span className="font-medium">{date}</span>
        </div>
      </div>
    </article>
  );
}
