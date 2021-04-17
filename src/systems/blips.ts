import alt from 'alt-client';
import game from 'natives';

import EventHandler from '../handlers/EventHandler';

class Blips {
    constructor() {
        EventHandler.onServer("AddBlips", this.AddBlips.bind(this));
    }


    AddBlips(label: string, position: alt.Vector3, sprite: number, color: number, scale: number, shortRange: boolean ) {
        const blipHandler = new alt.PointBlip(position.x, position.y, position.z);

        blipHandler.sprite = sprite;
        blipHandler.color = color;
        blipHandler.scale = scale;
        blipHandler.shortRange = shortRange;
        blipHandler.name = label;
    }
}

export default new Blips();