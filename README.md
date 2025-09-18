# MedControl 💊

Um aplicativo mobile multiplataforma para gerenciamento de medicamentos, desenvolvido com React Native/Expo e Node.js.

## 📋 Sobre o Projeto

### Contextualização do Problema

O uso contínuo de medicamentos é uma necessidade de milhões de pessoas no Brasil, especialmente em tratamentos de longo prazo, como hipertensão, diabetes, depressão e outras condições crônicas.

No entanto, grande parte dos pacientes enfrenta dificuldades em organizar seus horários, lembrar de tomar as doses corretas e acompanhar sua adesão ao tratamento.

**Problemas comuns:**
- Esquecimento de doses, comprometendo a eficácia do tratamento
- Falta de acompanhamento estruturado sobre horários e atrasos
- Ausência de ferramentas digitais simples e acessíveis para monitoramento

Essas falhas podem resultar em complicações de saúde, aumento de custos médicos e menor qualidade de vida.

### Objetivo do Projeto

Desenvolver o MedControl, um aplicativo mobile multiplataforma que auxilie usuários no gerenciamento de medicamentos de forma simples e segura, com apoio de um backend robusto para armazenamento e lógica de negócios.

**O MedControl terá como principais objetivos:**
- Agendar e notificar o usuário sobre horários de medicação
- Registar doses tomadas, atrasadas ou esquecidas
- Facilitar a usabilidade por meio de interface limpa, responsiva e acessível

## 🚀 Funcionalidades

### Principais Recursos
- **Cadastro de Medicamentos**: Registre medicamentos com horários personalizados
- **Notificações Inteligentes**: Lembretes automáticos nos horários corretos
- **Assistente de Voz**: Anúncio automático do medicamento e dose a ser tomada
- **Histórico Completo**: Acompanhamento de todas as doses tomadas, atrasadas ou esquecidas
- **Interface Intuitiva**: Design limpo e acessível para todas as idades
- **Finalização Automática**: Medicamentos com data de término são finalizados automaticamente

### Regras de Negócio

1. **Bloqueio de Cadastro de Medicamento**:
   - A frequência não pode ser menor ou igual a 0
   - A data de término não pode ser menor do que a de cadastro

2. **Validação de Doses**:
   - Não permitir doses em data anterior à atual
   - Impedir dose duplicada

3. **Geração de Horários**:
   - Gerar automaticamente os horários futuros baseados na frequência
   - Calcular atrasos e status das doses

4. **Histórico Obrigatório**:
   - Todas as ações são registradas para acompanhamento

5. **Assistente de Voz**:
   - Anúncio automático do nome do medicamento e dose no horário programado

6. **Finalização Automática**:
   - Medicamentos com data de finalização são desativados automaticamente

## 🛠️ Tecnologias Utilizadas

### Frontend (Mobile App)
- **React Native** com **Expo** - Framework multiplataforma
- **TypeScript** - Tipagem estática
- **React Navigation** - Navegação entre telas
- **Expo Notifications** - Sistema de notificações
- **Expo Speech** - Assistente de voz
- **AsyncStorage** - Armazenamento local

### Backend (API)
- **Node.js** com **Express** - Servidor web
- **TypeScript** - Tipagem estática
- **Prisma** - ORM para banco de dados
- **SQLite** - Banco de dados
- **JWT** - Autenticação
- **bcrypt** - Criptografia de senhas
- **Zod** - Validação de dados

## 📱 Estrutura do Projeto

```
medcontrol/
├── medcontrol-app/          # Aplicativo mobile (React Native/Expo)
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── screens/         # Telas da aplicação
│   │   ├── services/        # Serviços e APIs
│   │   ├── contexts/        # Contextos React
│   │   ├── hooks/           # Hooks customizados
│   │   ├── navigation/      # Configuração de navegação
│   │   ├── types/           # Definições de tipos
│   │   └── utils/           # Utilitários
│   └── android/             # Configurações Android
└── medcontrol-backend/      # API Backend (Node.js)
    ├── src/
    │   ├── controllers/     # Controladores das rotas
    │   ├── services/        # Lógica de negócio
    │   ├── models/          # Modelos de dados
    │   ├── routes/          # Definição das rotas
    │   ├── middlewares/     # Middlewares
    │   ├── validators/      # Validações
    │   └── utils/           # Utilitários
    └── prisma/              # Schema e migrações do banco
```

## 🚀 Como Executar o Projeto

### Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Expo CLI** (para o app mobile)
- **Git**

### 1. Clone o Repositório

```bash
git clone https://github.com/wesley-andrade/MedControl_WLL.git
cd MedControl_WLL
```

### 2. Configuração do Backend

```bash
# Navegue para a pasta do backend
cd medcontrol-backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Crie um arquivo .env na pasta medcontrol-backend com:
# DATABASE_URL="file:./dev.db"
# JWT_SECRET="sua-chave-secreta-aqui"

# Execute as migrações do banco de dados
npx prisma migrate dev

# Gere o cliente Prisma
npx prisma generate

# Inicie o servidor de desenvolvimento
npm run dev
```

O backend estará rodando em `http://localhost:3000`

### 3. Configuração do App Mobile

```bash
# Navegue para a pasta do app (em um novo terminal)
cd medcontrol-app

# Instale as dependências
npm install

# Configure a URL da API
# Edite o arquivo src/config/api.ts e ajuste a URL base da API

# Inicie o servidor de desenvolvimento
npm start
```

### 4. Executar no Dispositivo

#### Android
```bash
# Com o backend rodando, execute:
npm run android
```

#### iOS
```bash
# Com o backend rodando, execute:
npm run ios
```

#### Web (para testes)
```bash
# Com o backend rodando, execute:
npm run web
```

## 📱 Como Usar

1. **Cadastro/Login**: Crie uma conta ou faça login
2. **Adicionar Medicamento**: 
   - Informe nome, dosagem e frequência
   - Defina data de início e fim (opcional)
   - Adicione observações se necessário
3. **Gerenciar Doses**: 
   - Visualize horários programados
   - Marque doses como tomadas
   - Registre atrasos ou esquecimentos
4. **Histórico**: Acompanhe seu histórico de medicação
5. **Notificações**: Receba lembretes automáticos com assistente de voz

## 🔧 Scripts Disponíveis

### Backend
- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm run build` - Compila o TypeScript
- `npm start` - Inicia o servidor compilado

### Frontend
- `npm start` - Inicia o servidor Expo
- `npm run android` - Executa no Android
- `npm run ios` - Executa no iOS
- `npm run web` - Executa no navegador
- `npm run lint` - Executa o linter

## 👥 Equipe

Desenvolvido como projeto acadêmico para a matéria de Desenvolvimento para Dispositivos Moveis (TADS).

**Alunos:** Wesley, Luis e Luan