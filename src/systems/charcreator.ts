import alt from 'alt-client';
import game from 'natives';

import EventHandler from '../handlers/EventHandler';
import View from '../classes/View';

class CharCreator extends View {
    private localPlayer: alt.Player;
    private tempData: any;
    private camera: number;
    private fModel = alt.hash('mp_f_freemode_01');
    private mModel = alt.hash(`mp_m_freemode_01`);

    constructor() {
        super("Charcreator");

        this.camera = 0;
        this.localPlayer = alt.Player.local;

        EventHandler.onServer("ApplyPlayerCharacter", this.onApply.bind(this));

        this.on("Update", this.onUpdate.bind(this));
        this.on("Finish", this.onFinish.bind(this))

        game.requestModel(this.fModel);
        game.requestModel(this.mModel);
    }

    onFinish() {
        EventHandler.emitServer("SavePlayerCharacter", this.tempData.firstName, this.tempData.lastname, this.tempData.birthday, JSON.stringify({
            choiseMale: this.tempData.choiseMale,
            choiseFemale: this.tempData.choiseFemale,
           
            resemblance: this.tempData.resemblance,
            skintone: this.tempData.skintone,

            facedata: this.tempData.facedata,

            opacityOverlays: this.tempData.opacityOverlays,
            hairOverlay: this.tempData.hairOverlay,

            hairstyle: this.tempData.hairstyle,
            hair_color: this.tempData.hair_color,

            eyebrowShape: this.tempData.eyebrowShape,
            eyebrowThickness: this.tempData.eyebrowThickness,

            eye_color: this.tempData.eye_color,
            gender: this.tempData.gender
        }));
    }

    onApply(jsonString: string) {
        const jsonData = JSON.parse(jsonString);
        this.onUpdate(jsonData);
    }

    onUpdate(data: any) {
        this.tempData = data;

        const modelNeeded = this.tempData.gender === 0 ? this.mModel : this.fModel;
        if(this.localPlayer.model !== modelNeeded) {
            EventHandler.emitServer("SetModel", modelNeeded);
        }

        game.clearPedDecorations(this.localPlayer.scriptID);
        game.setPedHeadBlendData(this.localPlayer.scriptID, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);
        game.setPedHeadBlendData(
            this.localPlayer.scriptID,

            this.tempData.choiseMale,
            this.tempData.choiseFemale,
            0,
            this.tempData.choiseMale,
            this.tempData.choiseFemale,
            0,
            parseFloat(this.tempData.resemblance),
            parseFloat(this.tempData.skintone),
            0,
            false
        );

        for(let i = 0; i < this.tempData.facedata.length; i++) game.setPedFaceFeature(this.localPlayer.scriptID, i, this.tempData.facedata[i]);
        for(let i = 0; i < this.tempData.opacityOverlays.length; i++) {
            const val = this.tempData.opacityOverlays[i];
            game.setPedHeadOverlay(this.localPlayer.scriptID, val.id, val.value, parseFloat(val.opacity));
        }

        if(this.tempData.hairOverlay) {
            const collection = alt.hash(this.tempData.hairOverlay.collection);
            const overlay = alt.hash(this.tempData.hairOverlay.overlay);
        
            game.addPedDecorationFromHashes(this.localPlayer.scriptID, collection, overlay);
            game.setPedComponentVariation(this.localPlayer.scriptID, 2, this.tempData.hairstyle, 0, 0);
            game.setPedHairColor(this.localPlayer.scriptID, this.tempData.hair_color, 0);
        }

        game.setPedHeadOverlay(this.localPlayer.scriptID, 2, this.tempData.eyebrowShape, this.tempData.eyebrowThickness);
        game.setPedHeadOverlayColor(this.localPlayer.scriptID, 2, 1, 0, 0);
        
        game.setPedEyeColor(this.localPlayer.scriptID, this.tempData.eye_color);

        game.setPedComponentVariation(this.localPlayer.scriptID, 3, 15, 0, 0);
        game.setPedComponentVariation(this.localPlayer.scriptID, 4, 14, 0, 0);
        game.setPedComponentVariation(this.localPlayer.scriptID, 6, this.tempData.gender ? 35 : 34, 0, 0);
        game.setPedComponentVariation(this.localPlayer.scriptID, 8, 15, 0, 0);
        game.setPedComponentVariation(this.localPlayer.scriptID, 11, this.tempData.gender ? 15 : 91, 0, 0);
    }

    onOpen() {
        super.onOpen();

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
        super.onClose();
        
        if(this.camera != 0) {
            game.destroyCam(this.camera, false);
            game.renderScriptCams(false, false, 0, false, false, 0);
        }
    }
}

export default new CharCreator();