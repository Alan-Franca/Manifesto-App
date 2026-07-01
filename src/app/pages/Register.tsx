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
  const [devCodes, setDevCodes] = useState<{ emailCode?: string; phoneCode?: string } | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, verifyRegistration } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

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
      if (result.emailCode && result.phoneCode) {
        setDevCodes({
          emailCode: result.emailCode,
          phoneCode: result.phoneCode
        });
      }
    } else {
      setError(result.error || 'Email ou telefone já cadastrado');
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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
              <h1 className="text-3xl mb-2">Verificar Conta</h1>
              <p className="text-muted-foreground">
                Enviamos os códigos de confirmação para seus contatos
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl mb-2">Criar conta</h1>
              <p className="text-muted-foreground">Cadastre-se para começar a ler</p>
            </>
          )}
        </div>

        {isVerifying ? (
          <form onSubmit={handleVerifySubmit} className="space-y-4">
            {devCodes && (
              <div className="bg-primary/10 border border-primary/20 text-xs p-3 rounded-lg text-left">
                <p className="font-semibold text-primary mb-1">🔑 Códigos de Teste (Simulador):</p>
                <p>Código E-mail: <code className="font-bold bg-muted px-1.5 py-0.5 rounded text-sm">{devCodes.emailCode}</code></p>
                <p>Código Telefone: <code className="font-bold bg-muted px-1.5 py-0.5 rounded text-sm">{devCodes.phoneCode}</code></p>
                <p className="text-[10px] text-muted-foreground mt-2">
                  * Em produção real, esses códigos são enviados via SMTP e Twilio.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label>Código enviado para o E-mail ({formData.email})</Label>
              <Input
                type="text"
                name="emailCode"
                placeholder="Digite o código de 6 dígitos"
                value={otpData.emailCode}
                onChange={handleOtpChange}
                maxLength={6}
                required
                className="text-center font-mono text-lg tracking-widest"
              />
            </div>

            <div className="space-y-2">
              <Label>Código enviado para o Telefone ({formData.phone})</Label>
              <Input
                type="text"
                name="phoneCode"
                placeholder="Digite o código de 6 dígitos"
                value={otpData.phoneCode}
                onChange={handleOtpChange}
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
              onClick={() => setIsVerifying(false)}
              disabled={isLoading}
            >
              Voltar ao cadastro
            </Button>
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
