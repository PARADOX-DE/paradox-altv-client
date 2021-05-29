import alt from 'alt-client';

const controllers: Controller[] = [];

export default class Controller {
    name: string;

    constructor(name: string) {
        this.name = name;

        if(this.all.some(x => x.name == name)) alt.log(`[PARADOX] Controller >> ${name} already exists!`);
        
        alt.log(`[PARADOX] Controller >> ${name} loaded...`);
        alt.everyTick(this.onTick.bind(this));

        alt.on("keydown", key => this.onKey(key, true));
        alt.on("keyup", key => this.onKey(key, false));
        alt.on("consoleCommand", (command: string, ...args: string[]) => this.onConsoleCommand(command, ...args));

        controllers.push(this);
    }

    get all() {
        return controllers;
    }

    getByName(name: string) {
        return this.all.find(x => x.name == name);
    }

    onTick() {}
    onConsoleCommand(command: string, ...args: string[]) {}
    onKey(key: number, down: boolean) {}
}