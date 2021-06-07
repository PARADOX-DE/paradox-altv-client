import alt from 'alt-client';
import game from 'natives';

import Marker from '../../classes/Marker';
import Window from '../../classes/Window';

import EventController from '../../controllers/EventController';
import PlayerControlsController from '../../controllers/PlayerControlsController';

class XMenuView extends Window {
    targetMarker?: Marker;
    targetId?: number;

    constructor() {
        super("XMenu");
        
        this.on("Interact", this.onInteract.bind(this));
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
        const localPlayer = alt.Player.local;
        const raycast = this.getRaycast();
        let items: any[] = [];
        
        if(raycast[4]) {
            this.targetId = raycast[4];
            if(this.targetId == undefined || this.targetId == 11010) return;

            if(localPlayer.vehicle != null) { // current vehicle (inside)
                items = [{
					title: 'UR',
                    desc: "",
                    icon: 'exit'
				},
				{
					title: 'UR',
                    desc: "",
                    icon: 'exit'
				},
				{
					title: 'UR',
                    desc: "",
                    icon: 'exit'
				},
				{
					title: 'UR',
                    desc: "",
                    icon: 'exit'
				},
				{
					title: 'UR',
                    desc: "",
                    icon: 'exit'
				},
				{
					title: 'UR',
                    desc: "",
                    icon: 'exit'
				},
				{
					title: 'UR',
                    desc: "",
                    icon: 'exit'
				},
				{
					title: 'UR',
                    desc: "",
                    icon: 'exit'
				}];
            } else if(game.isEntityAVehicle(raycast[4])) { // vehicle at raycast (outside)
                items = [{
					title: 'Schließen',
                    desc: "Schließe das Menü",
                    icon: 'vehicle/exit',
				},
				{
					title: 'Kofferraum öffnen/schließen',
                    desc: "Öffne/Schließe den Kofferraum des Fahrzeuges",
                    icon: 'vehicle/trunk',
                    event: 'OpenVehicleTrunk'
				},
				{
					title: 'Motorhaube öffnen/schließen',
                    desc: "Öffne/Schließe die Motorhaube des Fahrzeuges",
                    icon: 'vehicle/hood',
                    event: 'OpenVehicleHood'
				},
				{
					title: 'Auf/Zuschließen',
                    desc: "Öffne/Schließe das Fahrzeug",
                    icon: 'vehicle/key',
                    event: 'LockVehicle'
				},
				{
					title: 'Starten/Stoppen',
                    desc: "Starte/Stoppe den Fahrzeug Motor",
                    icon: 'vehicle/engine',
                    event: 'StartVehicleEngine'
				}];

                game.setVehicleLights(raycast[4], 2);
                alt.setTimeout(() => game.setVehicleLights(raycast[4], 1), 300);
            } else { // nothing or player
                if(alt.isInDebug()) alt.log(`[RAYCAST][ENTITY] ${raycast[4]}`);
                if(!game.doesEntityExist(raycast[4]) || raycast[4] == alt.Player.local.scriptID) return;

                this.targetMarker = new Marker(27, game.getEntityCoords(raycast[4], false), 1.0, true, new alt.RGBA(255, 255, 255, 255), raycast[4]);
                items = [{
					title: 'UR',
                    desc: "",
                    icon: 'exit'
				},
				{
					title: 'UR',
                    desc: "",
                    icon: 'exit'
				},
				{
					title: 'UR',
                    desc: "",
                    icon: 'exit'
				},
				{
					title: 'UR',
                    desc: "",
                    icon: 'exit'
				},
				{
					title: 'UR',
                    desc: "",
                    icon: 'exit'
				},
				{
					title: 'UR',
                    desc: "",
                    icon: 'exit'
				},
				{
					title: 'UR',
                    desc: "",
                    icon: 'exit'
				},
				{
					title: 'UR',
                    desc: "",
                    icon: 'exit'
				}];
            }
        }

        const [_, x, y] = game.getActiveScreenResolution();

        PlayerControlsController.toggleGameControls(false);
        PlayerControlsController.showCursor(true);

        alt.setCursorPos({ x: x / 2, y: y / 2 });
        this.emit("Open", items);
    }

    closeXMenu() {
        PlayerControlsController.showCursor(false);
        PlayerControlsController.toggleGameControls(true);

        if(this.targetMarker) this.targetMarker.destroy();
        this.emit("Close");
    }

    onInteract(event: string) {
        if(this.targetId && event) EventController.emitServer(event, alt.Entity.getByScriptID(this.targetId));
    }
    
    onKey(key: number, down: boolean) {
        if(key != 88 || alt.isConsoleOpen()) return;

        if(down) this.openXMenu();
        else this.closeXMenu();
    }
}

export default new XMenuView();