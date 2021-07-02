import alt from 'alt-client';
import game from 'natives';

import Controller from '../classes/Controller';
import EventController from './EventController';
import HudView from '../views/Hud';
import Utils from '../util';
import ObjectCreator from '../systems/ObjectCreator';

class AdminController extends Controller {
    private localPlayer: alt.Player;
    private aduty: boolean;
    private noclip: boolean;
    private lastPressedKey: number;

    constructor() {
        super("Admin");
        
        this.localPlayer = alt.Player.local;
        this.aduty = false;
        this.noclip = false;
        this.lastPressedKey = 0;
        
        EventController.onServer("Admin::Toggle", this.toggle.bind(this));
        EventController.onServer("Admin::Noclip", this.toggleNoclip.bind(this));
    }

    forwardVectorFromRotation(rotation: alt.Vector3) {
        let z = rotation.z * (Math.PI / 180.0);
        let x = rotation.x * (Math.PI / 180.0);
        let num = Math.abs(Math.cos(x));

        return new alt.Vector3(-Math.sin(z) * num, Math.cos(z) * num, Math.sin(x));
    }

    addSpeedToVector(vector1: alt.IVector3, vector2: alt.IVector3, speed: number, lr = false): alt.Vector3 {
        return new alt.Vector3(
            vector1.x + vector2.x * speed,
            vector1.y + vector2.y * speed,
            lr === true ? vector1.z : vector1.z + vector2.z * speed
        );
    }
    
    camVectorForward(camRot: alt.IVector3): alt.IVector3 {
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
    
    camVectorRight(camRot: alt.IVector3): alt.IVector3 {
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
    
    isVectorEqual(vector1: alt.IVector3, vector2: alt.IVector3) {
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
        let result = game.getShapeTestResult(raycast);

        const hitEntity = result[4];

        return {
            isHit: result[1],
            pos: new alt.Vector3(result[2].x, result[2].y, result[2].z),
            hitEntity
        }
    }
    
    onTick() {
        if(!this.aduty) return;

        if(this.noclip) {
            const keys = {
                FORWARD: 32,
                BACKWARD: 33,
                LEFT: 34,
                RIGHT: 35,
                SHIFT: 21,
                SPACE: 22,
                CTRL: 36
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
            if(game.isDisabledControlPressed(0, keys.SPACE)) currentPos = new alt.Vector3(currentPos.x, currentPos.y, currentPos.z + 1.0);
            if(game.isDisabledControlPressed(0, keys.CTRL)) currentPos = new alt.Vector3(currentPos.x, currentPos.y, currentPos.z - 1.0);

            const newPos = new alt.Vector3(currentPos.x, currentPos.y, currentPos.z);
            if(!this.isVectorEqual(newPos, this.localPlayer.pos)) {
                game.setEntityCoordsNoOffset(this.localPlayer.vehicle ? this.localPlayer.vehicle.scriptID : this.localPlayer.scriptID, newPos.x, newPos.y, newPos.z, true, false, false);
            }

            if(this.localPlayer.vehicle != null) {
                game.setEntityRotation(this.localPlayer.vehicle.scriptID, rot.y, rot.x, rot.y, 2, true);
                game.setEntityHeading(this.localPlayer.vehicle.scriptID, rot.z);

                game.setVehicleForwardSpeed(this.localPlayer.vehicle.scriptID, 0);
            }
        }

        if(alt.debug) {
            const localPlayer = alt.Player.local;
            const data = {
                pos: { x: localPlayer.pos.x.toFixed(2), y: localPlayer.pos.y.toFixed(2), z: localPlayer.pos.z.toFixed(2) },
                rot: game.getEntityHeading(localPlayer.scriptID).toFixed(2),
                lastPressedKey: `${this.lastPressedKey} - ${String.fromCharCode(this.lastPressedKey)}`,
                objectCreatedEnabled: ObjectCreator.enabled ? "On" : "Off",
                objectCreatorIndex: ObjectCreator.currentObjectIndex,
                objectCreatorRotation: ObjectCreator.objectRotation
            };

            if(Object.keys(data).length) {
                Object.keys(data).forEach((k, v, arr) => {
                    this.DrawText2(
                        // @ts-ignore
                        `${k}: ${(typeof data[k] !== 'string') ? JSON.stringify(data[k]) : data[k]}`,
                        0.02,
                        (0.5 + (v / 80)),
                        0.2,
                        0,
                        255, 255, 255
                    );
                });
            }

            const raycast = this.getRaycast();
            if(raycast.isHit) {
                const headPosition = game.getWorldPositionOfEntityBone(localPlayer.scriptID, game.getPedBoneIndex(localPlayer.scriptID, 12844));
                if(headPosition) {
                    game.drawLine(headPosition.x, headPosition.y, headPosition.z, raycast.pos.x, raycast.pos.y, raycast.pos.z, 255, 0, 0, 255);
                }
            }
        }

        if(this.aduty) {
            for(const player of alt.Player.all) { 
                //if(player.scriptID == 0 || player.scriptID == this.localPlayer.scriptID) continue;
                if(player.scriptID == 0) continue;
            
                const position = player.pos;
                const distance = position.distanceTo(this.localPlayer.pos);
        
                if(distance > 80) continue;
        
                let scale = 1 - (0.8 * distance) / 25;
                let fontSize = 0.5 * scale;
        
                let [res, x, y] = game.getScreenCoordFromWorldCoord(position.x, position.y, position.z + 1.0, 0, 0);
                if(res) this.DrawText(`${player.name}`, x, y - 0.030, fontSize, 0, 255, 255, 255, 255, true, false);
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