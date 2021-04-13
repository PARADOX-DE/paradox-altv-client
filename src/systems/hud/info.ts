import alt from 'alt-client';
import game from 'natives';

import View from '../../classes/View';
import Streets from '../../data/streets';

class InfoView extends View {
    constructor() {
        super("Info");

        alt.everyTick(this.onEveryTick.bind(this));
    }

    onEveryTick() {
        const localPlayer = alt.Player.local;
        const zoneName = game.getNameOfZone(localPlayer.pos.x, localPlayer.pos.y, localPlayer.pos.z);

        const zone = Streets.find(x => x.name.toLowerCase().includes(zoneName.toLowerCase()));
        const [_, hash1, hash2] = game.getStreetNameAtCoord(localPlayer.pos.x, localPlayer.pos.y, localPlayer.pos.z);

        this.emit("Street::Update", zone != undefined ? zone.display : "Invalid", `${ hash2 == 0 ? game.getStreetNameFromHashKey(hash1) : game.getStreetNameFromHashKey(hash1) + ' - ' + game.getStreetNameFromHashKey(hash2) }`);
    }
}

export default new InfoView();