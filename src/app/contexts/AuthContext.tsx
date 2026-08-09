import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  gender: string;
  profileImage?: string;
  preferences?: string[];
  language?: string;
  twoFactorEnabled?: boolean;
  role?: string;
}

function migratePreferences(preferences?: string[]): string[] {
  if (!preferences) return [];
  const migrationMap: Record<string, string> = {
    'Tecnologia': '🧠 TECNOLOGIA',
    'Esportes': '📰 NOTÍCIAS',
    'Moda': '🎭 CULTURA',
    'Economia': '📰 NOTÍCIAS',
    'Política': '📰 NOTÍCIAS',
    'Cultura': '🎭 CULTURA',
    'Entretenimento': '🎭 CULTURA',
    'Ciência': '🧠 TECNOLOGIA',
    'Saúde': '🌍 SOCIEDADE',
    'Educação': '💼 TRABALHO E FUTURO'
  };

  const migrated = preferences.map(pref => {
    if ([
      '🧠 TECNOLOGIA',
      '💼 TRABALHO E FUTURO',
      '🎭 CULTURA',
      '💡 EXPLICAÇÕES',
      '🌍 SOCIEDADE',
      '📰 NOTÍCIAS'
    ].includes(pref)) {
      return pref;
    }
    return migrationMap[pref] || null;
  }).filter((pref): pref is string => pref !== null);

  return Array.from(new Set(migrated));
}

export interface DeliveryInfo {
  success: boolean;
  mode: 'production' | 'simulation';
  error?: string;
  details?: string;
}

export interface LoginResult {
  success: boolean;
  require2FA?: boolean;
  verificationRequired?: boolean;
  tempUserId?: string;
  email?: string;
  error?: string;
  emailDelivery?: DeliveryInfo;
  smsDelivery?: DeliveryInfo;
}

export interface RegisterResult {
  success: boolean;
  email?: string;
  error?: string;
  emailDelivery?: DeliveryInfo;
  smsDelivery?: DeliveryInfo;
}

interface ResendResult {
  success: boolean;
  message?: string;
  error?: string;
  emailDelivery?: DeliveryInfo;
  smsDelivery?: DeliveryInfo;
}

