import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 3002,
  host: process.env.HOST || '0.0.0.0',
  env: process.env.NODE_ENV || 'development',
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
};
