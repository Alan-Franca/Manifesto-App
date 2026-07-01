import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ScrapbookFlag } from '../components/ScrapbookFlag';
import { AnimatedIcon } from '../components/AnimatedIcon';

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
    { id: 'O3', round: 'oitavas', team1: 'Inglaterra', team2: 'RD Congo', flag1: '🏴󠁧󠁢󠁥󠁮ッグ󠁿', flag2: '🇨🇩', dateOrTime: '30/06 · 13:00' },
    { id: 'O4', round: 'oitavas', team1: 'Bélgica', team2: 'Senegal', flag1: '🇧🇪', flag2: '🇸🇳', dateOrTime: '30/06 · 17:00' },
    { id: 'O5', round: 'oitavas', team1: 'Estados Unidos', team2: 'Bósnia', flag1: '🇺🇸', flag2: '🇧🇦', dateOrTime: '30/06 · 21:00' },
    { id: 'O6', round: 'oitavas', team1: 'Espanha', team2: 'Áustria', flag1: '🇪🇸', flag2: '🇦🇹', dateOrTime: '02/07 · 16:00' },
    { id: 'O7', round: 'oitavas', team1: 'Portugal', team2: 'Croácia', flag1: '🇵🇹', flag2: '🇭🇷', dateOrTime: '02/07 · 20:00' },
    { id: 'O8', round: 'oitavas', team1: 'França', team2: 'Japão', flag1: '🇫🇷', flag2: '🇯🇵', score1: 3, score2: 1, dateOrTime: '29/06 (Final)', winner: 1 }
  ];

  const quartas: DisplayMatch[] = [
    { id: 'Q1', round: 'quartas', team1: 'Vencedor Oitavas 1', team2: 'Vencedor Oitavas 2', flag1: '❓', flag2: '❓', dateOrTime: '09/07 · 13:00' },
    { id: 'Q2', round: 'quartas', team1: 'Vencedor Oitavas 3', team2: 'Vencedor Oitavas 4', flag1: '❓', flag2: '❓', dateOrTime: '09/07 · 17:00' },
    { id: 'Q3', round: 'quartas', team1: 'Vencedor Oitavas 5', team2: 'Vencedor Oitavas 6', flag1: '❓', flag2: '❓', dateOrTime: '10/07 · 13:00' },
    { id: 'Q4', round: 'quartas', team1: 'Vencedor Oitavas 7', team2: 'França', flag1: '❓', flag2: '🇫🇷', dateOrTime: '10/07 · 17:00' }
  ];

  const semis: DisplayMatch[] = [
    { id: 'S1', round: 'semis', team1: 'Vencedor Quartas 1', team2: 'Vencedor Quartas 2', flag1: '❓', flag2: '❓', dateOrTime: '14/07 · 17:00' },
    { id: 'S2', round: 'semis', team1: 'Vencedor Quartas 3', team2: 'Vencedor Quartas 4', flag1: '❓', flag2: '❓', dateOrTime: '15/07 · 17:00' }
  ];

  const final: DisplayMatch = {
    id: 'F1', round: 'final', team1: 'Vencedor Semifinal 1', team2: 'Vencedor Semifinal 2', flag1: '❓', flag2: '❓', dateOrTime: '19/07 · 16:00'
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
        <div className="bg-card/40 rounded-2xl border border-border p-6 shadow-md overflow-x-auto min-h-[580px] flex items-center">
          <div className="flex gap-8 md:gap-12 min-w-[1000px] w-full items-stretch py-4">
            
            {/* 1. ROUND OF 16 (OITAVAS) */}
            <div className="flex flex-col justify-between w-60 gap-4">
              <div className="text-center font-display font-extrabold text-[#00a859] text-xs uppercase tracking-wider py-1 bg-secondary rounded border border-border">
                Oitavas De Final
              </div>
              <div className="flex flex-col justify-around flex-1 gap-3">
                {oitavas.map(m => <MatchCard key={m.id} match={m} />)}
              </div>
            </div>

            {/* Connecting lines column 1 */}
            <div className="hidden lg:flex flex-col justify-around w-6 text-muted-foreground select-none pointer-events-none">
              <div className="flex flex-col items-center justify-around h-full py-8 text-lg font-bold text-[#00a859]">
                <span>➔</span>
                <span>➔</span>
                <span>➔</span>
                <span>➔</span>
              </div>
            </div>

            {/* 2. QUARTERFINALS (QUARTAS) */}
            <div className="flex flex-col justify-between w-60 gap-4">
              <div className="text-center font-display font-extrabold text-[#00a859] text-xs uppercase tracking-wider py-1 bg-secondary rounded border border-border">
                Quartas De Final
              </div>
              <div className="flex flex-col justify-around flex-1 py-6 gap-8">
                {quartas.map(m => <MatchCard key={m.id} match={m} />)}
              </div>
            </div>

            {/* Connecting lines column 2 */}
            <div className="hidden lg:flex flex-col justify-around w-6 text-muted-foreground select-none pointer-events-none">
              <div className="flex flex-col items-center justify-around h-full py-16 text-lg font-bold text-[#00a859]">
                <span>➔</span>
                <span>➔</span>
              </div>
            </div>

            {/* 3. SEMIFINALS (SEMIS) */}
            <div className="flex flex-col justify-between w-60 gap-4">
              <div className="text-center font-display font-extrabold text-[#00a859] text-xs uppercase tracking-wider py-1 bg-secondary rounded border border-border">
                Semifinais
              </div>
              <div className="flex flex-col justify-around flex-1 py-12 gap-16">
                {semis.map(m => <MatchCard key={m.id} match={m} />)}
              </div>
            </div>

            {/* Connecting lines column 3 */}
            <div className="hidden lg:flex flex-col justify-around w-6 text-[#00a859] font-bold text-lg select-none pointer-events-none">
              <div className="flex flex-col items-center justify-center h-full">
                <span>➔</span>
              </div>
            </div>

            {/* 4. GRAND FINAL */}
            <div className="flex flex-col justify-between w-60 gap-4">
              <div className="text-center font-display font-extrabold bg-[#00a859] text-white text-xs uppercase tracking-wider py-1 rounded border border-[#00a859] shadow-sm flex items-center justify-center gap-1">
                <AnimatedIcon icon="sparkles" size={14} colors="primary:#ffffff,secondary:#ffffff" />
                Grande Final
              </div>
              <div className="flex flex-col justify-center flex-1 gap-12">
                <MatchCard match={final} />

                {/* Champion Podium Box */}
                <div className="border border-dashed border-[#ffcc00] bg-amber-500/5 rounded-xl p-4 flex flex-col items-center justify-center gap-2 h-[120px] shadow-sm">
                  <AnimatedIcon icon="award" size={32} colors="primary:#ffcc00,secondary:#ffcc00" className="animate-bounce" />
                  <div className="text-center">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Campeão FIFA™</div>
                    <div className="font-display font-black text-[#ffcc00] text-sm tracking-wide">EM DISPUTA</div>
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
