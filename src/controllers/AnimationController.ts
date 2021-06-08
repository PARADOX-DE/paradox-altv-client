import alt from 'alt-client';
import game from 'natives';
import Animation from '../classes/Animation';

import Controller from '../classes/Controller';
import WebView from '../classes/WebView';
import EventController from './EventController';

class AnimationController extends Controller {
    constructor() {
        super("Animation");

        EventController.onServer("PlayAnimation", this.playAnimation.bind(this));
        EventController.onServer("StopAnimation", this.stopAnimation.bind(this));

        EventController.onServer("StartEffect", this.startEffect.bind(this));
        EventController.onServer("StopEffect", this.stopEffect.bind(this));

        WebView.webView.on("StartEffect", this.startEffect.bind(this));
        WebView.webView.on("StopEffect", this.stopEffect.bind(this));
        
        WebView.webView.on("PlayAnimation", this.playAnimation.bind(this));
        WebView.webView.on("StopAnimation", this.stopAnimation.bind(this));
    }
    
    startEffect(name: string, duration: number, loop: boolean | number) {
        game.animpostfxStopAll();

        if(loop == true || loop == 1) game.animpostfxPlay(name, duration, true);
        else game.animpostfxPlay(name, duration, false);
    }

    stopEffect() {
        game.animpostfxStopAll();
    }

    playAnimation(dict: string, name: string, flag: number = 9, duration: number = -1) {
        new Animation(alt.Player.local.scriptID, dict, name, flag, duration).play();
    }

    stopAnimation() {
        new Animation(alt.Player.local.scriptID, "", "").stop();
    }
}

export default new AnimationController();