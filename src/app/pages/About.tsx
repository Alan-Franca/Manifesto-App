import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AnimatedIcon } from '../components/AnimatedIcon';

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
            className="flex items-center gap-2 hover:bg-secondary text-muted-foreground hover:text-primary transition-colors border border-border"
          >
            <AnimatedIcon icon="arrowLeft" size={16} />
            <span>Voltar para o Feed</span>
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center py-12 px-6 bg-card rounded-2xl border border-border shadow-sm mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6 tracking-tight">
            Manifesto
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto font-sans leading-relaxed mb-4">
            Em tempos de desinformação e desigualdade de acesso ao conhecimento, o Manifesto propõe um novo olhar sobre a cultura: tornar o saber um direito coletivo e não um privilégio.
          </p>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto font-sans leading-relaxed">
            Mais do que um projeto, o Manifesto é um movimento social e cultural que busca democratizar o conhecimento e fortalecer o pensamento crítico por meio da arte, da educação e do diálogo.
          </p>
          <div className="w-16 h-1 bg-[#00a859] mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-8 mb-12">
          {/* Section 1: A Origem e o Sentido */}
          <section className="bg-card rounded-2xl p-8 border border-border shadow-sm">
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
              <AnimatedIcon icon="book" size={24} colors="primary:#540B0E,secondary:#540B0E" />
              O Manifesto e o Acesso ao Saber
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Em uma era em que a informação é o principal instrumento de poder, o acesso desigual ao conhecimento continua sendo um dos maiores desafios da sociedade contemporânea. Surge, nesse contexto, o Manifesto, uma iniciativa que busca redefinir a relação entre cultura, arte e público — e transformar o aprendizado em um bem comum, livre e acessível.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              A palavra “manifesto” vem do latim <em>manifestus</em>, que significa “aquilo que é evidente, claro, visível”. Historicamente, o termo designa uma declaração pública de princípios, ideias ou intenções, geralmente de caráter político, artístico ou filosófico. Desde os manifestos modernistas do início do século XX até os movimentos culturais mais recentes, essa forma de expressão sempre carregou um mesmo propósito: tornar visível o invisível, dar voz a pensamentos que desafiam o estabelecido e inspirar transformação.
            </p>
          </section>

          {/* Section 2: Perspectiva e Cidadania */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-card rounded-2xl p-8 border border-border shadow-sm">
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <AnimatedIcon icon="compass" size={20} colors="primary:#540B0E,secondary:#540B0E" />
                Pontes e Diálogo
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                É exatamente sob essa perspectiva que o Manifesto se consolida. Mais do que um projeto cultural, ele se apresenta como um movimento de democratização do saber, rompendo com a ideia de que o conhecimento deve estar restrito a determinados grupos ou instituições. A proposta é criar pontes entre diferentes perspectivas, promover o pensamento crítico e incentivar o diálogo entre vozes diversas, reconhecendo o poder da cultura como ferramenta de inclusão e transformação.
              </p>
            </section>

            <section className="bg-card rounded-2xl p-8 border border-border shadow-sm">
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <AnimatedIcon icon="award" size={20} colors="primary:#540B0E,secondary:#540B0E" />
                Resistência Cultural
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                O movimento parte da compreensão de que a informação tem valor social e de que o acesso a ela é uma condição fundamental para o exercício pleno da cidadania. Em um mundo em que algoritmos determinam o que vemos e pensamos, o Manifesto surge como um ato de resistência — uma tentativa de devolver à sociedade o direito de construir seu próprio olhar sobre o mundo.
              </p>
            </section>
          </div>

          {/* Section 3: Pilares da Iniciativa */}
          <section className="bg-card rounded-2xl p-8 border border-border shadow-sm">
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
              <AnimatedIcon icon="tag" size={24} colors="primary:#540B0E,secondary:#540B0E" />
              Nossos Pilares
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              A iniciativa se apoia em três pilares centrais: acessibilidade, pluralidade e reflexão. Ao difundir conteúdos de forma aberta e crítica, o Manifesto reafirma que o desenvolvimento intelectual é um direito coletivo, não um privilégio de poucos. Cada ação, publicação e projeto visa aproximar o público do saber, estimulando a curiosidade, o debate e a participação social.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Em sua essência, o Manifesto propõe um retorno ao sentido original da palavra que o nomeia: tornar visível o que importa, aquilo que, por muito tempo, permaneceu oculto ou inacessível.
            </p>
          </section>

          {/* Section 4: Conclusão e Chamado à Ação */}
          <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-card border border-primary/20 rounded-2xl p-8 text-center shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8"></div>
            <h3 className="text-2xl font-display font-bold text-primary mb-4">Um Chamado à Ação</h3>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto leading-relaxed mb-6">
              Assim, o movimento se consolida como um espaço de partilha e resistência, onde aprender e pensar deixam de ser privilégios e passam a ser expressões da liberdade humana. O Manifesto não é apenas um nome — é uma atitude, um chamado à ação coletiva por uma sociedade mais consciente, crítica e aberta ao conhecimento.
            </p>
            <Button 
              onClick={() => navigate('/profile')} 
              className="bg-primary hover:bg-primary/95 text-primary-foreground font-bold shadow-md hover:shadow-lg transition-all rounded-xl px-8 py-3 h-auto text-sm"
            >
              Apoie o Movimento
            </Button>
          </section>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
