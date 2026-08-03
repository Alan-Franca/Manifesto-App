import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { AnimatedIcon } from '../components/AnimatedIcon';
import { useLanguage } from '../contexts/LanguageContext';

export function Admin() {
  const { user } = useAuth();
  const { translateCategory } = useLanguage();
  const navigate = useNavigate();

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('Acesso negado. Apenas administradores podem acessar esta página.');
      navigate('/feed');
    }
  }, [user, navigate]);

  // Tab State
  const [activeTab, setActiveTab] = useState('news');

  // News State
  const [news, setNews] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [isNewsDialogOpen, setIsNewsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<any>(null);
  
  // News Form Fields
  const [newsTitle, setNewsTitle] = useState('');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsCategory, setNewsCategory] = useState('');
  const [newsReadTime, setNewsReadTime] = useState('5 min');
  const [newsDate, setNewsDate] = useState('');
  const [newsImage, setNewsImage] = useState('');

  // Users State
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  // Fetch News
  const fetchNews = async () => {
    setNewsLoading(true);
    try {
      const res = await fetch('/api/news');
      if (res.ok) {
        const data = await res.json();
        setNews(data);
      } else {
        toast.error('Erro ao carregar notícias do servidor.');
      }
    } catch (err) {
      toast.error('Erro de conexão ao buscar notícias.');
    } finally {
      setNewsLoading(false);
    }
  };

  // Fetch Users
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const token = localStorage.getItem('manifesto_token');
      const res = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        toast.error('Erro ao carregar usuários.');
      }
    } catch (err) {
      toast.error('Erro de conexão ao buscar usuários.');
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    fetchUsers();
  }, []);

  // Handle News Image Upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewsImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open News Dialog for Add
  const handleAddNewsClick = () => {
    setEditingNews(null);
    setNewsTitle('');
    setNewsSummary('');
    setNewsCategory('');
    setNewsReadTime('5 min');
    // Set current date formatted as DD MMM YYYY in Portuguese (e.g. 29 Jun 2026)
    const options: any = { day: '2-digit', month: 'short', year: 'numeric' };
    const todayStr = new Date().toLocaleDateString('pt-BR', options).replace(/\. de/g, '').replace(/\./g, '');
    setNewsDate(todayStr);
    setNewsImage('');
    setIsNewsDialogOpen(true);
  };

  // Open News Dialog for Edit
  const handleEditNewsClick = (item: any) => {
    setEditingNews(item);
    setNewsTitle(item.title);
    setNewsSummary(item.summary);
    setNewsCategory(item.category);
    setNewsReadTime(item.readTime || '5 min');
    setNewsDate(item.date);
    setNewsImage(item.image || '');
    setIsNewsDialogOpen(true);
  };

  // Save News (Add / Edit)
  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsSummary || !newsCategory || !newsDate) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const payload = {
      title: newsTitle,
      summary: newsSummary,
      category: newsCategory,
      readTime: newsReadTime,
      date: newsDate,
      image: newsImage
    };

    const token = localStorage.getItem('manifesto_token');
    const url = editingNews ? `/api/news/${editingNews._id}` : '/api/news';
    const method = editingNews ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success(editingNews ? 'Notícia atualizada com sucesso!' : 'Notícia adicionada com sucesso!');
        setIsNewsDialogOpen(false);
        fetchNews();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Erro ao salvar notícia.');
      }
    } catch (err) {
      toast.error('Erro de conexão ao salvar notícia.');
    }
  };

  // Delete News
  const handleDeleteNews = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta notícia?')) return;
    const token = localStorage.getItem('manifesto_token');

    try {
      const res = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        toast.success('Notícia excluída com sucesso.');
        fetchNews();
      } else {
        toast.error('Erro ao excluir notícia.');
      }
    } catch (err) {
      toast.error('Erro de conexão ao excluir notícia.');
    }
  };

  // Update User Role Status
  const handleUpdateUser = async (id: string, updates: any) => {
    const token = localStorage.getItem('manifesto_token');
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      if (res.ok) {
        toast.success('Usuário atualizado com sucesso.');
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Erro ao atualizar usuário.');
      }
    } catch (err) {
      toast.error('Erro de conexão ao atualizar usuário.');
    }
  };

  // Delete User
  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário definitivamente?')) return;
    const token = localStorage.getItem('manifesto_token');

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        toast.success('Usuário excluído com sucesso.');
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Erro ao excluir usuário.');
      }
    } catch (err) {
      toast.error('Erro de conexão ao excluir usuário.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-28 pb-20 md:pb-8 px-4 max-w-7xl mx-auto w-full">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
              <AnimatedIcon icon="admin" size={32} /> Painel do Administrador
            </h1>
            <p className="text-muted-foreground mt-1">Gerencie os leitores e notícias do Jornal Manifesto</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] bg-secondary">
            <TabsTrigger value="news" className="flex items-center gap-2">
              <AnimatedIcon icon="newspaper" size={16} /> Notícias
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <AnimatedIcon icon="users" size={16} /> Usuários
            </TabsTrigger>
          </TabsList>

          {/* ----------------- NEWS TAB ----------------- */}
          <TabsContent value="news" className="space-y-4">
            <div className="flex justify-between items-center bg-card p-4 rounded-lg border border-border">
              <div>
                <h3 className="font-semibold text-lg text-foreground">Total de Notícias: {news.length}</h3>
                <p className="text-sm text-muted-foreground">Publique e gerencie matérias no portal</p>
              </div>
              <Button onClick={handleAddNewsClick} className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2">
                <AnimatedIcon icon="plus" size={16} colors="primary:#ffffff,secondary:#ffffff" /> Nova Notícia
              </Button>
            </div>

            {newsLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Imagem</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Leitura</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {news.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                          Nenhuma notícia cadastrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      news.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>
                            {item.image ? (
                              <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-md border" />
                            ) : (
                              <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                                Sem foto
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium max-w-[300px] truncate">{item.title}</TableCell>
                          <TableCell className="font-semibold text-xs uppercase tracking-wider">{translateCategory(item.category)}</TableCell>
                          <TableCell>{item.date}</TableCell>
                          <TableCell>{item.readTime}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button onClick={() => handleEditNewsClick(item)} variant="outline" size="icon" className="h-8 w-8 text-primary hover:bg-secondary">
                              <AnimatedIcon icon="edit" size={16} />
                            </Button>
                            <Button onClick={() => handleDeleteNews(item._id)} variant="outline" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                              <AnimatedIcon icon="trash" size={16} colors="primary:#ef4444,secondary:#ef4444" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* ----------------- USERS TAB ----------------- */}
          <TabsContent value="users" className="space-y-4">
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="font-semibold text-lg text-foreground">Usuários Cadastrados: {users.length}</h3>
              <p className="text-sm text-muted-foreground">Gerencie permissões e contas do portal</p>
            </div>

            {usersLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">Foto</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Papel (Role)</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u._id}>
                        <TableCell>
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center overflow-hidden text-primary-foreground font-semibold">
                            {u.profileImage ? (
                              <img src={u.profileImage} alt={u.name} className="w-full h-full object-cover" />
                            ) : (
                              u.name.charAt(0).toUpperCase()
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>{u.phone}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleUpdateUser(u._id, { role: u.role === 'admin' ? 'user' : 'admin' })}
                            variant="ghost"
                            size="sm"
                            disabled={u._id === user?.id}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
                              u.role === 'admin'
                                ? 'bg-primary/10 text-primary hover:bg-primary/20'
                                : 'bg-muted text-muted-foreground hover:bg-secondary'
                            }`}
                          >
                            <AnimatedIcon icon="admin" size={14} />
                            {u.role === 'admin' ? 'Administrador' : 'Leitor'}
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            onClick={() => handleDeleteUser(u._id)}
                            variant="outline"
                            size="icon"
                            disabled={u._id === user?.id}
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          >
                            <AnimatedIcon icon="trash" size={16} colors="primary:#ef4444,secondary:#ef4444" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* ----------------- ADD/EDIT NEWS DIALOG ----------------- */}
      <Dialog open={isNewsDialogOpen} onOpenChange={setIsNewsDialogOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-primary text-xl flex items-center gap-2">
              <AnimatedIcon icon="newspaper" size={20} />
              {editingNews ? 'Editar Notícia' : 'Publicar Nova Notícia'}
            </DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para divulgar a matéria no feed do Jornal Manifesto.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveNews} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="news-title">Título da Notícia *</Label>
              <Input
                id="news-title"
                value={newsTitle}
                onChange={(e) => setNewsTitle(e.target.value)}
                placeholder="Ex: Nova descoberta científica..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="news-summary">Resumo / Conteúdo da Notícia *</Label>
              <Textarea
                id="news-summary"
                value={newsSummary}
                onChange={(e) => setNewsSummary(e.target.value)}
                placeholder="Descreva de forma atrativa o resumo do acontecimento..."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="news-category">Categoria *</Label>
                <Select value={newsCategory} onValueChange={setNewsCategory}>
                  <SelectTrigger id="news-category" className="w-full">
                    <SelectValue placeholder="Selecione uma editoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="🧠 TECNOLOGIA">🧠 TECNOLOGIA</SelectItem>
                    <SelectItem value="💼 TRABALHO E FUTURO">💼 TRABALHO E FUTURO</SelectItem>
                    <SelectItem value="🎭 CULTURA">🎭 CULTURA</SelectItem>
                    <SelectItem value="💡 EXPLICAÇÕES">💡 EXPLICAÇÕES</SelectItem>
                    <SelectItem value="🌍 SOCIEDADE">🌍 SOCIEDADE</SelectItem>
                    <SelectItem value="📰 NOTÍCIAS">📰 NOTÍCIAS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="news-readtime">Tempo de Leitura</Label>
                <Input
                  id="news-readtime"
                  value={newsReadTime}
                  onChange={(e) => setNewsReadTime(e.target.value)}
                  placeholder="Ex: 5 min"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="news-date">Data da Publicação *</Label>
              <Input
                id="news-date"
                value={newsDate}
                onChange={(e) => setNewsDate(e.target.value)}
                placeholder="Ex: 29 Jun 2026"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Imagem de Capa</Label>
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 bg-secondary rounded-lg border overflow-hidden flex items-center justify-center flex-shrink-0">
                  {newsImage ? (
                    <img src={newsImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-muted-foreground text-center px-1">Sem imagem</span>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/95 text-xs text-muted-foreground"
                  />
                  <p className="text-[11px] text-muted-foreground">Envie uma imagem JPG, PNG ou GIF. Tamanho ideal: 800x600.</p>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t gap-2">
              <Button type="button" variant="outline" onClick={() => setIsNewsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Salvar Notícia
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
      <BottomNav />
    </div>
  );
}
