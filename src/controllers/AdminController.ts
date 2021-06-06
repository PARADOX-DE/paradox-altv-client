import alt from 'alt-client';
import game from 'natives';

import Controller from '../classes/Controller';
import EventController from './EventController';
import HudView from '../views/Hud';
import Utils from '../util';

class AdminController extends Controller {
    private localPlayer: alt.Player;
    private aduty: boolean;
    private noclip: boolean;
    private lastPressedKey: number;

    constructor() {
        super("Admin");
        
        this.localPlayer = alt.Player.local;
        this.aduty = true;
        this.noclip = false;
        this.lastPressedKey = 0;
        
        EventController.onServer("Admin::Toggle", this.toggle.bind(this));
        EventController.onServer("Admin::Noclip", this.toggleNoclip.bind(this));
    }

    addSpeedToVector(vector1: game.Vector3, vector2: game.Vector3, speed: number, lr = false): alt.Vector3 {
        return new alt.Vector3(
            vector1.x + vector2.x * speed,
            vector1.y + vector2.y * speed,
            lr === true ? vector1.z : vector1.z + vector2.z * speed
        );
    }
    
    camVectorForward(camRot: game.Vector3): game.Vector3 {
        let rotInRad = {
            x: camRot.x * (Math.PI / 180),
            y: camRot.y * (Math.PI / 180),
            z: camRot.z * (Math.PI / 180) + Math.PI / 2,
        };
    
        let camDir = {
            x: Math.cos(rotInRad.z),
            y: Math.sin(rotInRad.z),
            z: Math.sin(rotInRad.x),
        };
    
        return camDir;
    }
    
    camVectorRight(camRot: game.Vector3): game.Vector3 {
        let rotInRad = {
            x: camRot.x * (Math.PI / 180),
            y: camRot.y * (Math.PI / 180),
            z: camRot.z * (Math.PI / 180),
        };
    
        var camDir = {
            x: Math.cos(rotInRad.z),
            y: Math.sin(rotInRad.z),
            z: Math.sin(rotInRad.x),
        };
    
        return camDir;
    }
    
    isVectorEqual(vector1: game.Vector3, vector2: game.Vector3) {
        return (
            vector1.x === vector2.x &&
            vector1.y === vector2.y &&
            vector1.z === vector2.z
        );
    }

    toggle() {
        if(this.noclip) this.toggleNoclip();
        this.aduty = !this.aduty;

        HudView.emit("Admin::Update", this.aduty);
    }

    toggleNoclip() {
        if(!this.aduty) return false;
        this.noclip = !this.noclip;

        game.setEntityCollision(this.localPlayer.scriptID, !this.noclip, !this.noclip);
        game.freezeEntityPosition(this.localPlayer.scriptID, this.noclip);

        if (!this.noclip) {
            const pos = this.localPlayer.pos;
            const [result, z] = game.getGroundZFor3dCoord(
                pos.x,
                pos.y,
                pos.z,
                0,
                false,
                false
            );

            if(result) game.setEntityCoords(this.localPlayer.vehicle ? this.localPlayer.vehicle.scriptID : this.localPlayer.scriptID, pos.x, pos.y, z, true, false, false, true);
        }

        return true;
    }

    DrawText(text: string, x: number, y: number, scale: number, fontType: number, r: number, g: number, b: number, a: number = 255, useOutline = true, useDropShadow = true) {
        game.beginTextCommandDisplayText('STRING');
        game.setTextFont(fontType);
        game.setTextCentre(true);
        game.setTextScale(1, scale);
        game.setTextProportional(true);
        game.setTextColour(r, g, b, a);

        // tslint:disable-next-line
        const textMatched = text.match(/.{1,99}/g);
        if(textMatched) textMatched.forEach(textBlock => game.addTextComponentSubstringPlayerName(textBlock));
    
        if (useOutline) game.setTextOutline();
        if (useDropShadow) game.setTextDropShadow();
    
        game.endTextCommandDisplayText(x, y, 0);
        game.clearDrawOrigin();
    }

    DrawText2(text: string, x: number, y: number, scale: number, fontType: number, r: number, g: number, b: number, a: number = 255, useOutline = true, useDropShadow = true) {
        game.beginTextCommandDisplayText('STRING');
        game.setTextFont(fontType);
        game.setTextCentre(false);
        game.setTextScale(1, scale);
        game.setTextProportional(true);
        game.setTextColour(r, g, b, a);

        // tslint:disable-next-line
        const textMatched = text.match(/.{1,99}/g);
        if(textMatched) textMatched.forEach(textBlock => game.addTextComponentSubstringPlayerName(textBlock));
    
        if (useOutline) game.setTextOutline();
        if (useDropShadow) game.setTextDropShadow();
    
        game.endTextCommandDisplayText(x, y, 0);
        game.clearDrawOrigin();
    }
    
