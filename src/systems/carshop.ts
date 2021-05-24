import alt from 'alt-client';
import game from 'natives';

import EventHandler from '../handlers/EventHandler';
import View from '../classes/View';

class CarShopView extends View {
    previewCam: number;
    previewVehicle: number;

    savedPosition: alt.Vector3;

    constructor() {
        super("CarShop");

        this.previewCam = 0;
        this.previewVehicle = 0;
        this.savedPosition = new alt.Vector3(0,0,0);
        
        this.on("PreviewVehicle", this.PreviewVehicle.bind(this));
        this.on("PreviewVehicleChangeColor", this.PreviewVehicleChangeColor.bind(this));
        this.on("LeaveCarShop", this.LeaveCarShop.bind(this));
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

    async PreviewVehicle(vehicleModel: string) {
        if(this.savedPosition.x == 0 && this.savedPosition.y == 0 && this.savedPosition.z == 0)
            this.savedPosition = alt.Player.local.pos;

        await this.waitForModel(vehicleModel);
        alt.log("PreviewVehicle");

        if (this.previewCam != 0) {
            game.destroyCam(this.previewCam, false);
            game.renderScriptCams(false, true, 250, false, false, 0);

            this.previewCam = 0;
        }

        if(this.previewVehicle != 0) {
            game.setVehicleAsNoLongerNeeded(this.previewVehicle);
            game.deleteVehicle(this.previewVehicle);

            this.previewVehicle = 0;
        }
        
        game.setEntityCoordsNoOffset(alt.Player.local.scriptID, -863.24835, -10.08791, 40.602905, false, false, false);

        this.previewCam = game.createCamWithParams('DEFAULT_SCRIPTED_CAMERA', -873.95605, -17.28791, 43.3385, 0, 0, 0, 40, true, 0);
        game.pointCamAtCoord(this.previewCam, -875.7758, -24.158241, 41.394897);
        game.setCamActive(this.previewCam, true);
        game.renderScriptCams(true, true, 0, false, false, 0);

        this.previewVehicle = game.createVehicle(alt.hash(vehicleModel), -875.7758, -24.158241, 41.394897, 52.81, false, false, false);
        game.setVehicleColours(this.previewVehicle, 0, 0);
    }

    PreviewVehicleChangeColor(colorId: number){
        if(this.previewVehicle != 0){
            game.setVehicleColours(this.previewVehicle, colorId, colorId);
        }
    }
    
    LeaveCarShop() {
        game.setEntityCoordsNoOffset(alt.Player.local.scriptID, this.savedPosition.x, this.savedPosition.y, this.savedPosition.z, false, false, false);
        this.savedPosition = new alt.Vector3(0,0,0);
        
        if (this.previewCam != 0) {
            game.destroyCam(this.previewCam, false);
            game.renderScriptCams(false, true, 0, false, false, 0);

            this.previewCam = 0;
        }

        if(this.previewVehicle != 0) {
            game.setVehicleAsNoLongerNeeded(this.previewVehicle);
            game.deleteVehicle(this.previewVehicle);

            this.previewVehicle = 0;
        }
    }
}

export default new CarShopView();