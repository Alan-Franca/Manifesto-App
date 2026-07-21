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
  const [infoMessage, setInfoMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // States for 2FA
  const [is2FA, setIs2FA] = useState(false);
  const [tempUserId, setTempUserId] = useState('');
  const [code2FA, setCode2FA] = useState('');

  // States for Pending Registration Verification
  const [isPendingVerification, setIsPendingVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [otpData, setOtpData] = useState({ emailCode: '', phoneCode: '' });

  const { login, verify2FA, resend2FACode, verifyRegistration, resendVerificationCode } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    setIsLoading(true);

    const result = await login(emailOrPhone, password);
    setIsLoading(false);

    if (result.success) {
      navigate('/preferences');
    } else if (result.require2FA) {
      setIs2FA(true);
      setTempUserId(result.tempUserId || '');
      setInfoMessage('Código de autenticação enviado para o seu e-mail cadastrado.');
    } else if (result.verificationRequired) {
      setIsPendingVerification(true);
      setPendingEmail(result.email || '');
      setInfoMessage('Sua conta precisa de verificação inicial. Códigos enviados por e-mail e SMS.');
    } else {
      setError(result.error || 'Email/telefone ou senha incorretos');
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    setIsLoading(true);

    const success = await verify2FA(tempUserId, code2FA);
    setIsLoading(false);

    if (success) {
      navigate('/preferences');
    } else {
      setError('Código 2FA incorreto ou expirado');
    }
  };

  const handleResend2FA = async () => {
    setError('');
    setInfoMessage('');
    setResendLoading(true);

    const result = await resend2FACode(tempUserId);
    setResendLoading(false);

    if (result.success) {
      setInfoMessage(result.message || 'Novo código 2FA enviado para seu e-mail!');
    } else {
      setError(result.error || 'Falha ao reenviar código 2FA');
    }
  };

  const handlePendingVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    setIsLoading(true);

    const success = await verifyRegistration(pendingEmail, otpData.emailCode, otpData.phoneCode);
    setIsLoading(false);

    if (success) {
      navigate('/preferences');
    } else {
      setError('Código de e-mail ou telefone incorreto');
    }
  };

  const handleResendVerification = async () => {
    setError('');
    setInfoMessage('');
    setResendLoading(true);

    const result = await resendVerificationCode(pendingEmail);
    setResendLoading(false);

    if (result.success) {
      setInfoMessage(result.message || 'Novos códigos enviados por e-mail e SMS!');
    } else {
      setError(result.error || 'Falha ao reenviar códigos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logo} alt="Manifesto" className="h-16 mx-auto mb-4" />
          
          {is2FA ? (
            <>
              <h1 className="text-3xl mb-2 font-display font-bold text-primary">Autenticação de Dois Fatores</h1>
              <p className="text-muted-foreground text-sm">Digite o código de 6 dígitos enviado ao seu e-mail</p>
            </>
          ) : isPendingVerification ? (
            <>
              <h1 className="text-3xl mb-2 font-display font-bold text-primary">Verificar Cadastro</h1>
              <p className="text-muted-foreground text-sm font-medium text-destructive">
                Verificação necessária para ativar sua conta
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl mb-2 font-display font-bold text-primary">Bem-vindo de volta</h1>
              <p className="text-muted-foreground text-sm">Entre para continuar lendo o Jornal Manifesto</p>
            </>
          )}
        </div>

        {is2FA ? (
          <form onSubmit={handle2FASubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Código 2FA (6 dígitos)</Label>
              <Input
                type="text"
                placeholder="000000"
                value={code2FA}
                onChange={(e) => setCode2FA(e.target.value)}
                maxLength={6}
                required
                className="text-center font-mono text-xl tracking-[0.5em] py-3 font-bold"
                autoFocus
              />
            </div>

            {infoMessage && (
              <p className="text-primary text-xs font-semibold text-center bg-primary/10 p-2.5 rounded-lg border border-primary/20">{infoMessage}</p>
            )}

            {error && (
              <p className="text-destructive text-sm font-medium text-center bg-destructive/10 p-2.5 rounded-lg border border-destructive/20">{error}</p>
            )}

            <Button type="submit" className="w-full font-semibold" size="lg" disabled={isLoading}>
              {isLoading ? 'Verificando...' : 'Confirmar Acesso'}
            </Button>

            <div className="flex flex-col gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="w-full text-xs font-semibold"
                onClick={handleResend2FA}
                disabled={resendLoading || isLoading}
              >
                {resendLoading ? 'Reenviando...' : 'Reenviar Código por E-mail'}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full text-xs text-muted-foreground"
                onClick={() => {
                  setIs2FA(false);
                  setError('');
                  setInfoMessage('');
                }}
                disabled={isLoading}
              >
                Voltar ao login
              </Button>
            </div>
          </form>
        ) : isPendingVerification ? (
          <form onSubmit={handlePendingVerifySubmit} className="space-y-4">
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
              <Label>Código enviado para o Telefone (SMS)</Label>
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

            {infoMessage && (
              <p className="text-primary text-xs font-semibold text-center bg-primary/10 p-2.5 rounded-lg border border-primary/20">{infoMessage}</p>
            )}

            {error && (
              <p className="text-destructive text-sm font-medium text-center bg-destructive/10 p-2.5 rounded-lg border border-destructive/20">{error}</p>
            )}

            <Button type="submit" className="w-full font-semibold" size="lg" disabled={isLoading}>
              {isLoading ? 'Verificando...' : 'Confirmar e Ativar Conta'}
            </Button>

            <div className="flex flex-col gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="w-full text-xs font-semibold"
                onClick={handleResendVerification}
                disabled={resendLoading || isLoading}
              >
                {resendLoading ? 'Reenviando...' : 'Reenviar Códigos (E-mail e SMS)'}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full text-xs text-muted-foreground"
                onClick={() => {
                  setIsPendingVerification(false);
                  setError('');
                  setInfoMessage('');
                }}
                disabled={isLoading}
              >
                Cancelar e voltar
              </Button>
            </div>
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
