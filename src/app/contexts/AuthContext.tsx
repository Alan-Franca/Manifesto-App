import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  profileImage?: string;
  preferences?: string[];
  language?: string;
  twoFactorEnabled?: boolean;
  isPremium?: boolean;
  role?: string;
}

export interface LoginResult {
  success: boolean;
  require2FA?: boolean;
  verificationRequired?: boolean;
  tempUserId?: string;
  email?: string;
  error?: string;
  otpCode?: string;      // returned for dev ease
  emailCode?: string;    // returned for dev ease
  phoneCode?: string;    // returned for dev ease
}

export interface RegisterResult {
  success: boolean;
  email?: string;
  error?: string;
  emailCode?: string; // returned for dev ease
  phoneCode?: string; // returned for dev ease
}

interface AuthContextType {
  user: User | null;
  login: (emailOrPhone: string, password: string) => Promise<LoginResult>;
  verify2FA: (tempUserId: string, code: string) => Promise<boolean>;
  register: (data: Omit<User, 'id'> & { password: string }) => Promise<RegisterResult>;
  verifyRegistration: (email: string, emailCode: string, phoneCode: string) => Promise<boolean>;
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
              id: data.user._id
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

      if (res.status === 202 && data.verificationRequired) {
        return {
          success: false,
          verificationRequired: true,
          email: data.email,
          error: data.message,
          emailCode: data.emailCode,
          phoneCode: data.phoneCode
        };
      }

      if (res.ok) {
        if (data.require2FA) {
          return {
            success: false,
            require2FA: true,
            tempUserId: data.tempUserId,
            otpCode: data.otpCode
          };
        }

        const mappedUser = {
          ...data.user,
          id: data.user._id
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
          id: data.user._id
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

      if (res.ok || res.status === 201) {
        return {
          success: true,
          email: data.email,
          emailCode: responseData.emailCode,
          phoneCode: responseData.phoneCode
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

  const verifyRegistration = async (email: string, emailCode: string, phoneCode: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/verify-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, emailCode, phoneCode })
      });

      if (res.ok) {
        const data = await res.json();
        const mappedUser = {
          ...data.user,
          id: data.user._id
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
          id: resData.user._id
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
      register, 
      verifyRegistration, 
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
