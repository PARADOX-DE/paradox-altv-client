import alt from 'alt-client';
import game from 'natives';

import EventHandler from '../handlers/EventHandler';
import View from '../classes/View';

class BankView extends View {
    constructor() {
        super("Bank");

        this.on("Deposit", this.onDeposit.bind(this));
        this.on("Withdraw", this.onWithdraw.bind(this));
    }

    onDeposit(value: number) {
        EventHandler.emitServer("DepositMoney", value);
    }

    onWithdraw(value: number) {
        EventHandler.emitServer("WithdrawMoney", value);
    }
}

export default new BankView();