import alt from 'alt-client';

class Controls {
    cursor: boolean;
    controls: boolean;

    constructor() {
        this.cursor = false;
        this.controls = true;
    }

    showCursor(state: boolean) {
        if(state == undefined || this.cursor === state) return;

        this.cursor = state;
        alt.showCursor(this.cursor);
    }

    toggleGameControls(state: boolean) {
        if(state == undefined || this.controls === state) return;

        this.controls = state;
        alt.toggleGameControls(this.controls);
    }
}

export default new Controls();