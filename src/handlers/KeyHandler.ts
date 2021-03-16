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
}

alt.on("keydown", key => {
    for(const handler of list) {
        if(handler.code != key) continue;

        if(!handler.func) alt.emitServer("Pressed_E");
        else if(handler.func()) break;
    }
});

export default KeyHandler;