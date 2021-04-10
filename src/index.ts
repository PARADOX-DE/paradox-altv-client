import './handlers/KeyHandler';
import "./handlers/AnticheatHandler";
import "./handlers/AdminHandler";
import "./handlers/EventHandler";

import "./systems/login";
import "./systems/progressbar";
import "./systems/welcomeCutscene";
import "./systems/charcreator";
import "./systems/garage";
import "./systems/hud";
import "./systems/bank";

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
});

alt.on("gameEntityCreate", entity => {
    if(entity instanceof alt.Player) game.setPedSuffersCriticalHits(entity.scriptID, false);
});