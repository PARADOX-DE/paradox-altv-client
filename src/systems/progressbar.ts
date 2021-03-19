import alt from 'alt-client';
import game from 'natives';

import EventHandler from '../handlers/EventHandler';
import KeyHandler from '../handlers/KeyHandler';
import View from '../classes/View';

class ProgressbarView extends View {
    constructor() {
        super("ProgressBar");

        EventHandler.onServer("Progress::Start", this.startBar.bind(this));
    }

    startBar(time: number) {
        this.emit("Start", time);
    }
}

export default new ProgressbarView();