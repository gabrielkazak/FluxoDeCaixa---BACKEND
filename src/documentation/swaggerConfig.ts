// src/config/swaggerConfig.ts
import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sistema Fluxo API',
      version: '1.0.0',
      description: 'Documentação da API do sistema de fluxo de caixa, rotas separadas em autenticação, rotas de usuário, rotas de movimentação, e recuperação de senha.',
    },
    tags: [
      {
        name: 'Auth',
        description: 'Rotas de autenticação (login, registro, logout)',
      },
      {
        name: 'User',
        description: 'Rotas relacionadas ao gerenciamento de usuários',
      },
      {
        name: 'RecPassword',
        description: 'Rotas para recuperação de senha',
      },
      {
        name: 'Movimentações',
        description: 'Rotas relacionadas as movimentações do caixa',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
