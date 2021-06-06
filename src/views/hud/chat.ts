import alt from 'alt-client';
import Window from '../../classes/Window';
import EventController from '../../controllers/EventController';
import PlayerControlsController from '../../controllers/PlayerControlsController';

class ChatView extends Window {
    constructor() {
        super("Chat");

        this.on("Send", this.onMessage.bind(this));
        EventController.onServer("Chat::Receive", this.receiveMessage.bind(this));
    }

    onKey(key: number, down: false, isOpen: boolean) {
        if(!alt.isConsoleOpen() && !isOpen && key == 84 && down) this.openChat();
    }

    openChat() {
        this.emit("Show");

        PlayerControlsController.toggleGameControls(false);
        PlayerControlsController.showCursor(true);

        return true;
    }

    onMessage(message: string) {
        PlayerControlsController.toggleGameControls(true);
        PlayerControlsController.showCursor(false);

        EventController.emitServer("chat:message", message);
    }

    receiveMessage(title: string, message: string, error: boolean) {
        this.emit("Receive", title, message, error);
    }
}

export default new ChatView();