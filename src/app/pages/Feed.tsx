import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { NewsCard } from '../components/NewsCard';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { Footer } from '../components/Footer';

export function Feed() {
  const { user } = useAuth();
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchNews() {
      try {
        const token = localStorage.getItem('manifesto_token');
        const headers: any = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        const res = await fetch('/api/news', { headers });
        if (res.ok) {
          const data = await res.json();
          setNewsList(data);
        } else {
          setError('Não foi possível carregar as notícias.');
        }
      } catch (err) {
        console.error('Erro de rede ao buscar notícias:', err);
        setError('Erro de conexão ao buscar notícias.');
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  // Simular anúncios para usuários não premium
  const AdBanner = () => (
    <div className="bg-muted/50 rounded-lg p-8 text-center border-2 border-dashed border-border">
      <p className="text-muted-foreground mb-2">Publicidade</p>
      <p className="text-sm">
        Remova anúncios e tenha acesso a recursos exclusivos com o plano Premium
      </p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-20 pb-20 md:pb-8 px-4 max-w-7xl mx-auto w-full">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl mb-2">Olá, {user?.name?.split(' ')[0]}</h1>
            <p className="text-muted-foreground">Confira as últimas notícias selecionadas para você</p>
          </div>
          {user?.role === 'admin' && (
            <Button variant="outline" className="self-start md:self-auto border-primary text-primary hover:bg-primary/10">
              Modo Administrador Ativo
            </Button>
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Carregando notícias...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-10 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive mb-2 font-medium">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Tentar novamente
            </Button>
          </div>
        )}

        {!loading && !error && newsList.length === 0 && (
          <div className="text-center py-20 bg-muted/20 border border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">Nenhuma notícia encontrada.</p>
          </div>
        )}

        {!loading && !error && newsList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsList.map((news, index) => (
              <React.Fragment key={news._id || news.id}>
                <NewsCard {...news} />
                {/* Mostrar anúncio a cada 3 notícias para usuários não premium */}
                {!user?.isPremium && (index + 1) % 3 === 0 && index !== newsList.length - 1 && (
                  <div className="md:col-span-2 lg:col-span-3">
                    <AdBanner />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {!user?.isPremium && (
          <div className="mt-8 bg-primary/10 border border-primary/20 rounded-lg p-6 text-center">
            <h3 className="text-xl mb-2">Assine o Manifesto Premium</h3>
            <p className="text-muted-foreground mb-4">
              Sem anúncios, customização avançada e notificações personalizadas por email e SMS
            </p>
            <Button size="lg">
              Assinar Agora
            </Button>
          </div>
        )}
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}

