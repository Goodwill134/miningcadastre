import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Determine the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file in the backend directory
// This MUST be called before importing any modules that rely on process.env
const envPath = path.resolve(__dirname, '../.env'); // Path to .env in backend/ relative to scripts/
const dotenvResult = dotenv.config({ path: envPath });

if (dotenvResult.error) {
  console.error('ERROR loading .env file:', dotenvResult.error);
} else {
}

import { initDatabase } from '../src/utils/db.js';

async function main() {
  console.log('Starting database initialization...');
  try {
    await initDatabase();
    console.log('Database initialization completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

main();
