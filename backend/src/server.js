import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createReadStream, existsSync, statSync } from "node:fs";
import { createGzip } from "node:zlib";
import { handleApiRequest } from "./router.js";
import { startSchedulers } from "./services/scheduler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 4000);

const app = express();

// Enable gzip compression for all responses
app.use((req, res, next) => {
  const acceptEncoding = req.headers['accept-encoding'] || '';
  if (acceptEncoding.includes('gzip')) {
    // Will be handled per-response
  }
  next();
});

app.use(cors());
app.use(express.json());

// API routes
app.use("/api", handleApiRequest);
app.get("/health", (_req, res) => res.json({ ok: true, service: "gigshield-backend", now: new Date().toISOString() }));

// Serve built frontend (PWA) in production
const distPath = path.resolve(__dirname, "../../gigshield-ui/dist");

// Custom static file serving with gzip support
function serveGzipped(req, res, filePath, options = {}) {
  const gzPath = filePath + '.gz';
  const acceptGzip = (req.headers['accept-encoding'] || '').includes('gzip');
  
  // Try pre-compressed .gz file first
  if (acceptGzip && existsSync(gzPath)) {
    const stat = statSync(gzPath);
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.html': 'text/html',
      '.json': 'application/json',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.ico': 'image/x-icon',
    };
    res.set({
      'Content-Encoding': 'gzip',
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'Content-Length': stat.size,
      'Vary': 'Accept-Encoding',
      ...options.headers
    });
    createReadStream(gzPath).pipe(res);
    return true;
  }
  return false;
}

// Serve hashed assets with aggressive caching
app.use("/assets", express.static(path.join(distPath, "assets"), { 
  maxAge: '1y', 
  immutable: true,
  etag: true
}));

// Serve other static files (icons, manifest, etc.)
app.use(express.static(distPath, {
  maxAge: '1h',
  index: false,
  etag: true
}));

// Always serve index.html with no-cache for all navigation / SPA routes
app.get("*", (_req, res) => {
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  startSchedulers();
  console.log(`GigShield backend listening on http://0.0.0.0:${port}`);
});
