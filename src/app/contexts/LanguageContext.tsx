import React, { createContext, useContext, useState } from 'react';

export type Language = 'pt-BR' | 'en-US' | 'es-ES';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translateCategory: (category: string) => string;
  translateWeeklySegment: (day: number) => { label: string; title: string; description: string };
}

const translations: Record<Language, Record<string, string>> = {
  'pt-BR': {
    // Header & Navigation
    'header.search_placeholder': 'Buscar notícias...',
    'header.search': 'Buscar...',
    'header.admin_tooltip': 'Painel Admin',
    'nav.feed': 'Feed',
    'nav.admin': 'Admin',
    'nav.profile': 'Perfil',

    // Footer
    'footer.about': 'Sobre nós',
    'footer.rights': 'Jornal Manifesto. Todos os direitos reservados.',
    'footer.contact': 'Contato',

    // Profile Page
    'profile.title': 'Meu Perfil',
    'profile.free_account': '✓ Conta Gratuita Manifesto',
    'profile.admin_title': 'Ações de Administrador',
    'profile.admin_desc': 'Acesse o painel para gerenciar notícias e usuários do Jornal Manifesto.',
    'profile.admin_button': 'Acessar Painel Admin',
    'profile.language': 'Idioma',
    'profile.language_pt': 'Português (Brasil)',
    'profile.language_en': 'English (US)',
    'profile.language_es': 'Español',
    'profile.2fa': 'Autenticação de Dois Fatores',
    'profile.2fa_enabled': 'Ativado',
    'profile.2fa_disabled': 'Desativado',
    'profile.theme': 'Tema',
    'profile.theme_light': 'Claro',
    'profile.theme_dark': 'Escuro',
    'profile.saved_interests': 'Interesses Salvos',
    'profile.no_interests': 'Você ainda não escolheu suas editorias preferidas.',
    'profile.edit_interests': 'Editar interesses',
    'profile.logout': 'Sair',

    // Auth (Login & Register)
    'login.title': 'Seja bem-vindo de volta',
    'login.subtitle': 'Digite seu e-mail e senha para acessar sua conta.',
    'login.email_or_phone': 'E-mail',
    'login.password': 'Senha',
    'login.enter': 'Entrar na conta',
    'login.loading': 'Entrando...',
    'login.no_account': 'Não tem uma conta?',
    'login.register_link': 'Cadastre-se gratuitamente',
    'register.title': 'Criar sua conta',
    'register.subtitle': 'Preencha os dados abaixo para se juntar ao Jornal Manifesto.',
    'register.name': 'Nome Completo',
    'register.email': 'E-mail',
    'register.phone': 'Telefone (com DDD)',
    'register.role': 'Tipo de Conta',
    'register.role_reader': 'Leitor / Estudante',
    'register.role_admin': 'Administrador / Redator',
    'register.create': 'Criar minha conta',
    'register.has_account': 'Já tem uma conta?',
    'register.login_link': 'Fazer Login',

    // Feed Page
    'feed.hello': 'Olá',
    'feed.subtitle': 'As análises e explicações mais profundas selecionadas para você.',
    'feed.weekly_title': 'Manifesto Semanal',
    'feed.editorials': 'Editorias',
    'feed.clear_filters': 'Limpar Filtros',
    'feed.loading_news': 'Carregando notícias...',
    'feed.error_loading': 'Não foi possível carregar as notícias.',
    'feed.retry': 'Tentar Novamente',
    'feed.no_news': 'Nenhuma notícia encontrada.',
    'feed.no_news_sub': 'Experimente alterar os filtros ou cadastrar novos interesses no perfil.',
    'feed.today': 'HOJE',
    'feed.read_more': 'Ler matéria completa',
    'feed.cat_for_you': '📍 Para Você',
    'feed.cat_all': '🌐 Tudo',

    // Instagram Banner
    'insta.community': 'Comunidade Ativa',
    'insta.headline_start': 'Conecte-se com o ',
    'insta.headline_end': ' no Instagram',
    'insta.subtext': 'Receba pautas diárias, bastidores das reportagens, conteúdos em vídeo, carrosséis explicativos e participe das nossas enquetes exclusivas em primeira mão.',
    'insta.badge_carousels': 'Carrosséis Explicativos',
    'insta.badge_debates': 'Debates Jovens',
    'insta.badge_interaction': 'Interação Direta',
    'insta.cta_button': 'Siga no Instagram',
    'insta.footnote': '@manifesto_espro • Conteúdo diário e transformador',

    // Podcast Section
    'podcast.title_start': 'Podcast ',
    'podcast.title_end': 'Manifesto',
    'podcast.youtube_badge': 'No YouTube',
    'podcast.subtitle': 'Assista ou ouça nossos episódios direto pelo site',
    'podcast.youtube_button': 'Canal no YouTube',
    'podcast.episode': 'Episódio',
    'podcast.all_episodes': 'Todos os Episódios',
    'podcast.available': 'disponíveis',

    // Admin Page
    'admin.title': 'Painel Administrativo',
    'admin.new_post': 'Nova Notícia',
    'admin.manage_news': 'Notícias Cadastradas',
    'admin.manage_users': 'Usuários Registrados',
    'admin.edit': 'Editar',
    'admin.delete': 'Excluir',
    'admin.no_posts': 'Nenhuma notícia cadastrada.',
    'admin.modal_new_title': 'Criar Nova Notícia',
    'admin.modal_edit_title': 'Editar Notícia',
    'admin.title_label': 'Título da Notícia',
    'admin.summary_label': 'Resumo / Subtítulo',
    'admin.content_label': 'Conteúdo da Matéria',
    'admin.category_label': 'Categoria / Editoria',
    'admin.image_label': 'URL da Imagem de Capa',
    'admin.read_time_label': 'Tempo de Leitura',
    'admin.save_button': 'Salvar Notícia',
    'admin.cancel_button': 'Cancelar',

    // About Page
    'about.title': 'Sobre o Jornal Manifesto',
    'about.subtitle': 'Um projeto de jornalismo jovem, crítico e acessível.',
    'about.back_feed': 'Voltar ao Feed',

    // News Detail Page
    'news_detail.back': 'Voltar ao Feed',
    'news_detail.share': 'Compartilhar',
    'news_detail.copied': 'Link copiado para a área de transferência!',
    'news_detail.font_size': 'Tamanho do texto',
    'news_detail.related': 'Outras matérias recomendadas',
    'news_detail.not_found': 'Notícia não encontrada.',
    'news_detail.like': 'Curtir matéria'
  },
  'en-US': {
    // Header & Navigation
    'header.search_placeholder': 'Search news...',
    'header.search': 'Search...',
    'header.admin_tooltip': 'Admin Panel',
    'nav.feed': 'Feed',
    'nav.admin': 'Admin',
    'nav.profile': 'Profile',

    // Footer
    'footer.about': 'About Us',
    'footer.rights': 'Jornal Manifesto. All rights reserved.',
    'footer.contact': 'Contact',

    // Profile Page
    'profile.title': 'My Profile',
    'profile.free_account': '✓ Free Manifesto Account',
    'profile.admin_title': 'Admin Actions',
    'profile.admin_desc': 'Access the admin dashboard to manage news and users.',
    'profile.admin_button': 'Access Admin Panel',
    'profile.language': 'Language',
    'profile.language_pt': 'Português (Brasil)',
    'profile.language_en': 'English (US)',
    'profile.language_es': 'Español',
    'profile.2fa': 'Two-Factor Authentication',
    'profile.2fa_enabled': 'Enabled',
    'profile.2fa_disabled': 'Disabled',
    'profile.theme': 'Theme',
    'profile.theme_light': 'Light',
    'profile.theme_dark': 'Dark',
    'profile.saved_interests': 'Saved Interests',
    'profile.no_interests': 'You have not selected preferred topics yet.',
    'profile.edit_interests': 'Edit interests',
    'profile.logout': 'Sign Out',

    // Auth (Login & Register)
    'login.title': 'Welcome Back',
    'login.subtitle': 'Enter your email or phone and password to access your account.',
    'login.email_or_phone': 'Email or Phone',
    'login.password': 'Password',
    'login.enter': 'Sign In',
    'login.loading': 'Signing in...',
    'login.no_account': 'Don\'t have an account?',
    'login.register_link': 'Sign up for free',
    'register.title': 'Create your account',
    'register.subtitle': 'Fill in your details to join Jornal Manifesto.',
    'register.name': 'Full Name',
    'register.email': 'Email',
    'register.phone': 'Phone Number',
    'register.role': 'Account Type',
    'register.role_reader': 'Reader / Student',
    'register.role_admin': 'Administrator / Writer',
    'register.create': 'Create account',
    'register.has_account': 'Already have an account?',
    'register.login_link': 'Sign In',

    // Feed Page
    'feed.hello': 'Hello',
    'feed.subtitle': 'In-depth analysis and explanations selected for you.',
    'feed.weekly_title': 'Weekly Manifesto',
    'feed.editorials': 'Categories',
    'feed.clear_filters': 'Clear Filters',
    'feed.loading_news': 'Loading news...',
    'feed.error_loading': 'Could not load news.',
    'feed.retry': 'Try Again',
    'feed.no_news': 'No news found.',
    'feed.no_news_sub': 'Try changing your filters or adding new interests in your profile.',
    'feed.today': 'TODAY',
    'feed.read_more': 'Read full article',
    'feed.cat_for_you': '📍 For You',
    'feed.cat_all': '🌐 All',

    // Instagram Banner
    'insta.community': 'Active Community',
    'insta.headline_start': 'Connect with ',
    'insta.headline_end': ' on Instagram',
    'insta.subtext': 'Get daily stories, behind-the-scenes reporting, video content, explanatory carousels, and join our polls.',
    'insta.badge_carousels': 'Explanatory Carousels',
    'insta.badge_debates': 'Youth Debates',
    'insta.badge_interaction': 'Direct Interaction',
    'insta.cta_button': 'Follow on Instagram',
    'insta.footnote': '@manifesto_espro • Daily transforming content',

    // Podcast Section
    'podcast.title_start': 'Manifesto ',
    'podcast.title_end': 'Podcast',
    'podcast.youtube_badge': 'On YouTube',
    'podcast.subtitle': 'Watch or listen to our episodes directly on the site',
    'podcast.youtube_button': 'YouTube Channel',
    'podcast.episode': 'Episode',
    'podcast.all_episodes': 'All Episodes',
    'podcast.available': 'available',

    // Admin Page
    'admin.title': 'Admin Dashboard',
    'admin.new_post': 'New Article',
    'admin.manage_news': 'Published Articles',
    'admin.manage_users': 'Registered Users',
    'admin.edit': 'Edit',
    'admin.delete': 'Delete',
    'admin.no_posts': 'No news published yet.',
    'admin.modal_new_title': 'Create New Article',
    'admin.modal_edit_title': 'Edit Article',
    'admin.title_label': 'Article Title',
    'admin.summary_label': 'Summary / Subtitle',
    'admin.content_label': 'Article Content',
    'admin.category_label': 'Category',
    'admin.image_label': 'Cover Image URL',
    'admin.read_time_label': 'Read Time',
    'admin.save_button': 'Save Article',
    'admin.cancel_button': 'Cancel',

    // About Page
    'about.title': 'About Jornal Manifesto',
    'about.subtitle': 'A project of youth, critical, and accessible journalism.',
    'about.back_feed': 'Back to Feed',

    // News Detail Page
    'news_detail.back': 'Back to Feed',
    'news_detail.share': 'Share',
    'news_detail.copied': 'Link copied to clipboard!',
    'news_detail.font_size': 'Font size',
    'news_detail.related': 'Other recommended articles',
    'news_detail.not_found': 'Article not found.',
    'news_detail.like': 'Like article'
  },
  'es-ES': {
    // Header & Navigation
    'header.search_placeholder': 'Buscar noticias...',
    'header.search': 'Buscar...',
    'header.admin_tooltip': 'Panel Admin',
    'nav.feed': 'Inicio',
    'nav.admin': 'Admin',
    'nav.profile': 'Perfil',

    // Footer
    'footer.about': 'Sobre nosotros',
    'footer.rights': 'Jornal Manifesto. Todos los derechos reservados.',
    'footer.contact': 'Contacto',

    // Profile Page
    'profile.title': 'Mi Perfil',
    'profile.free_account': '✓ Cuenta Gratuita Manifesto',
    'profile.admin_title': 'Acciones de Administrador',
    'profile.admin_desc': 'Acceda al panel para gestionar noticias y usuarios.',
    'profile.admin_button': 'Acceder al Panel Admin',
    'profile.language': 'Idioma',
    'profile.language_pt': 'Português (Brasil)',
    'profile.language_en': 'English (US)',
    'profile.language_es': 'Español',
    'profile.2fa': 'Autenticación de Dos Factores',
    'profile.2fa_enabled': 'Activado',
    'profile.2fa_disabled': 'Desactivado',
    'profile.theme': 'Tema',
    'profile.theme_light': 'Claro',
    'profile.theme_dark': 'Oscuro',
    'profile.saved_interests': 'Intereses Guardados',
    'profile.no_interests': 'Aún no has seleccionado temas preferidos.',
    'profile.edit_interests': 'Editar intereses',
    'profile.logout': 'Cerrar Sesión',

    // Auth (Login & Register)
    'login.title': 'Bienvenido de nuevo',
    'login.subtitle': 'Ingrese su correo o teléfono y contraseña para acceder.',
    'login.email_or_phone': 'Correo o Teléfono',
    'login.password': 'Contraseña',
    'login.enter': 'Iniciar Sesión',
    'login.loading': 'Iniciando...',
    'login.no_account': '¿No tienes una cuenta?',
    'login.register_link': 'Regístrate gratis',
    'register.title': 'Crea tu cuenta',
    'register.subtitle': 'Rellene los datos a continuación para unirse a Jornal Manifesto.',
    'register.name': 'Nombre Completo',
    'register.email': 'Correo Electrónico',
    'register.phone': 'Teléfono',
    'register.role': 'Tipo de Cuenta',
    'register.role_reader': 'Lector / Estudiante',
    'register.role_admin': 'Administrador / Redactor',
    'register.create': 'Crear mi cuenta',
    'register.has_account': '¿Ya tienes una cuenta?',
    'register.login_link': 'Iniciar Sesión',

    // Feed Page
    'feed.hello': 'Hola',
    'feed.subtitle': 'Análisis profundos y explicaciones seleccionadas para ti.',
    'feed.weekly_title': 'Manifesto Semanal',
    'feed.editorials': 'Categorías',
    'feed.clear_filters': 'Limpiar Filtros',
    'feed.loading_news': 'Cargando noticias...',
    'feed.error_loading': 'No se pudieron cargar las noticias.',
    'feed.retry': 'Reintentar',
    'feed.no_news': 'No se encontraron noticias.',
    'feed.no_news_sub': 'Intenta cambiar los filtros o añadir nuevos intereses en tu perfil.',
    'feed.today': 'HOY',
    'feed.read_more': 'Leer artículo completo',
    'feed.cat_for_you': '📍 Para Ti',
    'feed.cat_all': '🌐 Todo',

    // Instagram Banner
    'insta.community': 'Comunidad Activa',
    'insta.headline_start': 'Conéctate con ',
    'insta.headline_end': ' en Instagram',
    'insta.subtext': 'Recibe pautas diarias, detrás de escena de reportajes, videos, carruseles explicativos y vota en nuestras encuestas.',
    'insta.badge_carousels': 'Carruseles Explicativos',
    'insta.badge_debates': 'Debates Juveniles',
    'insta.badge_interaction': 'Interacción Directa',
    'insta.cta_button': 'Seguir en Instagram',
    'insta.footnote': '@manifesto_espro • Contenido diario y transformador',

    // Podcast Section
    'podcast.title_start': 'Podcast ',
    'podcast.title_end': 'Manifesto',
    'podcast.youtube_badge': 'En YouTube',
    'podcast.subtitle': 'Escucha o mira nuestros episodios directamente en el sitio',
    'podcast.youtube_button': 'Canal de YouTube',
    'podcast.episode': 'Episodio',
    'podcast.all_episodes': 'Todos los Episodios',
    'podcast.available': 'disponibles',

    // Admin Page
    'admin.title': 'Panel de Administración',
    'admin.new_post': 'Nueva Noticia',
    'admin.manage_news': 'Noticias Publicadas',
    'admin.manage_users': 'Usuarios Registrados',
    'admin.edit': 'Editar',
    'admin.delete': 'Eliminar',
    'admin.no_posts': 'Ninguna noticia publicada aún.',
    'admin.modal_new_title': 'Crear Nueva Noticia',
    'admin.modal_edit_title': 'Editar Noticia',
    'admin.title_label': 'Título de la Noticia',
    'admin.summary_label': 'Resumen / Subtítulo',
    'admin.content_label': 'Contenido del Artículo',
    'admin.category_label': 'Categoría',
    'admin.image_label': 'URL de la Imagen de Portada',
    'admin.read_time_label': 'Tiempo de Lectura',
    'admin.save_button': 'Guardar Noticia',
    'admin.cancel_button': 'Cancelar',

    // About Page
    'about.title': 'Sobre Jornal Manifesto',
    'about.subtitle': 'Un proyecto de periodismo joven, crítico y accesible.',
    'about.back_feed': 'Volver al Feed',

    // News Detail Page
    'news_detail.back': 'Volver al Feed',
    'news_detail.share': 'Compartir',
    'news_detail.copied': '¡Enlace copiado al portapapeles!',
    'news_detail.font_size': 'Tamaño del texto',
    'news_detail.related': 'Otras noticias recomendadas',
    'news_detail.not_found': 'Noticia no encontrada.',
    'news_detail.like': 'Me gusta'
  }
};

