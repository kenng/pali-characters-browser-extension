import browser from 'webextension-polyfill';

export async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await browser.tabs.query(queryOptions);
    return tab;
}
