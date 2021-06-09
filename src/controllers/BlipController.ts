import alt from 'alt-client';
import game from 'natives';

import Controller from '../classes/Controller';
import EventController from './EventController';

class BlipController extends Controller {
    constructor() {
        super("Blip");
        
        EventController.onServer("AddBlips", this.AddBlip.bind(this));
    }
    
    AddBlip(label: string, position: alt.Vector3, sprite: number, color: number, scale: number, shortRange: boolean ) {
        const blipHandler = new alt.PointBlip(position.x, position.y, position.z);

        blipHandler.sprite = sprite;
        blipHandler.color = color;
        blipHandler.scale = scale;
        blipHandler.shortRange = shortRange;
        blipHandler.name = label;
    }
}

export default new BlipController();