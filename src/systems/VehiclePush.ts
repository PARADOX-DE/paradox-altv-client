import alt from 'alt-client';
import game from 'natives';

import utils from '../util';

class VehiclePush {
    localPlayer: alt.Player;
    everyTick: number;
    pushing: boolean;

    constructor() {
        this.localPlayer = alt.Player.local;
        this.everyTick = 0;
        this.pushing = false;
        
        game.requestAnimDict('missfinale_c2ig_11');
        alt.on("keydown", this.onKey.bind(this));
    }

    onKey(key: number) {
        if(key != 75 || this.pushing) return;

        const targetVehicle = utils.getNearestVehicle(this.localPlayer.pos);
        if(targetVehicle != null) this.pushVehicle(targetVehicle);
    }

    pushVehicle(vehicle: alt.Vehicle) {
        const localPlayer = this.localPlayer;
        const distance = vehicle.pos.distanceTo(localPlayer.pos);
        if(distance <= 8.0 && !game.isPedInAnyVehicle(localPlayer.scriptID, true)) {
            const vehcoords = vehicle.pos;
            const forward = game.getEntityForwardVector(vehicle.scriptID);

            const firstpart = new alt.Vector3(vehcoords.x + forward.x , vehcoords.y + forward.y, vehcoords.z + forward.z)
            const secondpart = new alt.Vector3(vehcoords.x + (forward.x) * -1, vehcoords.y + (forward.y) * -1, vehcoords.z + (forward.z) * -1);

            const first = game.getDistanceBetweenCoords(firstpart.x, firstpart.y, firstpart.z, localPlayer.pos.x, localPlayer.pos.y, localPlayer.pos.z, true);
            const second = game.getDistanceBetweenCoords(secondpart.x, secondpart.y, secondpart.z, localPlayer.pos.x, localPlayer.pos.y, localPlayer.pos.z, true);

            let front = first > second ? false : true;;
            if(game.isVehicleSeatFree(vehicle.scriptID, -1, false)) {
                const vehSize = game.getModelDimensions(game.getEntityModel(vehicle.scriptID), new alt.Vector3(0.0, 0.0, 0.0), new alt.Vector3(5.0, 5.0, 5.0) );
                const bone = game.getPedBoneIndex(localPlayer.scriptID, 6286);

                if (front) game.attachEntityToEntity(localPlayer.scriptID, vehicle.scriptID, bone, 0.0, vehSize[1].y * -1 + 0.1, vehSize[1].z + 1.0, 0.0, 0.0, 180.0, false, false, false, true, 0, true);
                else game.attachEntityToEntity(localPlayer.scriptID, vehicle.scriptID, bone, 0.0, vehSize[1].y - 0.3, vehSize[1].z + 1.0, 0.0, 0.0, 0.0, false, false, false, true, 0, true);
            }

            game.requestAnimDict('missfinale_c2ig_11');
            let animStarted = false;

            this.pushing = true;
            this.everyTick = alt.everyTick(() => {
                if(!game.isVehicleSeatFree(vehicle.scriptID, -1, false)) {
                    game.detachEntity(localPlayer.scriptID, false, true);
                    game.stopAnimTask(localPlayer.scriptID, 'missfinale_c2ig_11', 'pushcar_offcliff_m', 2.0);
                    game.setEntityCollision(localPlayer.scriptID, true, true);
                    game.freezeEntityPosition(localPlayer.scriptID, true);
                    game.freezeEntityPosition(localPlayer.scriptID, false);
                    game.setVehicleOnGroundProperly(vehicle.scriptID, 1);
                    
                    alt.clearEveryTick(this.everyTick);
                    this.pushing = false;
                }

                if(game.hasAnimDictLoaded("missfinale_c2ig_11") && !animStarted) {
                    animStarted = true;
                    game.taskPlayAnim(this.localPlayer.scriptID, "missfinale_c2ig_11", "pushcar_offcliff_m", 2.0, -8.0, -1, 35, 0, false, false, false);
                } else if(animStarted) {
                    if(game.hasEntityCollidedWithAnything(vehicle.scriptID)) game.setVehicleOnGroundProperly(vehicle.scriptID, 0);

                    if(game.isControlPressed(0, 32)) game.setVehicleForwardSpeed(vehicle.scriptID, front ? -1.0 : 1.0);
                    if(game.isControlPressed(0, 34)) game.taskVehicleTempAction(localPlayer.scriptID, vehicle.scriptID, front ? 10 : 11, 500);
                    if(game.isControlPressed(0, 9)) game.taskVehicleTempAction(localPlayer.scriptID, vehicle.scriptID, !front ? 10 : 11, 500);

                    if(alt.isKeyDown(75)) {
                        game.detachEntity(localPlayer.scriptID, false, true);
                        game.stopAnimTask(localPlayer.scriptID, "missfinale_c2ig_11", "pushcar_offcliff_m", 2.0);
                        game.setEntityCollision(localPlayer.scriptID, true, true);
                        game.freezeEntityPosition(localPlayer.scriptID, true);
                        game.freezeEntityPosition(localPlayer.scriptID, false);
                        game.setVehicleOnGroundProperly(vehicle.scriptID, 1);

                        alt.clearEveryTick(this.everyTick);
                        this.pushing = false;
                    }
                }
            });
        }
    }
}

export default new VehiclePush();