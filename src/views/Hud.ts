import alt from 'alt-client';
import game from 'natives';

import Window from '../classes/Window';
import HUDController from '../controllers/HUDController';

export class HudView extends Window {
    constructor() {
        super("Hud");
    }

    onOpen() {
        this.emit("gotMinimapWidth", HUDController.getMinimapWidth());
        // TODO: remove gotFormat and replace it in every vue component
        this.emit("gotFormat", game.getIsWidescreen());
    }

    onTick() {
        this.emit("Count::Update", alt.Player.all.length);

        game.hideHudComponentThisFrame(2);
        game.hideHudComponentThisFrame(7);
        game.hideHudComponentThisFrame(9);
    }

    onConsoleCommand(cmd: string, ...args: string[]) {
        if(cmd != "hud") return;

        switch(args[0]) {
            case "format":
                this.emit("gotMinimapWidth", HUDController.getMinimapWidth());
                break;
        }
    }
}

export default new HudView();