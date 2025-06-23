import 'dotenv/config';

import express, { NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import routes from './routes';

const { PORT = 3100 } = process.env;
const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');

// Только для локальных тестов. Не использовать это в проде
app.use(cors());
app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133', // Хардкодный ID пользователя
  };
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Server start on port: ${PORT}`));
