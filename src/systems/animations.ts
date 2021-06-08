import alt from 'alt-client';
import game from 'natives';

import EventHandler from '../handlers/EventHandler';
import AnimationHandler from '../handlers/AnimationHandler';
import View from '../classes/View';
import Webview from '../classes/Webview';

class Animations  {
    constructor() {
        EventHandler.onServer("PlayAnimation", this.playAnimation.bind(this));
        EventHandler.onServer("StopAnimation", this.stopAnimation.bind(this));

        EventHandler.onServer("StartEffect", (name, duration, looped) => {
            game.animpostfxStopAll()
            if(looped == 1)
            game.animpostfxPlay(name, duration, true)
                else
            game.animpostfxPlay(name, duration, false)
        });
        
        EventHandler.onServer("StopEffect", () => {
            game.animpostfxStopAll()
        });
        
        Webview.webView.on("PlayAnimation", this.playAnimation.bind(this));
        Webview.webView.on("StopAnimation", this.stopAnimation.bind(this));
    }

    playAnimation(dict: string, name: string, flag: number = 9, duration: number = -1) {
        new AnimationHandler(alt.Player.local.scriptID, dict, name, flag, duration).play();
    }

    stopAnimation() {
        new AnimationHandler(alt.Player.local.scriptID, "", "").stop();
    }
}

export default new Animations();