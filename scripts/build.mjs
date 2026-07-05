import { existsSync } from "node:fs";
import { cp, mkdir, rm } from "node:fs/promises";
import * as esbuild from "esbuild";

const OUTDIR = "dist";
const watch = process.argv.includes("--watch");

/** @type {import("esbuild").BuildOptions} */
const options = {
  entryPoints: ["src/background.ts", "src/popup.ts"],
  outdir: OUTDIR,
  bundle: true,
  format: "esm",
  target: "chrome120",
  logLevel: "info",
  minify: !watch,
  sourcemap: watch,
};

async function copyStatic() {
  await cp("src/manifest.json", `${OUTDIR}/manifest.json`);
  await cp("src/popup.html", `${OUTDIR}/popup.html`);
  if (existsSync("src/icons")) {
    await cp("src/icons", `${OUTDIR}/icons`, { recursive: true });
  }
}

await rm(OUTDIR, { recursive: true, force: true });
await mkdir(OUTDIR, { recursive: true });
await copyStatic();

if (watch) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  console.log(
    "[proxymancer] watching src/ — reload the unpacked extension in Chrome after changes",
  );
} else {
  await esbuild.build(options);
  console.log("[proxymancer] build complete → dist/");
}
