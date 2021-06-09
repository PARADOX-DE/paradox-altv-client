import alt from 'alt-client';
import Window from '../classes/Window';

import EventController from '../controllers/EventController';
import PlayerControlsController from '../controllers/PlayerControlsController';
import { ChatView } from './hud/chat';

export class InventoryView extends Window {
    constructor() {
        super("Inventory");
    }

    onOpen() {
        PlayerControlsController.showCursor(true);
        PlayerControlsController.toggleGameControls(false);
    }

    onClose() {
        PlayerControlsController.showCursor(false);
        PlayerControlsController.toggleGameControls(true);
    }

    onKey(key: number, down: false) {
        if(!down) return;
        if(key == 73) {
            const chatView = Window.getWindow("Chat");
            if(chatView != undefined && (chatView as ChatView).open == true) return;

            EventController.emitServer("Pressed_I");
        }
    }
}

export default new InventoryView();