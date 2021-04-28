import alt from 'alt-client';
import game from 'natives';

import View from '../../classes/View';

class SpeedometerView extends View {
    constructor() {
        super("Speedometer");
        
        alt.everyTick(this.onEveryTick.bind(this));
        alt.on("leftVehicle", this.onLeftVehicle.bind(this));
    }

    onLeftVehicle() {
        this.emit("Update", false, 0);
    }

    onEveryTick() {
        const localPlayer = alt.Player.local;

        if(localPlayer.vehicle) {
            const vehicle = localPlayer.vehicle;
            const speed = (vehicle.speed * 3.6).toFixed(0);

            this.emit(
                "Update",
                true,
                speed,
                game.getIsVehicleEngineRunning(vehicle.scriptID),
                game.getVehicleDoorLockStatus(vehicle.scriptID) != 1,
                game.getVehicleLightsState(vehicle.scriptID)[0] && game.getVehicleLightsState(vehicle.scriptID)[1]
            );
        }
    }
}

export default new SpeedometerView();