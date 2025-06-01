import express from 'express';
import router from './routes/userRoutes';

const app = express();
app.use(express.json());

app.use('/api', router); 

app.listen(3000, () => {
  console.log('Servidor rodando');
});

