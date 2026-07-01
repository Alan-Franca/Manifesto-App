import React from 'react';
import { Home, User, Shield } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { icon: Home, label: 'Feed', path: '/feed' },
    ...(user?.role === 'admin' ? [{ icon: Shield, label: 'Admin', path: '/admin' }] : []),
    { icon: User, label: 'Perfil', path: '/profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border z-50 md:hidden">
      <div className="h-full flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-6 py-2 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
