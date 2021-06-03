import alt from 'alt-client';
import game from 'natives';

import EventHandler from '../handlers/EventHandler';
import KeyHandler from '../handlers/KeyHandler';
import View from '../classes/View';

class Vehicle {
    constructor() {
        EventHandler.onServer("SetPedIntoVeh", this.SetPedIntoVeh.bind(this));
    }

    SetPedIntoVeh(vehicle: alt.Vehicle, seatId: number) {
        let cleared = false
        const interval = alt.setInterval(() => {
            const vehicleScriptId = vehicle.scriptID
            if (vehicleScriptId) {
                game.setPedIntoVehicle(alt.Player.local.scriptID, vehicleScriptId, seatId)
                alt.clearInterval(interval)
                cleared = true
            }
        }, 10)
    
        alt.setTimeout(() => {
            if (!cleared) {
                alt.clearInterval(interval)
            }
        }, 5000)
    }
}

export default new Vehicle();

