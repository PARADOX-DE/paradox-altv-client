import alt from 'alt-client';
import game from 'natives';

import EventHandler from '../handlers/EventHandler';
import View from '../classes/View';

class BankView extends View {
    constructor() {
        super("Bank");

        this.on("Show", this.onLoad.bind(this));
    }

    onLoad() {
        alt.log("Bank loaded");
    }
}

export default new BankView();