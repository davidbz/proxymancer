// Minimal, dependency-free logging surface for the extension: a console wrapper
// that adds a prefix and a single mute switch. Set SILENT to true to quiet it.
const SILENT = false;
const PREFIX = "[proxymancer]";

export const logger = {
  info: (...args: unknown[]) => {
    if (!SILENT) console.info(PREFIX, ...args);
  },
  error: (...args: unknown[]) => {
    if (!SILENT) console.error(PREFIX, ...args);
  },
};
