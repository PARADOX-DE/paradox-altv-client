import alt from 'alt-client';
import game from 'natives';

import EventHandler from '../../handlers/EventHandler';
import KeyHandler from '../../handlers/KeyHandler';
import View from '../../classes/View';

class NotificationView extends View {
    constructor() {
        super("Notification");
        
        EventHandler.onServer("PushNotification", this.pushNotification.bind(this));
    }

    pushNotification(title: string, text: string, time: number) {
        game.playSoundFrontend(-1, 'ATM_WINDOW', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);

        this.emit("PushNotification", title, text, time);
    }
}

export default new NotificationView();