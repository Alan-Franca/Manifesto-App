import React from 'react';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { Footer } from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useNavigate } from 'react-router-dom';
import { ScrapbookSticker } from '../components/ScrapbookSticker';
import { AnimatedIcon } from '../components/AnimatedIcon';

export function Profile() {
  const { user, updateUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLanguageChange = (language: string) => {
    updateUser({ language });
  };

  const handle2FAToggle = () => {
    updateUser({ twoFactorEnabled: !user?.twoFactorEnabled });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-28 pb-20 md:pb-8 px-4 max-w-2xl mx-auto w-full">
        <h1 className="text-3xl mb-8">Meu Perfil</h1>

        {/* Profile Picture */}
        <div className="bg-card rounded-lg p-6 mb-6 border border-border shadow-sm">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center overflow-hidden shadow-inner">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl text-primary-foreground font-bold font-display">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:opacity-90 transition-opacity shadow-md">
                <AnimatedIcon icon="camera" size={16} colors="primary:#ffffff,secondary:#ffffff" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <div>
              <h2 className="text-xl font-bold font-display mb-1">{user?.name}</h2>
              <p className="text-muted-foreground text-sm">{user?.email}</p>
              <p className="text-xs text-primary font-medium mt-2 flex items-center gap-1">
                ✓ Conta Gratuita Manifesto
              </p>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        {user?.role === 'admin' && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <AnimatedIcon icon="admin" size={24} colors="primary:#003049,secondary:#540B0E" />
              <h3 className="text-xl">Ações de Administrador</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Acesse o painel para gerenciar notícias e usuários do Jornal Manifesto.
            </p>
            <Button variant="default" onClick={() => navigate('/admin')}>
              Acessar Painel Admin
            </Button>
          </div>
        )}

        {/* Settings */}
        <div className="bg-card rounded-lg border border-border overflow-hidden mb-6">
          {/* Language */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AnimatedIcon icon="globe" size={20} />
                <div>
                  <p>Idioma</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.language === 'en-US' ? 'English (US)' : user?.language === 'es-ES' ? 'Español' : 'Português (Brasil)'}
                  </p>
                </div>
              </div>
              <Select value={user?.language || 'pt-BR'} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 2FA */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AnimatedIcon icon="admin" size={20} />
                <div>
                  <p>Autenticação de Dois Fatores</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.twoFactorEnabled ? 'Ativado' : 'Desativado'}
                  </p>
                </div>
              </div>
              <Switch checked={user?.twoFactorEnabled || false} onCheckedChange={handle2FAToggle} />
            </div>
          </div>

          {/* Theme */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'light' ? (
                  <AnimatedIcon icon="sun" size={20} />
                ) : (
                  <AnimatedIcon icon="moon" size={20} />
                )}
                <div>
                  <p>Tema</p>
                  <p className="text-sm text-muted-foreground">
                    {theme === 'light' ? 'Claro' : 'Escuro'}
                  </p>
                </div>
              </div>
              <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-card rounded-xl p-6 mb-6 border border-border shadow-sm border-t-4 border-t-accent">
          <h3 className="mb-4 font-display text-lg font-bold text-primary">Interesses Salvos</h3>
          {(!user?.preferences || user.preferences.length === 0) ? (
            <p className="text-sm text-muted-foreground mb-4">Você ainda não escolheu suas editorias preferidas.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {user.preferences.map((pref) => (
                <div
                  key={pref}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-xl text-xs font-bold uppercase tracking-wider font-sans select-none shadow-sm"
                >
                  <ScrapbookSticker category={pref} size="sm" hasTape={false} />
                  <span>{pref.replace(/[\uD800-\uDFFF\u2600-\u27BF]/g, '').trim()}</span>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => navigate('/preferences')}
            className="mt-5 text-primary hover:text-accent font-bold text-xs uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
          >
            Editar interesses
          </button>
        </div>

        {/* Logout */}
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full border border-destructive text-destructive hover:bg-destructive/10"
        >
          <AnimatedIcon icon="logout" size={18} colors="primary:#ef4444,secondary:#ef4444" className="mr-2" />
          Sair
        </Button>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
