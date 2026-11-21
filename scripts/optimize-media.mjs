// Converte as capturas reais (feitas com Playwright nos apps rodando localmente)
// e a foto profissional em WebP otimizado para publicação.
// Uso: npm run media
import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const captures = resolve(root, "_captures");
const outProjects = resolve(root, "public/media/projects");
const outAbout = resolve(root, "public/media/about");
await mkdir(outProjects, { recursive: true });
await mkdir(outAbout, { recursive: true });

const apps = ["ebinex", "clinical", "workforce", "shift", "student"];
const jobs = [];
for (const app of apps) {
  const desktop = resolve(captures, `${app}-desktop.png`);
  const mobile = resolve(captures, `${app}-mobile.png`);
  if (existsSync(desktop)) {
    jobs.push(sharp(desktop).resize({ width: 1600 }).webp({ quality: 82 }).toFile(resolve(outProjects, `${app}-desktop-1600.webp`)));
    jobs.push(sharp(desktop).resize({ width: 960 }).webp({ quality: 78 }).toFile(resolve(outProjects, `${app}-desktop-960.webp`)));
  }
  if (existsSync(mobile)) {
    jobs.push(sharp(mobile).resize({ width: 520 }).webp({ quality: 80 }).toFile(resolve(outProjects, `${app}-mobile-520.webp`)));
  }
}

const photo = resolve(root, "Foto Profissional.png");
if (existsSync(photo)) {
  jobs.push(sharp(photo).resize({ width: 1100 }).webp({ quality: 82 }).toFile(resolve(outAbout, "joao-morais-1100.webp")));
  jobs.push(sharp(photo).resize({ width: 640 }).webp({ quality: 80 }).toFile(resolve(outAbout, "joao-morais-640.webp")));
}

const fallback = resolve(captures, "scene-still.png");
if (existsSync(fallback)) {
  jobs.push(sharp(fallback).resize({ width: 1920 }).webp({ quality: 80 }).toFile(resolve(root, "public/media/scene-still.webp")));
}
const fallbackMobile = resolve(captures, "scene-still-mobile.png");
if (existsSync(fallbackMobile)) {
  jobs.push(sharp(fallbackMobile).resize({ width: 860 }).webp({ quality: 80 }).toFile(resolve(root, "public/media/scene-still-mobile.webp")));
}

const results = await Promise.all(jobs);
for (const r of results) console.log(`${r.width}x${r.height} ${Math.round(r.size / 1024)} KB`);
console.log(`${results.length} arquivos gerados.`);
void stat;
