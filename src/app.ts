import 'dotenv/config';

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import routes from './routes';

const { PORT = 3100 } = process.env;
const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');

// Только для локальных тестов. Не использовать это в проде
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Server start on port: ${PORT}`));
