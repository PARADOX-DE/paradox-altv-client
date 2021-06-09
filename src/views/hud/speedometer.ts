import alt from 'alt-client';
import game from 'natives';

import Window from '../../classes/Window';

export class SpeedometerView extends Window {
    constructor() {
        super("Speedometer");

        alt.on("leftVehicle", this.onLeftVehicle.bind(this));
    }

    onLeftVehicle() {
        this.emit("Update", false, 0);
    }

    onTick() {
        const localPlayer = alt.Player.local;

        if(localPlayer.vehicle) {
            const vehicle = localPlayer.vehicle;
            const speed = (vehicle.speed * 3.6).toFixed(0);
            
            let fuel = 0;
            const maxFuel = 0;

            if(vehicle.hasStreamSyncedMeta("Fuel")) fuel = vehicle.getStreamSyncedMeta("Fuel");

            const isEngineRunning = game.getIsVehicleEngineRunning(vehicle.scriptID);
            const lockStatus = game.getVehicleDoorLockStatus(vehicle.scriptID);
            const lightsState = game.getVehicleLightsState(vehicle.scriptID);

            this.emit("Update", true, speed, fuel, maxFuel, isEngineRunning, lockStatus != 1, lightsState[0] && lightsState[1]);
        }
    }
}

export default new SpeedometerView();