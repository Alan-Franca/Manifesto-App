# Manifesto - Plataforma de Notícias

Site minimalista para o jornal Manifesto, desenvolvido com React, TypeScript e Tailwind CSS.

## Características

### Autenticação
- **Cadastro**: Nome, Email, Telefone, Sexo, Senha e Confirmação de Senha
- **Login**: Email/Telefone e Senha
- Autenticação de dois fatores (2FA)

### Experiência do Usuário
- Pop-up de preferências após login (Esportes, Moda, Economia, etc.)
- Animação com avatar minimalista dando joinha
- Feed personalizado baseado nas preferências
- Navegação inferior em dispositivos móveis
- Header com logo, busca e perfil

### Perfil do Usuário
- Upload de foto de perfil (Premium)
- Alteração de idioma (PT-BR, EN-US, ES-ES)
- Ativação de 2FA
- Alternância entre tema claro e escuro

### Planos
- **Gratuito**: Com anúncios e funcionalidades limitadas
- **Premium**: 
  - Sem anúncios
  - Customização completa de perfil
  - Notificações por email e SMS
  - Conteúdo exclusivo

## Paleta de Cores
- Azul Principal: #09456c
- Branco: #fffffd
- Preto: #1a1b1c

## Tecnologias
- React 18.3.1
- TypeScript
- Tailwind CSS v4
- React Router DOM
- Lucide React (ícones)
- Motion (animações)
- Radix UI (componentes)

## Como Usar

1. **Primeiro Acesso**:
   - Clique em "Cadastre-se"
   - Preencha todos os campos
   - Após login, selecione suas preferências
   - Clique em "Explorar" após a animação

2. **Feed Principal**:
   - Notícias personalizadas baseadas nas preferências
   - Busca de notícias no header
   - Navegação via menu inferior (mobile)

3. **Perfil**:
   - Acesse pelo ícone no header
   - Configure idioma, tema e 2FA
   - Faça upgrade para Premium para recursos exclusivos

## Design
- Interface minimalista e limpa
- Totalmente responsivo
- Sem scroll horizontal em dispositivos móveis
- Animações suaves
- Acessibilidade considerada