interface AuthContextType {
  user: User | null;
  login: (emailOrPhone: string, password: string) => Promise<LoginResult>;
  verify2FA: (tempUserId: string, code: string) => Promise<boolean>;
  resend2FACode: (tempUserId: string) => Promise<ResendResult>;
  register: (data: Omit<User, 'id'> & { password: string }) => Promise<RegisterResult>;
  verifyRegistration: (email: string, emailCode: string) => Promise<boolean>;
  resendVerificationCode: (email: string) => Promise<ResendResult>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<boolean>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const logDeliveryDiagnostics = (label: string, emailDelivery?: DeliveryInfo, smsDelivery?: DeliveryInfo) => {
    console.group(`[MANIFESTO AUTH DIAGNÓSTICO - ${label}]`);
    if (emailDelivery) {
      if (emailDelivery.mode === 'production') {
        if (emailDelivery.success) {
          console.log(`%c[E-MAIL REAL DE PRODUÇÃO] Sent: ${emailDelivery.details}`, 'color: #10b981; font-weight: bold;');
        } else {
          console.error(`%c[ERRO E-MAIL REAL SMTP] Falha no disparo de e-mail: ${emailDelivery.error}`, 'color: #ef4444; font-weight: bold;');
          console.error(`Detalhes: ${emailDelivery.details}`);
        }
      } else {
        console.warn(`%c[E-MAIL SIMULAÇÃO/TESTE] ${emailDelivery.details}`, 'color: #f59e0b; font-weight: bold;');
      }
    }
    if (smsDelivery) {
      if (smsDelivery.mode === 'production') {
        if (smsDelivery.success) {
          console.log(`%c[SMS REAL TWILIO] Sent: ${smsDelivery.details}`, 'color: #10b981; font-weight: bold;');
        } else {
          console.error(`%c[ERRO SMS REAL TWILIO] Falha no disparo de SMS: ${smsDelivery.error}`, 'color: #ef4444; font-weight: bold;');
        }
      } else {
        console.warn(`%c[SMS SIMULAÇÃO/TESTE] ${smsDelivery.details}`, 'color: #f59e0b; font-weight: bold;');
      }
    }
    console.groupEnd();
  };

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('manifesto_token');
      if (token) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            // Map MongoDB _id to frontend id
            const mappedUser = {
              ...data.user,
              id: data.user._id,
              preferences: migratePreferences(data.user.preferences)
            };
            setUser(mappedUser);
            setIsAuthenticated(true);
          } else {
            // Token expired or invalid
            localStorage.removeItem('manifesto_token');
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Erro ao conectar ao servidor para carregar perfil:', error);
        }
      }
      setIsLoading(false);
    }
    loadUser();
  }, []);

  const login = async (emailOrPhone: string, password: string): Promise<LoginResult> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emailOrPhone, password })
      });

      const data = await res.json();

      logDeliveryDiagnostics('Login', data.emailDelivery, data.smsDelivery);

      if (res.status === 202 && data.verificationRequired) {
        return {
          success: false,
          verificationRequired: true,
          email: data.email,
          error: data.message,
          emailDelivery: data.emailDelivery,
          smsDelivery: data.smsDelivery
        };
      }

      if (res.ok) {
        if (data.require2FA) {
          return {
            success: false,
            require2FA: true,
            tempUserId: data.tempUserId,
            emailDelivery: data.emailDelivery
          };
        }

        const mappedUser = {
          ...data.user,
          id: data.user._id,
          preferences: migratePreferences(data.user.preferences)
        };
        
        localStorage.setItem('manifesto_token', data.token);
        setUser(mappedUser);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return {
          success: false,
          error: data.error || 'Erro ao fazer login'
        };
      }
    } catch (error) {
      console.error('Erro de rede no login:', error);
      return {
        success: false,
        error: 'Conexão com o servidor falhou. Verifique se o backend está rodando.'
      };
    }
  };

  const verify2FA = async (tempUserId: string, code: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tempUserId, code })
      });

      if (res.ok) {
        const data = await res.json();
        const mappedUser = {
          ...data.user,
          id: data.user._id,
          preferences: migratePreferences(data.user.preferences)
        };
        
        localStorage.setItem('manifesto_token', data.token);
        setUser(mappedUser);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro de rede na verificação 2FA:', error);
      return false;
    }
  };

  const resend2FACode = async (tempUserId: string): Promise<ResendResult> => {
    try {
      const res = await fetch('/api/auth/resend-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tempUserId })
      });

      const data = await res.json();
      logDeliveryDiagnostics('Reenviar 2FA', data.emailDelivery, undefined);

      if (res.ok) {
        return { success: true, message: data.message, emailDelivery: data.emailDelivery };
      } else {
        return { success: false, error: data.error || 'Erro ao reenviar código 2FA' };
      }
    } catch (error) {
      console.error('Erro de rede ao reenviar 2FA:', error);
      return { success: false, error: 'Erro de conexão com o servidor.' };
    }
  };

  const register = async (data: Omit<User, 'id'> & { password: string }): Promise<RegisterResult> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const responseData = await res.json();
      logDeliveryDiagnostics('Cadastro Inicial', responseData.emailDelivery, responseData.smsDelivery);

      if (res.ok || res.status === 201) {
        return {
          success: true,
          email: data.email,
          emailDelivery: responseData.emailDelivery,
          smsDelivery: responseData.smsDelivery
        };
      } else {
        return {
          success: false,
          error: responseData.error || 'Erro ao registrar usuário'
        };
      }
    } catch (error) {
      console.error('Erro de rede no registro:', error);
      return {
        success: false,
        error: 'Conexão com o servidor falhou. Verifique se o backend está rodando.'
      };
    }
  };

  const verifyRegistration = async (email: string, emailCode: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/verify-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, emailCode })
      });

      if (res.ok) {
        const data = await res.json();
        const mappedUser = {
          ...data.user,
          id: data.user._id,
          preferences: migratePreferences(data.user.preferences)
        };
        
        localStorage.setItem('manifesto_token', data.token);
        setUser(mappedUser);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro de rede na verificação de cadastro:', error);
      return false;
    }
  };

  const resendVerificationCode = async (email: string): Promise<ResendResult> => {
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      logDeliveryDiagnostics('Reenviar Verificação de Cadastro', data.emailDelivery, data.smsDelivery);

      if (res.ok) {
        return {
          success: true,
          message: data.message,
          emailDelivery: data.emailDelivery,
          smsDelivery: data.smsDelivery
        };
      } else {
        return { success: false, error: data.error || 'Erro ao reenviar códigos' };
      }
    } catch (error) {
      console.error('Erro de rede ao reenviar códigos:', error);
      return { success: false, error: 'Erro de conexão com o servidor.' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('manifesto_token');
  };

  const updateUser = async (data: Partial<User>): Promise<boolean> => {
    const token = localStorage.getItem('manifesto_token');
    if (!token) return false;

    try {
      const res = await fetch('/api/auth/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        const resData = await res.json();
        const mappedUser = {
          ...resData.user,
          id: resData.user._id,
          preferences: migratePreferences(resData.user.preferences)
        };
        setUser(mappedUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro de rede ao atualizar perfil:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      verify2FA, 
      resend2FACode,
      register, 
      verifyRegistration, 
      resendVerificationCode,
      logout, 
      updateUser, 
      isAuthenticated,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
