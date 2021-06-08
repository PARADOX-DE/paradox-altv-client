import game from 'natives';

import EventController from '../../controllers/EventController';
import Window from '../../classes/Window';

export class NotificationView extends Window {
    constructor() {
        super("Notification");
        
        EventController.onServer("PushNotification", this.pushNotification.bind(this));
    }

    pushNotification(title: string, text: string, time: number) {
        game.playSoundFrontend(-1, 'ATM_WINDOW', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);
        this.emit("PushNotification", title, text, time);
    }
}

export default new NotificationView();