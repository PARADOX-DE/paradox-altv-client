import Window from '../classes/Window';

import EventController from '../controllers/EventController';
import PlayerControlsController from '../controllers/PlayerControlsController';

class BankView extends Window {
    constructor() {
        super("Bank");

        this.on("Deposit", this.onDeposit.bind(this));
        this.on("Withdraw", this.onWithdraw.bind(this));
    }

    onDeposit(value: number) {
        EventController.emitServer("DepositMoney", value);
    }

    onWithdraw(value: number) {
        EventController.emitServer("WithdrawMoney", value);
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

export default new BankView();