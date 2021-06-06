import alt from 'alt-client';
import game from 'natives';

export default {
    getGroundZ(pos: alt.IVector3): Promise<number> {
        let ZStart = -100;

        return new Promise(resolve => {
            let interval = alt.setInterval(() => {
                game.requestCollisionAtCoord(pos.x, pos.y, ZStart);

                let [found, posZ] = game.getGroundZFor3dCoord(pos.x, pos.y, ZStart, 0, false, false);
                if (!found) {
                    ZStart += 5;
                    return;
                }

                alt.clearInterval(interval);
                resolve(posZ);
            }, 5);
        });
    },
    getNearestVehicle(pos: alt.IVector3): alt.Vehicle | null {
        let target = null;
        let newDistance = 1000;
    
        for(const vehicle of alt.Vehicle.all) {
            if(vehicle.scriptID == 0) continue;
            if(vehicle.pos.distanceTo(pos) <= 3 && vehicle.pos.distanceTo(pos) <= newDistance) {
                newDistance = vehicle.pos.distanceTo(pos);
                target = vehicle;
            }
        }
    
        return target;
    },
    isPlayerSpawned(target: alt.Player): Promise<boolean> {
        return new Promise(resolve => {
            let ticks = 0;
            if(target.scriptID != 0) return resolve(true);

            let interval = alt.everyTick(() => {
                if(ticks > 10000) return resolve(false);
                if(target.scriptID == 0) {
                    ticks++;
                    return;
                }

                alt.clearEveryTick(interval);
                resolve(true);
            });
        });
    }
}