import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ScrapbookFlag } from '../components/ScrapbookFlag';
import { AnimatedIcon } from '../components/AnimatedIcon';

const ConnectorOitavasToQuartas = () => (
  <div className="w-10 self-stretch relative text-[#00a859]/30">
    <div className="absolute top-[50px] bottom-[50px] left-0 right-1/2 border-y-2 border-r-2 border-current rounded-r-lg" />
    <div className="absolute top-1/2 -translate-y-1/2 left-1/2 right-0 border-t-2 border-current" />
  </div>
);

const ConnectorQuartasToSemis = () => (
  <div className="w-10 self-stretch relative text-[#00a859]/30">
    <div className="absolute top-[104px] bottom-[104px] left-0 right-1/2 border-y-2 border-r-2 border-current rounded-r-lg" />
    <div className="absolute top-1/2 -translate-y-1/2 left-1/2 right-0 border-t-2 border-current" />
  </div>
);

const ConnectorSemisToFinal = () => (
  <div className="w-10 self-stretch relative text-[#00a859]/30">
    <div className="absolute top-[216px] bottom-[216px] left-0 right-1/2 border-y-2 border-r-2 border-current rounded-r-lg" />
    <div className="absolute top-1/2 -translate-y-1/2 left-1/2 right-0 border-t-2 border-current" />
  </div>
);

interface DisplayMatch {
  id: string;
  round: 'oitavas' | 'quartas' | 'semis' | 'final';
  team1: string;
  team2: string;
  flag1: string;
  flag2: string;
  score1?: number;
  score2?: number;
  dateOrTime: string;
  isLive?: boolean;
  liveMin?: number;
  winner?: 1 | 2;
}

