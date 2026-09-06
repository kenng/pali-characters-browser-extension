# Chrome Web Store — Privacy practices justifications

Paste these into **Developer Dashboard → this extension → Privacy practices**.

Docs: https://developer.chrome.com/docs/webstore/cws-dashboard-privacy

---

## storage

Used with `chrome.storage.local` to save user preferences such as Enable on all pages and ITRANS mode, so settings persist across sessions and pages. Preferences stay on the device and are not sent to a server.

---

## activeTab

Grants temporary access to the current tab when the user opens the toolbar popup and clicks actions such as Activate on this page or Pin helper. That lets the extension talk to the content script on the page the user is actively using, without needing permanent access beyond that user gesture. No tab content is collected or sent off the device.

---

## tabs

Used to identify the active tab so popup actions (activate page, re-run content script, open Zen Editor / help links) apply to the correct tab, and to open extension pages in a new tab. Tab URLs/titles are not collected or transmitted.

---

## scripting

Used so the extension can inject its content script into the active page when the user clicks Activate / re-run from the popup, so Pāli keyboard shortcuts and the on-page helper work in that tab. Injected code ships in the extension package only; it is not loaded remotely.