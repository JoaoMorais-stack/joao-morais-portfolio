// Servidor local mínimo para o build estático (out/), só em 127.0.0.1.
// Simula uma hospedagem estática: diretórios servem index.html, 404.html no resto.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "..", "out");
const port = Number(process.env.PORT ?? 3210);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

async function resolveFile(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split("?")[0])).replace(/^([/\\])+/, "");
  const full = resolve(join(root, clean));
  if (full !== root && !full.startsWith(root + sep)) return null;
  try {
    const s = await stat(full);
    if (s.isDirectory()) return join(full, "index.html");
    return full;
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const file = await resolveFile(req.url ?? "/");
  try {
    if (!file) throw new Error("404");
    const body = await readFile(file);
    res.writeHead(200, {
      "content-type": types[extname(file)] ?? "application/octet-stream",
      "cache-control": file.includes(`${sep}_next${sep}`) ? "public, max-age=31536000, immutable" : "no-cache",
      "x-content-type-options": "nosniff",
    });
    res.end(body);
  } catch {
    const body = await readFile(join(root, "404.html")).catch(() => Buffer.from("404"));
    res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    res.end(body);
  }
}).listen(port, "127.0.0.1", () => console.log(`http://127.0.0.1:${port}/`));
