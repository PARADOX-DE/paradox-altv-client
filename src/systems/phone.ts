import alt from 'alt-client';
import game from 'natives';

import KeyHandler from '../handlers/KeyHandler';
import View from '../classes/View';

const animations = {
    "cellphone@": {
        "out": {
            "text": 'cellphone_text_in',
            "call": 'cellphone_call_listen_base'
        },
        "text": {
            "out": "cellphone_text_out",
            "text": "cellphone_text_in",
            "call": "cellphone_text_to_call"
        },
        "call": {
            'out': 'cellphone_call_out',
			'text': 'cellphone_call_to_text',
			'call': 'cellphone_text_to_call',
        }
    },
    "anim@cellphone@in_car@ps": {
        'out': {
			'text': 'cellphone_text_in',
			'call': 'cellphone_call_in',
		},
		'text': {
			'out': 'cellphone_text_out',
			'text': 'cellphone_text_in',
			'call': 'cellphone_text_to_call',
		},
		'call': {
			'out': 'cellphone_horizontal_exit',
			'text': 'cellphone_call_to_text',
			'call': 'cellphone_text_to_call',
		}
    }
}

class PhoneView extends View {
    currentStatus: string;
    lastDict: string;
    lastAnim: string;
    open: boolean;

    phoneModel: string = "prop_amb_phone";
    phoneObject?: number;

    constructor() {
        super("Phone");

        this.open = false;
        this.currentStatus = "out";
        this.lastDict = "";
        this.lastAnim = "";

        new KeyHandler("F1", 112, this.onOpen.bind(this));
    }

    loadAnimation(dict: string) {
        return new Promise(resolve => {
            let ticks = 1;

            game.requestAnimDict(dict);
            if(game.hasAnimDictLoaded(dict)) return resolve(true);

            let everyTick = alt.everyTick(() => {
                if(game.hasAnimDictLoaded(dict)) {
                    alt.clearEveryTick(everyTick);
                    return resolve(true);
                }

                ticks++;
                if(ticks >= 10000) {
                    alt.clearEveryTick(everyTick);
                    return resolve(false);
                }
            });
        });
    }

    playAnimation(status: string, freeze: boolean, force: boolean) {
        if(status == this.currentStatus && force == true) return Promise.resolve(false);

        return new Promise(async resolve => {
            const dict = alt.Player.local.vehicle != null ? "anim@cellphone@in_car@ps" : "cellphone@";
            await this.loadAnimation(dict);
            
            // @ts-ignore
            const animation: string = animations[dict][this.currentStatus][status];
            if(this.currentStatus != "out") game.stopAnimTask(alt.Player.local.scriptID, this.lastDict, this.lastAnim, 1);

            game.taskPlayAnim(alt.Player.local.scriptID, dict, animation, 3.0, -1, -1, freeze ? 14 : 50, 0, false, false, false);
            
            this.lastDict = dict;
            this.lastAnim = animation;
            this.currentStatus = status;

            if(status == "out") game.stopAnimTask(alt.Player.local.scriptID, this.lastDict, this.lastAnim, 1);
            resolve(true);
        });
    }

    waitForModel(): Promise<boolean> {
        return new Promise(resolve => {
            let ticks = 0;
            const model = alt.hash(this.phoneModel);

            game.requestModel(model);
            if(game.hasModelLoaded(model)) return resolve(true);

            let everyTick = alt.everyTick(() => {
                if(game.hasModelLoaded(model)) {
                    alt.clearEveryTick(everyTick);
                    return resolve(true);
                }

                ticks++;
                if(ticks >= 10000) {
                    alt.clearEveryTick(everyTick);
                    return resolve(false);
                }
            });
        });
    }

    onOpen() {
        if(this.open) return this.onClose();
        this.open = true;

        if(this.phoneObject) game.deleteObject(this.phoneObject);
        this.playAnimation("text", false, false).then(() => this.waitForModel().then(() => {
            this.phoneObject = game.createObject(alt.hash(this.phoneModel), 1, 1, 1, false, false, false);

            const bone = game.getPedBoneIndex(alt.Player.local.scriptID, 28422);
            game.attachEntityToEntity(this.phoneObject, alt.Player.local.scriptID, bone, 0, 0, 0, 0, 0, 0, true, true, false, false, 2, true);
            this.webview.emit("showWindow", "Phone");
        }));

        return true;
    }

    onClose() {
        this.open = false;
        
        if(this.phoneObject) {
            game.deleteObject(this.phoneObject);
            game.stopAnimTask(alt.Player.local.scriptID, this.lastDict, this.lastAnim, 1);
        }

        this.webview.emit("closeWindow", "Phone");
        return true;
    }
}

export default new PhoneView();