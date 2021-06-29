import Window from '../classes/Window';

import PlayerControlsController from '../controllers/PlayerControlsController';

export class GasStationView extends Window {
    constructor() {
        super("GasStation");
    }

    onOpen() {
        PlayerControlsController.toggleGameControls(false);
    }

    onClose() {
        PlayerControlsController.toggleGameControls(true);
    }
}

export default new GasStationView();