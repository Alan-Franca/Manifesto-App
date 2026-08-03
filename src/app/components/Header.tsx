import { useState } from 'react';
import { User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AnimatedIcon } from './AnimatedIcon';
import logo from '../../imports/newLogo.png';
import { useLanguage } from '../contexts/LanguageContext';

export function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-background/95 backdrop-blur-md border-b border-border z-50 transition-all duration-300">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        <button onClick={() => navigate('/feed')} className="flex-shrink-0 cursor-pointer">
          <img src={logo} alt="Manifesto" className="h-14 w-auto object-contain transition-all duration-300 hover:scale-105" />
        </button>

        <div className="flex-1 max-w-md mx-8">
          {searchOpen ? (
            <div className="flex items-center gap-2 bg-input-background rounded-lg px-4 py-2 border border-input">
              <AnimatedIcon icon="search" size={20} />
              <input
                type="text"
                placeholder={t('header.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-foreground"
                autoFocus
              />
              <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
                <AnimatedIcon icon="close" size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center gap-2 bg-input-background rounded-lg px-4 py-2 text-muted-foreground hover:bg-secondary transition-colors border border-input"
            >
              <AnimatedIcon icon="search" size={20} />
              <span>{t('header.search')}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user?.role === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              title={t('header.admin_tooltip')}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center text-primary transition-colors border border-border group"
            >
              <AnimatedIcon icon="admin" size={20} colors="primary:#003049,secondary:#540B0E" />
            </button>
          )}

          <button
            onClick={() => navigate('/profile')}
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border border-border ${
              user?.profileImage ? '' : 'bg-secondary'
            }`}
          >
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
