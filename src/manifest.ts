import fs from 'fs-extra'
// import type { Manifest } from 'webextension-polyfill'
import type PkgType from '../package.json'
import { isDev, port, r } from '../scripts/utils'

export async function getManifest() {
  const pkg = await fs.readJSON(r('package.json')) as typeof PkgType

  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: any = {
    manifest_version: 3,
    name: '__MSG_name__',
    version: pkg.version,
    default_locale: 'en',
    description: '__MSG_description__',
    action: {
      default_icon: './assets/icons/favicon-128x128.png',
      default_popup: './dist/popup/index.html',
    },
    options_ui: {
      page: './dist/editor/index.html',
      open_in_tab: true,
    },
    background: {
      service_worker: './dist/background/index.mjs',
      type: 'module',
    },
    icons: {
      16: './assets/icons/favicon-16x16.png',
      48: './assets/icons/favicon-48x48.png',
      128: './assets/icons/favicon-128x128.png',
    },
    permissions: [
      'tabs',
      'storage',
      'activeTab',
      'scripting',
    ],
    host_permissions: [
      'http://*/*',
      'https://*/*',
      'file:///*',
    ],
    content_scripts: [{
      all_frames: true,
      matches: ['http://*/*', 'https://*/*'],
      js: ['./dist/contentScripts/index.global.js'],
    }],
    web_accessible_resources: [
      {
        resources: ['dist/contentScripts/style.css', 'assets/*'],
        matches: ['<all_urls>'],
      },
    ],
    content_security_policy: {
      extension_pages: isDev
        ? `script-src 'self' http://localhost:${port}; object-src 'self'`
        : "script-src 'self'; object-src 'self'",
    },
  }

  if (isDev) {
    // for content script, as browsers will cache them for each reload,
    // we use a background script to always inject the latest version
    // see src/background/contentScriptHMR.ts
    delete manifest.content_scripts
    manifest.permissions?.push('webNavigation')
  }

  return manifest
}
