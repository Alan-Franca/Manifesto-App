import React, { useState } from 'react';
import { Search, User, X, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Input } from './ui/input';
import logo from '../../imports/image.png';

export function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-50">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        <button onClick={() => navigate('/feed')} className="flex-shrink-0">
          <img src={logo} alt="Manifesto" className="h-10 w-auto" />
        </button>

        <div className="flex-1 max-w-md mx-8">
          {searchOpen ? (
            <div className="flex items-center gap-2 bg-input-background rounded-lg px-4 py-2 border border-input">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar notícias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-foreground"
                autoFocus
              />
              <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center gap-2 bg-input-background rounded-lg px-4 py-2 text-muted-foreground hover:bg-secondary transition-colors border border-input"
            >
              <Search className="w-5 h-5" />
              <span>Buscar...</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user?.role === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              title="Painel Admin"
              className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center text-primary transition-colors border border-border"
            >
              <Shield className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={() => navigate('/profile')}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center overflow-hidden"
          >
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-primary-foreground" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
