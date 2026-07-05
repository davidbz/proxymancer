import { existsSync } from "node:fs";
import crx3 from "crx3";

const KEY_PATH = "key.pem";
const CRX_PATH = "proxymancer.crx";
const ZIP_PATH = "proxymancer.zip";

if (!existsSync("dist/manifest.json")) {
  console.error("[proxymancer] dist/ not found — run `npm run build` first.");
  process.exit(1);
}

// crx3 packs dist/ (manifest at the archive root) into two artifacts:
//   - proxymancer.crx : signed with keyPath (generated on first run) for
//     self-hosting / enterprise installs.
//   - proxymancer.zip : the Chrome Web Store upload artifact.
await crx3(["dist/manifest.json"], {
  keyPath: KEY_PATH,
  crxPath: CRX_PATH,
  zipPath: ZIP_PATH,
});

console.log(`[proxymancer] packed → ${CRX_PATH} + ${ZIP_PATH} (signing key: ${KEY_PATH})`);
