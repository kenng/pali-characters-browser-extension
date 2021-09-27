export function cursor_position(element: Element) {
    if (isFormElem(element))
        return (element as HTMLTextAreaElement).selectionEnd;

    let position = 0;
    const isSupported = typeof window.getSelection !== 'undefined';
    if (isSupported) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount !== 0) {
            const range = selection.getRangeAt(0);
            const preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            position = preCaretRange.toString().length;
        }
    }
    return position;
}

function isFormElem(elem: Element): boolean {
    if (elem.tagName === 'TEXTAREA' || elem.tagName === 'INPUT') {
        return true;
    }

    return false;
}

function getElemText(elem: Element): string {
    if (isFormElem(elem)) return (elem as HTMLTextAreaElement).value;

    return getTextNode(elem)?.textContent || '';
}

export function getText(
    elem: Element,
    letter: string,
): { pos: number; output: string } {
    const pos = cursor_position(elem);
    const str = getElemText(elem);
    if (pos == -1) return { pos, output: str };
    const output = [str.slice(0, pos), letter, str.slice(pos)].join('');
    return { pos, output };
}

export function setText(elem: Element, str: string) {
    if (isFormElem(elem)) (elem as HTMLTextAreaElement).value = str;
    elem.innerHTML = str;
}

function getTextNode(elem: Element): Element | null {
    while (elem.lastChild) {
        if (elem.lastChild.nodeName == '#text') {
            return elem.lastChild as Element;
        }
        elem = elem.lastChild as Element;
    }

    return null;
}

export function setCaret(elem: Element, pos: number) {
    // since we insert new letter, set the cursor to the last character
    if (isFormElem(elem)) {
        (elem as HTMLTextAreaElement).selectionEnd = pos;
        return;
    }
    const sel = window.getSelection();
    const textNode = getTextNode(elem);
    if (textNode) sel?.collapse(textNode, pos);
}
