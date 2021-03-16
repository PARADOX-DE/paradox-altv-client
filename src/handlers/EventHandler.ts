import alt from 'alt-client';

class EventHandler {
    constructor() {}

    emitServer(eventName: string, ...args: any[]) {
        alt.emitServer("PARADOX::EVENT", eventName, ...args);
    }
}

export default new EventHandler();