    onTick() {
        if(!this.aduty) return;

        if(alt.isInDebug()) {
            const localPlayer = alt.Player.local;
            const data = {
                pos: { x: localPlayer.pos.x.toFixed(2), y: localPlayer.pos.y.toFixed(2), z: localPlayer.pos.z.toFixed(2) },
                rot: game.getEntityHeading(localPlayer.scriptID).toFixed(2),
                lastPressedKey: `${this.lastPressedKey} - ${String.fromCharCode(this.lastPressedKey)}`
            };

            if(Object.keys(data).length) {
                Object.keys(data).forEach((k, v, arr) => {
                    this.DrawText2(
                        // @ts-ignore
                        `${k}: ${(typeof data[k] === 'object') ? JSON.stringify(data[k]) : data[k]}`,
                        0.02,
                        (0.5 + (v / 80)),
                        0.2,
                        0,
                        255, 255, 255
                    );
                });
            }
        }

        if(this.noclip) {
            const keys = {
                FORWARD: 32,
                BACKWARD: 33,
                LEFT: 34,
                RIGHT: 35,
                SHIFT: 21,
            };

            let currentPos = this.localPlayer.vehicle ? this.localPlayer.vehicle.pos : this.localPlayer.pos;

            const rot = game.getGameplayCamRot(2);
            const dirForward = this.camVectorForward(rot);
            const dirRight = this.camVectorRight(rot);

            let speed = 1.0;

            if(game.isDisabledControlPressed(0, keys.SHIFT)) speed += 1.0;
            if(game.isDisabledControlPressed(0, keys.FORWARD)) currentPos = this.addSpeedToVector(currentPos, dirForward, speed);
            if(game.isDisabledControlPressed(0, keys.BACKWARD)) currentPos = this.addSpeedToVector(currentPos, dirForward, -speed);
            if(game.isDisabledControlPressed(0, keys.LEFT)) currentPos = this.addSpeedToVector(currentPos, dirRight, -speed, true);
            if(game.isDisabledControlPressed(0, keys.RIGHT)) currentPos = this.addSpeedToVector(currentPos, dirRight, speed, true);

            const newPos = new alt.Vector3(currentPos.x, currentPos.y, currentPos.z);
            if(!this.isVectorEqual(newPos, this.localPlayer.pos)) game.setEntityCoordsNoOffset(this.localPlayer.vehicle ? this.localPlayer.vehicle.scriptID : this.localPlayer.scriptID, newPos.x, newPos.y, newPos.z, true, false, false);
        }

        if(this.aduty) {
            for(const player of alt.Player.all) { 
                if(player.scriptID == 0 || player.scriptID == this.localPlayer.scriptID) continue;
            
                const position = player.pos;
                const distance = position.distanceTo(this.localPlayer.pos);
        
                if(distance > 80) continue;
        
                let scale = 1 - (0.8 * distance) / 25;
                let fontSize = 0.6 * scale;
        
                let [res, x, y] = game.getScreenCoordFromWorldCoord(position.x, position.y, position.z + 1.0, 0, 0);
                if(res) this.DrawText(`${player.name}`, x, y - 0.030, fontSize, 4, 255, 255, 255, 255, true, false);
            }
        }
    }

    onKey(key: number, down: boolean) {
        if(down == true && key != "W".charCodeAt(0) && key != "A".charCodeAt(0) && key != "S".charCodeAt(0) && key != "D".charCodeAt(0) && key != "SPACE".charCodeAt(0))
            this.lastPressedKey = key;

        if(key == 113 && down == true) return this.toggle();
        else if(key == 114 && down == true) return this.toggleNoclip();
        else if(key == 115 && down) return this.tpToWaypoint();
    }

    tpToWaypoint() {
        if(!this.aduty) return;
        if(!game.isWaypointActive()) return alt.logError("[ADMIN][tpToWaypoint] no waypoint found!");

        const waypoint = game.getFirstBlipInfoId(8);
        const coords = game.getBlipInfoIdCoord(waypoint);

        Utils.getGroundZ(coords).then(groundZ => {
            game.setEntityCoords(this.localPlayer.scriptID, coords.x, coords.y, groundZ, true, false, false, true);
        });
    }
}

export default new AdminController();