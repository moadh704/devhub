import fs from 'fs';
import path from 'path';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'url';

const FILE = process.env.SQLITE_FILE || '/tmp/devhub.sqlite';
const BLOB_PATH = 'db/devhub.sqlite';
const schemaPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../prisma/bootstrap.sql');

async function loadBlob() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  const { get } = await import('@vercel/blob');
  try {
    const result = await get(BLOB_PATH, { access: 'private' });
    if (!result || result.statusCode === 404) return null;
    if (result.stream) {
      const chunks = [];
      for await (const chunk of result.stream) chunks.push(Buffer.from(chunk));
      return Buffer.concat(chunks);
    }
    if (typeof result.arrayBuffer === 'function') return Buffer.from(await result.arrayBuffer());
    return null;
  } catch (err) {
    const msg = String(err && err.message);
    if (!/404|not found|BlobNotFound/i.test(msg)) console.error('blob load', msg);
    return null;
  }
}

export async function persistDatabase() {
  if (!process.env.BLOB_READ_WRITE_TOKEN || !fs.existsSync(FILE)) return;
  const { put } = await import('@vercel/blob');
  await put(BLOB_PATH, fs.readFileSync(FILE), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/octet-stream',
  });
}

export async function ensureDatabase() {
  process.env.DATABASE_URL = `file:${FILE}`;
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'light-demo-jwt-secret-devhub';
  fs.mkdirSync(path.dirname(FILE), { recursive: true });

  const bytes = await loadBlob();
  if (bytes && bytes.length) fs.writeFileSync(FILE, bytes);

  const db = new DatabaseSync(FILE);
  db.exec('PRAGMA foreign_keys = ON');
  const exists = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'User'").get();
  if (!exists) db.exec(fs.readFileSync(schemaPath, 'utf8'));
  const count = Number(db.prepare('SELECT COUNT(*) AS c FROM User').get().c || 0);
  db.close();

  if (count === 0) {
    const { seed } = await import('../prisma/seed.js');
    await seed();
    await persistDatabase();
  }
}
