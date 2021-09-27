import fs from 'fs-extra'
import type { Manifest } from 'webextension-polyfill'
import type PkgType from '../package.json'
import { isDev, port, r } from '../scripts/utils'

export async function getManifest() {
  const pkg = await fs.readJSON(r('package.json')) as typeof PkgType

  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: Manifest.WebExtensionManifest = {
    manifest_version: 2,
    name: '__MSG_name__',
    version: pkg.version,
    default_locale: 'en',
    description: '__MSG_description__',

    browser_action: {
      default_icon: './assets/icons/favicon-128x128.png',
      default_popup: './dist/popup/index.html',
    },
    options_ui: {
      page: './dist/options/index.html',
      open_in_tab: true,
      chrome_style: false,
    },
    background: {
      page: './dist/background/index.html',
      persistent: false,
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
      'http://*/',
      'https://*/',
      'file:///*',
    ],
    content_scripts: [{
      matches: ['http://*/*', 'https://*/*', 'file:///*'],
      js: ['./dist/contentScripts/index.global.js'],
    }],
    web_accessible_resources: [
      'dist/contentScripts/style.css',
    ],
  }

  if (isDev) {
    // for content script, as browsers will cache them for each reload,
    // we use a background script to always inject the latest version
    // see src/background/contentScriptHMR.ts
    delete manifest.content_scripts
    manifest.permissions?.push('webNavigation')

    // this is required on dev for Vite script to load
    manifest.content_security_policy = `script-src \'self\' http://localhost:${port}; object-src \'self\'`
  }

  return manifest
}
