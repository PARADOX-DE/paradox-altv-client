import alt from 'alt-client';
import game from 'natives';

const markers: Marker[] = [];
const streamingRange = 250;

class Marker {
    readonly id: number;
    type: number;
    position: alt.IVector3;
    scale: number;
    visible: boolean;
    color: alt.RGBA;

    private readonly tickId: number;
    entityId?: number;

    constructor(type: number, position: alt.IVector3, scale: number, visible = true, color = new alt.RGBA(255, 255, 255, 255), entityId?: number) {
        this.id = Marker.all.length;
        this.type = type;
        this.position = position;
        this.scale = scale;
        this.visible = visible;
        this.color = color;
        this.entityId = entityId;

        this.tickId = alt.everyTick(this.onTick.bind(this));

        Marker.all.push(this);
    }

    onTick() {
        if(this.visible && alt.Player.local.pos.distanceTo(this.position) <= streamingRange) {
            if(this.entityId) {
                const coords = game.getEntityCoords(this.entityId, false);
                // @ts-ignore
                game.drawMarker(this.type, coords.x, coords.y, coords.z - 0.97, 0, 0, 0, 0, 0, 0, this.scale, this.scale, this.scale, this.color.r, this.color.g, this.color.b, this.color.a, false, false, 2, false, null, null, false);
            } else {
                // @ts-ignore
                game.drawMarker(this.type, this.position.x, this.position.y, this.position.z - 0.97, 0, 0, 0, 0, 0, 0, this.scale, this.scale, this.scale, this.color.r, this.color.g, this.color.b, this.color.a, false, false, 2, false, null, null, false);
            }

            game.drawRect(0, 0, 0, 0, 0, 0, 0, 0, false);
        }
    }

    destroy() {
        alt.clearEveryTick(this.tickId);
    }

    static getByID(id: number) {
        return this.all.find(x => x.id == id);
    }

    static get all() {
        return markers;
    }
}

export default Marker;