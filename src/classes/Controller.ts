import alt from 'alt-client';

const controllers: Controller[] = [];

export default class Controller {
    name: string;
    onTick?(): () => void;

    constructor(name: string) {
        this.name = name;

        if(this.all.some(x => x.name == name)) alt.log(`[PARADOX] Controller >> ${name} already exists!`);
        
        alt.log(`[PARADOX] Controller >> ${name} loaded...`);
        if(this.onTick) alt.everyTick(this.onTick.bind(this));

        controllers.push(this);
    }

    get all() {
        return controllers;
    }

    getByName(name: string) {
        return this.all.find(x => x.name == name);
    }
}