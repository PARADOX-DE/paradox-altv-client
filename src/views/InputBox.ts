import Window from '../classes/Window';

import PlayerControlsController from '../controllers/PlayerControlsController';

export class InputBoxView extends Window {
    constructor() {
        super("InputBox");
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

export default new InputBoxView();