const categoryTranslations: Record<Language, Record<string, string>> = {
  'pt-BR': {
    '🧠 TECNOLOGIA': 'Tecnologia',
    '💼 TRABALHO E FUTURO': 'Trabalho e Futuro',
    '🎭 CULTURA': 'Cultura',
    '💡 EXPLICAÇÕES': 'Explicações',
    '🌍 SOCIEDADE': 'Sociedade',
    '📰 NOTÍCIAS': 'Notícias'
  },
  'en-US': {
    '🧠 TECNOLOGIA': 'Technology',
    '💼 TRABALHO E FUTURO': 'Work & Future',
    '🎭 CULTURA': 'Culture',
    '💡 EXPLICAÇÕES': 'Explanations',
    '🌍 SOCIEDADE': 'Society',
    '📰 NOTÍCIAS': 'News'
  },
  'es-ES': {
    '🧠 TECNOLOGIA': 'Tecnología',
    '💼 TRABALHO E FUTURO': 'Trabajo y Futuro',
    '🎭 CULTURA': 'Cultura',
    '💡 EXPLICAÇÕES': 'Explicaciones',
    '🌍 SOCIEDADE': 'Sociedad',
    '📰 NOTÍCIAS': 'Noticias'
  }
};

const weeklySegmentTranslations: Record<Language, Record<number, { label: string; title: string; description: string }>> = {
  'pt-BR': {
    1: { label: 'Segunda', title: 'Você perdeu', description: 'mas a Manifesto te conta' },
    2: { label: 'Terça', title: 'Você Sabia?', description: 'Conceitos e curiosidades explicadas' },
    3: { label: 'Quarta', title: 'Destaque Semanal', description: 'Grandes inovações digitais em foco' },
    4: { label: 'Quinta', title: 'Cultura Explicada', description: 'Tendências, música, moda e séries' },
    5: { label: 'Sexta', title: 'Manifesto Recomenda', description: 'Críticas e indicações da equipe' }
  },
  'en-US': {
    1: { label: 'Monday', title: 'Missed it?', description: 'Manifesto breaks it down' },
    2: { label: 'Tuesday', title: 'Did You Know?', description: 'Concepts and trivia explained' },
    3: { label: 'Wednesday', title: 'Weekly Highlight', description: 'Digital innovations in focus' },
    4: { label: 'Thursday', title: 'Culture Explained', description: 'Trends, music, fashion & series' },
    5: { label: 'Friday', title: 'Manifesto Recommends', description: 'Reviews and team picks' }
  },
  'es-ES': {
    1: { label: 'Lunes', title: '¿Te lo perdiste?', description: 'Manifesto te lo cuenta' },
    2: { label: 'Martes', title: '¿Sabías Qué?', description: 'Conceptos y curiosidades explicadas' },
    3: { label: 'Miércoles', title: 'Destacado Semanal', description: 'Grandes innovaciones digitales' },
    4: { label: 'Jueves', title: 'Cultura Explicada', description: 'Tendencias, música, moda y series' },
    5: { label: 'Viernes', title: 'Manifesto Recomienda', description: 'Críticas y selecciones del equipo' }
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('manifesto_language') as Language;
    if (saved && (saved === 'pt-BR' || saved === 'en-US' || saved === 'es-ES')) {
      return saved;
    }
    return 'pt-BR';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('manifesto_language', lang);
  };

  const t = (key: string): string => {
    const langDict = translations[language] || translations['pt-BR'];
    return langDict[key] || translations['pt-BR'][key] || key;
  };

  const translateCategory = (category: string): string => {
    const langCat = categoryTranslations[language] || categoryTranslations['pt-BR'];
    return langCat[category] || category;
  };

  const translateWeeklySegment = (day: number) => {
    const langSeg = weeklySegmentTranslations[language] || weeklySegmentTranslations['pt-BR'];
    return langSeg[day] || weeklySegmentTranslations['pt-BR'][day];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translateCategory, translateWeeklySegment }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
