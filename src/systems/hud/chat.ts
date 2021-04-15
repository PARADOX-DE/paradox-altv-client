import alt from 'alt-client';
import game from 'natives';

import EventHandler from '../../handlers/EventHandler';
import KeyHandler from '../../handlers/KeyHandler';
import View from '../../classes/View';

class ChatView extends View {
    constructor() {
        super("Chat");

        this.on("Send", this.onMessage.bind(this));
        
        new KeyHandler("T", 84, this.openChat.bind(this), true);
        EventHandler.onServer("Chat::Receive", this.receiveMessage.bind(this));
    }

    openChat() {
        this.webview.focus();
        this.emit("Show");

        alt.toggleGameControls(false);
        alt.showCursor(true);

        return true;
    }

    onMessage(message: string) {
        this.webview.unfocus();

        alt.toggleGameControls(true);
        alt.showCursor(false);

        EventHandler.emitServer("chat:message", message);
    }

    receiveMessage(title: string, message: string, error: boolean) {
        this.emit("Receive", title, message, error);
    }
}

export default new ChatView();