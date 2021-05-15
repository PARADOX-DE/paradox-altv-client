import alt from 'alt-client';
import game from 'natives';

import Window from '../../classes/Window';
import Weapons from '../../data/weapons';

class WeaponInfoWindow extends Window {
    constructor() {
        super("WeaponInfo");
    }

    onTick() {
        const localPlayer = alt.Player.local;
        const weaponName = Weapons.find(x => x.hash == localPlayer.currentWeapon);

        this.emit("Update", localPlayer.currentWeapon != alt.hash("weapon_unarmed"), weaponName != undefined ? weaponName.name : "Unknown", game.getAmmoInClip(localPlayer.scriptID, localPlayer.currentWeapon)[1], game.getMaxAmmo(localPlayer.scriptID, localPlayer.currentWeapon)[1]);
    }
}

export default new WeaponInfoWindow();