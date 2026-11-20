import { defineConfig } from "@playwright/test";

// Testa o build estático servido localmente (npm run build antes).
export default defineConfig({
  testDir: "tests",
  timeout: 45_000,
  fullyParallel: false,
  workers: 2,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:3210",
    channel: "chrome",
    launchOptions: { args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] },
  },
  webServer: {
    command: "node scripts/serve-static.mjs",
    url: "http://127.0.0.1:3210/pt/",
    reuseExistingServer: true,
    timeout: 20_000,
  },
});
