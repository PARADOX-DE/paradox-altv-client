import alt from 'alt-client';
const list: KeyHandler[] = [];

class KeyHandler {
    key: string;
    code: number;
    func?: () => boolean;
    
    constructor(key: string, code: number, func?: () => boolean) {
        this.key = key;
        this.code = code;
        this.func = func;

        list.push(this);
    }

    static get all() {
        return list;
    }
}

alt.on("keydown", key => {
    for(const handler of KeyHandler.all) {
        if(handler.code != key) continue;

        if(!handler.func) alt.emitServer(`Pressed_${handler.key}`);
        else if(handler.func()) break;
    }
});

new KeyHandler("E", 69);
new KeyHandler("F5", 116, () => {
    alt.showCursor(true);
    alt.toggleGameControls(false);

    return true;
});

export default KeyHandler;