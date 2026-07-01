import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import logo from '../../imports/image.png';

export function Login() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // States for 2FA
  const [is2FA, setIs2FA] = useState(false);
  const [tempUserId, setTempUserId] = useState('');
  const [code2FA, setCode2FA] = useState('');
  const [dev2faCode, setDev2faCode] = useState('');

  // States for Pending Registration Verification
  const [isPendingVerification, setIsPendingVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [otpData, setOtpData] = useState({ emailCode: '', phoneCode: '' });
  const [devVerificationCodes, setDevVerificationCodes] = useState<{ emailCode?: string; phoneCode?: string } | null>(null);

  const { login, verify2FA, verifyRegistration } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(emailOrPhone, password);
    setIsLoading(false);

    if (result.success) {
      navigate('/preferences');
    } else if (result.require2FA) {
      setIs2FA(true);
      setTempUserId(result.tempUserId || '');
      if (result.otpCode) {
        setDev2faCode(result.otpCode);
      }
    } else if (result.verificationRequired) {
      setIsPendingVerification(true);
      setPendingEmail(result.email || '');
      if (result.emailCode && result.phoneCode) {
        setDevVerificationCodes({
          emailCode: result.emailCode,
          phoneCode: result.phoneCode
        });
      }
    } else {
      setError(result.error || 'Email/telefone ou senha incorretos');
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await verify2FA(tempUserId, code2FA);
    setIsLoading(false);

    if (success) {
      navigate('/preferences');
    } else {
      setError('Código de 2 fatores incorreto ou expirado');
    }
  };

  const handlePendingVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await verifyRegistration(pendingEmail, otpData.emailCode, otpData.phoneCode);
    setIsLoading(false);

    if (success) {
      navigate('/preferences');
    } else {
      setError('Código de e-mail ou telefone incorreto');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logo} alt="Manifesto" className="h-16 mx-auto mb-4" />
          
          {is2FA ? (
            <>
              <h1 className="text-3xl mb-2">Autenticação de Dois Fatores</h1>
              <p className="text-muted-foreground">Digite o código 2FA enviado para seu e-mail</p>
            </>
          ) : isPendingVerification ? (
            <>
              <h1 className="text-3xl mb-2">Verificar Cadastro</h1>
              <p className="text-muted-foreground font-medium text-destructive">
                Verificação necessária para ativar sua conta
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl mb-2">Bem-vindo de volta</h1>
              <p className="text-muted-foreground">Entre para continuar lendo</p>
            </>
          )}
        </div>

        {is2FA ? (
          <form onSubmit={handle2FASubmit} className="space-y-4">
            {dev2faCode && (
              <div className="bg-primary/10 border border-primary/20 text-xs p-3 rounded-lg text-left">
                <p className="font-semibold text-primary mb-1">🔑 Código 2FA de Teste (Simulador):</p>
                <p>Código: <code className="font-bold bg-muted px-1.5 py-0.5 rounded text-sm">{dev2faCode}</code></p>
                <p className="text-[10px] text-muted-foreground mt-2">
                  * Em produção real, este código é enviado via e-mail.
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label>Código 2FA (6 dígitos)</Label>
              <Input
                type="text"
                placeholder="000000"
                value={code2FA}
                onChange={(e) => setCode2FA(e.target.value)}
                maxLength={6}
                required
                className="text-center font-mono text-lg tracking-widest"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-destructive text-sm text-center">{error}</p>
            )}

            <Button type="submit" className="w-full font-semibold" size="lg" disabled={isLoading}>
              {isLoading ? 'Verificando...' : 'Confirmar Acesso'}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIs2FA(false)}
              disabled={isLoading}
            >
              Voltar ao login
            </Button>
          </form>
        ) : isPendingVerification ? (
          <form onSubmit={handlePendingVerifySubmit} className="space-y-4">
            {devVerificationCodes && (
              <div className="bg-primary/10 border border-primary/20 text-xs p-3 rounded-lg text-left font-sans">
                <p className="font-semibold text-primary mb-1">🔑 Códigos de Teste (Simulador):</p>
                <p>Código E-mail: <code className="font-bold bg-muted px-1.5 py-0.5 rounded text-sm">{devVerificationCodes.emailCode}</code></p>
                <p>Código Telefone: <code className="font-bold bg-muted px-1.5 py-0.5 rounded text-sm">{devVerificationCodes.phoneCode}</code></p>
              </div>
            )}
            <div className="space-y-2">
              <Label>Código enviado para o E-mail ({pendingEmail})</Label>
              <Input
                type="text"
                placeholder="000000"
                value={otpData.emailCode}
                onChange={(e) => setOtpData(prev => ({ ...prev, emailCode: e.target.value }))}
                maxLength={6}
                required
                className="text-center font-mono text-lg tracking-widest"
              />
            </div>

            <div className="space-y-2">
              <Label>Código enviado para o Telefone</Label>
              <Input
                type="text"
                placeholder="000000"
                value={otpData.phoneCode}
                onChange={(e) => setOtpData(prev => ({ ...prev, phoneCode: e.target.value }))}
                maxLength={6}
                required
                className="text-center font-mono text-lg tracking-widest"
              />
            </div>

            {error && (
              <p className="text-destructive text-sm text-center">{error}</p>
            )}

            <Button type="submit" className="w-full font-semibold" size="lg" disabled={isLoading}>
              {isLoading ? 'Verificando...' : 'Confirmar e Ativar Conta'}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIsPendingVerification(false)}
              disabled={isLoading}
            >
              Cancelar e voltar
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Email ou Telefone</Label>
              <Input
                type="text"
                placeholder="seu@email.com ou (00) 00000-0000"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Senha</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-destructive text-sm text-center">{error}</p>
            )}

            <Button type="submit" className="w-full font-semibold" size="lg" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Não tem uma conta?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-primary hover:underline font-semibold"
              >
                Cadastre-se
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
