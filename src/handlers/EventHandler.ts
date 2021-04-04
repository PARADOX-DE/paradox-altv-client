import alt from 'alt-client';

class EventHandler {
    constructor() {}

    emitServer(eventName: string, ...args: any[]) {
        if(alt.isInDebug()) alt.log(`[EVENT] emitServer: ${eventName} - ${args.join(", ")}`);
        alt.emitServer(eventName, ...args);
    }

    onServer(eventName: string, listener: (...args: any[]) => void) {
        if(alt.isInDebug()) alt.log(`[EVENT] onServer: ${eventName}`);
        alt.onServer(eventName, (...args: any[]) => listener(...args));
    }
}

export default new EventHandler();