import alt from 'alt-client';
import game from 'natives';
import util from '../util';

class ObjectCreator {
    private readonly objectModels = [alt.hash("v_res_j_radio"), alt.hash("v_corp_offchairfd")];
    private spawnedObjects: number[];
    private objectHandle: number;
    objectRotation: number;
    currentObjectIndex: number;

    enabled: boolean;
    isEdown: boolean;
    isQdown: boolean;

    constructor() {
        this.enabled = false;
        this.isEdown = false;
        this.isQdown = false;

        this.spawnedObjects = [];
        this.objectHandle = 0;
        this.objectRotation = 0;
        this.currentObjectIndex = 0;

        alt.on("keydown", this.onKeyDown.bind(this));
        alt.on("keyup", this.onKeyUp.bind(this));
        alt.everyTick(this.onTick.bind(this));
    }

    requestModel(modelHash: number, tries = 0): Promise<boolean> {
        return new Promise((resolve) => {
            if(!game.isModelValid(modelHash)) return resolve(false);
            if(game.hasModelLoaded(modelHash)) return resolve(true);

            if(tries == 0) game.requestModel(modelHash);
            if(tries >= 40) return resolve(false);
    
            alt.setTimeout(() => {
                if (!game.hasModelLoaded(modelHash)) return resolve(this.requestModel(modelHash, ++tries));
                
                return resolve(true);
            }, 25);
        });
    }

    onKeyUp(key: number) {
        switch(key) {
            case 81: // Q
                this.isQdown = false;
                break;
            case 69: // E
                this.isEdown = false;
                break;
        }
    }

    async onKeyDown(key: number) {
        switch(key) {
            case 116: // F5
                this.enabled = !this.enabled;
                this.updateObject();
                break;
            case 81: // Q
                if(!this.enabled) break;
                this.isQdown = true;
                break;
            case 69: // E
                if(!this.enabled) break;
                this.isEdown = true;
                break;
            case 13: // ENTER
                if(!this.enabled) break;

                const entityPos = game.getEntityCoords(this.objectHandle, true);
                const realPos = await util.getGroundZ(entityPos);

                game.setEntityCoords(this.objectHandle, entityPos.x, entityPos.y, realPos, true, false, false, true);
                game.setEntityAlpha(this.objectHandle, 255, true);

                this.spawnedObjects.push(this.objectHandle);
                this.objectHandle = 0;

                this.updateObject();
                break;
        }
    }

    async updateObject() {
        if(!this.enabled) {
            for(const obj of this.spawnedObjects) game.deleteObject(obj);
            this.spawnedObjects = [];

            if(this.objectHandle != 0) {
                game.deleteObject(this.objectHandle);
                this.objectHandle = 0;
            }

            return;
        }

        await this.requestModel(this.objectModels[this.currentObjectIndex]);
        if(this.objectHandle != 0) {
            game.deleteObject(this.objectHandle);
            this.objectHandle = 0;
        }

        this.objectHandle = game.createObject(this.objectModels[this.currentObjectIndex], 0, 0, 0, false, false, true);
        this.objectRotation = 0;

        const raycast = this.getRaycast();
        if(raycast.isHit) {
            this.objectRotation = 0;
            this.objectHandle = game.createObject(this.objectModels[this.currentObjectIndex], 0, 0, 0, false, false, true);

            game.setEntityCoords(this.objectHandle, raycast.pos.x, raycast.pos.y, raycast.pos.z + 0.1, true, false, false, true);
            game.setEntityHeading(this.objectHandle, this.objectRotation);
            game.setEntityAlpha(this.objectHandle, 200, true);
        } else {
            this.objectRotation = 0;
            this.objectHandle = game.createObject(this.objectModels[this.currentObjectIndex], 0, 0, 0, false, false, true);
        }
    }

    onTick() {
        if(!this.enabled) return;

        if(this.isQdown) {
            if(this.objectRotation == 0) this.objectRotation = 360;
            else this.objectRotation -= 1;
        }

        if(this.isEdown) {
            if(this.objectRotation == 360) this.objectRotation = 0;
            else this.objectRotation += 1;
        }

        const raycast = this.getRaycast();
        if(!raycast.isHit) return;
        
        game.drawSphere(raycast.pos.x, raycast.pos.y, raycast.pos.z, 0.1, 255, 0, 0, 25);

        if(this.objectHandle != 0) {
            game.setEntityCoords(this.objectHandle, raycast.pos.x, raycast.pos.y, raycast.pos.z + 0.1, true, false, false, true);
            game.setEntityHeading(this.objectHandle, this.objectRotation);
            game.setEntityAlpha(this.objectHandle, 200, true);
        }
    }

    GetDirectionFromRotation(rotation: alt.IVector3) {
        const z = rotation.z * (Math.PI / 180.0);
        const x = rotation.x * (Math.PI / 180.0);
        const num = Math.abs(Math.cos(x));
    
        return new alt.Vector3(
            (-Math.sin(z) * num),
            (Math.cos(z) * num),
            Math.sin(x)
        );
    }

    getRaycast() {
        let start = game.getFinalRenderedCamCoord();
        let rot = game.getFinalRenderedCamRot(2);
        let fvector = this.GetDirectionFromRotation(rot);
        let frontOf = new alt.Vector3((start.x + (fvector.x * 2000)), (start.y + (fvector.y * 2000)), (start.z + (fvector.z * 2000)));

        let raycast = game.startExpensiveSynchronousShapeTestLosProbe(start.x, start.y, start.z, frontOf.x, frontOf.y, frontOf.z, -1, alt.Player.local.scriptID, 7);
        let result = game.getShapeTestResult(raycast);

        const hitEntity = result[4];

        return {
            isHit: result[1],
            pos: new alt.Vector3(result[2].x, result[2].y, result[2].z),
            hitEntity
        }
    }
}

export default new ObjectCreator();