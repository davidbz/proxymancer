import { logger } from "./log";
import { DEFAULT_SETTINGS, type ProxySettings, parseBypassList } from "./proxy";

const STORAGE_KEY = "settings";

function el<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`missing element #${id}`);
  return node as T;
}

const enabledEl = el<HTMLInputElement>("enabled");
const schemeEl = el<HTMLSelectElement>("scheme");
const hostEl = el<HTMLInputElement>("host");
const portEl = el<HTMLInputElement>("port");
const bypassEl = el<HTMLTextAreaElement>("bypass");
const stateEl = el<HTMLParagraphElement>("state");

function readForm(): ProxySettings {
  return {
    enabled: enabledEl.checked,
    scheme: schemeEl.value as ProxySettings["scheme"],
    host: hostEl.value.trim(),
    port: Number(portEl.value) || DEFAULT_SETTINGS.port,
    bypassList: parseBypassList(bypassEl.value),
  };
}

/** Reflect the current state in the toggle line and dim the config when off. */
function renderState(s: ProxySettings): void {
  document.body.classList.toggle("disabled", !s.enabled);
  stateEl.classList.toggle("on", s.enabled);
  stateEl.classList.toggle("off", !s.enabled);

  if (!s.enabled) {
    stateEl.textContent = "Off — using system proxy";
  } else if (!s.host) {
    stateEl.textContent = "On — enter a host to start proxying";
  } else {
    stateEl.textContent = `On — proxying via ${s.scheme}://${s.host}:${s.port}`;
  }
}

async function save(s: ProxySettings): Promise<void> {
  await chrome.storage.sync.set({ [STORAGE_KEY]: s });
  logger.info("settings saved");
}

async function load(): Promise<void> {
  const stored = await chrome.storage.sync.get(STORAGE_KEY);
  const s: ProxySettings = {
    ...DEFAULT_SETTINGS,
    ...(stored[STORAGE_KEY] as Partial<ProxySettings>),
  };
  enabledEl.checked = s.enabled;
  schemeEl.value = s.scheme;
  hostEl.value = s.host;
  portEl.value = String(s.port);
  bypassEl.value = s.bypassList.join("\n");
  renderState(s);
}

// Update the visible state instantly; debounce the storage write so typing
// doesn't hit chrome.storage.sync rate limits.
let timer: number | undefined;
document.addEventListener("input", () => {
  const s = readForm();
  renderState(s);
  clearTimeout(timer);
  timer = setTimeout(() => void save(s), 300);
});

void load();
