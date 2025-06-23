# Sistema de Fluxo de Caixa (Backend)

## Descrição

Este é o backend do sistema que gerencia o fluxo de caixa de uma pequena empresa. Permite realizar movimentações de entrada e saída, atualizando o sistema de caixa com separação de responsabilidades e acessos entre administradores e usuários comuns.

## Tecnologias Utilizadas

- Node.js
- Express
- Swagger (para documentação da API)
- Prisma ORM (para acesso ao banco de dados)
- Banco de dados hospedado em neon.tech

## Funcionalidades

- CRUD usuários e movimentações financeiras
- Recuperação de senha
- Autenticação via JWT
- Controle de acessos por perfil (admin e usuário comum)

## Modelo do Banco de Dados

```prisma
model User {
  id                  Int         @id @default(autoincrement())
  name                String
  email               String      @unique
  password            String
  role                RoleType
  resetPasswordToken  String?
  resetTokenExpiry    DateTime?
  loginTries          Int         @default(0)
  blockedUntil        DateTime?
  fluxosCaixa         FluxoCaixa[]
}

enum RoleType {
  admin
  user
}

model FluxoCaixa {
  id                  Int             @id @default(autoincrement())
  idUsuario           Int
  tipo                TipoMovimentacao
  classificacao       ClassificacaoMovimentacao
  valor               Decimal         @db.Decimal(10,2)
  formaPagamento      FormaPagamento
  dataMovimentacao    DateTime
  descricao           String?
  alterado            String?

  usuario             User            @relation(fields: [idUsuario], references: [id])
}

model SaldoAtual {
  id                  Int             @id @default(autoincrement())
  saldoConta          Decimal         @db.Decimal(10,2)
  saldoCaixa          Decimal         @db.Decimal(10,2)
  data                DateTime
}

enum TipoMovimentacao {
  Entrada
  Saida
}

enum FormaPagamento {
  Pix
  Dinheiro
  Cartao
}

enum ClassificacaoMovimentacao {
  Venda
  Compra
  Investimento
  PrestacaoServico
  GastoFixo
}
```
## Autenticação

Utiliza JWT para autenticação e controle de sessões.

## Pré-requisitos

- Node.js instalado
- Conta ativa em algum serviço de disparo de emails (utilizado SendGrid no projeto)
- Banco de dados ativo (Neon.tech foi utilizado)

## Instalação

Clone o repositório via git:

```bash
git clone <https://github.com/gabrielkazak/FluxoDeCaixa---BACKEND>

npm install

npm run start
```

## Configurações

No arquivo `.env` configure:

- URL de conexão com o banco de dados
- Chave da API do serviço de disparo de emails (SendGrid)

## Desenvolvedores

- Arthur dos Reis  
- Gabriel da Silva Kazakevicius

