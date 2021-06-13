import Window from '../classes/Window';

import EventController from '../controllers/EventController';
import PlayerControlsController from '../controllers/PlayerControlsController';

export class GarageView extends Window {
    constructor() {
        super("Garage");

        this.on("Park", this.onPark.bind(this));
        this.on("Take", this.onTake.bind(this));
    }

    onPark(carId: number, garageId: number) {
        EventController.emitServer("ParkVehicle", carId);
    }

    onTake(carId: number, garageId: number) {
        EventController.emitServer("GarageParkOut", carId, garageId);
    }

    onOpen() {
        PlayerControlsController.showCursor(true);
        PlayerControlsController.toggleGameControls(false);
    }

    onClose() {
        PlayerControlsController.showCursor(false);
        PlayerControlsController.toggleGameControls(true);
    }
}

export default new GarageView();