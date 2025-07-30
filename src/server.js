import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';

import authRouter from './routers/auth.js';
import contactsRouter from './routers/contacts.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';

function setupServer() {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json());
  app.use(cookieParser());
  
  app.get('/', (req, res) => {
  res.json({ message: "Welcome to my API" });
});


   app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);
  
   app.use(notFoundHandler);
  app.use(errorHandler);
 

  return app;
}

export default setupServer;
