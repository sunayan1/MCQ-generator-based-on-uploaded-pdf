import express from 'express';
import pdf_routes from './routes/pdf_routes.js';
import { config } from 'dotenv';

config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use('/api', pdf_routes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
