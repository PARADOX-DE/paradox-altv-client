import alt from 'alt-client';
import game from 'natives';

import Controller from '../classes/Controller';
import EventController from './EventController';

class CharacterController extends Controller {
    private localPlayer: alt.Player;
    private tempData: any;
    private fModel = alt.hash('mp_f_freemode_01');
    private mModel = alt.hash(`mp_m_freemode_01`);

    constructor() {
        super("Character");
        
        this.localPlayer = alt.Player.local;

        game.requestModel(this.fModel);
        game.requestModel(this.mModel);

        alt.on("connectionComplete", this.setStats.bind(this));
        EventController.onServer("ApplyPlayerCharacter", this.onApply.bind(this));
    }

    onApply(jsonString: string) {
        this.onUpdate(JSON.parse(jsonString));
    }

    sendToServer() {
        EventController.emitServer("SavePlayerCharacter", this.tempData.firstName, this.tempData.secondName, this.tempData.birthday, JSON.stringify({
            Father: this.tempData.choiseMale,
            Mother: this.tempData.choiseFemale,
           
            Resemblance: this.tempData.resemblance,
            SkinTone: this.tempData.skintone,

            FaceData: this.tempData.facedata,

            OpacityOverlays: this.tempData.opacityOverlays,
            HairOverlay: this.tempData.hairOverlay,

            HairStyle: this.tempData.hairstyle,
            HairColor: this.tempData.hair_color,

            EyebrowShape: this.tempData.eyebrowShape,
            EyebrowThickness: this.tempData.eyebrowThickness,

            EyeColor: this.tempData.eye_color,
            Gender: this.tempData.gender
        }));
    }

    onUpdate(data: any) {
        this.tempData = data;

        const modelNeeded = this.tempData.sex === 0 ? this.fModel : this.mModel;
        if(this.localPlayer.model !== modelNeeded) EventController.emitServer("SetModel", modelNeeded);

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

    setStats() {
        alt.setStat(alt.StatName.Stamina, 100);
        alt.setStat(alt.StatName.Strength, 100);
        alt.setStat(alt.StatName.LungCapacity, 100);
        alt.setStat(alt.StatName.Wheelie, 100);
        alt.setStat(alt.StatName.Flying, 100);
        alt.setStat(alt.StatName.Shooting, 100);
        alt.setStat(alt.StatName.Stealth, 100);
    }
}

export default new CharacterController();