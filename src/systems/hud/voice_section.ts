
import alt from 'alt-client';
import game from 'natives';

import EventHandler from '../../handlers/EventHandler';
import KeyHandler from '../../handlers/KeyHandler';
import View from '../../classes/View';
import controls from '../controls';

class VoiceSectionView extends View {
    constructor() {
        super("VoiceSection");
        
        EventHandler.onServer("UpdatePhone", this.UpdatePhone.bind(this));
        EventHandler.onServer("UpdateVoiceRange", this.UpdateVoiceRange.bind(this));
    }
    
    UpdatePhone(state: boolean) {
        alt.log(state);
        this.emit("UpdatePhone", state);
    }

    UpdateVoiceRange(level: number) {
        this.emit("UpdateVoiceRange", level);
    }
}

export default new VoiceSectionView();