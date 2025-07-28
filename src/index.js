import 'dotenv/config';          
import initMongoConnection from './db/initMongoConnection.js';
import setupServer from './server.js';

(async () => {
  await initMongoConnection();
  
  const app = setupServer();
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
})();

