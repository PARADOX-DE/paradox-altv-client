import alt from 'alt-client';
import WebView from '../../classes/WebView';
import Window from '../../classes/Window';
import EventController from '../../controllers/EventController';
import PlayerControlsController from '../../controllers/PlayerControlsController';

export class ChatView extends Window {
    open: boolean;

    constructor() {
        super("Chat");
        this.open = false;

        this.on("Send", this.onMessage.bind(this));
        EventController.onServer("Chat::Receive", this.receiveMessage.bind(this));
    }

    onKey(key: number, down: false, isOpen: boolean) {
        if(!alt.isConsoleOpen() && !isOpen && key == 84 && down) this.openChat();
        if(!alt.isConsoleOpen() && isOpen && key == 38 && down) this.scrollChat(true);
    }

    openChat() {
        this.open = true;
        this.emit("Show");

        PlayerControlsController.toggleGameControls(false);
        PlayerControlsController.showCursor(true);

        return true;
    }

    scrollChat(up: boolean) {
        if(up)
            this.emit("ScrollUp");
    }

    onMessage(message: string) {
        PlayerControlsController.toggleGameControls(true);
        PlayerControlsController.showCursor(false);

        this.open = false;
        
        WebView.webView.emit("copyPaste", message);
        EventController.emitServer("chat:message", message);
    }

    receiveMessage(title: string, message: string, error: boolean) {
        this.emit("Receive", title, message, error);
    }
}

export default new ChatView();