// const letters = [
//     ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
//     ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
//     ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
//     ['ā', 'ḍ', 'ī', 'ḷ', 'ṁ', 'ṃ', 'ñ', 'ṇ', 'ṭ', 'ū', 'ŋ', 'ṅ'],
// ];

// diacritics
// "Alt Ctrl N" for "n tilde"
export const tilde: { [key: string]: string } = {
    a: 'ā',
    A: 'Ā',
    i: 'ī',
    I: 'Ī',
    n: 'ñ',
    N: 'Ñ',
    u: 'ū',
    U: 'Ū',
    // ubuntu map it 'ctrl+alt+shift+u' to search unicode
    Y: 'Ū',
};

// "Ctrl M" for "m overdot",
export const overdot: { [key: string]: string } = {
    m: 'ṁ',
    n: 'ṅ',
    N: 'Ṅ',
    // browser mostly map ctrl+n to open new tab
    ',': 'ṅ',
    '<': 'Ṅ',
};

// "Alt N" for "n underdot", etc.
export const underdot: { [key: string]: string } = {
    d: 'ḍ',
    D: 'Ḍ',
    l: 'ḷ',
    L: 'Ḷ',
    m: 'ṃ',
    M: 'Ṃ',
    g: 'ŋ',
    n: 'ṇ',
    N: 'Ṇ',
    t: 'ṭ',
    T: 'Ṭ',
};

export function onKeyDown(event: KeyboardEvent) {
    if (event.altKey && event.key != 'Alt') {
        if (event.ctrlKey && event.key != 'Control') {
            if (tilde[event.key]) {
                event.preventDefault();
                console.log(`tilde: ${tilde[event.key]}`);
                return tilde[event.key];
            }
        }
        if (underdot[event.key]) {
            console.log(`underdot: ${underdot[event.key]}`);
            event.preventDefault();
            return underdot[event.key];
        }
        return;
    } else if (
        (event.ctrlKey && event.key != 'Control') ||
        (event.metaKey && event.key != 'Meta')
    ) {
        if (overdot[event.key]) {
            console.log(`overdot: ${overdot[event.key]}`);
            event.preventDefault();
            return overdot[event.key];
        }
        return;
    }
    return;
}
