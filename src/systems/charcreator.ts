import alt from 'alt-client';
import game from 'natives';

import View from '../classes/View';
import HairOverlays from '../data/hairoverlays';

class CharCreator extends View {
    private localPlayer: alt.Player;

    constructor() {
        super("Charcreator");

        this.localPlayer = alt.Player.local;
        this.on("Update", this.onUpdate.bind(this));
    }

    onUpdate(data: any) {
        game.setPedHeadBlendData(this.localPlayer.scriptID, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);
        game.setPedHeadBlendData(
            this.localPlayer.scriptID,

            data.choiseMale,
            data.choiseFemale,
            0,
            data.choiseMale,
            data.choiseFemale,
            0,
            parseFloat(data.resemblance),
            parseFloat(data.skintone),
            0,
            false
        );

        for(let i = 0; i < data.facedata; i++) game.setPedFaceFeature(this.localPlayer.scriptID, i, data.facedata[i]);

        if(data.hairOverlay) {
            const collection = alt.hash(data.hairOverlay.collection);
            const overlay = alt.hash(data.hairOverlay.overlay);
        
            game.addPedDecorationFromHashes(this.localPlayer.scriptID, collection, overlay);
            game.setPedComponentVariation(this.localPlayer.scriptID, 2, data.hairstyle, 0, 0);
            game.setPedHairColor(this.localPlayer.scriptID, data.hair_color, 0);
        }

        game.setPedHeadOverlay(this.localPlayer.scriptID, 2, data.eyebrowShape, 1);
        game.setPedHeadOverlayColor(this.localPlayer.scriptID, 2, 1, 0, 0);

        game.setPedEyeColor(this.localPlayer.scriptID, data.eye_color);

        if(data.gender == 0) {
            game.setPedComponentVariation(this.localPlayer.scriptID, 3, 15, 0, 0);
            game.setPedComponentVariation(this.localPlayer.scriptID, 4, 14, 0, 0);
            game.setPedComponentVariation(this.localPlayer.scriptID, 6, 35, 0, 0);
            game.setPedComponentVariation(this.localPlayer.scriptID, 8, 15, 0, 0);
            game.setPedComponentVariation(this.localPlayer.scriptID, 11, 15, 0, 0);
        } else {
            game.setPedComponentVariation(this.localPlayer.scriptID, 3, 15, 0, 0);
            game.setPedComponentVariation(this.localPlayer.scriptID, 4, 14, 0, 0);
            game.setPedComponentVariation(this.localPlayer.scriptID, 6, 34, 0, 0);
            game.setPedComponentVariation(this.localPlayer.scriptID, 8, 15, 0, 0);
            game.setPedComponentVariation(this.localPlayer.scriptID, 11, 91, 0, 0);
        }
    }
}

export default new CharCreator();