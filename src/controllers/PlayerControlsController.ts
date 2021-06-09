import alt from 'alt-client';
import Controller from '../classes/Controller';

class PlayerControlsController extends Controller {
    cursor: boolean;
    movement: boolean;

    constructor() {
        super("PlayerControls");

        this.cursor = false;
        this.movement = true;
    }

    showCursor(state: boolean) {
        if(this.cursor == state) return;
        
        this.cursor = state;
        alt.showCursor(this.cursor);
    }

    toggleGameControls(state: boolean) {
        if(this.movement == state) return;

        this.movement = state;
        alt.toggleGameControls(this.movement);
    }
}

export default new PlayerControlsController();