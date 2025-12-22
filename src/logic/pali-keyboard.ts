// const letters = [
//     ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
//     ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
//     ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
//     ['ā', 'ḍ', 'ī', 'ḷ', 'ṁ', 'ṃ', 'ñ', 'ṇ', 'ṭ', 'ū', 'ŋ', 'ṅ'],
// ];

// Exported maps for help guide UI
export const tilde: Record<string, string> = {
    A: 'ā',
    I: 'ī',
    N: 'ñ',
    U: 'ū',
}

export const overdot: Record<string, string> = {
    M: 'ṁ',
    N: 'ṅ',
}

export const underdot: Record<string, string> = {
    D: 'ḍ',
    L: 'ḷ',
    M: 'ṃ',
    G: 'ŋ',
    N: 'ṇ',
    T: 'ṭ',
}

// Universal Safe Alternative: Distinct mapping for Ctrl + Alt
export const universalCodes: Record<string, string> = {
    KeyA: 'ā',
    KeyI: 'ī',
    KeyU: 'ū',
    KeyN: 'ñ',
    KeyM: 'ṁ',
    Comma: 'ṅ',
    KeyD: 'ḍ',
    KeyL: 'ḷ',
    KeyT: 'ṭ',
    KeyG: 'ŋ',
    Period: 'ṇ',
    Slash: 'ṃ',
}

// Physical Key Code Mappings (Layout Independent)
const tildeCodes: Record<string, string> = {
    KeyA: 'ā',
    KeyI: 'ī',
    KeyN: 'ñ',
    KeyU: 'ū',
    KeyY: 'ū',
}

const overdotCodes: Record<string, string> = {
    KeyM: 'ṁ',
    KeyN: 'ṅ',
    Comma: 'ṅ',
}

const underdotCodes: Record<string, string> = {
    KeyD: 'ḍ',
    KeyL: 'ḷ',
    KeyM: 'ṃ',
    KeyG: 'ŋ',
    KeyN: 'ṇ',
    KeyT: 'ṭ',
}

export function onKeyDown(event: KeyboardEvent) {
    const isMac = typeof navigator !== 'undefined' && 
                  (navigator.userAgent.includes('Mac') || navigator.platform.includes('Mac'));
    
    const hasCtrl = event.ctrlKey;
    const hasAlt = event.altKey;
    const hasMeta = event.metaKey; // Cmd on Mac
    const hasShift = event.shiftKey;
    const code = event.code;

    // Conflicting keys (N for new window, M for minimize)
    const isConflicting = code === 'KeyN' || code === 'KeyM';

    // Universal Safe Alternative: Ctrl + Alt + Key
    if (hasCtrl && hasAlt) {
        const char = universalCodes[code];
        if (char) {
            event.preventDefault();
            return hasShift ? char.toUpperCase() : char;
        }
    }

    // Tilde: 
    // Mac: Cmd + Alt + Key (if non-conflicting)
    if (isMac && hasMeta && hasAlt && !isConflicting) {
        const char = tildeCodes[code];
        if (char) {
            event.preventDefault();
            return hasShift ? char.toUpperCase() : char;
        }
    }
    
    // Underdot: Alt + Key
    if (hasAlt && !hasCtrl && !hasMeta) {
        const char = underdotCodes[code];
        if (char) {
            event.preventDefault();
            return hasShift ? char.toUpperCase() : char;
        }
    }
    
    // Overdot: 
    // Mac: Cmd + Key (if non-conflicting) OR Ctrl + Key (always handled above or below)
    if (((isMac && hasMeta && !isConflicting) || hasCtrl) && !hasAlt) {
        const char = overdotCodes[code];
        if (char) {
            event.preventDefault();
            return hasShift ? char.toUpperCase() : char;
        }
    }
    
    return;
}
