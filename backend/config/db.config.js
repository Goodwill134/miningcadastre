import dotenv from 'dotenv';

dotenv.config();

export const dbConfig = {
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:preci@localhost:5432/Masvingodb',
  type: 'postgres',
  graphql: true,
  openapi: true,
  schemalock: true
};
