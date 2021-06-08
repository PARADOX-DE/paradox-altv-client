import alt from 'alt-client';
import game from 'natives';

export default class Animation {
    scriptId: number;
    dict: string;
    name: string;
    duration: number;
    flag: number;

    constructor(scriptId: number = alt.Player.local.scriptID, dict: string, name: string, flag: number = 9, duration: number = -1) {
        this.scriptId = scriptId;
        this.dict = dict;
        this.name = name;
        this.duration = duration;
        this.flag = flag;
    }

    private loadDict(dict: string) {
        return new Promise(resolve => {
            let ticks = 0;

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

    play() {
        if(game.hasAnimDictLoaded(this.dict)) game.taskPlayAnim(this.scriptId, this.dict, this.name, 8, -4, this.duration, this.flag, 0, false, false, false);
        else this.loadDict(this.dict).then(success => {
            if(success) game.taskPlayAnim(this.scriptId, this.dict, this.name, 8, -4, this.duration, this.flag, 0, false, false, false);
        });

        return this;
    }

    stop() {
        game.clearPedTasks(this.scriptId);
        if (!alt.Player.local.vehicle) game.clearPedSecondaryTask(this.scriptId);

        return this;
    }
}