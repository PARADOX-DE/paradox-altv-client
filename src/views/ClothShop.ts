import Window from '../classes/Window';

import PlayerControlsController from '../controllers/PlayerControlsController';

export class ClothShopView extends Window {
    constructor() {
        super("ClothShop");
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

export default new ClothShopView();