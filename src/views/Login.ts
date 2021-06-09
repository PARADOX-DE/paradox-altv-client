import Window from '../classes/Window';

import EventController from '../controllers/EventController';
import PlayerControlsController from '../controllers/PlayerControlsController';

export class LoginView extends Window {
    constructor() {
        super("Login");

        this.on("Auth", this.onAuth.bind(this));
    }

    onAuth(username: string, password: string) {
        EventController.emitServer("RequestLoginResponse", username, password);
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

export default new LoginView();