// src/config/swaggerConfig.ts
import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sistema Fluxo API',
      version: '1.0.0',
      description: 'Documentação da API do sistema de autenticação e usuários.',
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
  apis: [
    './routes/*.ts'
  ],
};


const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
