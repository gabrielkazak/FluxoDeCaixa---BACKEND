import express from 'express';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes';
import flowRoutes from './routes/flowRoutes';
import authRoutes from './routes/authRoutes';
import recPasswordRoutes from './routes/recPasswordRoutes';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../src/documentation/swaggerConfig';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', userRoutes);
app.use('/api', flowRoutes);
app.use('/api', authRoutes);
app.use('/api', recPasswordRoutes);

app.listen(3000, () => {
  console.log('Servidor rodando');
});

export default app;
