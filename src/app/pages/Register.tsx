import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useAuth } from '../contexts/AuthContext';
import logo from '../../imports/image.png';

export function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    password: '',
    confirmPassword: ''
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpData, setOtpData] = useState({
    emailCode: '',
    phoneCode: ''
  });
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const { register, verifyRegistration, resendVerificationCode } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    const result = await register(formData);
    setIsLoading(false);

    if (result.success) {
      setIsVerifying(true);
      setInfoMessage('Códigos de verificação enviados por e-mail e SMS.');
    } else {
      setError(result.error || 'Email ou telefone já cadastrado');
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    setIsLoading(true);

    const success = await verifyRegistration(
      formData.email,
      otpData.emailCode,
      otpData.phoneCode
    );
    setIsLoading(false);

    if (success) {
      navigate('/preferences');
    } else {
      setError('Código de e-mail ou telefone incorreto');
    }
  };

  const handleResendCodes = async () => {
    setError('');
    setInfoMessage('');
    setResendLoading(true);

    const result = await resendVerificationCode(formData.email);
    setResendLoading(false);

    if (result.success) {
      setInfoMessage(result.message || 'Novos códigos de verificação enviados!');
    } else {
      setError(result.error || 'Falha ao reenviar códigos');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtpData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background overflow-y-auto">
      <div className="w-full max-w-md my-8">
        <div className="text-center mb-8">
          <img src={logo} alt="Manifesto" className="h-16 mx-auto mb-4" />
          
          {isVerifying ? (
            <>
              <h1 className="text-3xl mb-2 font-display font-bold text-primary">Verificar Conta</h1>
              <p className="text-muted-foreground text-sm">
                Enviamos os códigos de confirmação por e-mail e SMS
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl mb-2 font-display font-bold text-primary">Criar conta</h1>
              <p className="text-muted-foreground text-sm">Cadastre-se para começar a ler o Jornal Manifesto gratuitamente</p>
            </>
          )}
        </div>

        {isVerifying ? (
          <form onSubmit={handleVerifySubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Código enviado para o E-mail ({formData.email})</Label>
              <Input
                type="text"
                name="emailCode"
                placeholder="000000"
                value={otpData.emailCode}
                onChange={handleOtpChange}
                maxLength={6}
                required
                className="text-center font-mono text-lg tracking-widest"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label>Código enviado para o Telefone ({formData.phone})</Label>
              <Input
                type="text"
                name="phoneCode"
                placeholder="000000"
                value={otpData.phoneCode}
                onChange={handleOtpChange}
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
                onClick={handleResendCodes}
                disabled={resendLoading || isLoading}
              >
                {resendLoading ? 'Reenviando...' : 'Reenviar Códigos (E-mail e SMS)'}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full text-xs text-muted-foreground"
                onClick={() => {
                  setIsVerifying(false);
                  setError('');
                  setInfoMessage('');
                }}
                disabled={isLoading}
              >
                Voltar ao cadastro
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                type="text"
                name="name"
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Email (Domínios temporários serão bloqueados)</Label>
              <Input
                type="email"
                name="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Telefone (DDD + Número)</Label>
              <Input
                type="tel"
                name="phone"
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Sexo</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                  <SelectItem value="prefiro-nao-dizer">Prefiro não dizer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Senha</Label>
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Confirmar Senha</Label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {error && (
              <p className="text-destructive text-sm text-center">{error}</p>
            )}

            <Button type="submit" className="w-full font-semibold" size="lg" disabled={isLoading}>
              {isLoading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Já tem uma conta?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-primary hover:underline font-semibold"
              >
                Entrar
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
