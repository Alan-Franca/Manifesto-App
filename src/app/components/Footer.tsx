import { Link } from 'react-router-dom';
import { Instagram, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-card border-t border-border py-10 px-6 mt-auto pb-24 md:pb-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">

        {/* Left Side: Editorial & About Link */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <Link
            to="/about"
            className="text-primary hover:text-accent font-semibold tracking-wide text-lg transition-colors hover:underline decoration-2 underline-offset-4"
          >
            {t('footer.about')}
          </Link>
          <p className="text-xs text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} {t('footer.rights')}
          </p>
        </div>

        {/* Right Side: Contact info */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <p className="text-sm font-bold text-foreground tracking-wider uppercase">{t('footer.contact')}</p>
          <div className="flex flex-col sm:flex-row items-center gap-6 text-sm text-muted-foreground">
            <a
              href="https://instagram.com/manifesto_espro"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary hover:underline transition-colors duration-200"
            >
              <Instagram className="w-5 h-5 text-accent" />
              <span className="font-medium">@jornalmanifesto</span>
            </a>
            <a
              href="mailto:jornalmanifesto@outlook.com"
              className="flex items-center gap-2 hover:text-primary hover:underline transition-colors duration-200"
            >
              <Mail className="w-5 h-5 text-primary" />
              <span className="font-medium">jornalmanifesto@outlook.com</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
