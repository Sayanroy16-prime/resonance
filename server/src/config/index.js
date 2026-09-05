import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = {
  port: process.env.PORT || 5001,
  jwtSecret: process.env.JWT_SECRET || 'resonance_spotify_super_secret_jwt_key_2026',
  jwtExpiresIn: '30d',
  corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  dbPath: path.resolve(__dirname, '../../../server/data/resonance.db'),
  schemaPath: path.resolve(__dirname, '../db/schema.sql'),
  env: process.env.NODE_ENV || 'development'
};
