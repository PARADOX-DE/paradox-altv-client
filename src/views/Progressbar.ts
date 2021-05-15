import alt from 'alt-client';
import Window from '../classes/Window';
import EventController from '../controllers/EventController';
import { ServerEvents } from '../data/events';

class ProgressbarView extends Window {
    constructor() {
        super("Progressbar");

        EventController.onServer(ServerEvents.Progressbar.Start, this.startBar.bind(this));
    }

    startBar(title: string, message: string, time: number) {
        this.emit("Start", title, message, time);
    }
}

export default new ProgressbarView();