import alt from 'alt-client';
import game from 'natives';
import Handler from '../classes/Handler';

function convertVectorToObject(vector: alt.IVector3, fixedNumber: number = 2) {
    return {
        x: vector.x.toFixed(fixedNumber),
        y: vector.y.toFixed(fixedNumber),
        z: vector.z.toFixed(fixedNumber)
    };
}

class DevelopmentHandler extends Handler {
    enabled: boolean;

    constructor() {
        super("Development");

        this.enabled = alt.isInDebug();

        alt.on("consoleCommand", cmd => {
            if(cmd != "dev") return;
            this.enabled = !this.enabled;
        });

        alt.everyTick(this.onTick.bind(this));
    }

    drawText(text: string, x: number, y: number, scale: number, fontType: number, color: alt.RGBA, useOutline = true, useDropShadow = true) {
        game.beginTextCommandDisplayText('STRING');
        game.setTextFont(fontType);
        game.setTextCentre(false);
        game.setTextScale(1, scale);
        game.setTextProportional(true);
        game.setTextColour(color.r, color.g, color.b, color.a);

        const match = text.match(/.{1,99}/g);
        if(match) match.forEach(textBlock => game.addTextComponentSubstringPlayerName(textBlock));
    
        if (useOutline) game.setTextOutline();
        if (useDropShadow) game.setTextDropShadow();
    
        game.endTextCommandDisplayText(x, y, 0);
        game.clearDrawOrigin();
    }

    onTick() {
        if(!this.enabled) return;

        const localPlayer = alt.Player.local;
        const data = {
            pos: convertVectorToObject(localPlayer.pos),
            rot: game.getEntityHeading(localPlayer.scriptID).toFixed(2)
        };

        if(Object.keys(data).length) {
            Object.keys(data).forEach((k, v, arr) => {
                this.drawText(
                    // @ts-ignore
                    `${k}: ${(typeof data[k] === 'object') ? JSON.stringify(data[k]) : data[k]}`,
                    0.02,
                    (0.5 + (v / 80)),
                    0.2,
                    0,
                    new alt.RGBA(255, 255, 255, 255)
                );
            });
        }
    }
}

export default new DevelopmentHandler();