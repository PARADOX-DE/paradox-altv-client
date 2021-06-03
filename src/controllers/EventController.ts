import alt from 'alt-client';
import Controller from '../classes/Controller';

class EventController extends Controller {
    constructor() {
        super("Event");
    }

    onServer(eventName: string, listener: (...args: any[]) => void) {
        alt.onServer(eventName, listener.bind(this));
    }

    emitServer(eventName: string, ...args: any[]) {
        alt.emitServer(eventName, ...args);
        if(alt.isInDebug()) alt.log(`[EventController][EMIT] ${eventName}: ${args.join(", ")}`);
    }
}

export default new EventController();