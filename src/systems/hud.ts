import alt from 'alt-client';
import game from 'natives';

import View from '../classes/View';

class HudView extends View {
    constructor() {
        super("Hud");

        this.on("Show", this.onLoad.bind(this));

        alt.everyTick(this.onEveryTick.bind(this));
        alt.on("leftVehicle", this.onLeftVehicle.bind(this));
    }

    onLoad() {
        this.emit("gotFormat", game.getIsWidescreen());
    }

    onLeftVehicle() {
        this.emit("Speedo::Update", false, 0);
    }

    onEveryTick() {
        const localPlayer = alt.Player.local;

        if(localPlayer.vehicle) {
            const vehicle = localPlayer.vehicle;
            const speed = vehicle.speed * 3.6;

            this.emit("Speedo::Update", true, speed.toFixed(0));
        }

        this.emit("Count::Update", alt.Player.all.length);
    }
}

export default new HudView();