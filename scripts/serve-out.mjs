// Serves the static export (./out) under the GitHub Pages base path, behaving like Pages does:
//   /vamshi-portfolio/about/  → out/about/index.html
//   /vamshi-portfolio/about   → 301 to /vamshi-portfolio/about/
//   anything missing          → out/404.html with status 404
// Used by the Playwright tests (and handy for previewing a production build: npm run build && npm run serve).
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "/vamshi-portfolio";
const PORT = Number(process.env.PORT ?? 4173);
const ROOT = fileURLToPath(new URL("../out/", import.meta.url));

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
};

async function send(res, status, file) {
  const body = await readFile(file);
  res.writeHead(status, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
  res.end(body);
}

const notFound = (res) => send(res, 404, join(ROOT, "404.html")).catch(() => res.writeHead(404).end("Not found"));
const redirect = (res, to) => res.writeHead(301, { location: to }).end();

createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  const path = decodeURIComponent(url.pathname);

  if (path === "/" || path === BASE) return redirect(res, `${BASE}/`);
  if (!path.startsWith(`${BASE}/`)) return notFound(res);

  const rel = normalize(path.slice(BASE.length)).replace(/^[\\/]+/, "");
  let file = join(ROOT, rel);
  if (!file.startsWith(ROOT.replace(/[\\/]$/, "") + sep) && file !== ROOT) return notFound(res); // path traversal

  try {
    const info = await stat(file);
    if (info.isDirectory()) {
      if (!path.endsWith("/")) return redirect(res, `${path}/${url.search}`);
      file = join(file, "index.html");
    }
    await send(res, 200, file);
  } catch {
    await notFound(res);
  }
}).listen(PORT, () => console.log(`Serving out/ at http://localhost:${PORT}${BASE}/`));
