import alt from 'alt-client';

class EventHandler {
    constructor() {}

    emitServer(eventName: string, ...args: any[]) {
        alt.emitServer("PARADOX::EVENT", eventName, ...args);
    }

    onServer(eventName: string, listener: (...args: any[]) => void) {
        alt.onServer(eventName, (...args: any[]) => listener(...args));
    }
}

export default new EventHandler();