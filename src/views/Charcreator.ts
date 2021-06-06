import alt from 'alt-client';
import game from 'natives';

import Window from '../classes/Window';
import CharacterController from '../controllers/CharacterController';

class CharcreatorView extends Window {
    private camera: number;
    private localPlayer: alt.Player;

    constructor() {
        super("Charcreator");

        this.camera = 0;
        this.localPlayer = alt.Player.local;
        
        this.on("Update", (data) => CharacterController.onUpdate(data));
        this.on("Finish", () => CharacterController.sendToServer());
    }

    onOpen() {
        alt.setTimeout(() => {
            if(this.camera != 0) {
                game.destroyCam(this.camera, false);
                game.renderScriptCams(false, false, 0, false, false, 0);
            }
    
            const offset = game.getOffsetFromEntityInWorldCoords(this.localPlayer.scriptID, 0, 3, 1);
            this.camera = game.createCamWithParams("DEFAULT_SCRIPTED_CAMERA", offset.x, offset.y, offset.z, 0, 0, 0, 40, true, 2);
    
            game.setCamActive(this.camera, true);
            game.pointCamAtCoord(this.camera, this.localPlayer.pos.x, this.localPlayer.pos.y, this.localPlayer.pos.z);
            game.renderScriptCams(true, true, 500, false, false, 0);
        }, 250);
    }

    onClose() {
        if(this.camera != 0) {
            game.destroyCam(this.camera, false);
            game.renderScriptCams(false, false, 0, false, false, 0);
        }
    }
}

export default new CharcreatorView();