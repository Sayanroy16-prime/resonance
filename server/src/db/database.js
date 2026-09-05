import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { config } from '../config/index.js';

// Ensure data directory exists
const dbDir = path.dirname(config.dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new DatabaseSync(config.dbPath);

// Enable Foreign Keys & WAL mode for high concurrency
db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA journal_mode = WAL;');

// Initialize schema if tables do not exist
export const initSchema = () => {
  if (fs.existsSync(config.schemaPath)) {
    const schemaSql = fs.readFileSync(config.schemaPath, 'utf8');
    db.exec(schemaSql);
  }
};

// Database helper utilities
export const dbHelper = {
  get(sql, ...params) {
    const stmt = db.prepare(sql);
    return stmt.get(...params);
  },
  all(sql, ...params) {
    const stmt = db.prepare(sql);
    return stmt.all(...params);
  },
  run(sql, ...params) {
    const stmt = db.prepare(sql);
    return stmt.run(...params);
  },
  exec(sql) {
    return db.exec(sql);
  }
};

// Auto-run schema init on load
initSchema();
