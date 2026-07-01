import React from 'react';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Compass, Award, ArrowLeft } from 'lucide-react';

export function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-20 md:pb-12 px-4 max-w-4xl mx-auto w-full">
        {/* Back navigation */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/feed')}
            className="flex items-center gap-2 hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para o Feed</span>
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center py-12 px-6 bg-card rounded-2xl border border-border shadow-sm mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4 tracking-tight">
            Jornal Manifesto
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-sans font-medium">
            O compromisso irredutível com a verdade, a independência editorial e a profundidade de pensamento.
          </p>
          <div className="w-16 h-1 bg-accent mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Editorial Story */}
        <div className="space-y-8 mb-12">
          <section className="bg-card rounded-2xl p-8 border border-border shadow-sm">
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-accent" />
              Nossa História
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Fundado com o objetivo de ser uma voz crítica, independente e analítica no panorama jornalístico contemporâneo, o <strong>Jornal Manifesto</strong> nasceu da necessidade de se ir além do factual imediato e das manchetes rasas de clique-fácil.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Acreditamos que a informação de qualidade é a base para uma sociedade livre e democrática. Nossos jornalistas buscam, investigam e debatem com total autonomia, orientados estritamente pelo código ético do jornalismo profissional e pelo respeito ao leitor.
            </p>
          </section>

          {/* Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-card rounded-2xl p-8 border border-border shadow-sm">
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <Compass className="w-5 h-5 text-accent" />
                Nossa Missão
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Proporcionar jornalismo independente de alto nível, livre de amarras partidárias ou pressões comerciais. Focamos em entregar reportagens investigativas, análises aprofundadas e debates honestos sobre os temas mais relevantes que moldam a nossa sociedade.
              </p>
            </section>

            <section className="bg-card rounded-2xl p-8 border border-border shadow-sm">
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-accent" />
                Nossos Valores
              </h2>
              <ul className="list-disc pl-4 text-muted-foreground text-sm space-y-2 leading-relaxed">
                <li><strong>Independência:</strong> Total liberdade em nossa linha editorial.</li>
                <li><strong>Transparência:</strong> Compromisso absoluto com fatos e retidão jornalística.</li>
                <li><strong>Pluralidade:</strong> Abertura para debates construtivos de diversas visões intelectuais.</li>
                <li><strong>Profundidade:</strong> Rejeição ao sensacionalismo e foco na clareza informativa.</li>
              </ul>
            </section>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8 text-center mb-6">
          <h3 className="text-xl font-semibold text-primary mb-2">Apoie o Jornalismo Independente</h3>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto mb-6">
            Nossa independência é sustentada por leitores como você. Ao assinar o Manifesto Premium, você ganha acesso exclusivo a colunas exclusivas, customização e nos ajuda a manter a verdade em primeiro plano.
          </p>
          <Button 
            onClick={() => navigate('/profile')} 
            className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-6 py-2 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            Conhecer Plano Premium
          </Button>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
