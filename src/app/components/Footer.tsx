import { Link } from 'react-router-dom';
import { FcFeedback } from 'react-icons/fc';
import { useLanguage } from '../contexts/LanguageContext';

const FcInstagram = ({ className = '', style = {} }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    style={style}
    fill="none"
    strokeWidth="2"
  >
    <defs>
      <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="30%" stopColor="#fd5949" />
        <stop offset="60%" stopColor="#d6249f" />
        <stop offset="100%" stopColor="#285AEB" />
      </linearGradient>
    </defs>
    <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="url(#ig-grad)" fill="none" />
    <circle cx="12" cy="12" r="4.5" stroke="url(#ig-grad)" fill="none" />
    <circle cx="17.25" cy="6.75" r="1" fill="url(#ig-grad)" stroke="none" />
  </svg>
);

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
              <FcInstagram className="w-5 h-5" />
              <span className="font-medium">@jornalmanifesto</span>
            </a>
            <a
              href="mailto:contato@jornalmanifesto.com"
              className="flex items-center gap-2 hover:text-primary hover:underline transition-colors duration-200"
            >
              <FcFeedback className="w-5 h-5" />
              <span className="font-medium">contato@jornalmanifesto.com</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
