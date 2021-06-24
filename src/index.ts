import alt from 'alt-client';
import game from 'natives';

import './classes/WebView';

import './controllers/AnimationController';
import './controllers/WindowController';
import './controllers/PlayerControlsController';
import './controllers/HUDController';
import './controllers/CharacterController';
import './controllers/ClothingController';
import './controllers/AdminController';
import './controllers/BlipController';
import './controllers/CutsceneController';
import './controllers/AnticheatController';

import EventController from './controllers/EventController';
import './util';

import "./views/Login";
import "./views/Hud";
import './views/Progressbar';
import './views/Charcreator';
import './views/Garage';
import './views/Bank';
import './views/Inventory';
import './views/Carshop';
import './views/Shop';
import './views/Confirmation';
import './views/ClothShop';
import './views/Death';
import './views/Phone';

import './views/hud/chat';
import './views/hud/weaponinfo';
import './views/hud/voice';
import './views/hud/xmenu';
import './views/hud/notificiation';
import './views/hud/info';
import './views/hud/speedometer';

import './systems/VehiclePush';
import './systems/Voice';

alt.on("connectionComplete", () => {
    alt.setStat(alt.StatName.Stamina, 100);
    alt.setStat(alt.StatName.Strength, 100);
    alt.setStat(alt.StatName.LungCapacity, 100);
    alt.setStat(alt.StatName.Wheelie, 100);
    alt.setStat(alt.StatName.Flying, 100);
    alt.setStat(alt.StatName.Shooting, 100);
    alt.setStat(alt.StatName.Stealth, 100);

    game.replaceHudColourWithRgba(143, 36, 177, 221, 255);
    alt.log("[PARADOX ENCRYPTION] Loaded main file with AES-128");
});

alt.everyTick(() => {
    if(game.isPedArmed(alt.Player.local.scriptID, 6)) {
        game.disableControlAction(0, 141, true);
        game.disableControlAction(0, 142, true);
    }
});

alt.on("keydown", key => {
    if(key == 69) return EventController.emitServer("Pressed_E");
    else if(key == 76) return EventController.emitServer("Pressed_L");
});

EventController.onServer("SetPedIntoVeh", (vehicle: alt.Vehicle, seat: number) => {
    let ticks = 0;

    const interval = alt.setInterval(() => {
        ticks++;

        const vehicleScriptId = vehicle.scriptID
        if (vehicleScriptId) {
            game.setPedIntoVehicle(alt.Player.local.scriptID, vehicleScriptId, seat);
            return alt.clearInterval(interval);
        }

        if(ticks > 50000) return alt.clearInterval(interval);
    }, 10);
});