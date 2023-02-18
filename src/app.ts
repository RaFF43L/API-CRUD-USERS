import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';

import { config } from 'dotenv';
import { errors } from 'celebrate';
import { AppRouter } from './router';
import { MongoConnection } from './infra/mongo';

config();

class App {
  express!: express.Application;
  constructor() {
    this.inicializar();
  }

  inicializar() {
    // eslint-disable-next-line
    const errorHandling = (err, req, res, next) => {
      console.log(err);
      res.status(500).send({
        msg: err.message,
        success: false,
      });
    };
    const corsOptions = {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    };
    this.express = express();
    this.express.use(cors(corsOptions));
    this.express.use(helmet());
    this.express.use(compression());
    this.express.use(express.json({ limit: '50mb' }));
    this.express.use(express.urlencoded({ limit: '50mb', extended: true }));
    this.express.use(
      morgan(
        ':date[iso] HTTP/:http-version :method :url :status :response-time ms',
      ),
    );
    this.express.use(AppRouter);
    this.express.use(errors());
    this.express.use(errorHandling);
    this.conectarBancoDadosMongo();
  }
  conectarBancoDadosMongo = async () => {
    await MongoConnection.conectar();
  };
}

const app = new App().express;

export { app };
