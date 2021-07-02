import alt from "alt-client";
import game from 'natives';

interface RaycastResultInterface {
    isHit: boolean;
    pos: alt.Vector3;
    
    hitEntity: number;
    entityType: number;
    entityHash: number;
}

class Raycast {
    public static readonly player = alt.Player.local;
  
    public static line(scale: number, flags: number, ignoreEntity: number) {
        let playerForwardVector = { ...game.getEntityForwardVector(this.player.scriptID) };
        playerForwardVector.x *= scale;
        playerForwardVector.y *= scale;
        playerForwardVector.z *= scale;
    
        const targetPos = this.getTargetPos(this.player.pos, playerForwardVector);
        const ray = game.startExpensiveSynchronousShapeTestLosProbe(
            this.player.pos.x,
            this.player.pos.y,
            this.player.pos.z,
            targetPos.x,
            targetPos.y,
            targetPos.z,
            flags,
            ignoreEntity,
            0
        );
    
        return this.result(ray);
    }
  
    private static getTargetPos(entityVector: alt.IVector3, forwardVector: alt.IVector3): alt.IVector3 {
        return {
            x: entityVector.x + forwardVector.x,
            y: entityVector.y + forwardVector.y,
            z: entityVector.z + forwardVector.z,
        }
    }
  
    private static result(ray: any): RaycastResultInterface {
        const result = game.getShapeTestResult(ray, undefined, undefined, undefined, undefined);
        const hitEntity = result[4];

        return {
            isHit: result[1],
            pos: new alt.Vector3(result[2].x, result[2].y, result[2].z),
            hitEntity,
            entityType: game.getEntityType(hitEntity),
            entityHash: game.getEntityModel(hitEntity)
        }
    }
}

export default Raycast;