export function CupSchedule() {
  const navigate = useNavigate();
  const [liveScore, setLiveScore] = useState({ s1: 2, s2: 0, min: 72 });

  useEffect(() => {
    const syncScores = () => {
      const stored = sessionStorage.getItem('cup_matches');
      if (stored) {
        const matches = JSON.parse(stored);
        const live = matches.find((m: any) => m.isLive);
        if (live) {
          setLiveScore({
            s1: live.score1 ?? 2,
            s2: live.score2 ?? 0,
            min: live.liveMin ?? 72
          });
        }
      }
    };

    syncScores();
    window.addEventListener('cup-matches-update', syncScores);
    return () => window.removeEventListener('cup-matches-update', syncScores);
  }, []);

  // Set up matches list. Some matches are pre-populated, the live one uses state.
  const oitavas: DisplayMatch[] = [
    { id: 'O1', round: 'oitavas', team1: 'Brasil', team2: 'Noruega', flag1: '🇧🇷', flag2: '🇳🇴', dateOrTime: '05/07 · 17:00' },
    { id: 'O2', round: 'oitavas', team1: 'México', team2: 'Equador', flag1: '🇲🇽', flag2: '🇪🇨', score1: liveScore.s1, score2: liveScore.s2, dateOrTime: '30/06', isLive: true, liveMin: liveScore.min },
    { id: 'O3', round: 'oitavas', team1: 'Inglaterra', team2: 'RD Congo', flag1: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', flag2: '🇨🇩', dateOrTime: '30/06 · 13:00' },
    { id: 'O4', round: 'oitavas', team1: 'Bélgica', team2: 'Senegal', flag1: '🇧🇪', flag2: '🇸🇳', dateOrTime: '30/06 · 17:00' },
    { id: 'O5', round: 'oitavas', team1: 'Estados Unidos', team2: 'Bósnia', flag1: '🇺🇸', flag2: '🇧🇦', dateOrTime: '30/06 · 21:00' },
    { id: 'O6', round: 'oitavas', team1: 'Espanha', team2: 'Áustria', flag1: '🇪🇸', flag2: '🇦🇹', dateOrTime: '02/07 · 16:00' },
    { id: 'O7', round: 'oitavas', team1: 'Portugal', team2: 'Croácia', flag1: '🇵🇹', flag2: '🇭🇷', dateOrTime: '02/07 · 20:00' },
    { id: 'O8', round: 'oitavas', team1: 'França', team2: 'Japão', flag1: '🇫🇷', flag2: '🇯🇵', score1: 3, score2: 1, dateOrTime: '29/06 (Final)', winner: 1 }
  ];

  const quartas: DisplayMatch[] = [
    { id: 'Q1', round: 'quartas', team1: 'Brasil', team2: 'México', flag1: '🇧🇷', flag2: '🇲🇽', dateOrTime: '09/07 · 13:00' },
    { id: 'Q2', round: 'quartas', team1: 'Inglaterra', team2: 'Bélgica', flag1: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', flag2: '🇧🇪', dateOrTime: '09/07 · 17:00' },
    { id: 'Q3', round: 'quartas', team1: 'Estados Unidos', team2: 'Espanha', flag1: '🇺🇸', flag2: '🇪🇸', dateOrTime: '10/07 · 13:00' },
    { id: 'Q4', round: 'quartas', team1: 'Portugal', team2: 'França', flag1: '🇵🇹', flag2: '🇫🇷', dateOrTime: '10/07 · 17:00' }
  ];

  const semis: DisplayMatch[] = [
    { id: 'S1', round: 'semis', team1: 'Brasil', team2: 'Inglaterra', flag1: '🇧🇷', flag2: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', dateOrTime: '14/07 · 17:00' },
    { id: 'S2', round: 'semis', team1: 'Espanha', team2: 'França', flag1: '🇪🇸', flag2: '🇫🇷', dateOrTime: '15/07 · 17:00' }
  ];

  const final: DisplayMatch = {
    id: 'F1', round: 'final', team1: 'Brasil', team2: 'França', flag1: '🇧🇷', flag2: '🇫🇷', dateOrTime: '19/07 · 16:00'
  };

  const MatchCard = ({ match }: { match: DisplayMatch }) => {
    return (
      <div className={`p-3 rounded-xl border bg-card/75 text-left w-full flex flex-col justify-between h-[100px] transition-all duration-200 shadow-sm relative ${
        match.isLive
          ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.15)] ring-1 ring-red-500/50'
          : 'border-border hover:border-primary/40'
      }`}>
        {/* Card Header */}
        <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground">
          <span>{match.dateOrTime}</span>
          {match.isLive && (
            <span className="bg-red-600 text-white font-extrabold px-1.5 py-0.5 rounded text-[8px] animate-pulse flex items-center gap-1">
              <AnimatedIcon icon="clock" size={10} colors="primary:#ffffff,secondary:#ffffff" />
              AO VIVO {match.liveMin}'
            </span>
          )}
        </div>

        {/* Card Teams */}
        <div className="space-y-1 my-1">
          <div className={`flex items-center justify-between text-xs ${match.winner === 1 ? 'font-bold text-foreground' : 'text-foreground/80'}`}>
            <span className="flex items-center gap-1.5 truncate">
              <ScrapbookFlag flag={match.flag1} />
              <span className="truncate">{match.team1}</span>
            </span>
            {match.score1 !== undefined && (
              <span className="font-extrabold pr-0.5">{match.score1}</span>
            )}
          </div>
          <div className={`flex items-center justify-between text-xs ${match.winner === 2 ? 'font-bold text-foreground' : 'text-foreground/80'}`}>
            <span className="flex items-center gap-1.5 truncate">
              <ScrapbookFlag flag={match.flag2} />
              <span className="truncate">{match.team2}</span>
            </span>
            {match.score2 !== undefined && (
              <span className="font-extrabold pr-0.5">{match.score2}</span>
            )}
          </div>
        </div>

        {/* Card Footer Code/Label */}
        <div className="text-[8px] font-bold text-[#00a859] tracking-wider select-none uppercase">
          Jogo {match.id}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      <Header />

      <main className="flex-1 pt-28 pb-20 md:pb-12 px-4 max-w-7xl mx-auto w-full">
        {/* Navigation & Title Row */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/feed')}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors self-start border border-border"
          >
            <AnimatedIcon icon="arrowLeft" size={16} />
            <span>Voltar para o Feed</span>
          </Button>

          <div className="text-right sm:text-right">
            <h1 className="text-2xl md:text-3xl font-display font-black text-[#00a859] leading-tight">
              Mata-Mata Copa do Mundo FIFA™
            </h1>
            <p className="text-xs text-muted-foreground">
              Acompanhe o chaveamento dos jogos em tempo real até a grande final.
            </p>
          </div>
        </div>

        {/* Tournament Bracket Diagram */}
        <div className="bg-card/40 rounded-2xl border border-border p-6 shadow-md overflow-x-auto min-h-[580px]">
          <div className="flex flex-col min-w-[1120px] w-full py-4 select-none">
            
            {/* Headers Row */}
            <div className="flex gap-0 w-full mb-6 font-display font-extrabold text-[#00a859] text-xs uppercase tracking-wider text-center">
              <div className="w-60 py-1.5 bg-secondary rounded-lg border border-border">Oitavas de Final</div>
              <div className="w-10"></div>
              <div className="w-60 py-1.5 bg-secondary rounded-lg border border-border">Quartas de Final</div>
              <div className="w-10"></div>
              <div className="w-60 py-1.5 bg-secondary rounded-lg border border-border">Semifinais</div>
              <div className="w-10"></div>
              <div className="w-60 py-1.5 bg-[#00a859] text-white rounded-lg border border-[#00a859] shadow-sm flex items-center justify-center gap-1.5">
                <AnimatedIcon icon="sparkles" size={14} colors="primary:#ffffff,secondary:#ffffff" />
                Grande Final
              </div>
            </div>

            {/* Tree Row */}
            <div className="flex gap-0 w-full items-center">
              {/* Upper Half and Lower Half wrapper */}
              <div className="flex flex-col gap-6">
                
                {/* Upper Half (contains Q1 and Q2) */}
                <div className="flex items-center">
                  <div className="flex flex-col gap-4">
                    {/* Q1 group */}
                    <div className="flex items-center">
                      <div className="flex flex-col gap-2 w-60">
                        <MatchCard match={oitavas[0]} />
                        <MatchCard match={oitavas[1]} />
                      </div>
                      <ConnectorOitavasToQuartas />
                      <div className="w-60">
                        <MatchCard match={quartas[0]} />
                      </div>
                    </div>
                    
                    {/* Q2 group */}
                    <div className="flex items-center">
                      <div className="flex flex-col gap-2 w-60">
                        <MatchCard match={oitavas[2]} />
                        <MatchCard match={oitavas[3]} />
                      </div>
                      <ConnectorOitavasToQuartas />
                      <div className="w-60">
                        <MatchCard match={quartas[1]} />
                      </div>
                    </div>
                  </div>
                  
                  <ConnectorQuartasToSemis />
                  
                  <div className="w-60">
                    <MatchCard match={semis[0]} />
                  </div>
                </div>

                {/* Lower Half (contains Q3 and Q4) */}
                <div className="flex items-center">
                  <div className="flex flex-col gap-4">
                    {/* Q3 group */}
                    <div className="flex items-center">
                      <div className="flex flex-col gap-2 w-60">
                        <MatchCard match={oitavas[4]} />
                        <MatchCard match={oitavas[5]} />
                      </div>
                      <ConnectorOitavasToQuartas />
                      <div className="w-60">
                        <MatchCard match={quartas[2]} />
                      </div>
                    </div>
                    
                    {/* Q4 group */}
                    <div className="flex items-center">
                      <div className="flex flex-col gap-2 w-60">
                        <MatchCard match={oitavas[6]} />
                        <MatchCard match={oitavas[7]} />
                      </div>
                      <ConnectorOitavasToQuartas />
                      <div className="w-60">
                        <MatchCard match={quartas[3]} />
                      </div>
                    </div>
                  </div>
                  
                  <ConnectorQuartasToSemis />
                  
                  <div className="w-60">
                    <MatchCard match={semis[1]} />
                  </div>
                </div>
              </div>
              
              <ConnectorSemisToFinal />
              
              <div className="flex flex-col justify-center gap-12 w-60">
                <MatchCard match={final} />
                
                {/* Champion Podium Box */}
                <div className="border border-dashed border-[#ffcc00] bg-amber-500/5 rounded-xl p-4 flex flex-col items-center justify-center gap-2 h-[120px] shadow-sm">
                  <AnimatedIcon icon="award" size={32} colors="primary:#ffcc00,secondary:#ffcc00" className="animate-bounce" />
                  <div className="text-center">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Campeão FIFA™</div>
                    <div className="font-display font-black text-[#ffcc00] text-sm tracking-wide flex items-center justify-center gap-1.5 mt-1 select-none">
                      <ScrapbookFlag flag="🇧🇷" />
                      <span>Brasil</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
