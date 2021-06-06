import './classes/WebView';

import './controllers/WindowController';
import './controllers/PlayerControlsController';
import './controllers/HUDController';
import './controllers/CharacterController';
import './controllers/ClothingController';
import './controllers/AdminController';
import './controllers/BlipController';

import EventController from './controllers/EventController';
import './util';

import "./views/Login";
import "./views/Hud";
import './views/Progressbar';
import './views/Charcreator';
import './views/Garage';
import './views/Bank';

import './views/hud/chat';
import './views/hud/weaponinfo';
import './views/hud/voice';
import './views/hud/xmenu';

import alt from 'alt-client';
import game from 'natives';

alt.on("connectionComplete", () => {
    alt.setStat(alt.StatName.Stamina, 100);
    alt.setStat(alt.StatName.Strength, 100);
    alt.setStat(alt.StatName.LungCapacity, 100);
    alt.setStat(alt.StatName.Wheelie, 100);
    alt.setStat(alt.StatName.Flying, 100);
    alt.setStat(alt.StatName.Shooting, 100);
    alt.setStat(alt.StatName.Stealth, 100);

    game.replaceHudColourWithRgba(143, 36, 177, 221, 255);
    alt.log("[PARADOX ENCRYPTION] Loaded index.js");
});

alt.everyTick(() => {
    if(game.isPedArmed(alt.Player.local.scriptID, 6)) {
        game.disableControlAction(0, 141, true);
        game.disableControlAction(0, 142, true);
    }
});

alt.on("keydown", key => {
    if(key == 69) return EventController.emitServer("Pressed_E");
    else if(key == 73) return EventController.emitServer("Pressed_I");
});