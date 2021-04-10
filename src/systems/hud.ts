import alt from 'alt-client';
import game from 'natives';

import EventHandler from '../handlers/EventHandler';
import KeyHandler from '../handlers/KeyHandler';
import View from '../classes/View';
import Marker from '../classes/Marker';

import Weapons from '../data/weapons';
import Streets from '../data/streets';

class HudView extends View {
    savedCursorPosition?: alt.Vector2;
    targetMarker?: Marker;
    targetId?: number;

    everyTick: number;

    constructor() {
        super("Hud");

        this.on("Show", this.onLoad.bind(this));
        this.on("Chat::Send", this.onMessage.bind(this));
        this.on("XMenu::Interact", this.onInteract.bind(this));

        new KeyHandler("T", 84, this.openChat.bind(this), true);

        new KeyHandler("X", 88, this.openXMenu.bind(this), true, true);
        new KeyHandler("X", 88, this.closeXMenu.bind(this), false, false);

        this.everyTick = alt.everyTick(this.onEveryTick.bind(this));

        alt.on("leftVehicle", this.onLeftVehicle.bind(this));
    }

    onLoad() {
        this.emit("gotFormat", game.getIsWidescreen());
    }

    onLeftVehicle() {
        this.emit("Speedo::Update", false, 0);
    }

    onEveryTick() {
        const localPlayer = alt.Player.local;

        if(localPlayer.vehicle) {
            const vehicle = localPlayer.vehicle;
            const speed = vehicle.speed * 3.6;

            this.emit("Speedo::Update", true, speed.toFixed(0));
        }

        const zoneName = game.getNameOfZone(localPlayer.pos.x, localPlayer.pos.y, localPlayer.pos.z);

        const zone = Streets.find(x => x.name.toLowerCase().includes(zoneName.toLowerCase()));
        const [_, hash1, hash2] = game.getStreetNameAtCoord(localPlayer.pos.x, localPlayer.pos.y, localPlayer.pos.z);

        this.emit("Street::Update", zone != undefined ? zone.display : "Invalid", `${ hash2 == 0 ? game.getStreetNameFromHashKey(hash1) : game.getStreetNameFromHashKey(hash1) + ' - ' + game.getStreetNameFromHashKey(hash2) }`);
        this.emit("Count::Update", alt.Player.all.length);

        const weaponName = Weapons.find(x => x.hash == localPlayer.currentWeapon);

        this.emit("Weapon::Update", localPlayer.currentWeapon != alt.hash("weapon_unarmed"), weaponName != undefined ? weaponName.name : "Unknown", game.getAmmoInClip(localPlayer.scriptID, localPlayer.currentWeapon)[1], game.getMaxAmmo(localPlayer.scriptID, localPlayer.currentWeapon)[1]);
    }

    //#region chat
    openChat() {
        this.webview.focus();
        this.emit("Chat::Show");

        alt.toggleGameControls(false);
        alt.showCursor(true);

        return true;
    }

    onMessage(message: string) {
        this.webview.unfocus();

        alt.toggleGameControls(true);
        alt.showCursor(false);

        EventHandler.emitServer("chat:message", message);
    }
    //#endregion

    //#region X menu
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
        this.emit("XMenu::Open", items);

        return true;
    }

    closeXMenu() {
        alt.showCursor(false);
        alt.toggleGameControls(true);

        if(this.targetMarker) this.targetMarker.destroy();

        this.webview.unfocus();
        this.emit("XMenu::Close");
        
        return true;
    }

    onInteract(id: number) {
        if(this.targetId) EventHandler.emitServer("XMenu::Interact", id, this.targetId);
    }
    //#endregion

    //#region utils
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
    //#endregion
}

export default new HudView();