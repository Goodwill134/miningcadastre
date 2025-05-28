const dotenv = require('dotenv');
const { z } = require('zod');

dotenv.config();

const envSchema = z.object({
  PORT: z.string().transform(Number).default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  // Database
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().transform(Number).default(5432),
  DB_USER: z.string().default('cada_engine'),
  DB_PASSWORD: z.string().default('postgres'),
  DB_NAME: z.string().default('cada_engine'),
  // JWT
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('24h')
});

const env = envSchema.parse(process.env);

const config = {
  app: {
    port: env.PORT,
    env: env.NODE_ENV
  },
  database: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    name: env.DB_NAME
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN
  }
};

module.exports = { config };
