/**
 * @preserved 

 * PARADOX ROLEPLAY
 * (c) 2021 PARADOX INTERNATIONAL
 * By downloading you agree that you never will share, upload, copy or use this code.
 */

import './handlers/KeyHandler';
import "./handlers/AnticheatHandler";
import "./handlers/AdminHandler";
import "./handlers/EventHandler";
import "./handlers/DevelopmentHandler";

import "./systems/login";
import "./systems/progressbar";
import "./systems/welcomeCutscene";
import "./systems/charcreator";
import "./systems/garage";
import "./systems/hud";
import "./systems/bank";
import "./systems/vehicle";
import "./systems/jailCutscene";

import "./systems/hud/chat";
import "./systems/hud/notification";
import "./systems/hud/xmenu";
import "./systems/hud/info";
import "./systems/hud/weaponinfo";
import "./systems/hud/speedometer";
import "./systems/hud/voice_section";
import "./systems/phone";
import "./systems/phone/team/TeamLeaderApp";
import "./systems/confirmation";
import "./systems/carshop";

import "./systems/clothing";
import "./systems/blips";
import "./systems/animations";

import alt from 'alt-client';
import game from 'natives';
import AnimationHandler from './handlers/AnimationHandler';

alt.on("connectionComplete", () => {
    alt.setStat(alt.StatName.Stamina, 100);
    alt.setStat(alt.StatName.Strength, 100);
    alt.setStat(alt.StatName.LungCapacity, 100);
    alt.setStat(alt.StatName.Wheelie, 100);
    alt.setStat(alt.StatName.Flying, 100);
    alt.setStat(alt.StatName.Shooting, 100);
    alt.setStat(alt.StatName.Stealth, 100);
});

alt.everyTick(() => {
    if(game.isPedArmed(alt.Player.local.scriptID, 6)) {
        game.disableControlAction(0, 141, true);
        game.disableControlAction(0, 142, true);
    }
});

alt.on("gameEntityCreate", entity => {
    if(entity instanceof alt.Player) game.setPedSuffersCriticalHits(entity.scriptID, false);
});

alt.on("consoleCommand", (cmd, id, flag) => {
    if(cmd == "anim") {
        const numberId = parseInt(id);
        const flagId = parseInt(flag || "9");

        switch(numberId) {
            case 0:
                new AnimationHandler(alt.Player.local.scriptID, "", "").stop();
                break;
            case 1:
                new AnimationHandler(alt.Player.local.scriptID, "mp_arresting", "idle", flagId).play();
                break;
            case 2:
                new AnimationHandler(alt.Player.local.scriptID, "amb@lo_res_idles@", "world_human_bum_slumped_right_lo_res_base", flagId).play();
                break;
            case 3:
                new AnimationHandler(alt.Player.local.scriptID, "mini@strip_club@idles@bouncer@idle_a", "idle_a", flagId).play();
                break;
            case 4:
                new AnimationHandler(alt.Player.local.scriptID, "anim@heists@heist_corona@single_team", "single_team_loop_boss", flagId).play();
                break;
            case 5:
                new AnimationHandler(alt.Player.local.scriptID, "mp_ped_interaction", "handshake_guy_b", flagId).play();
                break;
            case 6:
                new AnimationHandler(alt.Player.local.scriptID, "amb@medic@standing@kneel@base", "base", flagId).play();
                break;
            case 7:
                new AnimationHandler(alt.Player.local.scriptID, "anim@heists@fleeca_bank@ig_7_jetski_owner", "owner_idle", flagId).play();
                break;
            case 8:
                new AnimationHandler(alt.Player.local.scriptID, "switch@michael@sitting", "idle", flagId).play();
                break;
            case 9:
                new AnimationHandler(alt.Player.local.scriptID, "amb@world_human_cheering@male_e", "base", flagId).play();
                break;
            case 10:
                new AnimationHandler(alt.Player.local.scriptID, "amb@world_human_leaning@male@wall@back@foot_up@base", "base", flagId).play();
                break;
            case 11:
                new AnimationHandler(alt.Player.local.scriptID, "anim@mp_player_intincarpeacestd@ds@", "idle_a", flagId).play();
                break;
            case 12:
                new AnimationHandler(alt.Player.local.scriptID, "melee@unarmed@streamed_variations", "plyr_takedown_front_headbutt", flagId).play();
                break;
            case 13:
                new AnimationHandler(alt.Player.local.scriptID, "amb@world_human_smoking_pot@female@base", "base", flagId).play();
                break;
        }
    }
});