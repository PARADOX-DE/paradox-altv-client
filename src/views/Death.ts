import Window from '../classes/Window';

import PlayerControlsController from '../controllers/PlayerControlsController';

export class DeathView extends Window {
    constructor() {
        super("DeathScreen");
    }

    onOpen() {
        PlayerControlsController.toggleGameControls(false);
    }

    onClose() {
        PlayerControlsController.toggleGameControls(true);
    }
}

export default new DeathView();