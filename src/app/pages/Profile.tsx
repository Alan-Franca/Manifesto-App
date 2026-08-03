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

import { useLanguage, Language } from '../contexts/LanguageContext';

export function Profile() {
  const { user, updateUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t, translateCategory } = useLanguage();
  const navigate = useNavigate();

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang as Language);
    updateUser({ language: newLang });
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
        <h1 className="text-3xl mb-8 font-display font-bold">{t('profile.title')}</h1>

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
                {t('profile.free_account')}
              </p>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        {user?.role === 'admin' && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <AnimatedIcon icon="admin" size={24} colors="primary:#003049,secondary:#540B0E" />
              <h3 className="text-xl font-bold font-display">{t('profile.admin_title')}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {t('profile.admin_desc')}
            </p>
            <Button variant="default" onClick={() => navigate('/admin')}>
              {t('profile.admin_button')}
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
                  <p className="font-semibold">{t('profile.language')}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en-US' ? t('profile.language_en') : language === 'es-ES' ? t('profile.language_es') : t('profile.language_pt')}
                  </p>
                </div>
              </div>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">{t('profile.language_pt')}</SelectItem>
                  <SelectItem value="en-US">{t('profile.language_en')}</SelectItem>
                  <SelectItem value="es-ES">{t('profile.language_es')}</SelectItem>
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
                  <p className="font-semibold">{t('profile.2fa')}</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.twoFactorEnabled ? t('profile.2fa_enabled') : t('profile.2fa_disabled')}
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
                  <p className="font-semibold">{t('profile.theme')}</p>
                  <p className="text-sm text-muted-foreground">
                    {theme === 'light' ? t('profile.theme_light') : t('profile.theme_dark')}
                  </p>
                </div>
              </div>
              <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-card rounded-xl p-6 mb-6 border border-border shadow-sm border-t-4 border-t-accent">
          <h3 className="mb-4 font-display text-lg font-bold text-primary">{t('profile.saved_interests')}</h3>
          {(!user?.preferences || user.preferences.length === 0) ? (
            <p className="text-sm text-muted-foreground mb-4">{t('profile.no_interests')}</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {user.preferences.map((pref) => (
                <div
                  key={pref}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-xl text-xs font-bold uppercase tracking-wider font-sans select-none shadow-sm"
                >
                  <ScrapbookSticker category={pref} size="sm" hasTape={false} />
                  <span>{translateCategory(pref)}</span>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => navigate('/preferences')}
            className="mt-5 text-primary hover:text-accent font-bold text-xs uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
          >
            {t('profile.edit_interests')}
          </button>
        </div>

        {/* Logout */}
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full border border-destructive text-destructive hover:bg-destructive/10"
        >
          <AnimatedIcon icon="logout" size={18} colors="primary:#ef4444,secondary:#ef4444" className="mr-2" />
          {t('profile.logout')}
        </Button>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
