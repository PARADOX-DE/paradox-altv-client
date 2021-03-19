import alt from 'alt-client';
import game from 'natives';

import EventHandler from '../handlers/EventHandler';
import KeyHandler from '../handlers/KeyHandler';
import View from '../classes/View';

class LoginView extends View {
    constructor() {
        super("Login");

        this.on("Auth", this.sendLogin.bind(this));
    }

    sendLogin(username: string, password: string) {
        EventHandler.emitServer("Login::Auth", username, password);
    }
}

export default new LoginView();