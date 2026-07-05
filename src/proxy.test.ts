import { describe, expect, it } from "vitest";
import { buildProxyConfig, type ProxySettings, parseBypassList } from "./proxy";

const base: ProxySettings = {
  enabled: true,
  scheme: "http",
  host: "127.0.0.1",
  port: 8080,
  bypassList: ["localhost"],
};

describe("buildProxyConfig", () => {
  it("builds a fixed_servers config when enabled", () => {
    const cfg = buildProxyConfig(base);
    expect(cfg.mode).toBe("fixed_servers");
    expect(cfg.rules?.singleProxy).toEqual({ scheme: "http", host: "127.0.0.1", port: 8080 });
    expect(cfg.rules?.bypassList).toEqual(["localhost"]);
  });

  it("supports socks5", () => {
    const cfg = buildProxyConfig({ ...base, scheme: "socks5" });
    expect(cfg.rules?.singleProxy?.scheme).toBe("socks5");
  });

  it("falls back to system mode when disabled", () => {
    expect(buildProxyConfig({ ...base, enabled: false })).toEqual({ mode: "system" });
  });

  it("falls back to system mode when host is empty", () => {
    expect(buildProxyConfig({ ...base, host: "" })).toEqual({ mode: "system" });
  });
});

describe("parseBypassList", () => {
  it("splits on newlines and commas, trims, and drops blanks", () => {
    expect(parseBypassList("localhost\n 127.0.0.1 ,\n\n*.internal ")).toEqual([
      "localhost",
      "127.0.0.1",
      "*.internal",
    ]);
  });

  it("returns an empty array for blank input", () => {
    expect(parseBypassList("   \n  ")).toEqual([]);
  });

  it("prefixes bare domains with *. but leaves wildcards, IPs, and single labels", () => {
    expect(
      parseBypassList("whatsapp.com, *.internal, .foo.com, localhost, 127.0.0.1, 10.0.0.0/8"),
    ).toEqual(["*.whatsapp.com", "*.internal", ".foo.com", "localhost", "127.0.0.1", "10.0.0.0/8"]);
  });
});
