import alt from 'alt-client';
import game from 'natives';
import Handler from '../classes/Handler';

import KeyHandler from './KeyHandler';

function convertVectorToObject(vector: alt.IVector3, fixedNumber: number = 2) {
    return {
        x: vector.x.toFixed(fixedNumber),
        y: vector.y.toFixed(fixedNumber),
        z: vector.z.toFixed(fixedNumber)
    };
}

class DevelopmentHandler extends Handler {
    enabled: boolean;

    no_clip: boolean;
    no_clip_speed: number;

    no_clip_keys = {
        FORWARD: 32,
        BACKWARD: 33,
        LEFT: 34,
        RIGHT: 35,
        UP: 22,
        DOWN: 36,
        SHIFT: 21,
    };

    constructor() {
        super("Development");

        this.enabled = alt.isInDebug();

        this.no_clip = false;
        this.no_clip_speed = 3.0;

        new KeyHandler("F10", 121, () => {
            this.no_clip = !this.no_clip;
            return true;
        });

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

    
 addSpeedToVector(vector1: alt.Vector3, vector2: alt.Vector3, speed: number, lr = false) {
    return new alt.Vector3(
        vector1.x + vector2.x * speed,
        vector1.y + vector2.y * speed,
        lr === true ? vector1.z : vector1.z + vector2.z * speed
    );
}

 camVectorForward(x: number, y: number, z: number) {
    let rotInRad = {
        x: x * (Math.PI / 180),
        y: y * (Math.PI / 180),
        z: z * (Math.PI / 180) + Math.PI / 2,
    };

    return new alt.Vector3(Math.cos(rotInRad.z),
    Math.sin(rotInRad.z),
    Math.sin(rotInRad.x));
}

 camVectorRight(x: number, y: number, z: number) {
    let rotInRad = {
        x: x * (Math.PI / 180),
        y: y * (Math.PI / 180),
        z: z * (Math.PI / 180),
    };

    return new alt.Vector3(
        Math.cos(rotInRad.z),
       Math.sin(rotInRad.z),
       Math.sin(rotInRad.x),
    );;
}

 isVectorEqual(vector1: alt.Vector3, vector2: alt.Vector3) {
    return (
        vector1.x === vector2.x &&
        vector1.y === vector2.y &&
        vector1.z === vector2.z
    );
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

        if(this.no_clip){
            let currentPos = alt.Player.local.pos;
            let speed = this.no_clip_speed;
            let rot = game.getGameplayCamRot(2);
            let dirForward = this.camVectorForward(rot.x, rot.y, rot.z);
            let dirRight = this.camVectorRight(rot.x, rot.y, rot.z);
    
            if (game.isDisabledControlPressed(0, this.no_clip_keys.SHIFT))
                speed = speed * 5;
    
            if (game.isDisabledControlPressed(0, this.no_clip_keys.FORWARD))
                currentPos = this.addSpeedToVector(currentPos, dirForward, speed);
            if (game.isDisabledControlPressed(0, this.no_clip_keys.BACKWARD))
                currentPos = this.addSpeedToVector(currentPos, dirForward, -speed);
            if (game.isDisabledControlPressed(0, this.no_clip_keys.LEFT))
                currentPos =  this.addSpeedToVector(currentPos, dirRight, -speed, true);
            if (game.isDisabledControlPressed(0, this.no_clip_keys.RIGHT))
                currentPos =  this.addSpeedToVector(currentPos, dirRight, speed, true);
            let zModifier = 0;
            if (game.isDisabledControlPressed(0, this.no_clip_keys.UP))
                zModifier += speed;
            if (game.isDisabledControlPressed(0, this.no_clip_keys.DOWN))
                zModifier -= speed;
    
            if (
                !this.isVectorEqual(
                    new alt.Vector3(
                        currentPos.x,
                        currentPos.y,
                        currentPos.z + zModifier
                    ),
                    alt.Player.local.pos
                )
            )
             
            game.setEntityCoordsNoOffset(alt.Player.local.scriptID,
                    currentPos.x,
                    currentPos.y,
                    currentPos.z + zModifier,
                    false, false, false
                );
        }    
    }
}

export default new DevelopmentHandler();