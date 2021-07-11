import alt from 'alt-client';
import game from 'natives';

import Marker from '../../classes/Marker';
import Window from '../../classes/Window';

import EventController from '../../controllers/EventController';
import PlayerControlsController from '../../controllers/PlayerControlsController';
import util from '../../util';

export class XMenuView extends Window {
    targetMarker?: Marker;
    targetId?: number;
    opened: boolean;

    constructor() {
        super("XMenu");
        this.opened = false;
        
        this.on("Interact", this.onInteract.bind(this));
    }

    openXMenu() {
        const localPlayer = alt.Player.local;
        let raycast = util.getRaycast();
        let items: any[] = [];
        
        let targetEntity: alt.Entity | null = null;
        if(localPlayer.vehicle != null) targetEntity = localPlayer.vehicle;
        else if(raycast.isHit && targetEntity == null) targetEntity = util.getNearestEntity(raycast.pos, 3);

        if(targetEntity == null) return;
        
        this.targetId = targetEntity.scriptID;

        if(localPlayer.vehicle != null) { // current vehicle (inside)
            targetEntity = localPlayer.vehicle;
            this.targetId = localPlayer.vehicle.scriptID;

            items = [{
                title: 'Schließen',
                desc: "Schließe das Menü",
                icon: 'vehicle/exit',
            },
            {
                title: 'Auf/Zuschließen',
                desc: "Öffne/Schließe das Fahrzeug",
                icon: 'vehicle/key',
                event: 'LockVehicle'
            },
            {
                title: 'Motorhaube öffnen/schließen',
                desc: "Öffne/Schließe die Motorhaube des Fahrzeuges",
                icon: 'vehicle/hood',
                event: 'OpenVehicleHood'
            },
            {
                title: 'Starten/Stoppen',
                desc: "Starte/Stoppe den Fahrzeug Motor",
                icon: 'vehicle/engine',
                event: 'StartVehicleEngine'
            }];

            if(localPlayer.seat == 1) items.push({
                title: 'Radio an/ausschalten',
                desc: "Schalte das Radio an/aus",
                icon: 'vehicle/radio',
                event: 'ToggleVehicleRadio'
            });
        } else if(game.isEntityAVehicle(targetEntity)) { // vehicle at raycast (outside)
            items = [{
                title: 'Schließen',
                desc: "Schließe das Menü",
                icon: 'vehicle/exit',
            },
            {
                title: 'Auf/Zuschließen',
                desc: "Öffne/Schließe das Fahrzeug",
                icon: 'vehicle/key',
                event: 'LockVehicle'
            },
            {
                title: 'Motorhaube öffnen/schließen',
                desc: "Öffne/Schließe die Motorhaube des Fahrzeuges",
                icon: 'vehicle/hood',
                event: 'OpenVehicleHood'
            },
            {
                title: 'Kofferraum öffnen/schließen',
                desc: "Öffne/Schließe den Kofferraum des Fahrzeuges",
                icon: 'vehicle/trunk',
                event: 'OpenVehicleTrunk'
            }];

            game.setVehicleLights(targetEntity.scriptID, 2);
            alt.setTimeout(() => {
                if(targetEntity != null) game.setVehicleLights(targetEntity.scriptID, 1);
            }, 300);
        } else { // nothing or player
            if(!game.doesEntityExist(targetEntity.scriptID) || targetEntity.scriptID == alt.Player.local.scriptID) return;

            this.targetMarker = new Marker(27, game.getEntityCoords(targetEntity.scriptID, false), 1.0, true, new alt.RGBA(255, 255, 255, 255), targetEntity.scriptID);
            items = [{
                title: 'Schließen',
                desc: "Schließe das Menü",
                icon: 'exit'
            }];
        }

        const [_, x, y] = game.getActiveScreenResolution();

        PlayerControlsController.toggleGameControls(false);
        PlayerControlsController.showCursor(true);

        alt.setCursorPos({ x: x / 2, y: y / 2 });
        this.emit("Open", items);
        this.opened = true;
    }

    closeXMenu() {
        PlayerControlsController.showCursor(false);
        PlayerControlsController.toggleGameControls(true);

        if(this.targetMarker) this.targetMarker.destroy();
        if(this.opened) this.emit("Close");
    }

    onInteract(itemTitle: string, event: string) {
        if(this.targetId) {
            if(event && event != "") EventController.emitServer(event, alt.Entity.getByScriptID(this.targetId));
            else this.onItemInteract(itemTitle);
        }
    }
    
    onKey(key: number, down: boolean) {
        if(key != 88 || alt.isConsoleOpen()) return;

        if(down) this.openXMenu();
        else this.closeXMenu();
    }
    
    onItemInteract(title: string) {

    }
}

export default new XMenuView();