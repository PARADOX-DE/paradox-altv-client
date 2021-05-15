import alt from 'alt-client';
import Window from '../classes/Window';
import PlayerControlsController from '../controllers/PlayerControlsController';
import { ServerEvents } from '../data/events';

class LoginView extends Window {
    constructor() {
        super("Login");

        this.on("Auth", this.onAuth.bind(this));
    }

    onAuth(username: string, password: string) {
        alt.emitServer(ServerEvents.Login.Auth, username, password);
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