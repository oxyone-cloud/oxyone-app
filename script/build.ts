import { build as esbuild } from "esbuild";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildAll() {
  console.log("Building client with Vite...");
  execSync("npx vite build", { stdio: "inherit" });

  console.log("Building server with esbuild (ESM mode)...");
  await esbuild({
    entryPoints: [path.resolve(__dirname, "../server/index.ts")],
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node20",
    outfile: path.resolve(__dirname, "../dist/index.js"),
    packages: "external",
  });

  console.log("Build complete: dist/index.js generated!");
}

buildAll().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});