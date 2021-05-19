import alt from 'alt-client';
import game from 'natives';

import EventHandler from '../handlers/EventHandler';
import View from '../classes/View';

class GarageView extends View {
    constructor() {
        super("Garage");

        this.on("Park", this.onPark.bind(this));
        this.on("Take", this.onTake.bind(this));
    }

    onPark(carId: number, garageId: number) {
        EventHandler.emitServer("GarageParkIn", carId, garageId);
    }

    onTake(carId: number, garageId: number) {
        EventHandler.emitServer("GarageParkOut", carId, garageId);
    }
}

export default new GarageView();