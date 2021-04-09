import alt from 'alt-client';
import Webview from '../classes/Webview';
const list: KeyHandler[] = [];

class KeyHandler {
    key: string;
    code: number;
    func?: () => boolean;
    needControls?: boolean;
    needDown: boolean;
    
    constructor(key: string, code: number, func?: () => boolean, needControls?: boolean, needDown: boolean = true) {
        this.key = key;
        this.code = code;
        this.func = func;
        this.needControls = needControls;
        this.needDown = needDown;

        list.push(this);
    }

    static get all() {
        return list;
    }
}

alt.on("keydown", key => {
    for(const handler of KeyHandler.all) {
        if(!handler.needDown) continue;
        if(handler.code != key) continue;
        if(handler.needControls == true && !alt.gameControlsEnabled()) continue; 

        if(!handler.func) alt.emitServer(`Pressed_${handler.key}`);
        else if(handler.func()) break;
    }
});

alt.on("keyup", key => {
    for(const handler of KeyHandler.all) {
        if(handler.needDown) continue;
        if(handler.code != key) continue;
        if(handler.needControls == true && !alt.gameControlsEnabled()) continue; 

        if(!handler.func) alt.emitServer(`Pressed_${handler.key}`);
        else if(handler.func()) break;
    }
});

new KeyHandler("E", 69);

new KeyHandler("F5", 116, () => {
    Webview.webView.focus();

    alt.showCursor(true);
    alt.toggleGameControls(false);

    return true;
});

new KeyHandler("F6", 117, () => {
    Webview.webView.unfocus();

    alt.showCursor(false);
    alt.toggleGameControls(true);

    return true;
});

export default KeyHandler;