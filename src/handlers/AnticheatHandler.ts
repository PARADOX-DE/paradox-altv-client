import alt from 'alt-client';
import game from 'natives';

import EventHandler from './EventHandler';

class AnticheatHandler {
    ticks: number;
    localPlayer: alt.Player;

    constructor() {
        this.localPlayer = alt.Player.local;
        this.ticks = 0;

        alt.everyTick(() => {
            if(this.ticks % 100 == 0) this.tick();
            if(this.ticks > 1000) this.ticks = 0;
        });

        alt.setInterval(() => {
            this.checkAutoheal();
        }, 10 * 1000);
    }

    tick() {
        if(game.getPlayerInvincible(this.localPlayer.scriptID)) return this.flag("Godmode");
        if(game.getEntityHealth(this.localPlayer.scriptID) > 200) return this.flag("Godmode/Autoheal");
        if(game.getPedArmour(this.localPlayer.scriptID) > 100) return this.flag("Godmode/Autoheal");


    }

    //#region Checks
    checkAutoheal() {
        const health = this.localPlayer.health;
        game.applyDamageToPed(this.localPlayer.scriptID, 1, false, undefined);

        alt.setTimeout(() => {
            alt.log(this.localPlayer.health);
            alt.log(health - 1);
            alt.log(health);
        }, 1000);
    }
    //#endregion

    flag(reason: string, ...args: any[]) {
        EventHandler.emitServer("Anticheat::Flag", reason, ...args);
    }
}

export default new AnticheatHandler();