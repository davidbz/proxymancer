import { logger } from "./log";
import { buildProxyConfig, DEFAULT_SETTINGS, type ProxySettings } from "./proxy";

const STORAGE_KEY = "settings";

async function loadSettings(): Promise<ProxySettings> {
  const stored = await chrome.storage.sync.get(STORAGE_KEY);
  return { ...DEFAULT_SETTINGS, ...(stored[STORAGE_KEY] as Partial<ProxySettings>) };
}

async function applySettings(): Promise<void> {
  const settings = await loadSettings();
  const config = buildProxyConfig(settings);
  chrome.proxy.settings.set({ value: config, scope: "regular" }, () => {
    if (chrome.runtime.lastError) {
      logger.error("failed to set proxy:", chrome.runtime.lastError.message);
      return;
    }
    // Surface the active state on the toolbar icon: a green "ON" badge when a
    // proxy is in effect, cleared when we defer to the system.
    const active = config.mode === "fixed_servers";
    chrome.action.setBadgeText({ text: active ? "ON" : "" });
    chrome.action.setBadgeBackgroundColor({ color: "#2a8f5e" });
    logger.info("proxy applied:", config.mode);
  });
}

// Re-apply on install, browser start, and whenever the popup saves new settings.
chrome.runtime.onInstalled.addListener(() => void applySettings());
chrome.runtime.onStartup.addListener(() => void applySettings());
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes[STORAGE_KEY]) {
    void applySettings();
  }
});
