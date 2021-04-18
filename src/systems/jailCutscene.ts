import alt from 'alt-client';
import game from 'natives';
import PedType from '../enums/PedType';
import AnimationHandler from '../handlers/AnimationHandler';
import EventHandler from '../handlers/EventHandler';
import KeyHandler from '../handlers/KeyHandler';

class JailCutscene {
    policeModel: string = "s_m_y_cop_01";
    policePed: number;
    camera: number;

    constructor() {
        this.policePed = 0;
        this.camera = 0;

        alt.on("disconnect", this.stop.bind(this));
        alt.on("resourceStop", this.stop.bind(this));

        EventHandler.onServer("StartJailCutscene", this.start.bind(this));

        new KeyHandler("F7", 118, () => this.start() && true);
        new KeyHandler("F9", 120, () => this.stop() && true);
    }

    waitForModel(modelString: string): Promise<boolean> {
        return new Promise(resolve => {
            let ticks = 0;
            const model = alt.hash(modelString);

            game.requestModel(model);
            if(game.hasModelLoaded(model)) return resolve(true);

            let everyTick = alt.everyTick(() => {
                if(game.hasModelLoaded(model)) {
                    alt.clearEveryTick(everyTick);
                    return resolve(true);
                }

                ticks++;
                if(ticks >= 10000) {
                    alt.clearEveryTick(everyTick);
                    return resolve(false);
                }
            });
        });
    }

    async start() {
        this.stop();
        alt.toggleGameControls(false);

        const localPlayer = alt.Player.local;
        game.setEntityCoords(localPlayer.scriptID, 459.65, -1001.79, 24.91 - 0.97, true, false, false, true);
        game.setEntityHeading(localPlayer.scriptID, 87.79);
        
        this.camera = game.createCamWithParams("DEFAULT_SCRIPTED_CAMERA", 461.50, -1000.25, 24.91, 0, 0, 0, 90, true, 2);
        game.pointCamAtEntity(this.camera, localPlayer.scriptID, 0, 0, 0, true);
        game.renderScriptCams(true, true, 500, false, false, 0);

        await this.waitForModel(this.policeModel);
        this.policePed = game.createPed(PedType.PED_TYPE_CIVMALE, alt.hash(this.policeModel), 463.80, -1001.86, 24.91 - 0.97, 89.63, false, false);
        
        game.taskGoToEntity(this.policePed, localPlayer.scriptID, 5000, 1.5, 1.0, 1073741824, 0);
        alt.setTimeout(() => {
            game.freezeEntityPosition(this.policePed, true);
            game.freezeEntityPosition(alt.Player.local.scriptID, true);

            new AnimationHandler(this.policePed, "mp_arrest_paired", "cop_p2_back_right").play();
            new AnimationHandler(alt.Player.local.scriptID, "mp_arrest_paired", "crook_p2_fwd_right").play();

            alt.setTimeout(() => {
                new AnimationHandler(this.policePed, "", "").stop();
                new AnimationHandler(alt.Player.local.scriptID, "mp_arresting", "idle").stop().play();
                
                game.freezeEntityPosition(this.policePed, false);
                game.freezeEntityPosition(alt.Player.local.scriptID, false);
            }, 3200);
        }, 2500);
    }

    async stop() {
        alt.toggleGameControls(true);
        game.setModelAsNoLongerNeeded(alt.hash(this.policeModel));

        if(this.policePed != 0) {
            game.deletePed(this.policePed);
            this.policePed = 0;
        }

        if(this.camera != 0) {
            game.destroyCam(this.camera, false);
            game.renderScriptCams(false, true, 250, false, false, 0);

            this.camera = 0;
        }
        
        game.freezeEntityPosition(alt.Player.local.scriptID, false);
        new AnimationHandler(alt.Player.local.scriptID, "", "").stop();
    }
}

export default new JailCutscene();