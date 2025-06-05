import express from 'express';
import userRoutes from './routes/userRoutes';
import flowRoutes from './routes/flowRoutes';
import authRoutes from './routes/authRoutes';

const app = express();
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', flowRoutes);
app.use('/api', authRoutes);

app.listen(3000, () => {
  console.log('Servidor rodando');
});

