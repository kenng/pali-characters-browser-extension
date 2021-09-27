import { tilde, underdot, overdot } from './pali-keyboard';

export function getKeyboardMappingStr(): string {
    let htmlStr = '<div class="pk-help-title">Tilde characters</div>';

    for (const [key, value] of Object.entries(tilde)) {
        const kbd = '<kbd>Ctrl</kbd> + <kbd>Alt</kbd> ';
        htmlStr += `<div class="pk-help-row">${value} : <code>${kbd} + ${key}</code></div>`;
    }

    htmlStr += '<div class="pk-help-title">Underdot characters</div>';
    for (const [key, value] of Object.entries(underdot)) {
        const kbd = '<kbd>Alt</kbd> ';
        htmlStr += `<div class="pk-help-row">${value} : <code>${kbd} + ${key}</code></div>`;
    }

    htmlStr += '<div class="pk-help-title">Overdot characters</div>';
    for (const [key, value] of Object.entries(overdot)) {
        const kbd = '<kbd>Ctrl</kbd> ';
        htmlStr += `<div class="pk-help-row">${value} : <code>${kbd} + ${key}</code></div>`;
    }

    return htmlStr;
}

function setStyle() {
    const css = document.createElement('style');
    css.innerHTML = `
.pk-help-title {
    margin-top: 20px;
    font-weight: bold;
    margin: 0;
}

.pk-modal {
	display: block;
	position: fixed;
	z-index: 1;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	overflow: scroll;
	background-color: #3c3c3ce8;
	transition: all 0.5s ease 0.06s;
}

.pk-modal-title {
    font-size: 1.3rem;
    font-weight: bold;
}

.pk-modal-content {
	background-color: #fff;
    margin-top: 10vh;
    margin-bottom: 20vh;
    margin-left: auto;
    margin-right: auto;
	padding: 1.2rem;
	box-shadow: 2px 2px 10px 0px rgba(99, 106, 119, 0.6);
	border-radius: 5px;
}

.pk-close-modal {
	color: #dedede;
	/*float: right;*/
	font-size: 2rem;
	font-weight: bold;
	display: flex;
	align-items: center;
}

.pk-close-modal:before {
	content: "Close";
	font-size: 1rem;
	display: none;
	text-decoration: none;
	align-self: center;
	margin-top: 0.2rem;
	font-weight: 400;
}

.pk-close-modal:hover:before {
	display: initial;
	color: #dedede;
}

.pk-close-modal:hover,
.pk-close-modal:focus {
	color: hsl(0, 100%, 70%);
	text-decoration: none;
	cursor: pointer;
}

.pk-close-modal:active,
.pk-close-modal:before:active {
	transition: all 60ms ease;
	transform: scale(0.97);
}

.pk-modal-content {
	display: flex;
	flex-direction: column;
}

.pk-modal-header {
	display: flex;
	flex-direction: row-reverse;
	justify-content: space-between;
	align-items: center;
	font-weight: bold;
}

.pk-modal-footer {
	display: flex;
	flex-direction: row-reverse;
	align-items: center;
}

.pk-modal-content kbd {
    border: 1px solid #aaa;
    border-radius: 0.2em;
    box-shadow: 0.1em 0.1em 0.2em rgb(0 0 0 / 10%);
    background-color: #efefef;
    color: #000;
    padding: 0.1em 0.3em;
}

.pk-help-body {
    line-height
}

.pk-help-row {
    line-height: 1.5;
}

.pk-modal-content hr {
    margin-left: 0;
    margin-right: 0;
    border-color: #efefef4d !important;
    border-width: 0.5px;
}

@media screen and (min-width: 599px) {
    .pk-modal-content {
        max-width: 650px;
    }
}
    `;
    document.body.appendChild(css);
}

function setScript() {
    const elem = document.createElement('div');
    elem.id = 'pk-modal-bg';
    elem.innerHTML = `
    <div id="pk-modal" class="pk-modal">
        <div class="pk-modal-content">
            	<div class="pk-modal-header">
			        <span class="pk-close-modal">&times;</span>
			        <h5 class="pk-modal-title">Usage Guide</h5>
                </div>
                <hr>
                <div class="pk-modal-body">
                    <div class="pk-help-body">
                        ${getKeyboardMappingStr()}
                    </div>
                </div>
                <div class="pk-modal-footer">

                </div>
		</div>
    </div>
    `;
    document.body.appendChild(elem);

    const modal = document.getElementById('pk-modal');
    const closeElem = document.getElementsByClassName('pk-close-modal');
    for (let index = 0; index < closeElem.length; index++) {
        closeElem[index]?.addEventListener('click', function () {
            modal!.style.display = 'none';
        });
    }

    document
        .getElementById('pk-modal-bg')!
        .addEventListener('click', function () {
            modal!.style.display = 'none';
        });
}

export function getKeyboardMappingHtml() {
    if (!document.getElementById('pk-modal-bg')) {
        setStyle();
        setScript();
    } else {
        document.getElementById('pk-modal')!.style.display = 'block';
    }
}
