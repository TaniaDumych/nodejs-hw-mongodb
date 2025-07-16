import mongoose from 'mongoose';
import 'dotenv/config';

async function initMongoConnection() {
  try {
    const {
      MONGODB_USER,
      MONGODB_PASSWORD,
      MONGODB_URL,
      MONGODB_DB,
    } = process.env;

    const connectionString = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

    await mongoose.connect(connectionString);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Mongo connection failed:', error.message);
    process.exit(1);
  }
}

export default initMongoConnection;
