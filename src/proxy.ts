// Pure proxy-config logic. No `chrome.*` access lives here so it can be unit
// tested without any browser mocks. `background.ts` is the only thing that
// bridges this to the real `chrome.proxy` API.

export type ProxyScheme = "http" | "https" | "socks4" | "socks5";

export interface ProxySettings {
  enabled: boolean;
  scheme: ProxyScheme;
  host: string;
  port: number;
  bypassList: string[];
}

export const DEFAULT_SETTINGS: ProxySettings = {
  enabled: false,
  scheme: "http",
  host: "",
  port: 8080,
  bypassList: [],
};

// ponytail: IPv4 / :-bearing IPv6 / CIDR — never wildcard-prefix these.
const IP_OR_CIDR = /^(\d{1,3}(\.\d{1,3}){3}(\/\d+)?|.*:.*)$/;

/**
 * Turn a bare domain into a subdomain-suffix match: `whatsapp.com` -> `*.whatsapp.com`
 * (matches `foo.whatsapp.com`, not `evilwhatsapp.com`). Left alone: entries already
 * wildcarded, single-label hosts like `localhost`, and IP/CIDR literals.
 */
function toSuffixMatch(entry: string): string {
  if (entry.includes("*") || entry.startsWith(".")) return entry;
  if (!entry.includes(".") || IP_OR_CIDR.test(entry)) return entry;
  return `*.${entry}`;
}

/** Normalize a raw bypass-list string (newline/comma separated) into clean entries. */
export function parseBypassList(raw: string): string[] {
  return raw
    .split(/[\n,]/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
    .map(toSuffixMatch);
}

/**
 * Translate plain settings into a `chrome.proxy` config.
 * Disabled (or missing host) hands control back to the OS via "system" mode.
 */
export function buildProxyConfig(settings: ProxySettings): chrome.proxy.ProxyConfig {
  if (!settings.enabled || !settings.host) {
    return { mode: "system" };
  }
  return {
    mode: "fixed_servers",
    rules: {
      singleProxy: {
        scheme: settings.scheme,
        host: settings.host,
        port: settings.port,
      },
      bypassList: settings.bypassList,
    },
  };
}
