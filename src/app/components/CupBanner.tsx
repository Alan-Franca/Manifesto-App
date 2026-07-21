import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { ScrapbookFlag } from './ScrapbookFlag';

interface Match {
  id: string;
  time?: string;
  date?: string;
  team1: string;
  team2: string;
  flag1: string;
  flag2: string;
  score1?: number;
  score2?: number;
  isLive?: boolean;
  liveMin?: number;
  phase: string;
  activeBorder?: boolean;
  hasArrow?: boolean;
}

export function CupBanner() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [matches, setMatches] = useState<Match[]>([]);

  // Initialize and listen to match updates
  useEffect(() => {
    // Check if match data exists in sessionStorage, if not initialize
    const getInitialMatches = (): Match[] => {
      const stored = sessionStorage.getItem('cup_matches');
      if (stored) {
        return JSON.parse(stored);
      }

      const initial: Match[] = [
        {
          id: '1',
          date: '05/07',
          time: '17:00',
          team1: 'Brasil',
          team2: 'Noruega',
          flag1: '🇧🇷',
          flag2: '🇳🇴',
          phase: 'Oitavas De Final',
          activeBorder: true,
          hasArrow: true,
        },
        {
          id: '2',
          date: '30/06',
          team1: 'México',
          team2: 'Equador',
          flag1: '🇲🇽',
          flag2: '🇪🇨',
          score1: 2,
          score2: 0,
          isLive: true,
          liveMin: 72,
          phase: 'Segunda Fase',
        },
        {
          id: '3',
          time: '13:00',
          team1: 'Inglaterra',
          team2: 'RD Congo',
          flag1: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
          flag2: '🇨🇩',
          phase: 'Segunda Fase',
          hasArrow: true,
        },
        {
          id: '4',
          time: '17:00',
          team1: 'Bélgica',
          team2: 'Senegal',
          flag1: '🇧🇪',
          flag2: '🇸🇳',
          phase: 'Segunda Fase',
          hasArrow: true,
        },
        {
          id: '5',
          time: '21:00',
          team1: 'Estados Unidos',
          team2: 'Bósnia',
          flag1: '🇺🇸',
          flag2: '🇧🇦',
          phase: 'Segunda Fase',
          hasArrow: true,
        },
        {
          id: '6',
          date: '02/07',
          time: '16:00',
          team1: 'Espanha',
          team2: 'Áustria',
          flag1: '🇪🇸',
          flag2: '🇦🇹',
          phase: 'Segunda Fase',
          hasArrow: true,
        },
        {
          id: '7',
          date: '02/07',
          time: '20:00',
          team1: 'Portugal',
          team2: 'Croácia',
          flag1: '🇵🇹',
          flag2: '🇭🇷',
          phase: 'Segunda Fase',
          hasArrow: true,
        }
      ];
      sessionStorage.setItem('cup_matches', JSON.stringify(initial));
      return initial;
    };

    setMatches(getInitialMatches());

    // Listen to changes from other components
    const handleStorageUpdate = (_e: Event) => {
      const stored = sessionStorage.getItem('cup_matches');
      if (stored) {
        setMatches(JSON.parse(stored));
      }
    };

    window.addEventListener('cup-matches-update', handleStorageUpdate);
    return () => {
      window.removeEventListener('cup-matches-update', handleStorageUpdate);
    };
  }, []);

  // Simulate real-time updates for the live match
  useEffect(() => {
    if (matches.length === 0) return;

    const interval = setInterval(() => {
      setMatches(prevMatches => {
        const updated = prevMatches.map(m => {
          if (m.isLive) {
            const nextMin = (m.liveMin || 72) >= 90 ? 90 : (m.liveMin || 72) + 1;
            
            // Randomly score a goal (2% chance for team1, 1% chance for team2 per tick)
            let s1 = m.score1 ?? 2;
            let s2 = m.score2 ?? 0;
            
            if (nextMin < 90) {
              const rand = Math.random();
              if (rand < 0.02) {
                s1 += 1;
              } else if (rand < 0.03) {
                s2 += 1;
              }
            }

            return {
              ...m,
              liveMin: nextMin,
              score1: s1,
              score2: s2
            };
          }
          return m;
        });

        sessionStorage.setItem('cup_matches', JSON.stringify(updated));
        // Dispatch event for other components (like CupSchedule)
        window.dispatchEvent(new Event('cup-matches-update'));
        return updated;
      });
    }, 4000); // Update every 4 seconds for a dynamic feel

    return () => clearInterval(interval);
  }, [matches.length]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollAmount = 260;
      const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const triggerConfetti = () => {
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // Green and Yellow confetti
      confetti(Object.assign({}, defaults, { 
        particleCount, 
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#00a859', '#ffcc00']
      }));
      confetti(Object.assign({}, defaults, { 
        particleCount, 
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#00a859', '#ffcc00']
      }));
    }, 250);
  };

  return (
    <section className="mb-10 bg-card rounded-2xl p-5 border border-border shadow-md transition-colors duration-300">
      {/* Title and Buttons Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-border/50">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-display font-extrabold text-[#00a859] tracking-tight">
            Agenda Copa do Mundo FIFA™
          </h2>
          <button
            onClick={() => navigate('/copa')}
            className="px-4 py-1.5 border border-[#00a859] text-[#00a859] hover:bg-[#00a859]/10 active:scale-95 transition-all text-xs font-bold rounded-lg cursor-pointer bg-transparent"
          >
            Ver agenda completa
          </button>
        </div>
        <button
          onClick={triggerConfetti}
          className="self-start sm:self-auto px-4 py-2 bg-[#00a859] hover:bg-[#00934d] active:scale-95 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <span>🇧🇷</span> Vai, Brasil!
        </button>
      </div>

      {/* Carrossel Slider Container */}
      <div className="relative group">
        {/* Scroll Buttons */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-3 z-10 w-8 h-8 rounded-full bg-background border border-border shadow-md flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors cursor-pointer text-[#00a859]"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: 'none' }}
        >
          {matches.map((match) => (
            <div
              key={match.id}
              className={`flex-shrink-0 w-[240px] p-4 rounded-xl border bg-card/60 flex flex-col justify-between h-[120px] transition-all duration-300 ${
                match.activeBorder
                  ? 'border-[#ffcc00] shadow-[0_0_10px_rgba(255,204,0,0.15)] ring-1 ring-[#ffcc00]/50'
                  : 'border-border hover:border-primary/40'
              }`}
            >
              {/* Header: Time/Date & Label/Badge */}
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground select-none">
                <span className="flex items-center gap-1">
                  {match.date ? `${match.date}` : ''}
                  {match.time ? ` · ${match.time}` : ''}
                  {match.hasArrow && <span className="text-[#00a859] font-bold">➔</span>}
                </span>

                {match.isLive ? (
                  <span className="flex items-center gap-1 bg-red-600 text-white font-bold px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider animate-pulse shadow-sm">
                    AO VIVO {match.liveMin}'
                  </span>
                ) : null}
              </div>

              {/* Body: Teams & Scores */}
              <div className="space-y-1.5 my-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-semibold text-foreground">
                    <ScrapbookFlag flag={match.flag1} />
                    <span>{match.team1}</span>
                  </span>
                  {match.score1 !== undefined && (
                    <span className="font-extrabold text-foreground text-base pr-1">{match.score1}</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-semibold text-foreground">
                    <ScrapbookFlag flag={match.flag2} />
                    <span>{match.team2}</span>
                  </span>
                  {match.score2 !== undefined && (
                    <span className="font-extrabold text-foreground text-base pr-1">{match.score2}</span>
                  )}
                </div>
              </div>

              {/* Footer: Phase Name */}
              <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider border-t border-border/40 pt-1.5 select-none">
                {match.phase}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-3 z-10 w-8 h-8 rounded-full bg-background border border-border shadow-md flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors cursor-pointer text-[#00a859]"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </section>
  );
}
