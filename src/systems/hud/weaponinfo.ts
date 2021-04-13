import alt from 'alt-client';
import game from 'natives';

import View from '../../classes/View';
import Weapons from '../../data/weapons';

class WeaponInfoView extends View {
    constructor() {
        super("WeaponInfo");

        alt.everyTick(this.onEveryTick.bind(this));
    }

    onEveryTick() {
        const localPlayer = alt.Player.local;
        const weaponName = Weapons.find(x => x.hash == localPlayer.currentWeapon);

        this.emit("Update", localPlayer.currentWeapon != alt.hash("weapon_unarmed"), weaponName != undefined ? weaponName.name : "Unknown", game.getAmmoInClip(localPlayer.scriptID, localPlayer.currentWeapon)[1], game.getMaxAmmo(localPlayer.scriptID, localPlayer.currentWeapon)[1]);
    }
}

export default new WeaponInfoView();