import { app } from './app';
import { config } from 'dotenv';

config();

const { PORT } = process.env;

app.listen(PORT || 9999, () => {
  console.log(`API RODANDO NA PORTA ${PORT}`);
});
