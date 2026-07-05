# Privacy Policy

**Last updated: July 5, 2026**

Proxymancer ("the extension") is a browser extension that lets you configure the
browser's forward-proxy settings — a proxy address and a bypass list — from the
toolbar. This policy explains what data the extension handles and how.

## Summary

Proxymancer does not collect, transmit, sell, or share any personal data. There
are no servers operated by the extension, no analytics, and no tracking. Your
configuration stays in your own browser.

## Data the extension stores

The only data Proxymancer stores is the proxy configuration you enter:

- Whether the proxy is enabled
- Proxy scheme, host, and port
- Bypass list entries

This is saved using the browser's `chrome.storage.sync` API. That means the
values are kept by your browser and, if you have browser sync enabled, are
synchronized across your signed-in browsers by the browser vendor. The extension
developer never receives, sees, or has access to this data.

The extension does not store, log, or transmit your browsing history, the
contents of your network traffic, credentials, or any other personal
information.

## Permissions

Proxymancer requests the minimum permissions needed to do its job:

- **`proxy`** — required to read and apply the browser's proxy settings. This is
  the extension's core function. The extension only writes the configuration you
  provide; it does not inspect or record the traffic that flows through the
  proxy.
- **`storage`** — required to save your proxy configuration so it persists and
  can be re-applied automatically.

The extension requests no host permissions and makes no network requests of its
own.

## Third parties

The extension itself sends data to no third parties. However, when you enable a
proxy, your browser routes traffic through the proxy server that **you**
configure. That proxy is operated by whoever you choose, and its operator may be
able to observe traffic that passes through it. Proxymancer has no affiliation
with, and no control over, any proxy server you configure. Review the privacy
practices of your chosen proxy provider.

## Children

Proxymancer is a general-purpose utility and is not directed at children. It
collects no personal data from anyone, including children.

## Changes to this policy

If this policy changes, the "Last updated" date above will be revised. Material
changes will be reflected in the extension's repository.

## Contact

For questions about this policy, contact: `davidbenzakai@gmail.com`.
