import alt from 'alt-client';
import game from 'natives';

import EventHandler from './EventHandler';

import AnticheatConfig from '../interfaces/AnticheatConfig';
import AnticheatFlag from '../enums/AnticheatFlag';
import Handler from '../classes/Handler';

class AnticheatHandler extends Handler {
    private localPlayer: alt.Player;
    private config: AnticheatConfig;
    private ticks: number;

    constructor() {
        super("Anticheat");

        this.localPlayer = alt.Player.local;
        this.ticks = 0;
        this.config = { maxVehicleSpeed: 1000, teleportDistance: 1000, resources: ["PARADOX_RP" ,"u1tim4te"], debug: true };

        EventHandler.onServer("Anticheat::LoadConfig", this.loadConfig.bind(this));

        alt.everyTick(() => {
            if(this.ticks % 100 == 0) this.onTick();
            if(this.ticks > 1000) this.ticks = 0;
        });

        alt.on("anyResourceStart", this.onResourceStart.bind(this));
        alt.setInterval(this.checkAutoheal.bind(this), 2 * 60000);
    }

    onResourceStart(name: string) {
        if(!this.config.resources.some(x => x === name)) return this.flag(AnticheatFlag.UnknownResource, name);
    }

    onTick() {
        if(alt.isInDebug() !== this.config.debug) return this.flag(AnticheatFlag.Debug);
        if(game.getPlayerInvincible(this.localPlayer.scriptID) === true) return this.flag(AnticheatFlag.Godmode);
        if(game.getEntityHealth(this.localPlayer.scriptID) > 200) return this.flag(AnticheatFlag.Autoheal, game.getEntityHealth(this.localPlayer.scriptID));
        if(game.getPedArmour(this.localPlayer.scriptID) > 100) return this.flag(AnticheatFlag.Autoheal, game.getPedArmour(this.localPlayer.scriptID));

        const vehicle = this.localPlayer.vehicle;
        if(vehicle && vehicle.speed > this.config.maxVehicleSpeed) return this.flag(AnticheatFlag.VehicleSpeed, vehicle.speed);
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
    loadConfig(configString: string) {
        this.config = JSON.parse(configString);
    }
    //#endregion

    flag(reason: AnticheatFlag, ...args: any[]) {
        EventHandler.emitServer("Anticheat::Flag", reason, ...args);
    }
}

export default new AnticheatHandler();