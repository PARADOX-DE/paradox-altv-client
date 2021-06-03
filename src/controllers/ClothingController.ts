import alt from 'alt-client';
import game from 'natives';

import Controller from '../classes/Controller';
import EventController from './EventController';

class ClothingController extends Controller {
    constructor() {
        super("Clothing");
        
        EventController.onServer("SetClothes", this.SetClothes.bind(this));
        EventController.onServer("SetProp", this.SetProp.bind(this));
    }
    
    SetClothes(component: number, drawable: number, texture: number){
        game.setPedComponentVariation(alt.Player.local.scriptID, component, drawable, texture, 0);
    }

    SetProp(component: number, drawable: number, texture: number, attach: boolean = true) {
        game.setPedPropIndex(alt.Player.local.scriptID, component, drawable, texture, attach);
    }
}

export default new ClothingController();