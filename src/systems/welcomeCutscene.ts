import alt from 'alt-client';
import game from 'natives';

import KeyHandler from '../handlers/KeyHandler';
import EventHandler from '../handlers/EventHandler';

class WelcomeCutscene {
    started: boolean;
    ped?: number;
    jet?: number;

    constructor() {
        this.started = false;

        EventHandler.onServer("StartArrivalCutscene", this.start.bind(this));
        EventHandler.onServer("StopArrivalCutscene", this.stop.bind(this));

        alt.on("disconnect", this.stop.bind(this));
        alt.everyTick(this.onTick.bind(this));
    }

    onTick() {
        if(!this.started) return;
        if(game.getCutsceneTime() > 26000) this.stop();
    }

    async start(gender: number = 0) {
        if(this.started) return;
        this.started = true;

        game.doScreenFadeOut(0);
        game.advanceClockTimeTo(19, 30, 0);
        game.setAudioFlag("DisableFlightMusic", true);

        game.clearPedTasksImmediately(alt.Player.local.scriptID);
        game.setEntityCoords(alt.Player.local.scriptID, -1117.778, -1557.625, 3.3819, true, false, false, true);
        game.setEntityInvincible(alt.Player.local.scriptID, true);

        game.prepareMusicEvent("FM_INTRO_START");
        this.ped = game.clonePed(alt.Player.local.scriptID, 0, false, false);

        game.setEntityAlpha(alt.Player.local.scriptID, 0, true);
        game.renderScriptCams(false, false, 0, false, false, undefined);

        game.requestCutscene("mp_intro_concat", 1);
        await this.waitForCutscene();

        const hash = alt.hash("p_cs_mp_jet_01_s");
        this.jet = game.createObject(hash, -1200, -1490, 142.385, false, true, false);

        game.setEntityCleanupByEngine(this.jet, false);
        game.setEntityVisible(this.jet, true, false);

        game.registerEntityForCutscene(this.jet, "MP_Plane", 0, 0, 0);

        if(gender == 0) {
            game.registerEntityForCutscene(0, "MP_Female_Character", 3, alt.hash("mp_f_freemode_01"), 0);
            game.registerEntityForCutscene(this.ped, "MP_Male_Character", 0, 0, 0);
        } else {
            game.registerEntityForCutscene(0, "MP_Male_Character", 3, alt.hash("mp_m_freemode_01"), 0);
            game.registerEntityForCutscene(this.ped, "MP_Female_Character", 0, 0, 0);
        }

        game.setEntityVisible(this.ped, true, false);
        for (let i = 1; i < 8; i++){
            game.registerEntityForCutscene(0, "MP_Plane_Passenger_" + i, 3, alt.hash("mp_m_freemode_01"), 0);
            game.setCutsceneEntityStreamingFlags("MP_Plane_Passenger_" + i, 0, 0);
        }

        game.setModelAsNoLongerNeeded(hash);
        alt.setTimeout(() => {
            game.startCutscene(4);
            game._0xBEB2D9A1D9A8F55A(9, 9, 9, 9);
            game.doScreenFadeIn(500);
            game.triggerMusicEvent("FM_INTRO_START");
        }, 500);

        alt.setTimeout(() => game.advanceClockTimeTo(23, 30, 0), 20000);
    }

    stop() {
        if(!game.isCutsceneActive() && !game.isCutscenePlaying()) return alt.log("No cutscene is active or playing!");
        this.started = false;

        game.triggerMusicEvent("FM_INTRO_DRIVE_END");
        game.stopCutsceneImmediately();
        game.shutdownLoadingScreen();

        if(this.ped) game.deletePed(this.ped);
        if(this.jet) game.deleteVehicle(this.jet);

        game.doScreenFadeIn(200);

        alt.setTimeout(() => {
            game.shutdownLoadingScreen();
            game.setNoLoadingScreen(true);

            game.setEntityInvincible(alt.Player.local.scriptID, false);
            game.setEntityAlpha(alt.Player.local.scriptID, 255, false);
            game.setEntityVisible(alt.Player.local.scriptID, true, false);
        }, 100);
    }

    async waitForCutscene() {
        return new Promise(resolve => {
            if(game.hasThisCutsceneLoaded("mp_intro_concat")) return resolve(true);

            const everyTick = alt.everyTick(() => {
                if(game.hasThisCutsceneLoaded("mp_intro_concat")) {
                    alt.clearInterval(everyTick);
                    resolve(true);
                }
            });
        });
    }
}

export default new WelcomeCutscene();