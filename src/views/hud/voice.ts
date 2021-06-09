import Window from '../../classes/Window';
import EventController from '../../controllers/EventController';

export class VoiceView extends Window {
    constructor() {
        super("VoiceSection");

        EventController.onServer("UpdateVoiceRange", this.UpdateVoiceRange.bind(this));
        EventController.onServer("UpdatePhone", this.UpdatePhone.bind(this));
    }

    UpdatePhone(state: boolean) {
        this.emit("UpdatePhone", state);
    }

    UpdateVoiceRange(level: number) {
        this.emit("UpdateVoiceRange", level);
    }

    onKey(key: number, down: boolean, isOpen: boolean) {
        if(key == 89 && down) EventController.emitServer("Pressed_Y");
    }
}

export default new VoiceView();