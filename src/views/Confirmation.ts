import Window from '../classes/Window';

import EventController from '../controllers/EventController';
import PlayerControlsController from '../controllers/PlayerControlsController';

export class ConfirmationView extends Window {
    constructor() {
        super("Confirmation");

        this.on("Callback", this.onCallback.bind(this));
    }

    onCallback(event_name: string) {
        EventController.emitServer(event_name);
    }

    onOpen() {
        PlayerControlsController.showCursor(true);
        PlayerControlsController.toggleGameControls(false);
    }

    onClose() {
        PlayerControlsController.showCursor(false);
        PlayerControlsController.toggleGameControls(true);
    }
}

export default new ConfirmationView();