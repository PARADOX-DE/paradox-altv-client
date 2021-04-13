import alt from 'alt-client';
import game from 'natives';

import EventHandler from '../../handlers/EventHandler';
import KeyHandler from '../../handlers/KeyHandler';
import View from '../../classes/View';
import Marker from '../../classes/Marker';

class XMenuView extends View {
    targetMarker?: Marker;
    targetId?: number;

    constructor() {
        super("XMenu");

        this.on("Interact", this.onInteract.bind(this));

        new KeyHandler("X", 88, this.openXMenu.bind(this), true, true);
        new KeyHandler("X", 88, this.closeXMenu.bind(this), false, false);
    }

    GetDirectionFromRotation(rotation: alt.IVector3) {
        var z = rotation.z * (Math.PI / 180.0);
        var x = rotation.x * (Math.PI / 180.0);
        var num = Math.abs(Math.cos(x));
    
        return new alt.Vector3(
            (-Math.sin(z) * num),
            (Math.cos(z) * num),
            Math.sin(x)
        );
    }

    getRaycast() {
        let start = game.getFinalRenderedCamCoord();
        let rot = game.getFinalRenderedCamRot(2);
        let fvector = this.GetDirectionFromRotation(rot);
        let frontOf = new alt.Vector3((start.x + (fvector.x * 2000)), (start.y + (fvector.y * 2000)), (start.z + (fvector.z * 2000)));
    
        let raycast = game.startExpensiveSynchronousShapeTestLosProbe(start.x, start.y, start.z, frontOf.x, frontOf.y, frontOf.z, -1, alt.Player.local.scriptID, 7);
        let getRaycast = game.getShapeTestResult(raycast);
        getRaycast.push(rot);
    
        return getRaycast;
    }

    openXMenu() {
        const raycast = this.getRaycast();
        let items: any[] = [{ name: "UR" }];

        if(raycast[4]) {
            this.targetId = raycast[4];

            if(game.isEntityAVehicle(raycast[4])) {
                items = [{ name: "UR" }, { name: "UR" }];

                game.setVehicleLights(raycast[4], 2);
                alt.setTimeout(() => game.setVehicleLights(raycast[4], 1), 300);
            } else this.targetMarker = new Marker(27, game.getEntityCoords(raycast[4], false), 1.0, true, new alt.RGBA(255, 255, 255, 255), raycast[4]);
        }

        const [_, x, y] = game.getActiveScreenResolution();

        alt.toggleGameControls(false);
        alt.showCursor(true);
        alt.setCursorPos({ x: x / 2, y: y / 2 });

        this.webview.focus();
        this.emit("Open", items);

        return true;
    }

    closeXMenu() {
        alt.showCursor(false);
        alt.toggleGameControls(true);

        if(this.targetMarker) this.targetMarker.destroy();

        this.webview.unfocus();
        this.emit("Close");
        
        return true;
    }

    onInteract(id: number) {
        if(this.targetId) EventHandler.emitServer("XMenu::Interact", id, this.targetId);
    }
}

export default new XMenuView();