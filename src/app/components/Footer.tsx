import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-card border-t border-border py-10 px-6 mt-auto pb-24 md:pb-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left Side: Editorial & About Link */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <Link 
            to="/about" 
            className="text-primary hover:text-accent font-semibold tracking-wide text-lg transition-colors hover:underline decoration-2 underline-offset-4"
          >
            Sobre nós
          </Link>
          <p className="text-xs text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} Jornal Manifesto. Todos os direitos reservados.
          </p>
        </div>

        {/* Right Side: Contact info */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <p className="text-sm font-bold text-foreground tracking-wider uppercase">Contato</p>
          <div className="flex flex-col sm:flex-row items-center gap-6 text-sm text-muted-foreground">
            <a 
              href="https://instagram.com/jornalmanifesto" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 hover:text-primary hover:underline transition-colors duration-200"
            >
              <Instagram className="w-4.5 h-4.5 text-primary" />
              <span className="font-medium">@jornalmanifesto</span>
            </a>
            <a 
              href="mailto:contato@jornalmanifesto.com" 
              className="flex items-center gap-2 hover:text-primary hover:underline transition-colors duration-200"
            >
              <Mail className="w-4.5 h-4.5 text-primary" />
              <span className="font-medium">contato@jornalmanifesto.com</span>
            </a>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
