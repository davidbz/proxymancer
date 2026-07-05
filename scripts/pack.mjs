import { existsSync } from "node:fs";
import crx3 from "crx3";

const KEY_PATH = "key.pem";
const CRX_PATH = "proxymancer.crx";

if (!existsSync("dist/manifest.json")) {
  console.error("[proxymancer] dist/ not found — run `npm run build` first.");
  process.exit(1);
}

// crx3 zips the directory containing the manifest, signs it with keyPath
// (generating the key on first run), and writes the .crx.
await crx3(["dist/manifest.json"], {
  keyPath: KEY_PATH,
  crxPath: CRX_PATH,
});

console.log(`[proxymancer] packed → ${CRX_PATH} (signing key: ${KEY_PATH})`);
