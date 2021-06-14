import Window from '../classes/Window';

import PlayerControlsController from '../controllers/PlayerControlsController';

export class ShopView extends Window {
    constructor() {
        super("Shop");
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

export default new ShopView();