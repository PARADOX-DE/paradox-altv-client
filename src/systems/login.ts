import alt from 'alt-client';
import game from 'natives';

import EventHandler from '../handlers/EventHandler';
import KeyHandler from '../handlers/KeyHandler';
import View from '../classes/View';

class LoginView extends View {
    constructor() {
        super("Login");

        this.on("Auth", this.sendLogin.bind(this));
        EventHandler.onServer("ResponseLoginStatus", this.responseLoginStatus.bind(this));
    }

    sendLogin(username: string, password: string) {
        EventHandler.emitServer("RequestLoginResponse", username, password);
    }

    responseLoginStatus(status: string){
        this.emit("Status", status);
    }
}

export default new LoginView();