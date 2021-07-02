import alt from 'alt-client';
import Marker from '../../classes/Marker';
import Window from '../../classes/Window';
import EventController from '../../controllers/EventController';

export class VoiceView extends Window {
    private rangeMarker: Marker | null;
    private timeoutId: number;

    constructor() {
        super("VoiceSection");

        EventController.onServer("UpdateVoiceRange", this.UpdateVoiceRange.bind(this));
        EventController.onServer("UpdatePhone", this.UpdatePhone.bind(this));

        this.rangeMarker = null;
        this.timeoutId = 0;
    }

    UpdatePhone(state: boolean) {
        this.emit("UpdatePhone", state);
    }

    getColorsFromRange(level: number) {
        switch(level) {
            case 0:
                return new alt.RGBA(52, 192, 235, 200);
            case 1:
                return new alt.RGBA(52, 235, 55, 200);
            case 2:
                return new alt.RGBA(235, 177, 52, 200);
            default:
                return new alt.RGBA(255, 255, 255, 200);
        }
    }

    getScaleFromRange(level: number) {
        switch(level) {
            case 0:
                return 2.0;
            case 1:
                return 4.0;
            case 2:
                return 6.0;
            default:
                return 1.0;
        }
    }

    UpdateVoiceRange(level: number) {
        this.emit("UpdateVoiceRange", level);

        const color = this.getColorsFromRange(level);
        const scale = this.getScaleFromRange(level);

        if(this.timeoutId != 0) alt.clearTimeout(this.timeoutId);
        if(this.rangeMarker) this.rangeMarker.destroy();

        this.rangeMarker = new Marker(27, new alt.Vector3(alt.Player.local.pos.x, alt.Player.local.pos.y, alt.Player.local.pos.z + 0.97), scale, true, color, alt.Player.local.scriptID);
        this.timeoutId = alt.setTimeout(() => {
            if(this.rangeMarker) {
                this.rangeMarker.destroy();
                this.rangeMarker = null;
            }

            this.timeoutId = 0;
        }, 500);
    }

    onKey(key: number, down: boolean, isOpen: boolean) {
        if(key == 89 && down) EventController.emitServer("Pressed_Y");
    }
}

export default new VoiceView();