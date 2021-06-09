import game from 'natives';
import Controller from '../classes/Controller';

class HUDController extends Controller {
    cursor: boolean;
    movement: boolean;

    constructor() {
        super("HUD");

        this.cursor = false;
        this.movement = true;
    }

    public getMinimapWidth() {
        const aspectRatio = this.getScreenAspectRatio();
        const resolution = this.getScreenResolution();

        return resolution.x / (4 * aspectRatio);
    }

    public getMinimapHeight() {
        const resolution = this.getScreenResolution();

        return resolution.y / 5.674;
    }

    public getMinimapTopLeft() {
        const resolution = this.getScreenResolution();
        const safeZone = this.getSafeZoneSize();
        const height = this.getMinimapHeight();
        
        const x = resolution.x * ((1.0 / 20.0) * (Math.abs(safeZone - 1.0) * 10));
        const y = resolution.y - resolution.y * ((1.0 / 20.0) * (Math.abs(safeZone - 1.0) * 10)) - height;
        
        return { x, y };
    }

    public getMinimapTopRight() {
        const { x, y } = this.getMinimapTopLeft();
        return { x: x + this.getMinimapWidth(), y };
    }

    public getMinimapBottomLeft() {
        const { x, y } = this.getMinimapTopLeft();
        return { x, y: y + this.getMinimapHeight() };
    }

    public getMinimapBottomRight() {
        const { x, y } = this.getMinimapTopLeft();
        return { x: x + this.getMinimapWidth(), y: y + this.getMinimapHeight() };
    }

    public getSafeZoneSize() {
        return game.getSafeZoneSize();
    }

    public getScreenAspectRatio() {
        return game.getAspectRatio(false);
    }

    public getScreenResolution() {
        const [_, x, y] = game.getActiveScreenResolution(0, 0);
        return { x, y };
    }
}

export default new HUDController();