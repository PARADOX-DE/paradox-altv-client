import alt from 'alt-client';
import game from 'natives';

import EventHandler from '../handlers/EventHandler';
import View from '../classes/View';

class HudView extends View {
    constructor() {
        super("Hud");

        this.on("Show", this.onLoad.bind(this));
    }

    onLoad() {
        alt.log("hud loaded");
        this.emit("gotFormat", game.getIsWidescreen());
    }
}

export default new HudView();