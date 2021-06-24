import alt from 'alt-client';
import game from 'natives';

import Window from '../classes/Window';

import PlayerControlsController from '../controllers/PlayerControlsController';

export class ClothShopView extends Window {
    constructor() {
        super("ClothShop");

        this.on("Try", this.tryCloth.bind(this));
    }

    onOpen() {
        PlayerControlsController.showCursor(true);
        PlayerControlsController.toggleGameControls(false);
    }

    onClose() {
        PlayerControlsController.showCursor(false);
        PlayerControlsController.toggleGameControls(true);
    }

    tryCloth(component : number, drawable: number, texture: number, torso_drawable: number, torso_texture: number) {
        game.setPedComponentVariation(alt.Player.local.scriptID, component, drawable, texture, 0);

        if(torso_drawable >= 0 && torso_texture >= 0)
            game.setPedComponentVariation(alt.Player.local.scriptID, 3, torso_drawable, torso_texture, 0);
    }
}

export default new ClothShopView();