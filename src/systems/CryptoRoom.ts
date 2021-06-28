import alt from 'alt-client';
import game from 'natives';
import EventController from '../controllers/EventController';

class CryptoRoom {
    constructor() {
        EventController.onServer("Crypto::LoadServer", this.loadServer.bind(this));
    }

    loadServer(serverCount: number){
        let interiorID = game.getInteriorAtCoords(1725.842, 4687.657, 17.54688);
        game.activateInteriorEntitySet(interiorID, 'serverroom_' + serverCount + 'server');
        game.refreshInterior(interiorID);

        alt.log("Welcome to CryptoRoom v.1");
    }
}

export default new CryptoRoom();