import Window from '../../classes/Window';
import EventController from '../../controllers/EventController';

class VoiceWindow extends Window {
    constructor() {
        super("VoiceSection");

        EventController.onServer("UpdateVoiceRange", this.UpdateVoiceRange.bind(this));
    }

    UpdateVoiceRange(level: number) {
        this.emit("UpdateVoiceRange", level);
    }

    onKey(key: number, down: boolean, isOpen: boolean) {
        if(key == 89 && down) EventController.emitServer("Pressed_Y");
    }
}

export default new VoiceWindow();