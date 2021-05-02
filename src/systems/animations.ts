import alt from 'alt-client';
import game from 'natives';

import EventHandler from '../handlers/EventHandler';
import AnimationHandler from '../handlers/AnimationHandler';
import View from '../classes/View';

class Animations  {
    constructor() {
        EventHandler.onServer("PlayAnimation", this.playAnimation.bind(this));
        EventHandler.onServer("StopAnimation", this.stopAnimation.bind(this));
    }

    playAnimation(dict: string, name: string, flag: number = 9, duration: number = -1) {
        new AnimationHandler(alt.Player.local.scriptID, dict, name, flag, duration).play();
    }

    stopAnimation() {
        new AnimationHandler(alt.Player.local.scriptID, "", "").stop();
    }
}

export default new Animations();