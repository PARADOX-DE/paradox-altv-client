import alt from 'alt-client';
import game from 'natives';

import EventHandler from '../handlers/EventHandler';

class Clothing {
    constructor() {
        EventHandler.onServer("SetClothes", this.SetClothes.bind(this));
    }

    SetClothes(component: number, drawable: number, texture: number){
        game.setPedComponentVariation(alt.Player.local.scriptID, component, drawable, texture, 0);
    }
}

export default new Clothing();