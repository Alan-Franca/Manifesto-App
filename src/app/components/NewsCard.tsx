import React from 'react';
import { Clock, Tag } from 'lucide-react';

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
    <article className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow cursor-pointer">
      {image && (
        <div className="w-full h-48 bg-muted overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
            <Tag className="w-3 h-3" />
            {category}
          </span>
          {isPremium && (
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 rounded text-xs">
              Premium
            </span>
          )}
        </div>

        <h3 className="mb-2 line-clamp-2">{title}</h3>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {summary}
        </p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {readTime}
          </span>
          <span>{date}</span>
        </div>
      </div>
    </article>
  );
}
