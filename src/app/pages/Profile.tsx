import React from 'react';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { Footer } from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Camera, Globe, Shield, Moon, Sun, LogOut, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

      <main className="flex-1 pt-20 pb-20 md:pb-8 px-4 max-w-2xl mx-auto w-full">
        <h1 className="text-3xl mb-8">Meu Perfil</h1>

        {/* Profile Picture */}
        <div className="bg-card rounded-lg p-6 mb-6 border border-border">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center overflow-hidden">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl text-primary-foreground">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:opacity-90 transition-opacity">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={!user?.isPremium}
                />
              </label>
            </div>
            <div>
              <h2 className="text-xl mb-1">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
              {!user?.isPremium && (
                <p className="text-xs text-muted-foreground mt-2">
                  Foto de perfil disponível apenas para Premium
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Premium Status */}
        {user?.isPremium ? (
          <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Crown className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-xl">Assinante Premium</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Você tem acesso a todos os recursos exclusivos
            </p>
          </div>
        ) : (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Crown className="w-6 h-6 text-primary" />
              <h3 className="text-xl">Upgrade para Premium</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Sem anúncios, customização de perfil e notificações por email/SMS
            </p>
            <Button 
              variant="default" 
              onClick={() => updateUser({ isPremium: true })}
            >
              Assinar Agora
            </Button>
          </div>
        )}

        {/* Admin Actions */}
        {user?.role === 'admin' && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-6 h-6 text-primary" />
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
                <Globe className="w-5 h-5 text-muted-foreground" />
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
                <Shield className="w-5 h-5 text-muted-foreground" />
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
                  <Sun className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Moon className="w-5 h-5 text-muted-foreground" />
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
        <div className="bg-card rounded-lg p-6 mb-6 border border-border">
          <h3 className="mb-4">Interesses</h3>
          <div className="flex flex-wrap gap-2">
            {user?.preferences?.map((pref) => (
              <span
                key={pref}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                {pref}
              </span>
            ))}
          </div>
          <button
            onClick={() => navigate('/preferences')}
            className="mt-4 text-primary hover:underline text-sm"
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
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
