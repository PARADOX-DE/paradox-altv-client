import alt from 'alt-client';
import game from 'natives';

import EventHandler from './EventHandler';
import AnticheatConfig from '../interfaces/AnticheatConfig';
import AnticheatFlag from '../enums/AnticheatFlag';

class AnticheatHandler {
    private localPlayer: alt.Player;
    private config: AnticheatConfig;

    private ticks: number;

    constructor() {
        this.localPlayer = alt.Player.local;
        this.ticks = 0;
        this.config = { maxVehicleSpeed: 1000, teleportDistance: 1000 };

        alt.onServer("Anticheat::LoadConfig", (config: AnticheatConfig) => this.config = config);

        alt.everyTick(() => {
            if(this.ticks % 100 == 0) this.tick();
            if(this.ticks > 1000) this.ticks = 0;
        });

        alt.setInterval(() => {
            this.checkAutoheal();
        }, 5 * 1000);
    }

    tick() {
        if(game.getPlayerInvincible(this.localPlayer.scriptID)) return this.flag(AnticheatFlag.Godmode);
        if(game.getEntityHealth(this.localPlayer.scriptID) > 200) return this.flag(AnticheatFlag.Autoheal, game.getEntityHealth(this.localPlayer.scriptID));
        if(game.getPedArmour(this.localPlayer.scriptID) > 100) return this.flag(AnticheatFlag.Autoheal, game.getPedArmour(this.localPlayer.scriptID));

        if(this.localPlayer.vehicle && this.localPlayer.vehicle.speed > this.config.maxVehicleSpeed)
            return this.flag(AnticheatFlag.VehicleSpeed, this.localPlayer.vehicle.speed);
    }

    //#region Checks
    checkAutoheal() {
        const health = this.localPlayer.health;
        game.applyDamageToPed(this.localPlayer.scriptID, 1, false, undefined);

        alt.setTimeout(() => {
            const realHealth = health - 1;

            if(this.localPlayer.health > realHealth) return this.flag(AnticheatFlag.Autoheal);
            game.setEntityHealth(this.localPlayer.scriptID, health, 0);
        }, 100);
    }
    //#endregion

    //#region Server events

    //#endregion

    flag(reason: AnticheatFlag, ...args: any[]) {
        alt.log(reason);
        EventHandler.emitServer("Anticheat::Flag", reason, ...args);
    }
}

export default new AnticheatHandler();