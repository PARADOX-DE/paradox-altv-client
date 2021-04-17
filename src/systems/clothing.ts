import alt from 'alt-client';
import game from 'natives';

import EventHandler from '../handlers/EventHandler';

class Clothing {
    constructor() {
        EventHandler.onServer("SetClothes", this.SetClothes.bind(this));
        EventHandler.onServer("SetProp", this.SetProp.bind(this));
    }

    SetClothes(component: number, drawable: number, texture: number){
        game.setPedComponentVariation(alt.Player.local.scriptID, component, drawable, texture, 0);
    }

    SetProp(component: number, drawable: number, texture: number, attach: boolean = true) {
        game.setPedPropIndex(alt.Player.local.scriptID, component, drawable, texture, attach);
    }
}

export default new Clothing();