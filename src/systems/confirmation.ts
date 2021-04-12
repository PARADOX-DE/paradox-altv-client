import alt from 'alt-client';
import game from 'natives';

import EventHandler from '../handlers/EventHandler';
import KeyHandler from '../handlers/KeyHandler';
import View from '../classes/View';

class ConfirmationView extends View {
    constructor() {
        super("Confirmation");

        this.on("Callback", this.callback.bind(this));
    }

    callback(event_name: string) {
        EventHandler.emitServer(event_name);
    }
}

export default new ConfirmationView();