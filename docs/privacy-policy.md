# Privacy Policy — Pāli Easy Keyboard & Shortcut

Last updated: 2026-09-06

## Summary

This browser extension helps you type Pāli diacritic characters on web pages. It does **not** collect, sell, or transmit your personal information, browsing history, form contents, or keystrokes to the developer or any third party.

## Data stored on your device

The extension stores only these preferences in the browser’s local extension storage (`storage.local`):

- Whether Pāli input is enabled globally
- Whether ITRANS sequence typing is enabled

These settings stay on your device and are not uploaded.

## What the extension does on pages

When enabled, a content script runs on HTTP and HTTPS pages (including same-origin iframes) to:

- Listen for keyboard shortcuts and optional ITRANS sequences
- Insert Pāli characters into the focused text field or contenteditable area
- Optionally show a pinned helper UI on the page

Text in page fields is read and modified **only on your device** for insertion. It is not logged to a server or shared.

The Zen Editor page keeps writing text in memory in that tab. Copy uses the system clipboard on your device. Editor text is not uploaded.

## Network activity

The packaged extension does not call remote APIs for analytics, accounts, ads, or telemetry. Extension logic and UI assets are bundled in the package.

## Permissions

- **storage** — save the preferences above
- **activeTab** — act on the current tab when you use the toolbar popup (e.g. enable on this page, pin helper)
- **Host access to http(s) pages** — inject the input helper so Pāli shortcuts work across websites

Development builds may request extra permissions (e.g. scripting / webNavigation) for hot reload; those are not required for the production store package.

## Contact

For privacy questions about this extension, open an issue on the project repository or contact the publisher listed on the Chrome Web Store / Firefox Add-ons listing.
