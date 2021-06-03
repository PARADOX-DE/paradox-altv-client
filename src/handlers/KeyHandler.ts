import alt from 'alt-client';
import game from 'natives';
import Handler from '../classes/Handler';
import Webview from '../classes/Webview';
import controls from '../systems/controls';
const list: KeyHandler[] = [];

class KeyHandler {
    key: string;
    code: number;
    func?: () => boolean;
    needControls?: boolean;
    needDown: boolean;
    
    constructor(key: string, code: number, func?: () => boolean, needControls?: boolean, needDown: boolean = true) {
        this.key = key;
        this.code = code;
        this.func = func;
        this.needControls = needControls;
        this.needDown = needDown;

        list.push(this);
    }

    static get all() {
        return list;
    }
}

alt.on("keydown", key => {
    for(const handler of KeyHandler.all) {
        if(!handler.needDown) continue;
        if(handler.code != key) continue;
        if(handler.needControls == true && !controls.controls) continue; 

        if(!handler.func) alt.emitServer(`Pressed_${handler.key}`);
        else if(handler.func()) break;
    }
});

alt.on("keyup", key => {
    for(const handler of KeyHandler.all) {
        if(handler.needDown) continue;
        if(handler.code != key) continue;
        if(handler.needControls == true && !controls.controls) continue; 

        if(!handler.func) alt.emitServer(`Pressed_${handler.key}`);
        else if(handler.func()) break;
    }
});

new KeyHandler("E", 69, undefined, true);
new KeyHandler("Y", 89, undefined, true);
new KeyHandler("I", 73, undefined, true);

new KeyHandler("F5", 116, () => {
    Webview.webView.focus();

    controls.showCursor(true);
    controls.toggleGameControls(false);

    return true;
});

new KeyHandler("F6", 117, () => {
    Webview.webView.unfocus();

    controls.showCursor(false);
    controls.toggleGameControls(true);

    return true;
});

function getNearestVehicle(pos: alt.IVector3): alt.Vehicle | null {
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
}

function hasVehicleTurretSeat(vehicle: alt.Vehicle): boolean {
    for(let i=0; i<game.getVehicleMaxNumberOfPassengers(vehicle.scriptID); i++) {
        if(game.isTurretSeat(vehicle.scriptID, i)) return true;
    }

    return false;
}

enum VehicleSeat {
    None = -3,
    Any,
    Driver,
    Passenger,
    LeftFront = -1,
    RightFront,
    LeftRear,
    RightRear,
    ExtraSeat1,
    ExtraSeat2,
    ExtraSeat3,
    ExtraSeat4,
    ExtraSeat5,
    ExtraSeat6,
    ExtraSeat7,
    ExtraSeat8,
    ExtraSeat9,
    ExtraSeat10,
    ExtraSeat11,
    ExtraSeat12,
}

new KeyHandler("G", 71, () => {
    const veh = getNearestVehicle(alt.Player.local.pos);
    if(!veh || veh == null) {
        alt.log("cant find vehicle");
        return false;
    }

    const localPlayer = alt.Player.local;
    const relPos = game.getOffsetFromEntityGivenWorldCoords(veh.scriptID, localPlayer.pos.x, localPlayer.pos.y, localPlayer.pos.z);
    let seat = VehicleSeat.Any;

    if(game.getVehicleMaxNumberOfPassengers(veh.scriptID) > 1) {
        if(relPos.x < 0 && relPos.y > 0) seat = VehicleSeat.LeftRear;
        else if(relPos.x >= 0 && relPos.y > 0) seat = VehicleSeat.RightFront;
        else if(relPos.x < 0 && relPos.y <= 0) seat = VehicleSeat.LeftRear;
        else if(relPos.x >= 0 && relPos.y <= 0) seat = VehicleSeat.RightRear;
    } else seat = VehicleSeat.Passenger;

    if(hasVehicleTurretSeat(veh) && !localPlayer.isInRagdoll && !localPlayer.isAiming) game.setPedIntoVehicle(localPlayer.scriptID, veh.scriptID, seat);
    else game.taskEnterVehicle(localPlayer.scriptID, veh.scriptID, -1, seat, 2.0, 0, 0);

    return true;
});

export default KeyHandler;