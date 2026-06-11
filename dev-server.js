/**
 * Local development API server.
 * Mimics Vercel's serverless function environment for local testing.
 * Run alongside `npm run dev` — Vite proxies /api calls to this server.
 *
 * Usage: node dev-server.js
 */

import { createServer } from 'http';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env manually (no dotenv dependency)
const __dirname = dirname(fileURLToPath(import.meta.url));
try {
  const envContent = readFileSync(join(__dirname, '.env'), 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim();
        process.env[key] = val;
      }
    }
  }
} catch {
  console.warn('No .env file found — API key must be set in environment');
}

// Dynamically import the handler
const { default: handler } = await import('./api/recommend.js');

const server = createServer(async (req, res) => {
  // Only handle /api/recommend
  if (!req.url.startsWith('/api/recommend')) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  // Parse body for POST
  let body = '';
  for await (const chunk of req) {
    body += chunk;
  }

  // Create a mock Vercel-like req/res
  const mockReq = {
    method: req.method,
    headers: req.headers,
    body: body ? JSON.parse(body) : {},
  };

  const mockRes = {
    statusCode: 200,
    headers: {},
    setHeader(key, val) {
      this.headers[key] = val;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      res.writeHead(this.statusCode, {
        ...this.headers,
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify(data));
    },
    end() {
      res.writeHead(this.statusCode, this.headers);
      res.end();
    },
  };

  try {
    await handler(mockReq, mockRes);
  } catch (err) {
    console.error('Handler error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`API dev server running on http://localhost:${PORT}`);
  console.log(`Gemini API key: ${process.env.GEMINI_API_KEY ? '✓ loaded' : '✗ missing'}`);
});
