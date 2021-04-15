import alt from 'alt-client';
import game from 'natives';

import View from '../classes/View';

class HudView extends View {
    constructor() {
        super("Hud");

        this.on("Show", this.onLoad.bind(this));
    }

    onLoad() {
        this.emit("gotFormat", game.getIsWidescreen());
    }

    onEveryTick() {
        this.emit("Count::Update", alt.Player.all.length);
    }
}

export default new HudView();